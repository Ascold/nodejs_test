import * as express from 'express'

import {NextFunction, Request, Response} from 'express';

import {UserRepository} from "../data/repository/users-repository";
import {UserModel} from "./models/user.model";
import {ErrorsConstant} from "./constants/errors.constant";
import {SuccessConstant} from "./constants/success.constant";

class UserRoutes {

    public router;
    public usersRepository;

    constructor() {
        this.usersRepository = new UserRepository();
        this.router = express.Router();
        this.mountRoutes();
    }

    public mountRoutes(): void {
        this.router.post('/create', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const result: UserModel = await this.usersRepository.createUser(req);
                res.status(201).json({
                    username: result.username,
                    password: result.password,
                    email: result.email
                });
            } catch (err) {
                res.status(ErrorsConstant.code[err.message] || ErrorsConstant.code.default_error).json({
                    error: ErrorsConstant.message[err.message] || ErrorsConstant.message.default_error
                })
            }

        });
        this.router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const token = await this.usersRepository.loginUser(req);
                return res.status(+SuccessConstant.code.auth_success).json({
                    responsePayload: token,
                    msg: SuccessConstant.message.auth_success
                });
            } catch (err) {
                res.status(ErrorsConstant.code[err.message] || ErrorsConstant.code.default_error).json({
                    error: ErrorsConstant.message[err.message] || ErrorsConstant.message.default_error
                })
            }
        });
        this.router.get('/', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const result = await this.usersRepository.getUsers();
                res.status(200).json(result);
            } catch (err) {
                res.status(ErrorsConstant.code[err.message] || ErrorsConstant.code.default_error).json({
                    error: ErrorsConstant.message[err.message] || ErrorsConstant.message.default_error
                })
            }
        });
        this.router.get('/:userId', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const user = await this.usersRepository.getUser(req.params.userId);
                res.status(200).json(user)
            } catch (err) {
                res.status(404);
            }
        });
    }
}

export default new UserRoutes().router
