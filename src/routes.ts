import express from 'express';
import { verify } from 'jsonwebtoken';
import process from 'process';
import PurchaseController from './controllers/purchaseController';
import SellerController from './controllers/sellerController';
import { responseError } from './helper';

const routes = express.Router();

/**
 * We must verify that the user is authenticated.
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
const mustBeAuthenticated = (req: express.Request, res: express.Response, next: express.NextFunction) => {

    const {authorization} = req.headers;
    const { JWT_SECRET } = process.env;

    if( !authorization ) {
        return res.status(400).json(responseError('Invalid access token'))
    }

    if( authorization ) {
        
        const token: string | undefined = authorization.split(' ').pop()

        if ( !token )
            return res.status(400).json(responseError('Invalid access token'))

        verify(token, <string>JWT_SECRET, async (err, seller ) => {

            if (err) {
                return res.status(401).json(responseError('Expired access token'));
            }

            next()
        });
    }

}

// Routes
routes.get('/', (req, res, next) => {
    res.status(200).send({
        title: "Cashback API",
        version: "1.0.0"
    });
});

routes.post( '/signin',         SellerController.signIn);
routes.post( '/register',       SellerController.register);
routes.get(  '/seller/valid',   mustBeAuthenticated, SellerController.validSeller);
routes.post( '/purchase',       mustBeAuthenticated, PurchaseController.create);
routes.get(  '/purchases',      mustBeAuthenticated, PurchaseController.listPurchases);
routes.get(  '/total-cashback', mustBeAuthenticated, SellerController.totalCashback);

export default routes;