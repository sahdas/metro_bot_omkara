/* eslint-disable no-undef */
const { Schema } = mongoose = require('mongoose')

const conversationSchema = new Schema({
  msgType: Number,
  messageText: String
}, { timestamps: true })

const sessionSchema = new Schema({
  sessionId: { type: String, unique: true },
  botId: Number,
  phoneNumber: Number,
  conversation: [conversationSchema],
  paymentStatus: Boolean,
  isActive: Boolean,
  language: String
}, { timestamps: true },
{ collection: 'sessions' })

module.exports = mongoose.model('Session', sessionSchema)
