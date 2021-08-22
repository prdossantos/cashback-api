import { ResponseError, ResponseSuccess } from "./models/responseModel"

/**
 * List of the status of a purchase
 */
export const Status = ['Em validação', 'Aprovado'];

/**
 * Returns when an error happens
 * @param message 
 * 
 * @returns object
 */
export const responseError = ( message: string ) => {
    const response: ResponseError = {
        success: false,
        error: message
    }

    return response;
} 

/**
 * Returns when a request is successful
 * @param data 
 * @returns object
 */
export const responseSuccess = <T>( data: T ) => {
    const response: ResponseSuccess<T> = {
        success: true,
        data
    }

    return response;
} 

export const unmaskDocument = ( value: string ) => value.replace(/\D+/g,'')
