import * as express from 'express'
import * as jwt from 'jsonwebtoken'

import {NextFunction, Request, Response} from 'express';

import {UserRepository} from "../repository/users-repository";

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
                const user = await this.usersRepository.emailCheck(req.body.email);
                if (user.length >= 1) {
                    return res.status(409).json({
                        message: "Mail exists"
                    });
                }
                const result = await this.usersRepository.createUser(req);
                res.status(201).json({
                    username: result.username,
                    password: result.password,
                    email: result.email
                });
            } catch (err) {
                res.status(500).json({
                    error: "Signup failed"
                })
            }

        });
        this.router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const user = await this.usersRepository.emailCheck(req);
                if (user.length < 1) {
                    return res.status(401).json({
                        message: "Auth failed"
                    });
                }
                const match = await this.usersRepository.passwordCheck(req, user);
                if (match) {
                    const payload = {
                        email: user[0].email
                    };
                    const token = jwt.sign(payload, 'secret', {expiresIn: '7h'});
                    return res.status(200).json({
                        responsePayload: token,
                        msg: "Auth successful"
                    });
                }
            } catch (err) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
        });
        this.router.get('/', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const users = await this.usersRepository.getUsers();
                let result = [];
                users.forEach(user => {
                    const processedUser = {
                        username: user.username,
                        email: user.email
                    };
                    result.push(processedUser);
                });
                res.status(200).json(result);
            } catch (err) {
                res.status(404);
            }
        });
        this.router.get('/:userId', async (req: Request, res: Response, next: NextFunction) => {
            const id = req.params.userId;
            try {
                const user = await this.usersRepository.getUser(id);
                res.status(200).json(user)
            } catch (err) {
                res.status(404);
            }
        });
    }
}

export default new UserRoutes().router
