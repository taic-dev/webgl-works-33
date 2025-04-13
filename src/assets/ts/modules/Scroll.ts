import { gsap } from "gsap";

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
  }

  init() {
    this.update();
    this.addEventListeners();
  }

  update() {
    this.base.width = [];
    this.base.height = [];
    this.domInfo.width = [];
    this.domInfo.height = [];
    this.domInfo.totalWidth = 0
    this.domInfo.totalHeight = 0
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

  onWheel(event: WheelEvent) {
    this.contents?.forEach((v, i) => {
      this.base.height[i] = this.base.height[i] - event.deltaY;
      gsap.set(v, { y: this.base.height[i] });
      this.loop(v, this.base.height[i], i);
    });
  }

  addEventListeners() {
    window.addEventListener("wheel", this.onWheel.bind(this));
  }

  resize() {
    this.update();
  }
}
