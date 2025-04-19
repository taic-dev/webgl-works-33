import { gsap } from "gsap";
import { EASING } from "../utils/constant";
import { Mesh } from "../webgl/Mesh";
import { getElementPositionAndSize } from "../utils/getElementSize";

export class Mouse {
  mesh: Mesh;
  stalker: HTMLElement | null;
  viewer: HTMLElement | null;
  close: HTMLElement | null;
  images: HTMLElement[] | null;
  imageIndex: number;
  beforePosition: { x: number; y: number }[];
  beforeSize: { x: number; y: number }[];

  constructor(mesh: Mesh) {
    this.mesh = mesh;
    this.stalker = document.querySelector<HTMLElement>(".js-stalker");
    this.viewer = document.querySelector<HTMLElement>(".js-gallery-viewer");
    this.close = document.querySelector<HTMLElement>(".js-close");
    this.images = [
      ...document.querySelectorAll<HTMLElement>(".js-gallery-image"),
    ];
    this.imageIndex = 0;
    this.beforePosition = [];
    this.beforeSize = [];
  }

  init() {
    this.addEventListeners();
  }

  onOpen(i: number) {
    const horizontal = getElementPositionAndSize(
      document.querySelector(".js-gallery-viewer-horizontal")!
    );
    const vertical = getElementPositionAndSize(
      document.querySelector(".js-gallery-viewer-vertical")!
    );

    window.isView = true;
    this.imageIndex = i;
    this.update();

    gsap.set(this.images, { pointerEvents: "none" });
    gsap.set(this.viewer, { zIndex: 999 });

    gsap.to(this.stalker, {
      scale: 1.3,
      opacity: 0,
      duration: 0.3,
      ease: EASING.TRANSFORM,
    });

    gsap.to(this.close, {
      scale: 1,
      opacity: 1,
      duration: 0.3,
      ease: EASING.TRANSFORM,
    });

    gsap.to(this.mesh.meshes[i].position, {
      x: 0,
      y: 0,
      z: 1.5,
      duration: 0.5,
      ease: EASING.TRANSFORM,
    });

    this.mesh.meshes.forEach((mesh, i) => {
      const aspect = mesh.scale.x > mesh.scale.y ? horizontal : vertical;
      if (i !== this.imageIndex) {
        gsap.to(mesh.scale, {
          x: 0,
          y: 0,
          z: 0,
          duration: 0.5,
          ease: EASING.TRANSFORM,
        });
      } else {
        gsap.to(mesh.scale, {
          x: aspect.dom.width,
          y: aspect.dom.height,
          z: 1,
          duration: 0.5,
          ease: EASING.OUT_BACK,
        });
      }
    });
  }

  onClose() {
    window.isView = false;

    gsap.set(this.images, { pointerEvents: "auto" });
    gsap.set(this.viewer, { zIndex: 99 });

    gsap.to(this.close, {
      scale: 1.3,
      opacity: 0,
      duration: 0.3,
      ease: EASING.TRANSFORM,
    });

    gsap.to(this.mesh.meshes[this.imageIndex].position, {
      x: this.beforePosition[this.imageIndex].x,
      y: this.beforePosition[this.imageIndex].y,
      z: 1,
      duration: 0.5,
      ease: EASING.TRANSFORM,
    });

    this.mesh.meshes.forEach((mesh, i) => {
      gsap.to(mesh.scale, {
        x: this.beforeSize[i].x,
        y: this.beforeSize[i].y,
        duration: 0.5,
        ease: EASING.OUT_BACK,
      });
    });
  }

  onMouseenter() {
    gsap.to(this.stalker, {
      scale: 1,
      opacity: 1,
      duration: 0.3,
      ease: EASING.TRANSFORM,
    });
  }

  onMouseleave() {
    gsap.to(this.stalker, {
      scale: 0,
      opacity: 0,
      duration: 0.3,
      ease: EASING.TRANSFORM,
    });
  }

  onMousemove(e: MouseEvent) {
    const x = e.clientX;
    const y = e.clientY;

    gsap.to(this.stalker, { x, y, duration: 0.5 });
  }

  addEventListeners() {
    this.images?.forEach((image, i) => {
      image.addEventListener("mouseenter", this.onMouseenter.bind(this));
      image.addEventListener("mouseleave", this.onMouseleave.bind(this));
      image.addEventListener("click", () => this.onOpen(i));
    });

    this.close?.addEventListener("click", this.onClose.bind(this));
    window.addEventListener("mousemove", this.onMousemove.bind(this));
  }

  update() {
    this.refresh();
    this.mesh.meshes.forEach((v) => {
      this.beforePosition.push({ x: v.position.x, y: v.position.y });
      this.beforeSize.push({ x: v.scale.x, y: v.scale.y });
    });
  }

  refresh() {
    this.beforePosition = [];
    this.beforeSize = [];
  }

  resize() {
    this.update();
  }
}
