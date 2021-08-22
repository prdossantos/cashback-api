import { Request, Response } from 'express';
import PurchaseController from "../controllers/purchaseController";
import purchaseModel from '../models/purchaseModel';
import { mockRequest, mockResponse, expects } from '../../jest.utils';
const mockingoose = require('mockingoose')

jest.mock('../mongo.connection', () =>( { isDBConnected: jest.fn(() => () => true) } ))

expect.extend(expects);

process.env = {
    JWT_SECRET: "09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be34",
    DOCUMENTS_APPROVED: "15350946056"
};

describe('test purchaseController::listPurchases', () => {

    it('case 1. list all purchases', async () => {

        const req = mockRequest();
        const res = mockResponse()

        mockingoose(purchaseModel).toReturn([], 'find');

        await PurchaseController.listPurchases(req as Request, res as Response);

        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: true,
                data: []
            }),
        )
    });
});

describe('test purchaseController::create', () => {

    it('case 1. should not be create a new pruchase', async () => {

        const req = mockRequest();
        const res = mockResponse()
        req.body = {}

        mockingoose(purchaseModel).toReturn([], 'save');

        await PurchaseController.create(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            //@ts-ignore
            expect.toBeInJson('error', 'purchase validation failed')
        );
    });

    it('case 2. should be create a new pruchase with 10% of cashback', async () => {

        const req = mockRequest();
        const res = mockResponse()
        req.body = {
            date: '2021-08-21',
            document: '12345678901',
            value: 1,
            code: '123'
        }

        mockingoose(purchaseModel).toReturn([], 'save');

        await PurchaseController.create(req as Request, res as Response);

        expect(res.json).toHaveBeenCalledWith(
            //@ts-ignore
            expect.toBeInJson('cashbackPercent', 10)
        );
    });
});
