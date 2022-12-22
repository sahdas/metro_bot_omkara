const express = require('express')
const router = express.Router()
const Payment = require('../models/paymentModel')

// Create a new Payment
router.post('/', async (req, res) => {
  const payment = new Payment({
    transactionId: req.body.transactionId,
    transactionAmount: req.body.transactionAmount,
    ticketType: req.body.ticketType,
    numberOfTickets: req.body.numberOfTickets,
    sourceStation: req.body.sourceStation,
    destinationStation: req.body.destinationStation,
    tickets: req.body.tickets
  })

  try {
    const dataToSave = await payment.save()
    res.status(200).json(dataToSave)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Get all payment
router.get('/', async (req, res) => {
  try {
    const data = await Payment.find()
    res.json(data)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get by ID Method
router.get('/:paymentId', async (req, res) => {
  // Get by the session id provided in the request
  try {
    const data = await Payment.findOne({ paymentId: req.params.paymentId })
    res.json(data)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
