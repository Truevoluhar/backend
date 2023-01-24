const mongoose = require('mongoose')
const Schema = mongoose.Schema

var sessionSchema = new Schema({
  loggedUser: String,
  createdAt: Date
}, { collection: 'sessions' })

sessionSchema.index({ 'createdAt': 1 }, { expireAfterSeconds: 3600 })
var sessionModel = mongoose.model('sessionModel', sessionSchema)

module.exports = sessionModel