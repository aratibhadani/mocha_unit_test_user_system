let chaiHttp = require("chai-http");
const server = require("../../server.js");
var chai = require("chai");
const { expect } = require("chai");
const should = chai.should();
chai.use(chaiHttp);

describe(">>>>>>>>>>>> Test Register User API <<<<<<<<<<<<<", () => {
  it(">>>>> Failure : first name required", function (done) {
    chai
      .request(server)
      .post("/add-user")
      .send({
        email: "testUser1@gmail.com",
        lastName: "tester",
      })
      .end((err, response) => {
        expect(response.status).to.be.equal(400);
        response.body.should.have.nested.property("meta.message");
        done();
      });
  });
  it(">>>>> Failure : user first name not blank", function (done) {
    chai
      .request(server)
      .post("/add-user")
      .send({
        firstName: "",
        email: "testUser1@gmail.com",
        lastName: "tester",
      })
      .end((err, response) => {
        expect(response.status).to.be.equal(400);
        response.body.should.have.nested.property("meta.message");
        done();
      });
  });
  it(">>>>> Failure : user first name not be max 20 character", function (done) {
    chai
      .request(server)
      .post("/add-user")
      .send({
        firstName: "1234567890-1234567890",
        email: "testUser1@gmail.com",
        lastName: "tester",
      })
      .end((err, response) => {
        expect(response.status).to.be.equal(400);
        response.body.should.have.nested.property("meta.message");
        done();
      });
  });
  it(">>>>> Failure : last name required", function (done) {
    chai
      .request(server)
      .post("/add-user")
      .send({
        email: "testUser1@gmail.com",
        firstName: "tester",
      })
      .end((err, response) => {
        expect(response.status).to.be.equal(400);
        response.body.should.have.nested.property("meta.message");
        done();
      });
  });
  it(">>>>> Failure : user last name not blank", function (done) {
    chai
      .request(server)
      .post("/add-user")
      .send({
        lastName: "",
        email: "testUser1@gmail.com",
        firstName: "tester",
      })
      .end((err, response) => {
        expect(response.status).to.be.equal(400);
        response.body.should.have.nested.property("meta.message");
        done();
      });
  });
  it(">>>>> Failure : user last name not be max 20 character", function (done) {
    chai
      .request(server)
      .post("/add-user")
      .send({
        lastName: "1234567890-1234567890",
        email: "testUser1@gmail.com",
        firstName: "tester",
      })
      .end((err, response) => {
        expect(response.status).to.be.equal(400);
        response.body.should.have.nested.property("meta.message");
        done();
      });
  });
  it(">>>>> Failure : email required", function (done) {
    chai
      .request(server)
      .post("/add-user")
      .send({
        firstName: "tester",
        lastName: "testData",
      })
      .end((err, response) => {
        expect(response.status).to.be.equal(400);
        response.body.should.have.nested.property("meta.message");
        done();
      });
  });
  it(">>>>> Failure : user email not blank", function (done) {
    chai
      .request(server)
      .post("/add-user")
      .send({
        lastName: "test",
        email: "",
        firstName: "tester",
      })
      .end((err, response) => {
        expect(response.status).to.be.equal(400);
        response.body.should.have.nested.property("meta.message");
        done();
      });
  });
  it(">>>>> Failure : user email not be max 50 character", function (done) {
    chai
      .request(server)
      .post("/add-user")
      .send({
        lastName: "123456",
        email: "1234567890-12345678901234567890123456789012345gmail.com",
        firstName: "tester",
      })
      .end((err, response) => {
        expect(response.status).to.be.equal(400);
        response.body.should.have.nested.property("meta.message");
        done();
      });
  });
  it(">>>>> Failure : user enter valid email ID", function (done) {
    chai
      .request(server)
      .post("/add-user")
      .send({
        lastName: "test",
        email: "1234567890-12345678901234567890123456789012345678901341",
        firstName: "tester",
      })
      .end((err, response) => {
        expect(response.status).to.be.equal(400);
        response.body.should.have.nested.property("meta.message");
        done();
      });
  });
  // it(">>>>> Failure : User already exists", function (done) {
  //   chai
  //     .request(server)
  //     .post("/add-user")
  //     .send({
  //       firstName: "Paul Oluyege",
  //       lastName: "Paul Oluyege",
  //       email: "testUser1@gmail.com",
  //     })
  //     .end((err, response) => {
  //       if (response.status) expect(response.status).to.be.equal(400);
  //       response.body.should.have.property("message");
  //       response.body.message.should.equal("User already exists.");
  //       done();
  //     });
  // });
  // it(">>>>> Success : User created success", function (done) {
  //   chai
  //     .request(server)
  //     .post("/add-user")
  //     .send({
  //       firstName: "Paul Oluyege",
  //       lastName: "Paul Oluyege",
  //       email: "testUser1@gmail.com",
  //     })
  //     .end((err, response) => {
  //       if (response.status) expect(response.status).to.be.equal(200);
  //       response.body.should.have.property("message");
  //       response.body.message.should.equal("User register successfully.");
  //       done();
  //     });
  // });
});

