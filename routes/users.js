require("dotenv").config();
const router = require("express").Router();
const { registerValidation, loginValidation}= require("../validation");
const bcrypt = require("bcryptjs");
const mysql= require("mysql");
const bodyParser=require("body-parser");
const jwt = require("jsonwebtoken");
const verify = require("./verifyToken");

router.use(bodyParser.json());

// CREATE COONECTION

const db= mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'testing'
});


//GET ALL
router.route("/register")
.get(verify,(req,res)=>{
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
.post(async (req,res)=>{

    // VALIDATION BEFORE STORING DATA
    const { error } = registerValidation(req.body);

    if(error){
        return res.status(400).send(error.details[0].message);
    }
    
    // // HASH PASSWORD

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

     // CHECK USER ALREADY EXIST IN DATABASE OR NOT

    db.query(`SELECT DISTINCT email FROM users WHERE email="${req.body.email}";`,async (err, result)=>{
        if(err){
            res.json({
                success:0,
                message: err.message
            })
        }
       
        console.log(result.length);
        if(result.length===1) {
            res.json({
                message: "Email already Exist"
            })
        }
        if(result.length===0){
            // ADDING NEW USER

            let user={
                fname:req.body.fname,
                lname:req.body.lname,
                email:req.body.email,
                password:hashedPassword
            };


            let sql= 'INSERT INTO users SET ?';

            let query = db.query(sql, user, (error, data)=>{
                if(error){
                    res.json({
                        success:0,
                        message: error.message
                    })
                }
                res.json({
                    success:1,
                    message: "User has been added"
                })
            })
        }

    });
})
//DELETE ALL
.delete(verify,(req,res)=>{
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
router.route("/register/:id")
.get(verify,(req,res)=>{
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
.put(verify,(req,res)=>{
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
.delete(verify,(req,res)=>{
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


//////////////////////////LOGIN////

router.route("/login")
.post(async (req,res)=>{
    // VALIDATION 
    const { error } = loginValidation(req.body);

    if(error){
        return res.status(400).send(error.details[0].message);
    }

    // CHECK IF EMAIL EXIST
    db.query(`SELECT DISTINCT email,password FROM users WHERE email="${req.body.email}";`,async (err, result)=>{
        if(err){
            res.status(400).json({
                success:0,
                message: err.message
            })
        }
        if(result.length===0){
            res.status(400).json({
                        message: "Email or Password is incorrect"
                    })
        }
        
        if(result.length===1){
            const validPass = await bcrypt.compare(req.body.password, result[0].password);
            if(!validPass){
                res.status(400).json({
                    message:"Invalid Password"
                })
            }
            /// //////////////////////////////////////

            //CREATE and assign Token

            const token = jwt.sign({_pass:result[0].password}, process.env.TOKEN_SECRET);
            res.header('auth-token', token).send(token);
            // res.send("Logged In Sucessfully")
            
        }
        
    });
    
})

module.exports = router;