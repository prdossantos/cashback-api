import { responseError, responseSuccess, unmaskDocument } from "../helper";
import { ResponseError, ResponseSuccess } from "../models/responseModel";

describe('test helper::responseError', () => {
    it('case 1. error message must be test', () => {
        const response: ResponseError = responseError('test');
        expect(typeof response).toEqual('object')
        expect(response.error).toEqual('test')
    });
});

describe('test helper::responseSuccess', () => {
    it('case 1. response data must be an empty array', () => {
        const response: ResponseSuccess<any> = responseSuccess<any>([]);
        expect(response.success).toEqual(true)
        expect(response.data).toEqual([])
    });
});

describe('test helper::unmaskDocument', () => {
    it('case 1. should return the document unmasked', () => {
        const document = '123.456.789-01';
        expect(unmaskDocument(document)).toEqual('12345678901')
    });
});