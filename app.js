#!/usr/bin/env node

const port = 8080

const ip = require('ip')
const fs = require('fs')
const path = require('path')
const express = require('express')
//const bodyParser = require('body-parser')
//
const myIP = ip.address()

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

let subDir = ''

let completeDisplayedPath = ''

const updateDisplayedFile = () => {
  completeDisplayedPath = `/${imgPath}${subDir}${displayedFile}`
}

//const getFrontendImagePath = () => `/${imgPath}${displayedFile}`
const getFrontendImagePath = () => completeDisplayedPath
const getServerImageDir = () => path.join('public', imgPath)

const getSelectedImageDir = () => path.join(getServerImageDir(), subDir)

const app = express()

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

/* potentiell loggen (wird bei jedem request durchgeführt) */
app.all('*', (req, _, next) => {
  //console.log('connect!')
  //console.log(req.method)
  if (req.method === 'POST') {
    //console.log(req.body)
  }
  next()
})

function sendHTML(res, path) {
  res.set('Content-Type', 'text/html')
  const html = fs.readFileSync(path)
  res.send(html)
}

app.get('/server', (_, res) => {
  sendHTML(res, 'server.html')
})

app.get('/client', (_, res) => {
  sendHTML(res, 'client.html')
})

app.get('/current', (_, res) => {
  const response = {
    img:
      showType === displayTypes.images ? getFrontendImagePath() : externalImage,
    iframe: displayedIframe,
    show: showType,
  }
  res.send(response)
})

app.post('/update', (req, res) => {
  displayedFile = req.body.img
  updateDisplayedFile()
  ;(showType = displayTypes.images), res.send('update successful')
})

app.post('/updateExt', (req, res) => {
  externalImage = req.body.img
  ;(showType = displayTypes.externalImages), res.send('update successful')
})

app.post('/updateIframe', (req, res) => {
  displayedIframe = req.body.iframe
  showType = displayTypes.iframe
  res.send('update successful')
})

/* change to selected folder */
app.post('/selectDir', (req, res) => {
  const dir = req.body.dir
  subDir = dir === '' ? dir : path.normalize(path.join(subDir, dir))
  res.send('update successful')
})

/* list of folders in current folder */
app.get('/dirs', (_, res) => {
  //const dirContents = fs.readdirSync(getServerImageDir())
  const dirContents = fs.readdirSync(getSelectedImageDir())
  const folders = dirContents.filter((file) => {
    //const stat = fs.lstatSync(path.join(getSelectedImageDir(), file))
    const stat = fs.statSync(path.join(getSelectedImageDir(), file))
    return stat.isDirectory()
  })
  res.send(subDir === '' ? folders : ['..', ...folders])
})

/* list of images in current folder */
app.get('/images', (_, res) => {
  //const dirContents = fs.readdirSync(getServerImageDir())
  const dirContents = fs.readdirSync(getSelectedImageDir())
  const files = dirContents.filter((file) => {
    if (file.startsWith('.')) {
      return false
    }
    const stat = fs.lstatSync(path.join(getSelectedImageDir(), file))
    return !stat.isDirectory()
  })
  files.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
  res.send(files)
})

app.listen(port)

console.log(
  `listening on port ${port}. http://localhost:${port}/server http://${myIP}:${port}/client`
)
