import * as mongoose from 'mongoose'
import * as bcrypt from 'bcrypt'
import User from '../models/user'

export class UserRepository {

    constructor() {

    }

    public emailCheck(req) {
        return User.find({email: req.body.email}).exec();
    }

    public passwordCheck(req, user) {
        return bcrypt.compare(req.body.password, user[0].password);
    }

    public getUsers() {
        return User.find().exec();
    }

    public getUser(id) {
        return User.findById(id).exec();
    }

    public async createUser(req) {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(req.body.password, salt);
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                username: req.body.username,
                password: hash,
                email: req.body.email
            });
            const result = await user.save();
            return {
                username: result.username,
                password: result.password,
                email: result.email
            };
    }
}