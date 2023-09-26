
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
const app = express();

dotenv.config({path:'./config.env'});
require('./db/conn');

const User = require('./model/UserSchema');

app.use(express.json());

app.use(require('./router/auth'));

const PORT = process.env.PORT;


app.get('/contact',(req,res)=>{
    // res.cookie("jwt",'diksh');
    res.send("contact page");
});
app.get('/login',(req,res)=>{
    res.send("login page");
});

app.get('/registration',(req,res)=>{
    res.send("registration page");
});
app.listen(PORT,()=>{
    console.log(`Server is running at port number ${PORT}`)
})