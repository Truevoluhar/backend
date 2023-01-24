const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  username: String,
  password: String,
  status: String,
  glasovi: Number
}, { collection: 'registriraniuporabniki' })

let userModel = mongoose.model('userModel', userSchema)

module.exports = userModel;