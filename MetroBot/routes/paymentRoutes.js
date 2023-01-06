const express = require('express')
const router = express.Router()
const Payment = require('../models/paymentModel')
const QRCode = require('qrcode')
const PDFDocument = require('pdfkit');
const fs = require('fs');

const ticketFilePath = process.env.TICKET_FILE_PATH 

// Create a new Payment
router.post('/', async (req, res) => {
  const payment = new Payment({
    transactionId: req.body.transactionId,
    sessionId:req.body.sessionId,
    transactionAmount: req.body.transactionAmount,
    ticketType: req.body.ticketType,
    numberOfTickets: req.body.numberOfTickets,
    sourceStationCode: req.body.sourceStationCode,
    destinationStationCode: req.body.destinationStationCode,
    tickets: req.body.tickets,
    phoneNumber: req.body.phoneNumber
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

// Get the payment with paymentId
// for each ticket generate the QR code and save the pdf
// Build the response with the ticket pdf details

// QR code Method
router.get('/QRCode/:paymentId', async (req, res) => {
  // Get by the payment id provided in the request
  try {
    const payment = await Payment.findOne({ paymentId: req.params.paymentId })
    
    const pdfs= await generateQRCodeImage(payment)
  res.send(pdfs)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})


//Generate QR code with pdf
async function generateQRCodeImage(payment){
  const tickets = payment.tickets
  const transactionId = payment.transactionId
  const sourceStationCode =payment.sourceStationCode
  const destinationStationCode= payment. destinationStationCode
  const transactionAmount = payment.transactionAmount
  const transactionTime =payment.createdAt
  let QRcodeInfo ={transactionId, transactionAmount, sourceStationCode,destinationStationCode,transactionTime}
  let pdfFilePath=[]
    for(let i=0; i< tickets.length; i++) {
      let ticketId = tickets[i].ticketId 
      let ticketStatus =tickets[i].ticketStatus
      QRcodeInfo.ticketId =  ticketId
      QRcodeInfo.ticketStatus =ticketStatus
      //Convert the data into String format
      let QRcodeInfoString= JSON.stringify(QRcodeInfo)
      //Generate QR code
      await QRCode.toFile(
        `${ticketFilePath}/${ticketId}.png`, QRcodeInfoString,
        [{
            data: [10, 10, 10],
            mode: 'byte'
        }])
    // //Generate pdf    
    //   await pdfMaker(ticketId)
      pdfFilePath.push(`${ticketFilePath}/${ticketId}.png`)
  };
  return pdfFilePath
}

//Genarate pdf- not used now
async function pdfMaker(ticketId) {
   
  // Create a document
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(`${ticketFilePath}/${ticketId}.pdf`));
  doc
      .fontSize(25)
      .text(`Ticket number: ${ticketId}`, 100, 100)
      .align ? 'center' : 'center'

  // Add an image, constrain it to a given size, and center it vertically and horizontally
  doc.image(`QRimage/${ticketId}.png`, {
      fit: [400, 400],
      align: 'center',
      valign: 'center'
  });
  doc.end();
}

module.exports = router
