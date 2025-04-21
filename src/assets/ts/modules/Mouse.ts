import { gsap } from "gsap";
import { EASING } from "../utils/constant";
import { Mesh } from "../webgl/Mesh";
import {
  getElementPositionAndSize,
  getMouseCoordinate,
} from "../utils/getPositionUtils";

export class Mouse {
  mesh: Mesh;
  stalker: HTMLElement | null;
  viewer: HTMLElement | null;
  close: HTMLElement | null;
  images: HTMLElement[];
  horizontal: HTMLElement | null;
  vertical: HTMLElement | null;
  imageIndex: number;
  beforeSize: { x: number; y: number }[];

  constructor(mesh: Mesh) {
    this.mesh = mesh;
    this.stalker = document.querySelector<HTMLElement>(".js-stalker");
    this.viewer = document.querySelector<HTMLElement>(".js-gallery-viewer");
    this.close = document.querySelector<HTMLElement>(".js-close");
    this.images = [
      ...document.querySelectorAll<HTMLElement>(".js-gallery-image"),
    ];
    this.horizontal = document.querySelector(".js-gallery-viewer-horizontal")!;
    this.vertical = document.querySelector(".js-gallery-viewer-vertical")!;

    this.imageIndex = 0;
    this.beforeSize = [];
  }

  init() {
    this.addEventListeners();
  }

  onOpen(i: number) {
    if (!this.horizontal || !this.vertical) return;
    window.isView = true;
    this.imageIndex = i;
    this.update();

    const isLandscape =
      this.mesh.meshes[i].scale.x > this.mesh.meshes[i].scale.y;
    const aspect = getElementPositionAndSize(
      isLandscape ? this.horizontal : this.vertical
    );

    gsap.set(isLandscape ? this.vertical : this.horizontal, {
      display: "none",
    });
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
    const imageElement = getElementPositionAndSize(
      this.images[this.imageIndex]
    );

    gsap.set(this.horizontal, { display: "block" });
    gsap.set(this.vertical, { display: "block" });
    gsap.set(this.images, { pointerEvents: "auto" });
    gsap.set(this.viewer, { zIndex: 99 });

    gsap.to(this.close, {
      scale: 1.3,
      opacity: 0,
      duration: 0.3,
      ease: EASING.TRANSFORM,
    });

    gsap.to(this.mesh.meshes[this.imageIndex].position, {
      x: imageElement.dom.x,
      y: imageElement.dom.y,
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

  onMouseEnter() {
    gsap.to(this.stalker, {
      scale: 1,
      opacity: 1,
      duration: 0.3,
      ease: EASING.TRANSFORM,
    });
  }

  onMouseLeave() {
    gsap.to(this.stalker, {
      scale: 0,
      opacity: 0,
      duration: 0.3,
      ease: EASING.TRANSFORM,
    });
  }

  onModalMove(e: MouseEvent) {
    const mesh = this.mesh.meshes[this.imageIndex];
    const { x, y } = getMouseCoordinate(e);

    gsap.to((mesh.material as any).uniforms.uMouse.value, {
      x,
      y,
      duration: 0.5,
    });

    gsap.to(mesh.rotation, {
      x: y * 0.2,
      y: -x * 0.2,
      duration: 0.5,
      ease: "power1.out",
    });
  }

  onModalLeave() {
    const mesh = this.mesh.meshes[this.imageIndex];
    gsap.to((mesh.material as any).uniforms.uMouse.value, {
      x: 0,
      y: 0,
      duration: 0.5,
    });

    gsap.to(mesh.rotation, {
      x: 0,
      y: 0,
      duration: 0.5,
    });
  }

  onMouseMove(e: MouseEvent) {
    const x = e.clientX;
    const y = e.clientY;

    gsap.to(this.stalker, { x, y, duration: 0.5 });
  }

  addEventListeners() {
    this.images?.forEach((image, i) => {
      image.addEventListener("mouseenter", this.onMouseEnter.bind(this));
      image.addEventListener("mouseleave", this.onMouseLeave.bind(this));
      image.addEventListener("click", () => this.onOpen(i));
    });

    window.addEventListener("mousemove", this.onMouseMove.bind(this));
    this.horizontal?.addEventListener("mousemove", (e) => this.onModalMove(e));
    this.vertical?.addEventListener("mousemove", (e) => this.onModalMove(e));
    this.horizontal?.addEventListener(
      "mouseleave",
      this.onModalLeave.bind(this)
    );
    this.vertical?.addEventListener("mouseleave", this.onModalLeave.bind(this));
    this.close?.addEventListener("click", this.onClose.bind(this));
  }

  update() {
    this.refresh();
    this.mesh.meshes.forEach((v) => {
      this.beforeSize.push({ x: v.scale.x, y: v.scale.y });
    });
  }

  refresh() {
    this.beforeSize = [];
  }

  resize() {
    if (window.isView) return;
    this.update();
  }
}
