const express = require('express');
const app = express();
const apiRoutesV1 = require('./api_v1/api_v1');

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://192.168.4.225:4200");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        res.header("Access-Control-Allow-Credentials", "true");
        return res.status(200).json({});
    }
    next();
});
app.use('/api/v1', apiRoutesV1);

module.exports = app;
