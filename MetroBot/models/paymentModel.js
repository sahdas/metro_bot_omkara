/* eslint-disable no-undef */
const { Schema } = mongoose = require('mongoose')
var uuid = require('node-uuid')
const uuidv4= require('uuid');


const ticketSchema = new Schema({
  ticketId: String,
  ticketQR: String,
  ticketStatus: String
}, { timestamps: true })

const paymentSchema = new Schema({
  transactionId: { type: String, required: true ,unique: true },
  transactionAmount: Number,
  ticketType: String,
  numberOfTickets: Number,
  sourceStationCode: String,
  destinationStationCode: String,
  phoneNumber: {type :Number , required: true},
  sessionId : { type: String, required: true},
  tickets: [ticketSchema]
}, { timestamps: true },
{ collection: 'payments' })

module.exports = mongoose.model('Payment', paymentSchema)
