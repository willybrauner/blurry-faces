export function preloadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    // create void image tag for each url
    let $img = document.createElement("img")
    // add url to src attr in order to start loading
    $img.src = url
    // count loaded image, If all are loaded, resolve promise
    $img.onload = () => {
      resolve($img)
    }
  })
}
