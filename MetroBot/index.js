const http = require('http')
const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const routes = require('./routes/sessionRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
const stationRoutes = require('./routes/stationRoutes')
const app = express()
//const server = http.createServer(app)
// const io = require('socket.io')(server, {
//   cors: {
//     origin: '*'
//   }
// })
// const {
//   getMeetingById,
//   getActiveMeetings,
//   meetingUpdate
// } = require('./service/meetingService.js')

const mongoString = process.env.DATABASE_URL
const port = process.env.PORT || '3000'

mongoose.connect(mongoString)
const database = mongoose.connection

database.on('error', (error) => {
  console.log(error)
})

database.once('connected', () => {
  console.log('Database Connected')
})

app.use(express.json())
app.use(cors())
app.use('/v1/sessions', routes)
app.use('/v1/payments', paymentRoutes)
app.use('/v1/stations', stationRoutes)

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// io.on('connection', (socket) => {
//   console.log('a user connected')

//   socket.on('message', function (data) {
//     console.log('Message from client', data)
//     const meetingId = data.meetingId
//     console.log('Join details', meetingId)
//     meetingDetails = [
//       {
//         meeting_id: meetingId,
//         total_participants: 0
//       }
//     ]
//     getMeetingById(meetingId).then((item) => {
//       if (item != null) {
//         meetingDetails[0].total_participants = item.total_participants
//         io.emit('message', meetingDetails)
//       }
//     })
//   })
// })
app.listen(port, () => {
  console.log(`Server Started at ${port}`)
})
