import css from "./HomePage.module.less"
import React, { forwardRef, ForwardedRef, useRef, useLayoutEffect } from "react"
import { useStack } from "@cher-ami/router"
import { gsap } from "gsap"
import Logo from "../../components/logo/Logo"
import { DICO } from "../../data/dico"
import Github from "../../components/github/Github"
import Polaroid from "../../components/polaroid/Polaroid"
import { merge } from "../../helpers/arrayUtils"
import InputImages from "../../components/inputImages/InputImages"

interface IProps {}

const componentName = "HomePage"
const debug = require("debug")(`front:${componentName}`)

/**
 * @name HomePage
 */
const HomePage = forwardRef((props: IProps, handleRef: ForwardedRef<any>) => {
  const rootRef = useRef(null)
  const logoRef = useRef(null)
  const polaroidRef = useRef([])
  const inputImagesRef = useRef(null)
  const lineRef = useRef(null)
  const donateLinkRef = useRef(null)
  const creditLinkRef = useRef(null)
  const githubLinkRef = useRef(null)

  // ------------------------------------------------------------------------------------- ANIM

  const tl = useRef<gsap.core.Timeline>(null)

  const initTl = (
    $logo = logoRef.current,
    $polaroids = polaroidRef.current,
    $inputImages = inputImagesRef.current,
    $line = lineRef.current,
    $gitubLink = githubLinkRef.current,
    $donateLink = donateLinkRef.current,
    $creditLink = creditLinkRef.current
  ): gsap.core.Timeline => {
    const current = gsap.timeline({
      paused: true,
      defaults: {
        autoAlpha: 1,
        duration: 1.6,
        ease: "elastic.out(1, 0.6)",
      },
    })

    // left
    current.from(
      $logo,
      {
        y: -300,
        autoAlpha: 0,
      },
      "start"
    )
    // left
    current.from(
      $line,
      {
        autoAlpha: 1,
        width: 0,
        duration: 0.3,
        ease: " circle.in",
      },
      "start+=0.3"
    )
    current.set($line, { clearProps: "width" })

    current.addLabel("polaroid", "start+=1")
    // left
    current.from(
      $polaroids[2],
      {
        x: -innerWidth * 1.5,
        rotate: 40,
      },
      "polaroid"
    )
    // right
    current.from(
      $polaroids[1],
      {
        x: innerWidth * 1.5,
        rotate: 100,
      },
      "polaroid+=.1"
    )
    // center
    current.from(
      $polaroids[0],
      {
        x: innerWidth * 1.5,
        rotate: 70,
      },
      "polaroid+=.2"
    )

    // button
    current.from(
      $inputImages,
      {
        y: 200,
        duration: 1,
        transformOrigin: "center",
        autoAlpha: 0,
        stagger: 0.1,
      },
      "polaroid+=0.3"
    )
    current.addLabel("ui", "polaroid+=0.5")
    current.from(
      [$donateLink, $creditLink],
      {
        y: 100,
        duration: 1,
        transformOrigin: "center",
        autoAlpha: 0,
        stagger: 0.1,
        clearProps: "transform",
      },
      "ui"
    )
    current.from(
      $gitubLink,
      {
        y: -100,
        duration: 1,
        transformOrigin: "center",
        autoAlpha: 0,
        clearProps: "transform",
      },
      "ui+=.3"
    )

    return current
  }

  useLayoutEffect(() => {
    tl.current = initTl()
  }, [])

  /**
   * playIn page transition
   * (remove this example if not use)
   */
  const playIn = (): Promise<void> => tl.current.play() as any

  /**
   * playOut page transition
   * (remove this example if not use)
   */
  const playOut = (): Promise<void> => tl.current.reverse() as any

  /**
   * Handle page for Stack
   * Minimal arguments should be: useStack({ componentName, handleRef, rootRef });
   * (remove playIn and playOut if not use)
   */
  useStack({ componentName, handleRef, rootRef, playIn, playOut })

  return (
    <div className={css.root} ref={rootRef}>
      <header className={css.header}>
        <Logo className={css.logo} ref={logoRef} />
        <a
          className={css.githubLink}
          href={DICO.github_link}
          target={"_blank"}
          ref={githubLinkRef}
        >
          <Github className={css.github} />
        </a>
      </header>
      <section className={css.content}>
        <div className={css.line} ref={lineRef} />
        <div className={css.polaroids}>
          <div className={css.polaroidsInner}>
            {["center", "right", "left"].map((el, i) => (
              <Polaroid
                ref={(r) => (polaroidRef.current[i] = r)}
                className={merge([css.polaroid, css[`polaroid_${el}`]])}
                key={i}
              />
            ))}
          </div>
        </div>
      </section>

      <InputImages className={css.input} ref={inputImagesRef} />

      <footer className={css.footer}>
        <a
          className={css.donateLink}
          href={DICO.donate_link}
          ref={donateLinkRef}
          target={"_blank"}
        >
          <div className={css.donate} dangerouslySetInnerHTML={{ __html: DICO.donate }} />
        </a>
        <a
          className={css.creditLink}
          href={DICO.author_webiste}
          ref={creditLinkRef}
          target={"_blank"}
        >
          <div className={css.credit}>{DICO.credits}</div>
        </a>
      </footer>
    </div>
  )
})

HomePage.displayName = componentName
export default HomePage
