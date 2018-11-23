import * as mongoose from 'mongoose'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

import User from '../models/user'
import {UserModel} from "../../controllers/models/user.model";

export class UserRepository {

    constructor() {

    }

    public emailCheck(req): Array<UserModel> {
        return User.find({email: req.body.email}).exec();
    }

    public passwordCheck(req, user): boolean {
        return bcrypt.compare(req.body.password, user[0].password);
    }

    public async getUsers(): Promise<Array<UserModel>> {
        try {
            User.find().exec();
            const usersArr = await User.find().exec();
            let result = [];
            usersArr.forEach(user => {
                const processedUser = {
                    username: user.username,
                    email: user.email
                };
                result.push(processedUser);
            });
            return result;
        } catch (err) {
            throw new Error("not_found")
        }
    }

    public getUser(id): Object {
        return User.findById(id).exec();
    }

    public async createUser(req): Promise<UserModel> {
        const user = await this.emailCheck(req);
        let salt;
        let hash;

        if (user.length >= 1) {
            throw new Error("mail_exists")
        }
        try {
            salt = bcrypt.genSaltSync(10);
            hash = bcrypt.hashSync(req.body.password, salt);
        } catch (err) {
            throw new Error("hashing_error")
        }
        try {
            const newUser = new User({
                _id: new mongoose.Types.ObjectId(),
                username: req.body.username,
                password: hash,
                email: req.body.email
            });
            const result = await newUser.save();
            return {
                username: result.username,
                password: result.password,
                email: result.email
            };
        } catch (err) {
            throw new Error("signup_error")
        }
    }

    public async loginUser(req) {
        const user = await this.emailCheck(req);

        if (user.length < 1) {
            throw new Error("auth_error")
        }

        try {
            const match = await this.passwordCheck(req, user);
            if (match) {
                const payload = {
                    email: user[0].email
                };
                return jwt.sign(payload, 'secret', {expiresIn: '7h'});
            }
        } catch (err) {
            throw new Error("auth_error")
        }
    }
}