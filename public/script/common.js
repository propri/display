/* ============== CONSTS ==== */
const currentImgUrl = '/current'
const updateImageUrl = '/update'
const imagesUrl = '/images'

const urlAttribute = 'data-url'
/* ======================== */

let lastImg = ''

async function getCurrent() {
  const response = await fetch(currentImgUrl)
  const result = await response.json()
  return result.img
}

async function updateImage() {
  const newImg = await getCurrent()
  if (lastImg === newImg) {
    return
  }
  lastImg = newImg
  document.querySelector('#img').src = lastImg
}

const iv = setInterval(updateImage, 1000)

