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

async function showImageList() {
  const images = await updateImageList()

  const list = document.querySelector('#images')
  for (let i = 0; i < list.children.length; i++) {
    let child = list.children[i]
    child.removeEventListener(setImageListener)
    list.removeChild(child)
  }

  console.log(images)

  images.forEach(img => {
    const li = document.createElement('li')
    li.addEventListener('click', setImageListener)
    li.textContent = img
    li.setAttribute(urlAttribute, img)
    list.appendChild(li)
  })
}

showImageList()
