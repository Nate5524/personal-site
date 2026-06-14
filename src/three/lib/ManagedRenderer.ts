import * as THREE from "three";
import { WebGPURenderer } from "three/webgpu";

export type SupportedRenderer = THREE.WebGLRenderer | WebGPURenderer;

export class ManagedRenderer {
  readonly renderer: SupportedRenderer;

  constructor(renderer: SupportedRenderer) {
    this.renderer = renderer;
  }

  static createManagedWebGlRenderer(): ManagedRenderer {
    return new ManagedRenderer(new THREE.WebGLRenderer());
  }

  static createManagedWebGpuRenderer(): ManagedRenderer {
    return new ManagedRenderer(new WebGPURenderer());
  }

  render(scene: THREE.Scene, camera: THREE.Camera) {
    this.renderer.render(scene, camera);
  }

  setSize(width: number, height: number) {
    this.renderer.setSize(width, height);
  }

  dispose() {
    this.renderer.dispose();
  }

  setAnimationLoop(callback: (time: DOMHighResTimeStamp, frame?: XRFrame) => void) {
    this.renderer.setAnimationLoop(callback);
  }
}
