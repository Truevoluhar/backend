const mongoose = require('mongoose')
const Schema = mongoose.Schema

var projectSchema = new Schema({
  naslovprojekta: String,
  opisprojekta: String,
  ocenjenavrednostprojekta: Number,
  lokacijaprojekta: String,
  latprojekta: Number,
  lngprojekta: Number,
  opisizvajanjaprojekta: String,
  vplivprojekta: String,
  nalozifotografijo: String,
  glasovi: Number
}, { collection: 'Projekti' })

var projectModel = mongoose.model('projectModel', projectSchema)

module.exports = projectModel