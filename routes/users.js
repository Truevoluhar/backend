var express = require('express');
var router = express.Router();
var userModel = require('../models/usermodel')
var sessionModel = require('../models/sessionmodel')
var projectModel = require('../models/projectmodel')
var settingsModel = require('../models/settingsmodel')
var newsModel = require('../models/newsmodel')
var pingerModel = require('../models/pingermodel')
var bcrypt = require('bcrypt')


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', async (req, res) => {
  let data = req.body.data
  let findUser = await userModel.find({ username: data.username })
  if (findUser.length > 0) {
    res.json('Uporabnik s tem uporabniškim imenom že obstaja.')
  } else {
    if (data.password === data.checkpassword) {
      const hashPassword = await bcrypt.hash(data.password, 12)
      let newUser = new userModel({
        username: data.username,
        password: hashPassword,
        status: data.status,
        glasovi: 3
      })
      newUser.save((err, data) => {
        if (err) throw err
        console.log(data)
      })
      res.json('Uporabnik registriran.')
    } else {
      res.json('Vneseni gesli se ne ujemata.')
    }
  }
})


router.post('/login', async function(req, res) {
  let data = req.body.data
  console.log(data)
  let user = await userModel.find({ username: data.username })
  if (user.length > 0) {
    if (data.password === user[0].password) {
      let newSession = new sessionModel({
        loggedUser: data.username,
        createdAt: new Date()
      })
      newSession.save((err, data) => {
        if (err) throw err
        console.log(data)
      })
      res.json('Uporabnik uspešno prijavljen.')
    } else {
      res.json('Geslo ni pravilno.')
    }
  } else {
    res.json('Uporabniško ime ni pravilno.')
  }
})

router.get('/isauth', async (req, res) => {
  let session = await sessionModel.find({})
  console.log(session)
  if (session) {
    res.json(session)
  } else {
    res.json('NO')
  }
})

router.post('/getuser', async (req, res) => {
  let data = req.body.userObj
  let user = await userModel.find({ username: data.username })
  if (user.length > 0) {
    res.json(user)
  } else {
    res.json('User not found')
  }
})


router.post('/predlagajprojekt', (req, res) => {
  let data = req.body.data
  let newProject = new projectModel({
    naslovprojekta: data.naslovprojekta,
    opisprojekta: data.opisprojekta,
    ocenjenavrednostprojekta: Number(data.ocenjenavrednostprojekta),
    lokacijaprojekta: data.lokacijaprojekta,
    latprojekta: data.latprojekta,
    lngprojekta: data.lngprojekta,
    opisizvajanjaprojekta: data.opisizvajanjaprojekta,
    vplivprojekta: data.vplivprojekta,
    nalozifotografijo: data.photonameholder,
    glasovi: 0
  })
  newProject.save((err, data) => {
    if (err) {
      res.json(err)
    } else {
      console.log(data)
      res.json('Projekt shranjen')
    }
  })
})

router.post('/uploadimage', async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: 'No file uploaded'
      })
    } else {
      // Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
      let avatar = req.files.avatar
      // Use the mv() method to place the file in the upload directory (i.e. "uploads")
      avatar.mv('./images/' + avatar.name)

      //send response
      res.send({
        status: true,
        message: 'File is uploaded',
        data: {
          name: avatar.name,
          mimetype: avatar.mimetype,
          size: avatar.size
        }
      })
    }
  } catch (err) {
    res.status(500).send(err)
  }
})

router.get('/pridobiprojekte', async (req, res) => {
  let getAllProjects = await projectModel.find({})
  if (getAllProjects.length > 0) {
    res.json(getAllProjects)
  } else {
    res.json()
  }
})

router.post('/glasuj', async (req, res) => {
  let data = req.body.data
  let query = { naslovprojekta: data.naslovprojekta }
  let update = { $inc: { glasovi: +1 } }
  await projectModel.updateOne(query, update)
  let updatedProject = await projectModel.find(query)
  res.json(updatedProject)
})

router.post('/odstejglas', async (req, res) => {
  let data = req.body.userObj
  let user = data.username
  let query = { username: user }
  let update = { $inc: { glasovi: -1 } }
  await userModel.updateOne(query, update)
  let updatedUser = await userModel.find(query)
  console.log(updatedUser)
  res.json(updatedUser)
})


router.post('/izpis', async (req, res) => {
  let data = req.body.obj
  let username = data.username
  let findAndDelete = await sessionModel.deleteOne({ loggedUser: username })
  if (findAndDelete.deletedCount === 1) {
    res.json('Uporabnik uspešno izpisan')
  } else {
    res.json('Napaka')
  }
})

router.post('/shraninastavitve', async (req, res) => {
  let data = req.body.data
  let deleteSettings = await settingsModel.deleteOne({})
  let newSettings = new settingsModel({
    skupnavrednost: data.skupnavrednost,
    predlagatimozno: data.predlagatimozno,
    glasovatimozno: data.glasovatimozno,
    lat: data.lat,
    lng: data.lng,
    stglasov: data.stglasov
  })
  newSettings.save((err, data) => {
    if (err) throw err
    console.log(data)
    res.json(data)
  })
})

router.get('/dobinastavitve', async (req, res) => {
  let getSettings = await settingsModel.find({})
  if (getSettings.length > 0) {
    res.json(getSettings)
  } else {
    res.json('Ni nastavitev')
  }
})

router.get('/getnews', async (req, res) => {
  let news = await newsModel.find({})
  if (news.length > 0) {
    res.json(news)
  } else {
    res.json('Ni novic')
  }
})

router.post('/savenews', async (req, res) => {
  let data = req.body.data
  let newNews = new newsModel({
    newstitle: data.newstitle,
    newsintro: data.newsintro,
    newstext: data.newstext,
    newsphoto: data.newsphoto,
    newsdate: new Date()
  })
  newNews.save((err, data) => {
    if (err) throw err
    res.json('OK')
  })
})

router.post('/deletenews', async (req, res) => {
  let data = req.body.deleteObj
  let newstitle = data.newstitle
  let result = await newsModel.deleteOne({ newstitle: newstitle })
  if (result.deletedCount === 1) {
    console.log("OK")
    let newData = await newsModel.find({})
    res.json(newData)
  } else {
    console.log("NO")
    res.json('NO')
  }
})

module.exports = router