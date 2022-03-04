#!/usr/bin/env node

const port = 8080

const fs = require('fs')
const express = require('express')
//const bodyParser = require('body-parser')

const displayTypes = {
  images: 'images',
  externalImages: 'externalImages',
  iframe: 'iframe',
}

let displayedFile = 'none.png'
let externalImage = ''
let displayedIframe = ''
let showType = displayTypes.images

const imgPath = 'img/'

const getFrontendImagePath = () => `/${imgPath}${displayedFile}`
const getServerImageDir = () => `public/${imgPath}`

//function sseDemo(req, res) {
  //let messageId = 0

  //sendData = (data) => {
    //res.write(`id: ${messageId}\n`)
    //res.write(`data: ${JSON.stringify(data)}\n\n`)
    //messageId += 1
  //}

  //req.on('close', () => {
    //// nothing to do?
  //})
//}

const app = express()

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

/* potentiell loggen (wird bei jedem request durchgeführt) */
app.all('*', (req, res, next) => {
  //console.log('connect!')
  //console.log(req.method)
  if (req.method === 'POST') {
    //console.log(req.body)
  }
  next()
})

//app.get('/event-stream', (req, res) => {
  //// sse setup
  //res.writeHead(200, {
    //'Content-Type': 'text/event-stream',
    //'Cache-Control': 'no-cache',
    //'Connection': 'keep-alive',
  //})
  //res.write('\n')

  //sseDemo(req, res)
//})

function sendHTML(res, path) {
  res.set('Content-Type', 'text/html')
  const html = fs.readFileSync(path)
  res.send(html)
}

app.get('/server', (req, res) => {
  sendHTML(res, 'server.html')
})

app.get('/client', (req, res) => {
  sendHTML(res, 'client.html')
})

app.get('/current', (req, res) => {
  const response = {
    img: showType === displayTypes.images ? getFrontendImagePath() : externalImage,
    iframe: displayedIframe,
    show: showType,
  }
  res.send(response) 
})

app.post('/update', (req, res) => {
  displayedFile = req.body.img
  showType = displayTypes.images,
  res.send('update successful')
})

app.post('/updateExt', (req, res) => {
  externalImage = req.body.img
  showType = displayTypes.externalImages,
  res.send('update successful')
})

app.post('/updateIframe', (req, res) => {
  displayedIframe = req.body.iframe
  showType = displayTypes.iframe
  res.send('update successful')
})

app.get('/images', (req, res) => {
  const files = fs.readdirSync(getServerImageDir())
  res.send(files)
})

app.listen(port)

