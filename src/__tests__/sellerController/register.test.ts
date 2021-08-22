import { Request, Response } from 'express';
import SellerController from "../../controllers/sellerController";
import sellerModel from '../../models/sellerModel';
import { mockRequest, mockResponse, expects } from '../../../jest.utils';
const mockingoose = require('mockingoose')

jest.mock('../../mongo.connection', () =>( { isDBConnected: jest.fn(() => () => true) } ))

expect.extend(expects);

describe('test sellerController::register', () => {

    it('case 1. validation error when creating a new seller', async () => {

        const req = mockRequest();
        const res = mockResponse();
        req.body = {}

        mockingoose(sellerModel).toReturn({}, 'find');

        await SellerController.register(req as Request, res as Response);

        expect(res.json).toHaveBeenCalledWith(
            //@ts-ignore
            expect.toBeInJson('error', 'seller validation failed')
        )
    });

    it('case 2. a new seller must be created', async () => {

        const req = mockRequest();
        const res = mockResponse();
        req.body = {
            name: 'Teste Bonito',
            document: '12345678901',
            email: 'email@teste.com',
            password: 'pass'
        }

        mockingoose(sellerModel).toReturn({}, 'find');

        await SellerController.register(req as Request, res as Response);

        expect(res.json).toHaveBeenCalledWith(
            //@ts-ignore
            expect.toBeInJson('name', 'Teste')
        )
    });
});
