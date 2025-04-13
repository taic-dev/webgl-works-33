import { gsap } from "gsap"
import Lenis from "lenis";
import { lenis } from "./modules/lenis";
import { App } from "./webgl/App";
import { Animation } from "./webgl/Animation";
import { opening } from "./modules/opening";
import { Scroll } from "./modules/scroll";

lenis();

// webgl
const webgl = new App();
webgl.init();
gsap.ticker.add(() => {
  webgl.render()
  webgl.update()
});

// scroll
const scroll = new Scroll();
scroll.init();

// animation
opening();
const animation = new Animation(webgl.setup, webgl.mesh)
animation.openingGl();

window.addEventListener('resize', () => {
  webgl.resize()
})