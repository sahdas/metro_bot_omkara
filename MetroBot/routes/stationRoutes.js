const express = require('express')
const router = express.Router()
const Station = require('../models/stationModel')

// Get fare details based on the source and destination stations
router.get('/fare', async (req, res) => {
  const { sourceStationCode, destinationStationCode } = req.query

  // Get provided in the request
  try {
    const data = await Station.findOne({
      $and: [
        { stationCode: sourceStationCode },
        { fareList: { $elemMatch: { stationCode: destinationStationCode } } }
      ]
    })
    if (data) {
      // Search the fare from the list
      const foundValue = data.fareList.filter(obj => obj.stationCode === destinationStationCode)
      const result = {}
      result.sourceStationCode = sourceStationCode
      result.sourceStationName = data.sourceStation
      result.destinationStationCode = destinationStationCode
      result.destinationStationName = foundValue[0].stationName
      result.fare = foundValue[0].fare + ' INR'
      res.json(result)
    } else {
      res.status(400).json({ message: 'Station not found' })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get all stations
router.get('/', async (req, res) => {
  try {
    const data = await Station.find({})
    res.json(data)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
