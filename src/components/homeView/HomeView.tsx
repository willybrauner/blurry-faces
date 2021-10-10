import css from "./HomeView.module.less"
import React, { useLayoutEffect, useRef } from "react"
import { merge } from "../../lib/utils/arrayUtils"
import Logo from "../logo/Logo"
import { DICO } from "../../data/dico"
import Github from "../github/Github"
import Polaroid from "../polaroid/Polaroid"
import InputImages from "../inputImages/InputImages"
import { gsap } from "gsap"
import HomeViewService from "./HomeViewService"
import { useView } from "../../helpers/useView"

interface IProps {
  className?: string
}

const componentName = "HomeView"
const debug = require("debug")(`front:${componentName}`)

/**
 * @name HomeView
 */
function HomeView(props: IProps) {
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

  const playIn = () => tl.current.play()
  const playOut = () => tl.current.reverse()

  useView({
    view: HomeViewService,
    playIn,
    playOut,
  })

  // -------------------------–-------------------------–--------------------------------- RENDER

  return (
    <div className={merge([css.root, props.className])}>
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
          <div className={css.donate}>{DICO.donate}</div>
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
}

export default HomeView
