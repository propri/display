async function updateDisplayedImage(img) {
  const options = {
    method: 'POST',
    body: JSON.stringify({img}),
    headers: {
      'Content-Type': 'application/json',
    },
  }

  await fetch(updateImageUrl, options)
}

async function updateImageList() {
  const response = await fetch(imagesUrl)
  const images = await response.json()
  return images
}

function setImageListener() {
  const img = this.getAttribute(urlAttribute)
  updateDisplayedImage(img)
}

function showPreviewImg() {
  const img = this.getAttribute(urlAttribute)

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
    li.setAttribute(urlAttribute, img)
    list.appendChild(li)
  })
}

updateList()
