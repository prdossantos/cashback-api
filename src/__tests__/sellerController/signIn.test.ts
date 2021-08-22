import { genSalt, hash } from 'bcryptjs';
import { Request, Response } from 'express';
import SellerController from "../../controllers/sellerController";
import sellerModel from '../../models/sellerModel';
import { mockRequest, mockResponse, expects } from '../../../jest.utils';
const mockingoose = require('mockingoose')

jest.mock('../../mongo.connection', () =>( { isDBConnected: jest.fn(() => () => true) } ))

expect.extend(expects);

process.env = {
    JWT_SECRET: "09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be34",
    DOCUMENTS_APPROVED: "15350946056"
};

describe('test sellerController::signIn', () => {

    it('case 1. should return that it is not a valid document.', async () => {

        const req = mockRequest();
        const res = mockResponse();
        req.body = {}

        mockingoose(sellerModel).toReturn({}, 'findOne');

        await SellerController.signIn(req as Request, res as Response);

        expect(res.json).toHaveBeenCalledWith(
            //@ts-ignore
            expect.toBeInJson('error', 'seller validation failed')
        )
    });

    it('case 2. a new access token must be created', async () => {

        const req = mockRequest();
        const res = mockResponse();
        req.body = {
            email: 'email@teste.com',
            password: 'pass'
        }

        mockingoose(sellerModel).toReturn({
            email: 'email@teste.com',
            password: await hash('pass', await genSalt()) 
        }, 'findOne');

        mockingoose(sellerModel).toReturn({}, 'updateOne');

        await SellerController.signIn(req as Request, res as Response);

        expect(res.json).toHaveBeenCalledWith(
            //@ts-ignore
            expect.toBeInJson('accessToken', '.')
        )
    });
});
