import { gsap } from "gsap";
import { lenis } from "./modules/lenis";
import { App } from "./webgl/App";
import { Animation } from "./webgl/Animation";
import { opening } from "./modules/opening";
import { Scroll } from "./modules/Scroll";

lenis();

// scroll
const scroll = new Scroll();
scroll.init();

// webgl
const webgl = new App();
webgl.init();
gsap.ticker.add(() => {
  webgl.render();
  webgl.update();
  scroll.raf();
});

// animation
opening();
const animation = new Animation(webgl.setup, webgl.mesh);
animation.openingGl();

window.addEventListener("resize", () => {
  webgl.resize();
  scroll.resize();
});
