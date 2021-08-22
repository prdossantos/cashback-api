import mongoose, { Mongoose } from 'mongoose';

const mdbConnection = (): Promise<Mongoose> => {

    const connection = mongoose.connect(`${process.env.MONGODB_NEW_URL_PARSER}`, { useUnifiedTopology: true, useNewUrlParser: true });

    mongoose.connection.on('connecting', () => console.log('MongoDB is trying to connect'))

    return connection;
}

export const isDBConnected = () => {
    const isConnected = mongoose.connections.map( conn => conn.readyState );
    return isConnected.length ? isConnected[0] == 1 : false
};

export default mdbConnection;