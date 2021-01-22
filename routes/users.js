
const router = require("express").Router();
const { registerValidation, loginValidation}= require("../validation");
const bcrypt = require("bcryptjs");
const mysql= require("mysql");
const bodyParser=require("body-parser");

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
.post(async (req,res)=>{

    // VALIDATION BEFORE STORING DATA
    const { error } = registerValidation(req.body);

    if(error){
        return res.status(400).send(error.details[0].message);
    }

    // CHECK USER ALREADY EXIST IN DATABASE OR NOT

    // const [result]= await db.query(`SELECT DISTINCT email FROM users WHERE email="${req.body.email}";`);
    // res.send(result);
    
    // // HASH PASSWORD

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // // ADDING NEW USER

    let user={
        fname:req.body.fname,
        lname:req.body.lname,
        email:req.body.email,
        password:hashedPassword
    };


    let sql= 'INSERT INTO users SET ?';

    let query = await db.query(sql, user, (err, result)=>{
        if(err){
            res.json({
                success:0,
                message: err.message
            })
        }
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
router.route("/register/:id")
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


//////////////////////////LOGIN////

// app.route("/login")
// .post(async (req,res)=>{
//     // VALIDATION 
//     const { error } = loginValidation(req.body);

//     if(error){
//         return res.status(400).send(error.details[0].message);
//     }

//     // CHECK IF EMAIL EXIST


// })

module.exports = router;