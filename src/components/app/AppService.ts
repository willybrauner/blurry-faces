import HomeViewService from "../homeView/HomeViewService"
import GalleryViewService from "../galleryView/GalleryViewService"

class AppService {
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

export default new AppService()
