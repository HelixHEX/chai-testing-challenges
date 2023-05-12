require("dotenv").config();
const app = require("../server.js");
const mongoose = require("mongoose");
const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;

const User = require("../models/user.js");
const Message = require("../models/message.js");

chai.config.includeStack = true;

const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

/**
 * root level hooks
 */
after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {};
  mongoose.modelSchemas = {};
  mongoose.connection.close();
  done();
});

describe("Message API endpoints", () => {
  const userId = mongoose.Types.ObjectId();
  const messageId = mongoose.Types.ObjectId();
  const testUser = {
    username: "test",
    password: "test",
    _id: userId,
  };

  const testMessage = {
    title: "test",
    body: "test message",
    author: testUser._id,
    _id: messageId,
  };
  beforeEach((done) => {
    // TODO: add any beforeEach code here
    const user = new User({
      username: testUser.username,
      password: testUser.password,
      _id: testUser._id,
    });
    user.save().then(() => {
      const message = new Message({
        title: testMessage.title,
        body: testMessage.body,
        author: testMessage.author,
        _id: testMessage._id,
      });
      message.save();
    });
    done();
  });

  afterEach((done) => {
    // TODO: add any afterEach code here
    Message.deleteMany({ title: [testMessage.title] }).then(() => {
      User.deleteMany({ username: [testUser.username] });
    });
    done();
  });

  it("should load all messages", (done) => {
    // TODO: Complete this
    chai
      .request(app)
      .get("/messages")
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        expect(res.body[0]).to.have.property("title");
        expect(res.body[0]).to.have.property("body");
        expect(res.body[0]).to.have.property("author");
        expect(res.body[0]).to.have.property("_id");
        done();
      });
    done();
  });

  it("should get one specific message", (done) => {
    // TODO: Complete this
    chai
      .request(app)
      .get(`/messages/${testMessage._id}`)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("title");
        expect(res.body).to.have.property("body");
        expect(res.body).to.have.property("author");
        expect(res.body).to.have.property("_id");
      });
    done();
  });

  it("should post a new message", (done) => {
    // TODO: Complete this
    chai
      .request(app)
      .post("/messages")
      .send(testMessage)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("title");
        expect(res.body).to.have.property("body");
        expect(res.body).to.have.property("author");
        expect(res.body).to.have.property("_id");
      });
    done();
  });

  it("should update a message", (done) => {
    // TODO: Complete this
    chai
      .request(app)
      .put(`/messages/${testMessage._id}`)
      .send({ title: "updated title" })
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("title");
        expect(res.body).to.have.property("body");
        expect(res.body).to.have.property("author");
        expect(res.body).to.have.property("_id");
      });
    done();
  });

  it("should delete a message", (done) => {
    // TODO: Complete this
    chai
      .request(app)
      .delete(`/messages/${testMessage._id}`)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body.message).to.equal("Successfully deleted.");
      });
    done();
  });
});
