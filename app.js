const express = require("express");
const app= express();
const usersRouter = require('./routes/users');
const dbRouter = require('./database');

// use router
app.use('/users', usersRouter);

//Database Creation and Table Creation Routes

app.use('/create', dbRouter);

module.exports= app.listen('3001',()=>{
    console.log("Server started on Port 3001");
});


