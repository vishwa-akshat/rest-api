const express = require("express");
const app= express();
const bodyParser=require("body-parser");
const mysql= require("mysql");

app.use(bodyParser.json());


// CREATE COONECTION

const db= mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'testing'
});

//CONNECT

db.connect((err)=>{
    if(err){
        throw err;
    }
    console.log("MySQL connected...");
});

//CREATE DB

app.get('/createdb',(req,res)=>{
    let sql = "CREATE DATABASE testing";
    db.query(sql,(err, result)=>{
        if(err) throw err;
        console.log(result);
        res.send('Database created');
    })
});

// CREATE TABLE

app.get('/createtable',(req,res)=>{
    let sql="CREATE TABLE users(id INT NOT NULL AUTO_INCREMENT, fname VARCHAR(255), lname VARCHAR(255), email VARCHAR(255),password VARCHAR(255),PRIMARY KEY(id))";

    db.query(sql, (err, result)=>{
        if(err) throw err;
        console.log(result);
        res.json('Table created');
    })

});
////////VALIDATION
const Joi = require("@hapi/joi");

const schema = Joi.object({
    fname: Joi.string().min(3).required(),
    lname: Joi.string().min(3).required(),
    email: Joi.string().email().min(6).required(),
    password: Joi.string().min(6).required()
});

//GET ALL
app.route("/users")
.get((req,res)=>{
    let sql = 'SELECT * FROM users;'

    let query = db.query(sql,(err, results)=>{
        if(err){
            res.json({
                success:0,
                message: err.message
            })
        }
        console.log(results);
        res.json({
            success:1,
            data: results
        });
    })
})
//POST
.post((req,res)=>{

    const { error } = schema.validate(req.body);

    if(error){
        return res.status(400).send(error.details[0].message);
    }

    let user={
        fname:req.body.fname,
        lname:req.body.lname,
        email:req.body.email,
        password:req.body.password
    };


    let sql= 'INSERT INTO users SET ?';

    let query = db.query(sql, user, (err, result)=>{
        if(err){
            res.json({
                success:0,
                message: err.message
            })
        }
        console.log(result);
        res.json({
            success:1,
            message: "User has been added"
        })
    })
})
//DELETE ALL
.delete((req,res)=>{
    let sql = `DELETE FROM users;`

    let query = db.query(sql,(err, result)=>{
        if(err){
            res.json({
                success: 0,
                message:err.message
            });
        }
        console.log(result);
        res.json({
            success: 1,
            message: "Deleted all data from users"
        });
    })
});

//GET ONE
app.route("/users/:id")
.get((req,res)=>{
    let sql = `SELECT * FROM users WHERE id=${req.params.id};`

    let query = db.query(sql,(err, result)=>{
        if(err){
            res.json({
                success:0,
                message: err.message
            })
        }
        console.log(result);
        res.json({
            success:1,
            data: result
        });
    })
})
//UPDATE 
.put((req,res)=>{
    let reset=req.body.reset;
    let sql=`UPDATE users SET password = ${reset} WHERE id=${req.params.id};`

    let query = db.query(sql,(err, result)=>{
        if(err){
            res.json({
                success: 0,
                message:err.message
            });
        }
        console.log(result);
        res.json({
            success: 1,
            message: `Password updated for user with ID ${req.params.id}`
        });
    })
})
//DELETE
.delete((req,res)=>{
    let sql = `DELETE FROM users WHERE id=${req.params.id};`

    let query = db.query(sql,(err, result)=>{
        if(err){
            res.json({
                success: 0,
                message:err.message
            });
        }
        console.log(result);
        res.json({
            success: 1,
            message: `Deleted user with ID ${req.params.id}`
        });
    })
});


app.listen('3000',()=>{
    console.log("Server started on Port 3000");
});