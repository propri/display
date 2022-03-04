/* ============== CONSTS ==== */
export const CONSTS = {
  currentImgUrl : '/current',
  updateImageUrl : '/update',
  updateExtImageUrl : '/updateExt',
  updateIframeUrl : '/updateIframe',
  imagesUrl : '/images',
  urlAttribute : 'data-url',
}
/* ======================== */

let lastImg = ''
let lastIframe = ''

async function getCurrent() {
  const response = await fetch(CONSTS.currentImgUrl)
  const result = await response.json()
  return result
}

async function updateDisplay() {
  const updateData = await getCurrent()
  switch (updateData.show) {
    case 'images':
    case 'externalImages':
      showImg(updateData.img)
      break
    case 'iframe':
      showIframe(updateData.iframe)
      break
  }
}

async function showImg(newImg) {
  await showVariant('image')
  if (lastImg === newImg) {
    return
  }
  lastImg = newImg
  document.querySelector('#img').src = lastImg
}

async function showIframe(newIframe) {
  await showVariant('iframe')
  if (lastIframe === newIframe) {
    return
  }
  lastIframe = newIframe
  document.querySelector('#iframe').src = lastIframe
}

async function showVariant(variant) {
  const imageContainer = document.querySelector('#imageContainer')
  const iframeContainer = document.querySelector('#iframeContainer')
  if (variant === 'iframe') {
    imageContainer.setAttribute('style', 'display: none;')
    iframeContainer.setAttribute('style', 'display: block;')
  } else {
    imageContainer.setAttribute('style', 'display: block;')
    iframeContainer.setAttribute('style', 'display: none;')
  }
}

let iv = setInterval(updateDisplay, 1000)

window.addEventListener('unload', () => {
  clearInterval(iv)
})

