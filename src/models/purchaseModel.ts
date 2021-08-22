import moment from 'moment';
import { Schema, model, ValidatorProps } from 'mongoose';
import { Status, unmaskDocument } from '../helper';

export interface Purchase {
    _id?: string,
    code: string,
    value: number,
    document: string,
    status: string,
    cashbackPercent: number,
    cashbackValue: number,
    date: string
}

const purchaseSchema = new Schema<Purchase>({
    __v: { type: Number, select: false},
    code: {
        type: String, 
        required: true
    },
    value: {
        type: Number, 
        required: true, 
        set: ( value: string | number ) => parseFloat(value.toString()),
        validate: {
            validator: ( value: number ) => value > 0,
            message: ( props: ValidatorProps ) => {
                return `${props.value} should be great then zero!`;
            }
        }
    },
    cashbackPercent: {
        type: Number
    },
    cashbackValue: {
        type: Number
    },
    document: {
        type: String, 
        required: true, 
        set: unmaskDocument,
        validate: {
            validator: ( value: string ) => /^\d{11}$/.test(value),
            message: ( props: ValidatorProps ) => `${props.value} is not a valid document, should be exact 11 numbers!`
        }
    },
    date: {
        type: String, 
        required: true,
        validate: {
            validator: ( value: string ) => /^\d{4}([./-])\d{2}\1\d{2}$/.test(value),
            message: ( props: ValidatorProps ) => `${props.value} is not a valid date, use the format: YYYY-MM-DD!`
        }
    },
    status: {
        type: String, 
        required: true,
        default: Status[0],
        validate: {
            validator: ( value: string ) => Status.indexOf(value) > -1,
            message: ( props: ValidatorProps ) => `${props.value} is not valid status! Choose one of (${Status.join(', ')})`
      
        }
    }
}, {
    collection: 'purchases',
    timestamps: true
});

const purchaseModel = model<Purchase>('purchase', purchaseSchema)

/**
 * Returns the total accumulated value of a seller, 
 * based on their sales for the past month.
 * 
 * @param document 
 * @returns number
 */
export const totalSales = async ( document: string ) => {
    let value: number = 0;

    const purchases = await purchaseModel.find({ 
        document: document, 
        date: { 
            $gte: moment().subtract(1, 'month').format('YYYY-MM-DD'), 
            $lte: moment().format('YYYY-MM-DD') 
        } 
    });
                
    if( purchases.length ) {
        const total: any = purchases.reduce( ( prev: Purchase, current: Purchase ): any => prev.value + current.value );

        if( typeof total === 'object' ) {
            value = total.value;
        } else {
            value = total;
        }
    }

    return value
}

/**
 * Calculates the percentage of discount to be applied.
 *  
 * @param value 
 * @returns number
 */
export const calcChargebackPercent = ( value: number ) => {
    if( value > 1500 )
        return 20;
    else if( value >= 1000 )
        return 15;
    else if( value > 0 )
        return 10;
    else
        return 0;
}

/**
 * Calculates the cashback received on this purchase
 *  
 * @param cashbackPercent
 * @param value 
 * @returns number
 */
export const calcChargebackValue = ( cashbackPercent: number, value: number ) =>{ 
    return ( value * ( cashbackPercent / 100) );
}



export default purchaseModel;