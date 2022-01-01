#!/usr/bin/env node

const fs = require('fs')
const express = require('express')
//const bodyParser = require('body-parser')

var displayedFile = 'none.png'
const imgPath = 'img/'

const getFrontendImagePath = () => `/${imgPath}${displayedFile}`
const getServerImageDir = () => `public/${imgPath}`

function sseDemo(req, res) {
  let messageId = 0

  sendData = (data) => {
    res.write(`id: ${messageId}\n`)
    res.write(`data: ${JSON.stringify(data)}\n\n`)
    messageId += 1
  }

  req.on('close', () => {
    // nothing to do?
  })
}

const app = express()

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get('/event-stream', (req, res) => {
  // sse setup
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  })
  res.write('\n')

  sseDemo(req, res)
})

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
    img: getFrontendImagePath(),
  }
  res.send(response) 
})

app.post('/update', (req, res) => {
  displayedFile = req.body.img
})

app.get('/images', (req, res) => {
  const files = fs.readdirSync(getServerImageDir())
  res.send(files)
})

//app.all('*', (req, res, next) => {
  //console.log('connect!')
  //next()
//})

app.listen(11223)

