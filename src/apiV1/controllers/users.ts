import * as express from 'express'
import * as mongoose from 'mongoose'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import User from '../../models/user'
import {NextFunction, Request, Response} from 'express';

class UserRoutes {

    public router;

    constructor() {
        this.router = express.Router();
        this.mountRoutes();
    }

    public mountRoutes(): void {
        this.router.post('/create', async (req: Request, res: Response, next: NextFunction) => {

            const user = await User.find({email: req.body.email}).exec();

            if (user.length >= 1) {
                return res.status(409).json({
                    message: "Mail exists"
                });
            } else {
                bcrypt.hash(req.body.password, 10, async (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            username: req.body.username,
                            password: hash,
                            email: req.body.email
                        });

                        try {
                            const result = await user.save();
                            res.status(201).json({
                                username: result.username,
                                password: result.password,
                                email: result.email
                            });
                        } catch (err) {
                            res.status(404);
                            // const error = new Error(err);
                            // error.status = 404;
                            // next(error);
                        }
                    }
                });
            }
        });
        this.router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
            console.log('cookie', req.cookies);
            try {
                const user = await User.find({email: req.body.email}).exec();
                if (user.length < 1) {
                    return res.status(401).json({
                        message: "Auth failed"
                    });
                }
                const match = await bcrypt.compare(req.body.password, user[0].password);
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
                const users = await User.find().exec();
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
                // const error = new Error(err);
                // error.status = 404;
                // next(error);
            }
        });
        this.router.get('/:userId', async (req: Request, res: Response, next: NextFunction) => {
            const id = req.params.userId;
            try {
                const user = await User.findById(id).exec();
                res.status(200).json(user)
            } catch (err) {
                res.status(404);
                // const error = new Error(err);
                // error.status = 404;
                // next(error);
            }
        });
    }
}

export default new UserRoutes().router
