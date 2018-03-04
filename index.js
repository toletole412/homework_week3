const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
  .use(cors())
  .use(bodyParser.json())

const port = process.env.PORT || 4001

var Sequelize = require('sequelize')
var sequelize = new Sequelize('postgres://postgres:secret@localhost:5432/postgres')

const Event = sequelize.define('events', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  startDate: {
    type: Sequelize.DATE,
    allowNull: false
  },
  endDate: {
    type: Sequelize.DATE,
    allowNull: false
  },
  description: Sequelize.STRING
}, {
  tableName: 'events',
  timestamps: false
})


app.listen(port, () => {
  console.log(`
  Server is listening on ${port}.

  Open http://localhost:${port}.

  to see the app in your browser.
    `)
  })

const now = new Date();
const todayAtMoment = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes())
const Op = Sequelize.Op


app.get('/events', (req, res) => {
  const events = req.body
  const eventEndDate = new Date(req.body.endDate)

  console.log(todayAtMoment)

  Event
    .findAll({
      attributes: ['title', 'startDate', 'endDate'],
      where: {
      endDate: {
        [Op.gt]: todayAtMoment.getTime()
      }
    }
    })
    .then((events) => {
      res.json(events)
    })
    .catch((err) => {
      console.error(err)
      res.status(500)
      res.json({ message: 'Oops! There was an error getting the events. Please try again' })
    })
})


app.get('/events/:id', (req, res) => {
  const event= Event
    .findById(req.params.id)
    .then((eventDetail) => {
      if (eventDetail) {
        res.json(eventDetail)
      } else {
        res.status(404)
        res.json({ message: 'Event is not found!' })
      }
    })
    .catch((err) => {
      console.error(err)
      res.status(500)
      res.json({ message: 'Oops! There was an error getting the event. Please try again' })
    })
})


app.post('/events', (req, res) => {
  const newEvent = req.body
  const newEventStartDate = new Date(req.body.startDate)
  const newEventEndDate = new Date(req.body.endDate)


  if (todayAtMoment.getTime() > newEventStartDate.getTime() ||
      newEventStartDate.getTime() > newEventEndDate.getTime()) {
    console.log("Oops! Check your date again, Start date should be after today and end date should be after start date")
  } else {
    Event.create(newEvent)
      .then(entity => {
        res.status(201)
        res.json(entity)
      })
      .catch(err => {
        res.status(422)
        res.json({ message: err.message })
      })
    }
  })


app.put('/events/:id', (req, res) => {
  const eventId = Number(req.params.id)
  const updates = req.body

  Event.findById(req.params.id)
    .then(entity => {
      return entity.update(updates)
    })
    .then(final => {
      res.send(final)
    })
    .catch(error => {
      res.status(500).send({
        message: `Something went wrong`,
        error
      })
    })
})


app.delete('/events/:id', (req, res) => {
  const eventId = Number(req.params.id)

  Event.findById(req.params.id)
  .then(entity => {
    return entity.destroy()
  })
  .then(_ => {
    res.send({
      message: 'The event was deleted succesfully'
    })
  })
  .catch(error => {
    res.status(500).send({
      message: `Something went wrong`,
      error
    })
  })
})
