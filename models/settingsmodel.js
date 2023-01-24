const mongoose = require('mongoose')
const Schema = mongoose.Schema

const settingsSchema = new Schema({
  skupnavrednost: Number,
  predlagatimozno: String,
  glasovatimozno: String,
  lat: Number,
  lng: Number,
  stglasov: Number
}, { collection: "settings" })

let settingsModel = mongoose.model("settingsModel", settingsSchema)
module.exports = settingsModel