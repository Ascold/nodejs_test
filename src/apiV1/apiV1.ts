import router from './routes/users';
import { Express } from 'express';

export class ApiV1 {
    public app: Express;

    public mountApi(app): void {
        this.app = app;
        app.use('/users', router);
        app.use((req, res, next) => {
            res.status(404).json({
                error: {
                    message: 'error'
                }
            });
        });
    }
}
