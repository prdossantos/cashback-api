import purchaseModel, { calcChargebackPercent, calcChargebackValue, totalSales } from "../models/purchaseModel";
import { mockRequest, mockResponse, expects } from '../../jest.utils';
const mockingoose = require('mockingoose')

jest.mock('../mongo.connection', () =>( { isDBConnected: jest.fn(() => () => true) } ))

expect.extend(expects);

describe('test purchaseModel::calcChargebackPercent', () => {
    it('case 1. should return 10 for the purchase amount between 1 and 999', () => {
        expect(calcChargebackPercent(999)).toEqual(10)
    });
    it('case 2. should return 15 for the purchase amount between 1000 and 1499', () => {
        expect(calcChargebackPercent(1001)).toEqual(15)
    });
    it('case 3. should return 20 for purchase amount grater then 1500', () => {
        expect(calcChargebackPercent(1501)).toEqual(20)
    });
    it('case 4. should return 0 for purchase amount less or equal to zero', () => {
        expect(calcChargebackPercent(0)).toEqual(0)
    });
});

describe('test purchaseModel::calcChargebackValue', () => {
    it('case 1. should return 10 for the purchase amount between 1 and 999', () => {
        expect(calcChargebackValue(10, 1000)).toEqual(100)
    });
});

describe('test purchaseModel::totalSales', () => {
    it('case 1. get total sales with no purchase', async () => {
        mockingoose(purchaseModel).toReturn([], 'find');
        const total = await totalSales('12345678901');
        expect(total).toEqual(0)
    });

    it('case 2. get total sales with two or more purchases', async () => {
        mockingoose(purchaseModel).toReturn([
            {value: 400},
            {value: 600},
        ], 'find');
        const total = await totalSales('12345678901');
        expect(total).toEqual(1000)
    });

    it('case 2. get the total of a seller', async () => {
        mockingoose(purchaseModel).toReturn([
            {value: 400}
        ], 'find');
        const total = await totalSales('12345678901');
        expect(total).toEqual(400)
    });
});

describe('test purchaseModel::validation', () => {
    it('case 1. must return that the document is is required', () => {
        const hasErrors = (new purchaseModel({})).validateSync(['document']);
        expect(hasErrors?.message).toContain('document:')
    });
    it('case 2. should return that it is not a valid document', () => {
        const hasErrors = (new purchaseModel({document: '123'})).validateSync(['document']);
        expect(hasErrors?.message).toContain('is not a valid document')
    });
    it('case 3. should return that it is not a valid date', () => {
        const hasErrors = (new purchaseModel({date: '02/08/2021'})).validateSync(['date']);
        expect(hasErrors?.message).toContain('is not a valid date')
    });
    it('case 4. should return that it is not valid status', () => {
        const hasErrors = (new purchaseModel({status: 'test'})).validateSync(['status']);
        expect(hasErrors?.message).toContain('is not valid status')
    });
    it('case 5. should return that it is not a valid value', () => {
        const hasErrors = (new purchaseModel({value: 'a'})).validateSync(['value']);
        expect(hasErrors?.message).toContain('Cast to Number failed for value')
    });
    it('case 6. should return that the value must be great then zero', () => {
        const hasErrors = (new purchaseModel({value: 0})).validateSync(['value']);
        expect(hasErrors?.message).toContain('should be great then zero')
    });
    it('case 7. should not return errors', () => {
        const hasErrors = (new purchaseModel({code: '1', document: '12345678901', value: 1, date: '2021-08-21'})).validateSync();
        expect(hasErrors).toBeUndefined()
    });
});