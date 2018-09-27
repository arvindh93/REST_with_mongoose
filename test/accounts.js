let mongodb = require("mongodb")
let chai = require("chai")
let chaiHttp = require("chai-http")
let server = require("../server.js")

let should = chai.should()
let mongoClient = mongodb.MongoClient
let dbUrl = "mongodb://localhost:27017/test"

chai.use(chaiHttp)

describe('accounts', () => {

  beforeEach((done) => {
    insertInitialAccounts(done)
  })

  describe('/GET accounts', () => {
    it('it should get all the accounts', (done) => {
      chai.request(server)
        .get('/accounts')
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('array')
          res.body.length.should.be.eql(3)
          done()
        })
    })
  })

  describe('/GET account', () => {
    it('it should get the account by passing id', (done) => {
      chai.request(server)
        .get('/accounts')
        .end((err, res) => {
          if (err) {
            process.exit(1)
          }
          let expectedAccount = res.body[1]
          chai.request(server)
            .get('/accounts/' + expectedAccount._id)
            .end((err, res) => {
              if (err) {
                process.exit(1)
              }
              res.should.have.status(200)
              res.body.should.be.a('object')
              res.body.should.have.property('_id').eql(expectedAccount._id)
              res.body.should.have.property('name').eql(expectedAccount.name)
              res.body.should.have.property('balance').eql(expectedAccount.balance)
            })
            done()
        })
    })})

    describe('/POST account', () => {
      it('it should add an account document and return document object', (done) => {
        let newAccount = {
          "name": "test account",
          "balance": 23000
        }

        chai.request(server)
          .post('/accounts')
          .send(newAccount)
          .end((err, res) => {
            if (err) {
              process.exit(1)
            } else {
              res.should.have.status(201)
              res.body.should.be.a('object')
              res.body.should.have.property('name').eql("test account")
              res.body.should.have.property('balance').eql(23000)
            }
            done()
          })
      })
    })

  describe('/DELETE account', () => {
    it('it should delete passing account document', (done) => {
      chai.request(server)
        .get('/accounts')
        .end((err, res) => {
          if (err) {
            process.exit(1)
          }
          let expectedAccount = res.body[1]

          chai.request(server)
            .delete('/accounts/' + expectedAccount._id)
            .end((err, res) => {
              if (err) {
                process.exit(1)
              }

              chai.request(server)
                .get('/accounts')
                .end((err, res) => {
                  res.should.have.status(200)
                  res.body.length.should.be.eql(2)
                  done()
                })
            })
      })
    })
  })

  afterEach((done) => {
    removeInitiallyCreatedAccounts(done)
  })
})

let insertInitialAccounts = function(callback) {
  mongoClient.connect(dbUrl, {useNewUrlParser: true}, (err, conn) => {
    if (err) {
      console.log("Error in connecting DB....")
      process.exit()
    }

    let db = conn.db('test')
    let dataToInsert = [
      {
        "name": "Account 1",
        "balance": 1000
      },
      {
        "name": "Account 2",
        "balance": 2000
      },
      {
        "name": "Account 3",
        "balance": 3000
      }
    ]
    db.collection('accounts').insertMany(dataToInsert, (err, result) => {
      if (err) {
        console.err("Error in inserting inital accounts...")
        process.exit(1)
      }

      console.log("Successfully inserted accounts")
      callback()
    })
  })
}

let removeInitiallyCreatedAccounts = function (callback) {
  mongoClient.connect(dbUrl, {useNewUrlParser: true}, (err, conn) => {
    if (err) {
      console.log("Error in connecting DB....")
      process.exit()
    }
    let db = conn.db('test')
    db.dropCollection('accounts', (err, result) => {
      if (err) {
        console.log("Error in deleting initial accounts....")
        process.exit()
      }
    })

      callback()
    })
}
