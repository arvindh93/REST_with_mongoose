let mongoose = require("mongoose")

let accountSchema = new mongoose.Schema({
  "name": String,
  "balance": Number
})

module.exports = mongoose.model('Account', accountSchema)
