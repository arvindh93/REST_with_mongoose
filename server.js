const express = require("express")
const logger = require("morgan")
const bodyParser = require("body-parser")
const routes = require("./routes/account.js")
const mongoose = require("mongoose")

const app = express()
const port = 3000

app.use(bodyParser.json())
mongoose.connect("mongodb://localhost:27017/test", {useNewUrlParser: true})

app.get('/accounts', (req, res) => {
  routes.getAccounts((err, accounts) => {
    if (err) {
      res.status(500).send(err.message)
    } else {
      res.status(200).send(accounts)
    }
  })
})

app.get('/accounts/:id', (req, res) => {
  routes.getAccount(req.params.id, (err, account) => {
    if (err) {
      res.status(500).send(err.message)
    } else {
      res.status(200).send(account)
    }
  })
})

app.post('/accounts', (req, res) => {
  routes.addAccount(req.body, (err, account) => {
    if (err) {
      let errorBody = {
        "error" : err.message
      }
      res.status(500).send(errorBody)
    } else {
      res.status(201).send(account)
    }
  })
})

app.delete('/accounts/:id', (req, res) => {
  routes.deleteAccount(req.params.id, (err) => {
    if (err) {
      let errorBody = {
        "error" : err.message
      }
      res.status(500).send(errorBody)
    } else {
      res.sendStatus(200)
    }
  })
})

app.listen(port)
module.exports = app
