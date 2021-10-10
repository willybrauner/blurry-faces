import HomeViewService from "../components/homeView/HomeViewService"
import GalleryViewService from "../components/galleryView/GalleryViewService"

class Viewer {
  public async goToGallery(): Promise<void> {
    if (HomeViewService.currentPlayState !== "unmount") {
      await HomeViewService.playOut()
      await HomeViewService.unmount()
    }

    if (GalleryViewService.currentPlayState === "unmount") {
      await GalleryViewService.mount()
      await GalleryViewService.playIn()
    }
  }
  public async goToHome(): Promise<any> {
    if (HomeViewService.currentPlayState === "unmount") {
      await HomeViewService.mount()
      await HomeViewService.playIn()
    }
  }
}

export default new Viewer()
