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
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (width === 0 || height === 0) return

    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext("2d")
    const $fakeImg = new Image()

    // start preload
    $fakeImg.src = canvas.toDataURL("image/jpg")

    // when is loaded
    $fakeImg.onload = () => {
      context.drawImage(img, 0, 0, canvas.width, (canvas.width * img.height) / img.width)

      // set blur zone on image
      blurZone?.forEach((zone) => {
        const imgData = context.getImageData(
          zone.x * width || 1,
          zone.y * height || 1,
          zone.width * width || 1,
          zone.height * height || 1
        )
        blur(imgData)
        context.putImageData(imgData, zone.x * width, zone.y * height)
      })

      // return
      resolve(canvas.toDataURL("image/jpg", [0.0, 1.0]).split(",")[1])
    }
  })
}
