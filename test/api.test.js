const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");
const mysql= require("mysql");



//Assertion Style 
chai.should();

chai.use(chaiHttp);

describe("Rest Api", ()=>{

    //Test GET Route for all user
    describe("GET /users/register", ()=>{
        it("It should GET all the users ", (done)=>{
            chai.request(server)
                .get("/users/register")
                .end((err, response) =>{
                    response.should.have.status(200);
                    response.body.should.be.a("object");
                    response.body.should.have.property("data").be.a("array");
                done();
                })
        })
        // it("It should not GET all the users when the database is empty ", (done)=>{
        //     chai.request(server)
        //         .get("/users/register")
        //         .end((err, response) =>{
        //             response.should.have.status(401);
        //             response.body.should.be.a("object");
        //             response.body.should.have.property("message").equal("No users in database");
        //         done();
        //         })
        // })
    });



   //Test POST Route 
    describe("POST /users/register", ()=>{
        it("It should POST a new user", (done)=>{
            const user = {
                fname:"Akshat",
                lname:"Vishwakarma",
                email:"qweasd1@gmail.com",
                password:"123456789"
            }
            chai.request(server)
                .post("/users/register")
                .send(user)
                .end((err, response) =>{
                    response.should.have.status(200);
                    response.body.should.be.a("object");
                    response.body.should.have.property("message").equal("User has been added");
                   
                done();
                })
        })

        it("It should not POST a new user when email already exist", (done)=>{
            const user = {
                fname:"Akshat",
                lname:"Vishwakarma",
                email:"akshat@123.com",
                password:"123456789"
            }
            chai.request(server)
                .post("/users/register")
                .send(user)
                .end((err, response) =>{
                    response.should.have.status(401);
                    response.body.should.be.a("object");
                    response.body.should.have.property("message").equal("Email already Exist");
                done();
                })
        })

        it("It should not POST a new user when fname/lname/email is not provided ", (done)=>{
            const user = {
                email:"a45512901@gmail.com",
                password:"123456789"
            }
            chai.request(server)
                .post("/users/register")
                .send(user)
                .end((err, response) =>{
                    response.should.have.status(400);
                    response.body.should.be.a("object");
                done();
                })
        })
    });

    // // Test DELETE Route for all user
    // describe("DELETE /users/register", ()=>{
    //     it("It should DELETE all the users in the database ", (done)=>{
    //         chai.request(server)
    //             .delete("/users/register")
    //             .end((err, response) =>{
    //                 response.should.have.status(200);
    //                 response.body.should.be.a("object");
    //                 response.body.should.have.property("message").equal("Deleted all data from users");
    //             done();
    //             })
    //     })
    // });


    //Test GET Route for single user
    describe("GET /users/register/:id", ()=>{
        it("It should get a single users ", (done)=>{
            const userId = 21;
            chai.request(server)
                .get(`/users/register/${userId}`)
                .end((err, response) =>{
                    response.should.have.status(200);
                    response.body.should.be.a("object");
                    response.body.should.have.property("data").with.property("id");
                    response.body.should.have.property("data").property("fname");
                    response.body.should.have.property("data").property("lname");
                    response.body.should.have.property("data").property("email");
                    response.body.should.have.property("data").property("password");
                    response.body.should.have.property("data").property("created_at");
                done();
                })
        })
        it("It should get a single users ", (done)=>{
            const userId = 9;
            chai.request(server)
                .get(`/users/register/${userId}`)
                .end((err, response) =>{
                    response.should.have.status(400);
                    response.body.should.be.a("object");
                    response.body.should.have.property("message").equal("ID/User Doesn't Exist");
                done();
                })
        })
    });


    //Test PUT Route 
    describe("PUT /users/register/:id", ()=>{
        it("It should PUT/UPDADE a user's password", (done)=>{
            const body = {
                oldPassword:"123456789",
                newPassword:"123456789789"
            }
            const userId =23;
            chai.request(server)
                .put("/users/register/"+userId)
                .send(body)
                .end((err, response) =>{
                    response.should.have.status(200);
                    response.body.should.be.a("object");
                    response.body.should.have.property("message").equal(`Password updated for user with ID ${userId}`);
                done();
                })
        })

        it("It should not PUT/UPDADE a user's password when old password is wrong", (done)=>{
            const body = {
                oldPassword:"akshat123",
                newPassword:"1234567895656"
            }
            const userId =9;
            chai.request(server)
                .put("/users/register/"+userId)
                .send(body)
                .end((err, response) =>{
                    response.should.have.status(400);
                    response.body.should.be.a("object");
                    response.body.should.have.property("message").equal("Invalid Password");
                done();
                })
        })

        it("It should not PUT/UPDADE a user's password when new password's min char is less than 6", (done)=>{
            const body = {
                oldPassword:"123456789",
                newPassword:"12"
            }
            const userId =9;
            chai.request(server)
                .put("/users/register/"+userId)
                .send(body)
                .end((err, response) =>{
                    response.should.have.status(400);
                    response.body.should.be.a("object");
                done();
                })
        })

    })

    // //Test DELETE Route FOR single user 

    describe("DELETE /users/register/:id", ()=>{
        it("It should DELETE single user in the database ", (done)=>{
            const userId =24;
            chai.request(server)
                .delete("/users/register/"+userId)
                .end((err, response) =>{
                    response.should.have.status(200);
                    response.body.should.be.a("object");
                done();
                })
        })

        it("It should not DELETE single user in the database when ID is wrong/User doen't exist ", (done)=>{
            const userId =16;
            chai.request(server)
                .delete("/users/register/"+userId)
                .end((err, response) =>{
                    response.should.have.status(400);
                    response.body.should.be.a("object");
                done();
                })
        })
    });

    /// TEST Login POST Route 
    describe("POST /users/login", ()=>{
        it("It should POST/Login user ", (done)=>{
            const user={
                email:"akshat@123.com",
                password:"123456789"
            };
            chai.request(server)
                .post("/users/login")
                .send(user)
                .end((err, response) =>{
                    response.should.have.status(200);     
                done();
                })
        })

        it("It should not POST/Login user when email is wrong/doesn't exist", (done)=>{
            const user={
                email:"shat@123.com",
                password:"123456789"
            };
            chai.request(server)
                .post("/users/login")
                .send(user)
                .end((err, response) =>{
                    response.should.have.status(400);
                    response.body.should.be.a("object");     
                    response.body.should.have.property("message").equal("Email is incorrect");     
                done();
                })
        })

        it("It should not POST/Login user when password is wrong", (done)=>{
            const user={
                email:"akshat@123.com",
                password:"123456456"
            };
            chai.request(server)
                .post("/users/login")
                .send(user)
                .end((err, response) =>{
                    response.should.have.status(401);
                    response.body.should.be.a("object");     
                    response.body.should.have.property("message").equal("Invalid Password");     
                done();
                })
        })
        
    });

})