const express = require('express');
const app = express();
const usersRouter = require('./routes/users');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

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