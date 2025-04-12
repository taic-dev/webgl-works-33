import { gsap } from "gsap";
import { Setup } from "./Setup";
import { Mesh } from "./Mesh";
import { EASING } from "../utils/constant";

export class Animation {
  setup: Setup
  mesh: Mesh

  constructor(setup: Setup, mesh: Mesh) {
    this.setup = setup;
    this.mesh = mesh
  }

  openingGl() {
    this.mesh.meshes.forEach((mesh) => {
      gsap.to((mesh.material as any).uniforms.uAlpha, {
        value: 1,
        duration: 1,
        delay: 3,
        ease: EASING.TRANSFORM
      })
    })
  }
}