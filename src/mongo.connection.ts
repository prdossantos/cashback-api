import mongoose, { Mongoose } from 'mongoose';
const logger = require('pino')({
    prettyPrint: {
      levelFirst: true
    },
    prettifier: require('pino-pretty')
})
const mdbConnection = (): Promise<Mongoose> => {

    const connection = mongoose.connect(`${process.env.MONGODB_NEW_URL_PARSER}`, { useUnifiedTopology: true, useNewUrlParser: true });

    mongoose.connection.on('connecting', () =>{ 
        logger.info('MongoDB is trying to connect')
    })

    return connection;
}

export const isDBConnected = () => {
    const isConnected = mongoose.connections.map( conn => conn.readyState );
    return isConnected.length ? isConnected[0] == 1 : false
};

export default mdbConnection;