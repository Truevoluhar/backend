var mongoose = require('mongoose')
var Schema = mongoose.Schema

let pingerSchema = new Schema({
  pingername: String,
  pinger: Number
}, {collection: "pinger"})

let pingerModel = mongoose.model("pingerModel", pingerSchema)
module.exports = pingerModel