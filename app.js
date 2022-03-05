#!/usr/bin/env node

const port = 8080

const fs = require('fs')
const path = require('path')
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

let subDir = ''

//const getFrontendImagePath = () => `/${imgPath}${displayedFile}`
const getFrontendImagePath = () => `/${imgPath}${subDir}${displayedFile}`
const getServerImageDir = () => path.join('public', imgPath)

const getSelectedImageDir = () => path.join(getServerImageDir(), subDir)

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

app.post('/selectDir', (req, res) => {
  const dir = req.body.dir
  subDir = dir === "" ? dir : path.join(subDir, dir)
  res.send('update successful')
})

app.get('/dirs', (req, res) => {
  //const dirContents = fs.readdirSync(getServerImageDir())
  const dirContents = fs.readdirSync(getSelectedImageDir())
  const folders = dirContents.filter((file) => {
    const stat = fs.lstatSync(path.join(getSelectedImageDir(), file))
    return stat.isDirectory()
  })
  res.send(folders)
})

app.get('/images', (req, res) => {
  //const dirContents = fs.readdirSync(getServerImageDir())
  const dirContents = fs.readdirSync(getSelectedImageDir())
  const files = dirContents.filter((file) => {
    if (file.startsWith('.')) {
      return false
    }
    const stat = fs.lstatSync(path.join(getSelectedImageDir(), file))
    return !stat.isDirectory()
  })
  res.send(files)
})

app.listen(port)

