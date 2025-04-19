import { gsap } from "gsap";
import { EASING, DURATION } from "../utils/constant";

export const opening = () => {
  window.isPlaying = true;
  const openingText = document.querySelector(".js-opening-text");
  const images = [...document.querySelectorAll<HTMLElement>('.js-gallery-image')];
  const tl = gsap.timeline();

  gsap.set(images, { pointerEvents: "none" })

  tl.to(openingText, {
    opacity: 1,
    filter: "blur(0)",
    letterSpacing: 0,
    duration: DURATION.BASE,
    delay: 0.5,
    ease: "power2.in",
  }).to(openingText, {
    scale: 0.7,
    color: "#cfcfcf",
    duration: 0.8,
    delay: 1.5,
    ease: EASING.TRANSFORM,
    onComplete: () => {
      window.isPlaying = false;
      gsap.set(images, { pointerEvents: "auto" })
    },
  });
};
