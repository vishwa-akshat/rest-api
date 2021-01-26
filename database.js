const app_db = require("express").Router();
const mysql= require("mysql");

// CREATE COONECTION

const db= mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'testing' 
    //Uncomment database: 'name of database' after creating database to create table
});

// CONNECT

db.connect((err)=>{
    if(err){
        throw err;
    }
    console.log("MySQL connected...");
});


//CREATE DB

app_db.get('/db',(req,res)=>{
    const dbname = "testing2";
    let sql = `CREATE DATABASE ${dbname}`;
    db.query(sql,(err, result)=>{
        if(err) throw err;
        console.log(result);
        res.send('Database created');
    })
});

// CREATE TABLE

app_db.get('/table',(req,res)=>{
    let sql="CREATE TABLE users(id INT NOT NULL AUTO_INCREMENT, fname VARCHAR(255), lname VARCHAR(255), email VARCHAR(255),password VARCHAR(255),created_at DATETIME DEFAULT NOW(),PRIMARY KEY(id))";

    db.query(sql, (err, result)=>{
        if(err) throw err;
        console.log(result);
        res.status(200).json('Table created');
    })

});

module.exports= app_db;