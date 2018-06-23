const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');

// const connection = mongoose.connection;
//
// router.delete("/", (req, res, next) => {
//     connection.dropDatabase();
//     res.status(200);
// });

/* GET users listing */
router.get('/', function (req, res, next) {
    User.find()
        .exec()
        .then(users => {
            res.status(200).json(users)
        })
        .catch(err => {
            const error = new Error(err);
            error.status = 404;
            next(error);
        })
});

/* GET user by id */
router.get('/:userId', function (req, res, next) {
    const id = req.params.userId;
    User.findById(id)
        .exec()
        .then(user => {
            res.status(200).json(user)
        })
        .catch(err => {
            const error = new Error(err);
            error.status = 404;
            next(error);
        })
});

/* POST user */

router.post('/create', function (req, res, next) {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: "Mail exists"
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
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
                        user.save()
                            .then(result => {
                                res.status(201).json({
                                    username: result.username,
                                    password: result.password,
                                    email: result.email
                                });
                            })
                            .catch(err => {
                                const error = new Error(err);
                                error.status = 404;
                                next(error);
                            });
                    }
                });
            }

        });
});

module.exports = router;
