import Lenis from 'lenis'

export const lenis = () => {
  const lenis = new Lenis();
  window.lenis = lenis;
  const raf = (time: number) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);

  // window.lenis.on("scroll", (e: Lenis) => {
  //   window.velocity = e.velocity;
  //   console.log(e.velocity)
  // });
};
