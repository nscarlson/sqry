const { createCanvas, Image } = require('canvas')
const canvas = createCanvas(1000, 1000)
const ctx = canvas.getContext('2d')

const jsqr = require('jsqr')

const img = new Image()

img.onload = () => ctx.drawImage(img, 0, 0)
img.onerror = (err) => {
    throw err
}
img.src = '/Users/nathan/Desktop/qr.png'

const imageData = ctx.getImageData(0, 0, 1000, 1000).data

const code = jsqr(imageData, 1000, 1000).data
console.log('code:', code)
