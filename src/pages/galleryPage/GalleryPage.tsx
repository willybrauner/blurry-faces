import css from "./GalleryPage.module.less"
import React, {
  forwardRef,
  ForwardedRef,
  useRef,
  useContext,
  useLayoutEffect,
  useState,
} from "react"
import { useStack } from "@cher-ami/router"
import { AppContext } from "../../index"
import { gsap } from "gsap"
import Image from "../../components/image/Image"
import Logo from "../../components/logo/Logo"
import RestartButton from "../../components/restartButton/RestartButton"
import DownloadButton from "../../components/downloadButton/DownloadButton"

interface IProps {}

const componentName = "GalleryPage"
const debug = require("debug")(`front:${componentName}`)

/**
 * @name GalleryPage
 */
const GalleryPage = forwardRef((props: IProps, handleRef: ForwardedRef<any>) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef(null)
  const restartButtonRef = useRef(null)
  const logoRef = useRef(null)
  const downloadButtonRef = useRef(null)
  const listRef = useRef(null)
  const itemRef = useRef([])
  const { images } = useContext(AppContext)

  const imageReadyCounter = useRef<number>(0)
  const [imagesAreReady, setImagesAreReady] = useState<boolean>(false)

  // ------------------------------------------------------------------------------------- PAGE

  const tl = useRef<gsap.core.Timeline>(null)

  const initTl = (): gsap.core.Timeline => {
    const current = gsap.timeline({ paused: true })
    current.from(
      [restartButtonRef.current, logoRef.current, downloadButtonRef.current],
      {
        y: -window.innerHeight,
        stagger: 0.05,
        ease: "elastic.out(0.4, 0.8)",
        duration: 0.7,
      },
      "start"
    )
    current.from(
      listRef.current,
      {
        y: window.innerHeight,
        duration: 1,
        ease: "elastic.out(0.3, 0.5)",
      },
      "start=+0.1"
    )
    return current
  }

  useLayoutEffect(() => {
    if (!tl.current) tl.current = initTl()
  }, [])

  /**
   * playIn page transition
   * (remove this example if not use)
   */
  const playIn = (): Promise<void> =>
    new Promise(async (resolve) => {
      await tl.current.play()
      document.body.style.overflow = "scroll"
      resolve()
    })

  /**
   * playOut page transition
   * (remove this example if not use)
   */
  const playOut = (): Promise<void> =>
    new Promise(async (resolve) => {
      await tl.current.reverse()
      document.body.style.overflow = null
      resolve()
    })

  /**
   * Handle page for Stack
   * Minimal arguments should be: useStack({ componentName, handleRef, rootRef });
   * (remove playIn and playOut if not use)
   */
  useStack({
    componentName,
    handleRef,
    rootRef,
    playIn,
    playOut,
    isReady: imagesAreReady,
  })

  return (
    <div className={css.root} ref={rootRef}>
      <div className={css.headerBackground} />
      <header className={css.header} ref={headerRef}>
        <RestartButton className={css.restartButton} ref={restartButtonRef} />
        <Logo className={css.logo} ref={logoRef} />
        <DownloadButton className={css.downloadButton} ref={downloadButtonRef} />
      </header>
      {images ? (
        <section className={css.content}>
          <ul className={css.list} ref={listRef}>
            {images?.map((el, i) => (
              <li className={css.item} key={i} ref={(r) => (itemRef.current[i] = r)}>
                <Image
                  className={css.image}
                  data={el}
                  rank={i + 1}
                  dispatchImageIsReady={() => {
                    imageReadyCounter.current++
                    if (imageReadyCounter.current === images.length) {
                      setImagesAreReady(true)
                    }
                  }}
                />
              </li>
            ))}
          </ul>
        </section>
      ) : (
        "loadinnnnnng"
      )}
    </div>
  )
})

GalleryPage.displayName = componentName
export default GalleryPage
