const express = require('express')
const router = express.Router()
const Station = require('../models/stationModel')
const csv = require('csv-parser')
const fs = require('fs')

const parsedCSV = []

fs.createReadStream('MetroFare.csv')
.pipe(csv())
.on('data', (data) => parsedCSV.push(data))
.on('end', () => {
  var temp = Object.assign({}, parsedCSV);
})
// // Get fare details based on the source and destination stations
// router.get('/fare', async (req, res) => {
//   let { sourceStationCode, destinationStationCode } = req.query

//  sourceStationCode = sourceStationCode.toUpperCase()
//  destinationStationCode=  destinationStationCode.toUpperCase()
//   // Get provided in the request
//   try {
//     const data = await Station.findOne({
//       $and: [
//         { stationCode: sourceStationCode },
//         { fareList: { $elemMatch: { stationCode: destinationStationCode } } }
//       ]
//     })
//     if (data) {
//       // Search the fare from the list
//       const foundValue = data.fareList.filter(obj => obj.stationCode === destinationStationCode)
//       const result = {}
//       result.sourceStationCode = sourceStationCode
//       result.sourceStationName = data.sourceStation
//       result.destinationStationCode = destinationStationCode
//       result.destinationStationName = foundValue[0].stationName
//       result.fare = foundValue[0].fare
//       res.json(result)
//     } else {
//       res.status(400).json({ message: 'Station not found' })
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message })
//   }
// })

// Get all stations
router.get('/', async (req, res) => {
  try {
    let response=[]
    for (let i=0; i<parsedCSV.length;i++){
        let station={}
        station.sourceStation =parsedCSV[i]['Station Name'].split("(")[0]
        station.stationCode = parsedCSV[i]['Station Name'].split("(")[1].split(")")[0]
        response.push(station)
    }
    res.json(response)
    // const data = await Station.find({})
    // res.json(data)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get fare details based on the source and destination stations
router.get('/fare', async (req, res) => {
  let { sourceStationCode, destinationStationCode } = req.query

 sourceStationCode = sourceStationCode.toUpperCase()
 destinationStationCode=  destinationStationCode.toUpperCase()
  try {
    let i;
    //loop through the parsed data and find if the source station is found. 
      for (i=0; i < parsedCSV.length;i++){
        if(parsedCSV[i]['Station Name'].includes(`(${sourceStationCode})`)){          
                    let stationsNames = Object.keys(parsedCSV[i])
                    let destinationStation;
                    //find the destination station from the destination station code
                    for (let i=0;i<stationsNames.length; i++){
                        if(stationsNames[i].includes(`(${destinationStationCode})`)){
                        destinationStation= stationsNames[i]
                        break;
                        }
                    }
                    //If destination station found , then build the response
                    if (destinationStation){
                    let response={};
                    response.sourceStationCode = sourceStationCode;
                    response.sourceStationName = parsedCSV[i]['Station Name'].split("(")[0];
                    response.destinationStationCode = destinationStationCode;
                    response.destinationStationName = destinationStation.split("(")[0];
                    response.fare = Number(parsedCSV[i][destinationStation])
                    //var result = Object.assign({}, response);
                    res.send(response)
                    break
                    }
        }
      }
      if(i>= parsedCSV.length)res.send({ message: 'Station not found' })
    
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
