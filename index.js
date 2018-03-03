const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
  .use(cors())
  .use(bodyParser.json())

const port = process.env.PORT || 4001


var Sequelize = require('sequelize')
var sequelize = new Sequelize('postgres://postgres:secret@localhost:5432/postgres')

app.listen(port, () => {
  console.log(`
  Server is listening on ${port}.

  Open http://localhost:${port}.

  to see the app in your browser.
    `)
  })
