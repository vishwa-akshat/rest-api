const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");

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
                done();
                })
        })
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
                done();
                })
        })

        it("It should not POST a new user when email already exist", (done)=>{
            const user = {
                fname:"Akshat",
                lname:"Vishwakarma",
                email:"a78901@gmail.com",
                password:"123456789"
            }
            chai.request(server)
                .post("/users/register")
                .send(user)
                .end((err, response) =>{
                    response.should.have.status(401);
                    response.body.should.be.a("object");
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

    //Test DELETE Route for all user



    //Test GET Route for single user
    describe("GET /users/register/:id", ()=>{
        it("It should get a single users ", (done)=>{
            const userId = 9;
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
    });


    //Test PUT Route 
    describe("PUT /users/register", ()=>{
        it("It should PUT/UPDADE a user's password", (done)=>{
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
                done();
                })
        })

    })
    //Test DELETE Route FOR single user 

    
})