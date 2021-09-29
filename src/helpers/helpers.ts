import { TBlurZone } from "../components/blurZone/BlurZone"

export const blur = (imgData) => {
  let k = 0
  let px = imgData.data
  while (k <= 100) {
    for (let i = 0, len = px.length; i < len; i++) {
      if (i % 4 === 3) continue
      px[i] =
        (px[i] +
          (px[i - 4] || px[i]) +
          (px[i + 4] || px[i]) +
          (px[i - 4 * imgData.width] || px[i]) +
          (px[i + 4 * imgData.width] || px[i]) +
          (px[i - 4 * imgData.width - 4] || px[i]) +
          (px[i + 4 * imgData.width + 4] || px[i]) +
          (px[i + 4 * imgData.width - 4] || px[i]) +
          (px[i - 4 * imgData.width + 4] || px[i])) /
        9
    }
    k++
  }
}

export const div2Canvas = (
  width: number,
  height: number,
  img: HTMLImageElement,
  blurZone: TBlurZone[]
) => {
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext("2d")
  context.drawImage(img, 0, 0, canvas.width, (canvas.width * img.height) / img.width)

  blurZone.forEach((zone) => {
    const imgData = context.getImageData(
      zone.x * width,
      zone.y * height,
      zone.width * width,
      zone.height * height
    )
    blur(imgData)
    context.putImageData(imgData, zone.x * width, zone.y * height)
  })

  //const link = document.createElement("a")
  //link.download = `${filename}-blurry`
  const imgSource = canvas.toDataURL("image/png", [0.0, 1.0]).split(",")[1]
  //  .replace("image/png", "image/octet-stream")
  // link.href = imgSource
  // link.click()
  return imgSource
}

/**
 * getFilenameFromUrl
 */
export const getFilenameFromUrl = (imageUrl: string) => {
  return imageUrl.substring(imageUrl.lastIndexOf("/") + 1)
}