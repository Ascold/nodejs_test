import * as express from 'express'
import * as mongoose from 'mongoose'
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import { Express } from 'express';
import ApiV1 from './apiV1/apiV1';

class App {

    public app: Express;
    private dbConnectionString: string = 'mongodb://admin:admin@node-test-shard-00-00-uamiy.mongodb.net:27017,node-test-shard-00-01-uamiy.mongodb.net:27017,node-test-shard-00-02-uamiy.mongodb.net:27017/test?ssl=true&replicaSet=node-test-shard-0&authSource=admin&retryWrites=true';

    constructor () {
        this.app = express();
        this.handleCors();
        this.parseRequest();
        this.connectDb();
        this.mountApiV1();
        this.handleErrors();
    }

    private handleCors(): void {
        this.app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "http://192.168.4.225:4200");
            res.header(
                "Access-Control-Allow-Headers",
                "Origin, X-Requested-With, Content-Type, Accept, Authorization"
            );
            res.header("Access-Control-Allow-Credentials", "true");
            if (req.method === "OPTIONS") {
                res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
                res.header("Access-Control-Allow-Credentials", "true");
                return res.status(200).json({});
            }
            next();
        });
    }

    private parseRequest(): void {
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
    }

    private connectDb(): void {
        mongoose.connect(this.dbConnectionString);
    }

    private mountApiV1(): void {
        this.app.use('/api/v1', ApiV1);
    }

    private handleErrors(): void {
        this.app.use((req, res, next) => {
            res.status(404).json({
                error: {
                    message: 'error'
                }
            });
        });
    }
}

export default new App().app
