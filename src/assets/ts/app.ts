import { gsap } from "gsap"
import Lenis from "lenis";
import { lenis } from "./modules/lenis";
import { App } from "./webgl/App";
import { Animation } from "./webgl/Animation";
import { opening } from "./modules/opening";

lenis();

// webgl
const webgl = new App();
webgl.init();
gsap.ticker.add(() => webgl.render());

// animation
opening();
const animation = new Animation(webgl.setup, webgl.mesh)
animation.openingGl();

window.lenis.on('scroll', (e: Lenis) => {
  window.velocity = e.velocity
  webgl.update()
});

window.addEventListener('resize', () => {
  webgl.resize()
})