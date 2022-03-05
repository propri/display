import { CONSTS } from './common.js'

let currentDir = ''

async function updateDisplayedImage(img) {
  const options = {
    method: 'POST',
    body: JSON.stringify({img}),
    headers: {
      'Content-Type': 'application/json',
    },
  }

  await fetch(CONSTS.updateImageUrl, options)
}

async function updateExtImg() {
  const extImg = document.querySelector('#extImgInput')?.value || ''
  const options = {
    method: 'POST',
    body: JSON.stringify({ img: extImg }),
    headers: {
      'Content-Type': 'application/json',
    },
  }

  await fetch(CONSTS.updateExtImageUrl, options)
}


async function updateIframe() {
  const iframe = document.querySelector('#iframeInput')?.value || ''
  const options = {
    method: 'POST',
    body: JSON.stringify({ iframe }),
    headers: {
      'Content-Type': 'application/json',
    },
  }

  await fetch(CONSTS.updateIframeUrl, options)
}


async function updateImageList() {
  const response = await fetch(CONSTS.imagesUrl)
  const images = await response.json()
  return images
}

function setImageListener() {
  const img = this.getAttribute(CONSTS.urlAttribute)
  updateDisplayedImage(img)
}

function showPreviewImg() {
  const img = this.getAttribute(CONSTS.urlAttribute)

  document.querySelector('#previewImg').src = `/img/${currentDir}${img}`
}

async function updateList() {
  const images = await updateImageList()

  const list = document.querySelector('#images')
  for (let i = list.children.length - 1; i >= 0; i--) {
    let child = list.children[i]
    child.removeEventListener('click', setImageListener)
    child.removeEventListener('mouseover', showPreviewImg)
    list.removeChild(child)
  }

  images.forEach((img) => {
    const li = document.createElement('li')
    li.addEventListener('click', setImageListener)
    li.addEventListener('mouseover', showPreviewImg)
    li.textContent = img
    li.setAttribute(CONSTS.urlAttribute, img)
    list.appendChild(li)
  })
}

async function setDirListener() {
  const dir = this.getAttribute(CONSTS.dirAttribute)
  const options = {
    method: 'POST',
    body: JSON.stringify({dir}),
    headers: {
      'Content-Type': 'application/json',
    },
  }
  await fetch(CONSTS.selectDir, options)

  currentDir = dir === '' ? dir : currentDir + dir

  updateDirs()
}

async function updateDirList() {
  const response = await fetch(CONSTS.dirsUrl)
  const dirs = await response.json()
  return dirs
}

async function updateDirs() {
  const dirs = await updateDirList()

  const list = document.querySelector('#dirs')
  for (let i = list.children.length - 1; i >= 0; i--) {
    let child = list.children[i]
    child.removeEventListener('click', setDirListener)
    list.removeChild(child)
  }

  const li = document.createElement('li')
  li.addEventListener('click', setDirListener)
  li.textContent = '[top]'
  li.setAttribute(CONSTS.dirAttribute, '')
  list.appendChild(li)


  dirs.forEach((dir) => {
    const li = document.createElement('li')
    li.addEventListener('click', setDirListener)
    li.textContent = dir
    li.setAttribute(CONSTS.dirAttribute, `${dir}/`)
    list.appendChild(li)
  })

  updateList()
}

function setup() {
  document.querySelector('#updateList').addEventListener('click', updateList)
  document.querySelector('#updateIframe').addEventListener('click', updateIframe)
  document.querySelector('#updateExtImg').addEventListener('click', updateExtImg)

  updateDirs()
  updateList()
}

setup()
