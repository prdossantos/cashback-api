import { genSalt, hash } from 'bcryptjs';
import { Request, Response } from 'express';
import SellerController from '../../controllers/sellerController';
import sellerModel from '../../models/sellerModel';
import { mockRequest, mockResponse, expects } from '../../../jest.utils';
import axios from 'axios';

jest.mock('../../mongo.connection', () =>( { isDBConnected: jest.fn(() => () => true) } ))
jest.mock("axios");

expect.extend(expects);

process.env = {
    BOTICARIO_API_URL: "https://mdaqk8ek5j.execute-api.us-east-1.amazonaws.com/v1",
    BOTICARIO_API_TOKEN: "ZXPURQOARHiMc6Y0flhRC1LVlZQVFRnm"
};


describe('test sellerController::totalCashback', () => {

    it('case 1. should return that it is not a valid document.', async () => {

        const req = mockRequest();
        const res = mockResponse();
        req.query = {}

        await SellerController.totalCashback(req as Request, res as Response);

        expect(res.json).toHaveBeenCalledWith(
            //@ts-ignore
            expect.toBeInJson('error', 'seller validation failed')
        )
    });

    it('case 2. will return the seller\'s accumulated', async () => {

        const req = mockRequest();
        const res = mockResponse();
        req.query = {
            document: '12345678901'
        }

        //@ts-ignore
        axios.get.mockImplementation(() => Promise.resolve({ 
            data: {
                'statusCode': 200,
                'body': {
                    'credit': -1
                }
            } 
        }));

        await SellerController.totalCashback(req as Request, res as Response);

        expect(res.json).toHaveBeenCalledWith(
            //@ts-ignore
            expect.toBeInJson('total', -1)
        )
    });
});
