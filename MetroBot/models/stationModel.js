/* eslint-disable no-undef */
const { Schema } = mongoose = require('mongoose')

const fareListSchema = new Schema({
  stationName: String,
  stationCode: String,
  fare: String
}, { timestamps: true })

const stationSchema = new Schema({
  stationCode: { type: String, unique: true },
  sourceStation: String,
  fareList: [fareListSchema]
},
{ collection: 'stations' })

module.exports = mongoose.model('Station', stationSchema)
