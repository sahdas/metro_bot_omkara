/* eslint-disable no-undef */
const { Schema } = mongoose = require('mongoose')

const ticketSchema = new Schema({
  ticketId: Number,
  ticketQR: String,
  ticketStatus: String
}, { timestamps: true })

const paymentSchema = new Schema({
  transactionId: { type: String, unique: true },
  transactionAmount: Number,
  ticketType: String,
  numberOfTickets: Number,
  sourceStation: String,
  destinationStation: String,
  tickets: [ticketSchema]
}, { timestamps: true },
{ collection: 'payments' })

module.exports = mongoose.model('Payment', paymentSchema)
