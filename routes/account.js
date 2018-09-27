let mongoose = require("mongoose")
let Account = require("../model/account.js")

function getAccounts(callback) {
  Account.find({})
    .exec((err, results) => {
      if (err) {
        console.log("error in finding books....")
        callback(new Error("Error in finding books..."))
      }
      callback(null, results)
    })
}

function getAccount(id, callback) {
  Account.findById(id)
    .exec((err, result) => {
      if (err) {
        callback(new Error("No account found..."))
      } else {
        callback(null, result)
      }
    })
}

function addAccount(dataToInsert, callback) {
  let accountData = new Account(dataToInsert)
  accountData.save((err) => {
    if (err) {
      callback(new Error("Cannot add new account"))
    } else {
      callback(null, accountData)
    }
  })
}

function deleteAccount(id, callback) {
  Account.findById(id)
    .exec((err, account) => {
      if (err) {
        callback(new Error("No account found..."))
      } else {
        account.remove((err, doc) => {
          if (err) {
            callback(err)
          } else {
            callback(null)
          }
        })
      }
    })
}

module.exports = {getAccounts, getAccount, addAccount, deleteAccount}
