const mongoose = require('mongoose')
const Schema = mongoose.Schema

var newsSchema = new Schema({
  newstitle: String,
  newsintro: String,
  newstext: String,
  newsphoto: String,
  newsdate: Date
}, { collection: "news" })

var newsModel = mongoose.model("newsModel", newsSchema)
module.exports = newsModel