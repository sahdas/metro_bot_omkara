const express = require('express')
const router = express.Router()
const Session = require('../models/sessionModel')

// Create a new session
router.post('/', async (req, res) => {
  // Update any old session which is associated to the phone number to inactive
  // and create a new session against the phone number
  const session = new Session({
    sessionId: req.body.sessionId,
    botId: req.body.botId,
    phoneNumber: req.body.phoneNumber,
    conversation: req.body.conversation,
    paymentStatus: false, // By default payment is false
    isActive: true // By default active session

  })

  try {
    // make all the other sessions of the mobile number inactive
    await Session.updateMany(
      { phoneNumber: req.body.phoneNumber },
      { $set: { isActive: false } }
    )
    const dataToSave = await session.save()
    res.status(200).json(dataToSave)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Get all sessions
router.get('/', async (req, res) => {
  try {
    const data = await Session.find()
    res.json(data)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get by ID Method
router.get('/:sessionId', async (req, res) => {
  // Get by the session id provided in the request
  try {
    const data = await Session.findOne({ sessionId: req.params.sessionId })
    res.json(data)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Update by ID Method
router.patch('/:id', async (req, res) => {
  // This method will update all the fields as sent in the body and push if a n
  try {
    const id = req.params.id
    const { conversation, paymentStatus, isActive, language } = req.body

    const query = { sessionId: id }
    const update = {
      $set: { paymentStatus, isActive, language },
      $push: { conversation }
    }
    const options = { new: true }

    Session.findOneAndUpdate(query, update, options, function (err, data) {
      if (err) {
        return res.status(500).send(err)
      }
      if (!data) {
        return res.status(404).end()
      }
      return res.status(200).send(data)
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Delete by ID Method
router.delete('/delete/:id', (req, res) => {
  res.send('Delete by ID API')
})

module.exports = router
