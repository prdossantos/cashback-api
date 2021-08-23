import express from 'express';
import { responseError, responseSuccess, Status } from '../helper';
import { isDBConnected } from '../mongo.connection';
import purchaseModel, { calcChargebackPercent, calcChargebackValue, Purchase, totalSales } from '../models/purchaseModel';
import sellerModel from '../models/sellerModel';
const logger = require('pino')({
    prettyPrint: {
      levelFirst: true
    },
    prettifier: require('pino-pretty')
})

class PurchaseController {
    
    /**
     * Creates a new purchase
     * 
     * @param req 
     * @param res 
     * @returns 
     */
    async create( req: express.Request, res: express.Response ) {
        
        const { body } = req
        const purchase = new purchaseModel(body);
        const hasErrors = purchase.validateSync();
        const { DOCUMENTS_APPROVED } = process.env

        if( hasErrors )        
            return res.status(400).json(responseError(hasErrors.message));

        if( !isDBConnected() )
            return res.status(400).json(responseError('Your DB isn\'t started, but your request is ok!'));

        try {

            if( DOCUMENTS_APPROVED && DOCUMENTS_APPROVED?.split(',').indexOf(purchase.document) > -1 ) {
                purchase.status = Status[1];
            }

            purchase.cashbackPercent = calcChargebackPercent(purchase.value);
            purchase.cashbackValue   = await calcChargebackValue(purchase.cashbackPercent, await totalSales(purchase.document));

            const saved = await purchase.save();
            purchase._id = saved._id;
        } catch( e ) {
            logger.error(e.message)
            return res.status(400).json(responseError(e.message));
        }

        return res.json(responseSuccess<Purchase>(purchase))
    }

    /**
     * Will list all purchases realised.
     * 
     * @param req 
     * @param res 
     * @returns 
     */
    async listPurchases( req: express.Request, res: express.Response ) {
        
        if( !isDBConnected() )
            return res.status(400).json(responseError('Your DB isn\'t started, but your request is ok!'));

        const purchases: any = await purchaseModel.find();

        return res.json(responseSuccess<Purchase[]>(purchases))
    }
}

export default new PurchaseController()