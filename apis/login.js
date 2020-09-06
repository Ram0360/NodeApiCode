const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");

//pg admin
const pg = require("pg");
const app = require('../app');
const { route, response } = require('../app');

const config = {
    user:"postgres",
    password:"5432",
    port:5432,
    database:"react_talent_app"
};

const pool = new pg.Pool(config);

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));

//GET
router.get('/',(req,res,next) => {
    pool.connect((err, client, done) =>{
        if(err)
        {
            done();
            res.status(400).send(err);
        }
        client.query('SELECT * FROM public.user_details', (err, result) => {
            done();
            if(err){
                res.status(500).send(err);
            }
            else{
                res.status(200).send(result.rows);
            }

        })
    })
});

//GET Details for given id
router.get('/getdetailforId/:id',(req,res,next) => {
    pool.connect((err, client, done) =>{
        if(err)
        {
            done();
            res.status(400).send(err);
        }
        client.query('SELECT * FROM user_details WHERE user_id = '+req.params.id, (err, result) => {
            done();
            if(err){
                res.status(500).send(err);
            }
            else{
                res.status(200).send(result.rows);
            }
        })
    })
});



//PATCH for Applicant
router.patch('/updateappldetails',(req,res, next) =>{
    pool.connect((err, client, done) =>{
        if(err){
            done();
            res.status(400).send(err);
        }
        else{
            client.query('UPDATE user_details SET "user_name"=' + "'" + req.body.user_name + "'" + ',"user_email"='+ "'"  + req.body.user_email+ "'"  + ', "user_phonenumber"=' + req.body.user_phonenumber + ',"user_type"='+ "'"  + req.body.user_type+ "'"  + 'WHERE "user_id"='+ "'"  + req.body.user_id+ "'" + ';',(err, result)=> {
                done();
                if(err){
                    res.status(500).send(err);
                }
                else{
                    res.status(200).json({
                        message : "Details updated successfully"
                    })
                }
            })
        }     
    })     
});

//PATCH for HR Details
router.patch('/updatehrdetails',(req,res, next) =>{
    pool.connect((err, client, done) =>{
        if(err){
            done();
            res.status(400).send(err);
        }
        else{
            client.query('INSERT INTO user_details ("user_name", "user_password", "retype_password","user_email", "user_phonenumber", "user_type") VALUES (' + "'" + req.body.user_name+ "','" + req.body.user_password + "','" + req.body.retype_password + "','"   + req.body.user_email + "','"  + req.body.user_phonenumber + "','" + req.body.user_type + "')",(err, result)=> {
                done();
                if(err){
                    res.status(500).send(err);
                }
                else{
                    res.status(201).json({
                        message : "Inserted successfully"
                    })
                }
            })
        }
     
    })     
});

//PUT for registration
router.put('/adddetails',(req,res, next) =>{
    pool.connect((err, client, done) =>{
        if(err){
            done();
            res.status(400).send(err);
        }
        else if(req.body.user_password != req.body.retype_password){
            res.status(500).json({
                message : "Password and Re-type password should be same"
            })
        }
        else{
            client.query('INSERT INTO user_details ("user_name", "user_password", "retype_password","user_email", "user_phonenumber", "user_type") VALUES (' + "'" + req.body.user_name+ "','" + req.body.user_password + "','" + req.body.retype_password + "','"   + req.body.user_email + "','"  + req.body.user_phonenumber + "','" + req.body.user_type + "')",(err, result)=> {
                done();
                if(err){
                    res.status(500).send(err);
                }
                else{
                    res.status(201).json({
                        message : "Inserted successfully"
                    })
                }
            })
        }
     
    })     
});

//POST for login
router.post('/userlogin',(req,res,next) => {
    pool.connect((err, client, done) =>{
        if(err)
        {
            done();
            res.status(400).send(err);
        }

        else{

            var name = req.body.user_email;
            var pswd =  req.body.user_password;
        
            client.query("SELECT * FROM public.user_details WHERE user_email = '" + name  + "' AND user_password ='" + pswd + "'", (err, result) => {
                done();
                if(err){
                    res.status(500).send(err);
                }
                else{
                    if(result.rows == ''){
                        res.status(500).json({
                            message : "Invalid login credentials, try again"
                        })
                    }
                    else{
                        res.status(200).json({
                        message : "Login Successfully"
                    })
                    }
                    
                }
    
            })
        }
        
    })
});


module.exports = router;