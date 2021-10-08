import css from "./HomeView.module.less"
import React, { useLayoutEffect, useRef } from "react"
import { merge } from "../../lib/utils/arrayUtils"
import Logo from "../logo/Logo"
import { DICO } from "../../data/dico"
import Github from "../github/Github"
import Polaroid from "../polaroid/Polaroid"
import InputImages from "../inputImages/InputImages"
import { gsap } from "gsap"

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

  const enterAnim = (
    $logo = logoRef.current,
    $polaroids = polaroidRef.current,
    $inputImages = inputImagesRef.current,
    $line = lineRef.current,
    $gitubLink = githubLinkRef.current,
    $donateLink = donateLinkRef.current,
    $creditLink = creditLinkRef.current
  ): void => {
    const tl = gsap.timeline({
      defaults: { autoAlpha: 1, duration: 1.6, ease: "elastic.out(1, 0.6)" },
    })

    // left
    tl.from(
      $logo,
      {
        y: -300,
        autoAlpha: 0,
      },
      "start"
    )
    // left
    tl.from(
      $line,
      {
        autoAlpha: 1,
        width: 0,
        duration: 0.3,
        ease: " circle.in",
      },
      "start+=0.3"
    )
    tl.set($line, { clearProps: "width" })

    tl.addLabel("polaroid", "start+=1")
    // left
    tl.from(
      $polaroids[2],
      {
        x: -innerWidth * 1.5,
        rotate: 40,
      },
      "polaroid"
    )
    // right
    tl.from(
      $polaroids[1],
      {
        x: innerWidth * 1.5,
        rotate: 100,
      },
      "polaroid+=.1"
    )
    // center
    tl.from(
      $polaroids[0],
      {
        x: innerWidth * 1.5,
        rotate: 70,
      },
      "polaroid+=.2"
    )

    // button
    tl.from(
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
    tl.addLabel("ui", "polaroid+=0.5")
    tl.from(
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
    tl.from(
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
  }

  useLayoutEffect(() => {
    enterAnim()
  }, [])

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
