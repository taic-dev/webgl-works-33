import { gsap } from "gsap";
import { App } from "./webgl/App";
import { Animation } from "./webgl/Animation";
import { opening } from "./modules/opening";
import { Scroll } from "./modules/Scroll";
import { Mouse } from "./modules/Mouse";

window.addEventListener('load', () => {
  // webgl
  const webgl = new App();
  webgl.init();
  gsap.ticker.add(() => {
    webgl.render();
    webgl.update();
  });
  
  // animation
  opening();
  const animation = new Animation(webgl.setup, webgl.mesh);
  animation.openingGl();
  
  // scroll
  const scroll = new Scroll();
  scroll.init();
  
  // mouse
  const mouse = new Mouse(webgl.mesh);
  mouse.init();
  
  window.addEventListener("resize", () => {
    webgl.resize();
    scroll.resize();
  });
})
