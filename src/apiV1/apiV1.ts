import * as express from 'express'
import userRouter from './routes/users';
import { Express } from 'express';

class ApiV1 {
    public app: Express;

    constructor() {
        this.app = express();
        this.mountApi();
    }

    public mountApi(): void {
        this.app.use('/users', userRouter);
    }
}
export default new ApiV1().app
