import { genSalt, hash } from 'bcryptjs';
import { Request, Response } from 'express';
import SellerController from "../../controllers/sellerController";
import sellerModel from '../../models/sellerModel';
import { mockRequest, mockResponse, expects } from '../../../jest.utils';
const mockingoose = require('mockingoose')

jest.mock('../../mongo.connection', () =>( { isDBConnected: jest.fn(() => () => true) } ))

expect.extend(expects);

describe('test sellerController::validSeller', () => {

    it('case 1. should return that it is not a valid document', async () => {

        const req = mockRequest();
        const res = mockResponse();
        req.query = {}

        mockingoose(sellerModel).toReturn({}, 'findOne');

        await SellerController.validSeller(req as Request, res as Response);

        expect(res.json).toHaveBeenCalledWith(
            //@ts-ignore
            expect.toBeInJson('error', 'seller validation failed')
        )
    });

    it('case 2. checks if the seller is valid', async () => {

        const req = mockRequest();
        const res = mockResponse();
        req.query = {
            document: '12345678901'
        }

        mockingoose(sellerModel).toReturn({
            document: '12345678901'
        }, 'findOne');

        mockingoose(sellerModel).toReturn({}, 'updateOne');

        await SellerController.validSeller(req as Request, res as Response);

        expect(res.json).toHaveBeenCalledWith(
            //@ts-ignore
            expect.toBeInJson('isValid', true)
        )
    });
});
