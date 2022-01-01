#!/usr/bin/env node

const fs = require('fs')
const express = require('express')

const app = express()

var displayedFile = 'none.png'
const imgPath = '/public/img/'

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

app.get('/server', (req, res) => {
  const serverSite = fs.readFileSync('server.html')
  res.write(serverSite)
})

app.use(express.static('public'))

app.all('*', (req, res, next) => {
  console.log('connect!')
  next()
})

app.listen(11223)

