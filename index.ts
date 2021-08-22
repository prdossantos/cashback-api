import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './src/routes';
import mdbConnection from './src/mongo.connection';
import { responseError } from './src/helper';

const app = express();

require('dotenv').config({
    path: `.env`,
})

const port = process.env.NODE_PORT || '8080';

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(compression())

app.use(cors())

app.listen(port, () => {
    console.log(`app listening on port ${port}`);

    mdbConnection().then( connection => {
        console.log('MongoDB connected')
    }).catch( e => {
        console.log(`Mongodb connection error: ${e.message}`)
    })
})

app.use((req, res, next) => {
    // console.log('Time:', Date.now());
    // console.log('ENV:', app_env)

    next();
});


//Routes
app.use('/', routes);


//Response Middleware
app.use((req, res, next) => {
    if( res.statusCode >= 400 ) {
        res.status(res.statusCode).send(responseError(res.statusMessage || 'Method not found'));
    } else {
        res.status(404).send(responseError(res.statusMessage || 'Method not found'));
    }
});