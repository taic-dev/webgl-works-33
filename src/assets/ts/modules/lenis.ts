import Lenis from 'lenis'

export const lenis = () => {
  const lenis = new Lenis();
  const raf = (time: number) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
};
