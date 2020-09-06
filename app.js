const express = require('express');
const app = express();

const morgan = require('morgan');

app.use((req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Access-Control-Allow-Credentials", "true");
		res.setHeader("Access-Control-Max-Age", "1800");
		res.setHeader("Access-Control-Allow-Headers", "content-type");
		res.setHeader("Access-Control-Allow-Methods","PUT, POST, GET, DELETE, PATCH, OPTIONS");

    // if(req.method === "OPTIONS")
    // {
    //     res.header("Access-Control-Allow-Methods", "POST,PUT,GET,PATCH,DELETE");
    //     return res.status(200).json({});
    // }
    next();
});


app.use(morgan('dev'));

//Login Routing

const loginRouting = require('./apis/login');
app.use('/login',loginRouting);

app.use((req,res,next) =>{
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error : {
            message : error.message
        }
    })
});

module.exports = app;