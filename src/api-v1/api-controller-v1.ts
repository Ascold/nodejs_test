import * as express from 'express'
import userRouter from './controllers/users';
import { Express } from 'express';

class ApiController {
    public app: Express;

    constructor() {
        this.app = express();
        this.mountApi();
    }

    public mountApi(): void {
        this.app.use('/users', userRouter);
    }
}
export default new ApiController().app
