import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './src/routes';
import mdbConnection from './src/mongo.connection';
import { responseError } from './src/helper';
const pino = require('pino-http')()
const logger = require('pino')({
    prettyPrint: {
      levelFirst: true
    },
    prettifier: require('pino-pretty')
})

const app = express();

require('dotenv').config({
    path: `.env`,
})

const port = process.env.NODE_PORT || '8080';

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(compression())
app.use(pino)
app.use(cors())

app.listen(port, () => {
    logger.info(`app listening on port ${port}`)

    mdbConnection().then( connection => {
        logger.info(`MongoDB connected`)
    }).catch( e => {
        logger.error(`Mongodb connection error: ${e.message}`)
    })
})

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