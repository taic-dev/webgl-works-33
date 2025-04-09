import { gsap } from "gsap"
import { App } from "./webgl/App";
import { lenis } from "./modules/lenis";
import { opening } from "./modules/opening";

lenis();
opening();

// const webgl = new App();
// webgl.init();
// gsap.ticker.add(() => webgl.render());

// window.addEventListener('scroll', () => {
//   webgl.update()
// })

// window.addEventListener('resize', () => {
//   webgl.resize()
// })