import Lenis from 'lenis'

export const lenis = () => {
  const lenis = new Lenis();
  window.lenis = lenis;
  const raf = (time: number) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
};