describe(">>>>>>>>>>>> Test Login API <<<<<<<<<<<<", () => {
  it(">>>>> Success : login with access auth route", function (done) {
    chai
      .request(server)
      .post("/login")
      .send({
        password: "User1234",
        email: "radhamishra12@gmail.com",
      })
      .end((err, res) => {
        res.body.should.have.property("token");
        var token = res.body.token;
        chai
          .request(server)
          .get("/user-todo")
          .set({ Authorization: `Bearer ${token}` })
          .end(function (error, response) {
            response.should.have.status(200);
            done();
          });
      });
  });
  it(">>>>> Failure : login with No user exists", function (done) {
    chai
      .request(server)
      .post("/login")
      .send({
        password: "User1234",
        email: "radha@gmail.com",
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(404);
        done();
      });
  });
  it(">>>>> Failure : login with Password incorrect", function (done) {
    chai
      .request(server)
      .post("/login")
      .send({
        password: "User123",
        email: "radhamishra12@gmail.com",
      })
      .end((err, response) => {
        response.should.have.status(401);
        response.should.be.json;
        response.body.should.be.a("object");
        done();
      });
  });
});

describe(">>>>>>>>>>>> Test User Listing API <<<<<<<<<<<<<", () => {
  it("Success : get all user", function (done) {
    chai
      .request(server)
      .get("/user-list")
      .end((err, response) => {
        expect(response.status).to.be.equal(200);
        expect(response.body).to.have.all.keys("data");
        done();
      });
  });
  it("Success : get search user", function (done) {
    chai
      .request(server)
      .get("/user-list")
      .end((err, response) => {
        expect(response.status).to.be.equal(200);
        expect(response.body).to.have.all.keys("data");
        done();
      });
  });
});

describe(">>>>>>>>>>>> Update User API <<<<<<<<<<<<<", () => {
  it("Failure : user not exists", function (done) {
    chai
      .request(server)
      .patch('/user/10')
      .send({
        firstName:"test",
        lastName:"user"
      })
      .end((err, response) => {
        response.should.have.status(404);
        response.body.should.have.property('message');
        done();
      });
  });
  it("Success : update user", function (done) {
    chai
      .request(server)
      .patch('/user/3')
      .send({
        firstName:"test",
        lastName:"user"
      })
      .end((err, response) => {
        response.should.have.status(200);
        response.body.should.have.property('message');
        done();
      });
  });
});
describe(">>>>>>>>>>>> Get Specific User Data <<<<<<<<<<<<<", () => {
  it("Failure : user not exists", function (done) {
    chai
      .request(server)
      .get('/user/10')
      .send({
        firstName:"test",
        lastName:"user"
      })
      .end((err, response) => {
        response.should.have.status(404);
        response.body.should.have.property('message');
        done();
      });
  });
  it("Success : get user data", function (done) {
    chai
      .request(server)
      .get('/user/3')
      .end((err, response) => {
        response.should.have.status(200);
        response.body.should.have.property('message');
        done();
      });
  });
});
describe(">>>>>>>>>>>> Delete User Data <<<<<<<<<<<<<", () => {
  it("Failure : user not exists", function (done) {
    chai
      .request(server)
      .delete('/user/10')
      .end((err, response) => {
        response.should.have.status(404);
        response.body.should.have.property('message');
        done();
      });
  });
  it("Success : delete user data", function (done) {
    chai
      .request(server)
      .delete('/user/3')
      .end((err, response) => {
        response.should.have.status(200);
        response.body.should.have.property('message');
        done();
      });
  });
});
