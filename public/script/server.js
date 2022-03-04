import { CONSTS } from './common.js'

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

  document.querySelector('#previewImg').src = `/img/${img}`
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

  images.forEach(img => {
    const li = document.createElement('li')
    li.addEventListener('click', setImageListener)
    li.addEventListener('mouseover', showPreviewImg)
    li.textContent = img
    li.setAttribute(CONSTS.urlAttribute, img)
    list.appendChild(li)
  })
}


function setup() {
  document.querySelector('#updateList').addEventListener('click', updateList)
  document.querySelector('#updateIframe').addEventListener('click', updateIframe)
  document.querySelector('#updateExtImg').addEventListener('click', updateExtImg)

  updateList()
}

setup()
