const express = require('express');
const app = express();
const usersRouter = require('./routes/users');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect(
    'mongodb://admin:admin@node-test-shard-00-00-uamiy.mongodb.net:27017,node-test-shard-00-01-uamiy.mongodb.net:27017,node-test-shard-00-02-uamiy.mongodb.net:27017/test?ssl=true&replicaSet=node-test-shard-0&authSource=admin&retryWrites=true'
);

app.use('/users', usersRouter);

app.use((req, res, next) => {
    const error = new Error();
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    console.log('error');
    res.status(err.status);
    res.json({
        error: {
            message: err.message
        }
    })
});

module.exports = app;