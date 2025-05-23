import { gsap } from "gsap";
import NormalizeWheel from "normalize-wheel";

const lerp = (p1: number, p2: number, t: number) => p1 + (p2 - p1) * t;

export class Scroll {
  contents: HTMLElement[] | null;
  base: {
    width: number[];
    height: number[];
  };
  domInfo: {
    width: number[];
    height: number[];
    totalWidth: number;
    totalHeight: number;
  };
  scroll: {
    ease: number;
    current: number;
    target: number;
    position: number;
  };
  start: number;

  constructor() {
    this.contents = [
      ...document.querySelectorAll<HTMLElement>(".js-gallery-grid"),
    ];
    this.base = {
      width: [],
      height: [],
    };
    this.domInfo = {
      width: [],
      height: [],
      totalWidth: 0,
      totalHeight: 0,
    };
    this.scroll = {
      ease: 0.05,
      current: 0,
      target: 0,
      position: 0,
    };
    this.start = 0;
  }

  init() {
    this.raf();
    this.update();
    this.addEventListeners();
  }

  update() {
    this.base.width = [];
    this.base.height = [];
    this.domInfo.width = [];
    this.domInfo.height = [];
    this.domInfo.totalWidth = 0;
    this.domInfo.totalHeight = 0;
    let additionWidth = 0;
    let additionHeight = 0;
    this.contents?.forEach((v) => {
      gsap.set(v, { y: additionHeight });
      this.base.width.push(additionWidth);
      this.base.height.push(additionHeight);
      this.domInfo.width.push(v.clientWidth);
      this.domInfo.height.push(v.clientHeight);
      additionWidth += v.clientWidth;
      additionHeight += v.clientHeight;
    });
    this.domInfo.totalWidth = this.domInfo.width.reduce((s, e) => s + e, 0);
    this.domInfo.totalHeight = this.domInfo.height.reduce((s, e) => s + e, 0);
  }

  loop(ele: HTMLElement, p: number, i: number) {
    // 上　画面外
    if (p < -this.domInfo.height[i]) {
      this.base.height[i] = this.domInfo.totalHeight + this.base.height[i];
      gsap.set(ele, { y: this.domInfo.totalHeight + this.base.height[i] });
    }

    // 下　画面外
    if (p > this.domInfo.totalHeight - p) {
      this.base.height[i] = -this.domInfo.totalHeight + this.base.height[i];
      gsap.set(ele, { y: -this.domInfo.totalHeight + this.base.height[i] });
    }
  }

  raf() {
    this.scroll.current = lerp(
      this.scroll.current,
      this.scroll.target,
      this.scroll.ease
    );

    this.contents?.forEach((v, i) => {
      this.base.height[i] = this.base.height[i] - this.scroll.current;
      gsap.set(v, { y: this.base.height[i] });
      this.loop(v, this.base.height[i], i);
    });

    this.scroll.target *= 0.5;
    window.velocity = this.scroll.current;

    requestAnimationFrame(this.raf.bind(this));
  }

  onWheel(event: WheelEvent) {
    if (window.isPlaying || window.isView) return;
    const normalized = NormalizeWheel(event);
    const speed = normalized.pixelY;
    this.scroll.target += speed * 0.5;
  }

  onTouchStart(event: TouchEvent) {
    if (window.isPlaying) return;
    window.isDown = true;
    this.scroll.position = this.scroll.current;
    this.start = event.touches
      ? event.touches[0].clientY
      : (event as any).clientY;
  }

  onTouchMove(event: TouchEvent) {
    if (window.isPlaying || !window.isDown) return;
    const y = event.touches ? event.touches[0].clientY : (event as any).clientY;
    const distance = (this.start - y) * 0.3;
    this.scroll.target = this.scroll.position + distance;
  }

  onTouchEnd() {
    if (window.isPlaying || !window.isDown) return;
    window.isDown = false;
  }

  addEventListeners() {
    window.addEventListener("wheel", this.onWheel.bind(this));
    window.addEventListener("touchstart", (e) => this.onTouchStart(e));
    window.addEventListener("touchmove", (e) => this.onTouchMove(e));
    window.addEventListener("touchend", this.onTouchEnd);
  }

  resize() {
    this.update();
  }
}
