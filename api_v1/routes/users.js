const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

/* Create user */

router.post('/create', async (req, res, next) => {

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
                    const error = new Error(err);
                    error.status = 404;
                    next(error);
                }
            }
        });
    }
});

/* Login user */

router.post('/login', async (req, res, next) => {
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
            return res.cookie('token', 'token', {httpOnly : false}).json({
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

/* GET users listing */

router.get('/', async (req, res, next) => {
    try {
        const users = await User.find().exec();
        res.status(200).json(users)
    } catch (err) {
        const error = new Error(err);
        error.status = 404;
        next(error);
    }
});

/* GET user by id */

router.get('/:userId', async (req, res, next) => {
    const id = req.params.userId;
    try {
        const user = await User.findById(id).exec();
        res.status(200).json(user)
    } catch (err) {
        const error = new Error(err);
        error.status = 404;
        next(error);
    }
});

module.exports = router;
