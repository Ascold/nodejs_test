const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');


mongoose.connect(
    'mongodb://admin:admin@node-test-shard-00-00-uamiy.mongodb.net:27017,node-test-shard-00-01-uamiy.mongodb.net:27017,node-test-shard-00-02-uamiy.mongodb.net:27017/test?ssl=true&replicaSet=node-test-shard-0&authSource=admin&retryWrites=true'
);

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
router.post('/', function (req, res, next) {
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        lastName: req.body.lastName
    });
    user.save()
        .then(result => {
            console.log('result', result);
            res.status(201).json({result});
        })
        .catch(err => {
            const error = new Error(err);
            error.status = 404;
            next(error);
        });
});

module.exports = router;
