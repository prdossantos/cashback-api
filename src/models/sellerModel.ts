import { Schema, model, ValidatorProps } from 'mongoose';
import { unmaskDocument } from '../helper';

export interface Seller {
    _id?: string,
    name: string,
    email: string,
    document: string,
    password: string
}

const sellerSchema = new Schema<Seller>({
    __v: { type: Number, select: false},
    name: {
        type: String, 
        required: true, 
        validate: {
            validator: ( value: string ) => /([\w]{3,})+\s+([\w\s]{3,})/i.test(value),
            message: ( props: ValidatorProps ) => `${props.value} is not a full name!`
        }
    },
    email: {
        type: String, 
        required: true, 
        unique: [true, `email already registered`],
        validate: {
            validator: ( value: string ) =>  /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/.test(value),
            message: ( props: ValidatorProps ) => `${props.value} is not a valid email!`
        }
    },
    document: {
        type: String, 
        required: true, 
        unique: [true, `document already registered`],
        set: unmaskDocument,
        validate: {
            validator: ( value: string ) => /^\d{11}$/.test(value),
            message: ( props: ValidatorProps ) => `${props.value} is not a valid document, should be exact 11 numbers!`
        }
    },
    password: {
        type: String, 
        required: true,
        select: false
    },
    accessToken: {
        type: String,
        select: false
    }
}, {
    collection: 'sellers',
    timestamps: true
});


const sellerModel = model<Seller>('seller', sellerSchema)


export default sellerModel;