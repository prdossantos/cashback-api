import { compare, genSalt, hash } from 'bcryptjs';
import express from 'express';
import sellerModel, { Seller } from '../models/sellerModel';
import { responseError, responseSuccess, unmaskDocument } from '../helper';
import { isDBConnected } from '../mongo.connection';
import axios from 'axios';
import { sign } from 'jsonwebtoken';
const logger = require('pino')({
    prettyPrint: {
      levelFirst: true
    },
    prettifier: require('pino-pretty')
})

class SellerController {
    
     /**
     * Make a new login
     * 
     * @param req 
     * @param res 
     * @returns 
     */
      async signIn( req: express.Request, res: express.Response ) {
        
        const { email, password } = req.body
        const { JWT_SECRET } = process.env
        let accessToken = null
     
        const hasErrors = (new sellerModel({email, password})).validateSync(['email', 'password']);

        if( hasErrors )        
            return res.status(400).json(responseError(hasErrors.message));

        if( !isDBConnected() )
            return res.status(400).json(responseError('Your DB isn\'t started, but your request is ok!'));

        try {   
            const seller: any = await sellerModel.findOne({email}, 'password');
            
            if( seller && !seller._id )
                return res.status(400).json(responseError('Your email is invalid'));

            const isValidPass = await compare(password, seller?.password || '')
            
			if( isValidPass ) {
				accessToken = sign({ email }, <string>JWT_SECRET);
                await sellerModel.updateOne({_id: seller._id}, {accessToken});
            } else {
                return res.status(400).json(responseError('Your password is invalid'));
            }
        } catch( e ) {
            logger.error(e.message)
            return res.status(400).json(responseError(e.message));
        }

        return res.json(responseSuccess<any>({accessToken}))
    }

    /**
     * Creates a new seller
     * 
     * @param req 
     * @param res 
     * @returns 
     */
    async register( req: express.Request, res: express.Response ) {
        
        const { body } = req
        const seller = new sellerModel(body);
        const hasErrors = seller.validateSync();

        if( hasErrors )        
            return res.status(400).json(responseError(hasErrors.message));

        if( !isDBConnected() )
            return res.status(400).json(responseError('Your DB isn\'t started, but your request is ok!'));

        try {
            seller.password = await hash(seller.password, await genSalt());
            const saved = await seller.save();
            seller._id = saved._id;
        } catch( e ) {
            logger.error(e.message)
            return res.status(400).json(responseError(e.message));
        }

        return res.json(responseSuccess<Seller>(seller))
    }

    /**
     * Will check if there is a seller with the document sent
     * 
     * @param req 
     * @param res 
     * @returns 
     */
    async validSeller( req: express.Request, res: express.Response ) {
        
        const document = unmaskDocument(<string>(req.query.document || ''))

        const hasErrors = (new sellerModel({document})).validateSync(['document']);

        if( hasErrors )        
            return res.status(400).json(responseError(hasErrors.message));

        if( !isDBConnected() )
            return res.status(400).json(responseError('Your DB isn\'t started, but your request is ok!'));

        const seller: any = await sellerModel.findOne({document: `${document}`});

        return res.json(responseSuccess<any>({isValid: seller ? true : false}))
    }
    /**
     * Will list any seller's accumulated cashback
     * 
     * @param req 
     * @param res 
     * @returns 
     */
    async totalCashback( req: express.Request, res: express.Response ) {
        
        const document = unmaskDocument(<string>(req.query.document || ''))
        const { BOTICARIO_API_URL, BOTICARIO_API_TOKEN } = process.env;
        let total = 0;
        const hasErrors = (new sellerModel({document})).validateSync(['document']);

        if( hasErrors )        
            return res.status(400).json(responseError(hasErrors.message));

        try {
            const response: any = await axios.get(`${BOTICARIO_API_URL}/cashback?cpf=${document}`, {
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `${BOTICARIO_API_TOKEN}`
                }
            })
            if( response.data.body && response.data.body.credit ) {
                total = response.data.body.credit
            }

        } catch ( e ) { 
            logger.error( e.message ) 
        }

        return res.json(responseSuccess<any>({total}))
    }

}


export default new SellerController()