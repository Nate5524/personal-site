import * as THREE from "three";
import { WebGPURenderer } from "three/webgpu";
import type { Logger } from "./Logger";

export type SupportedRenderer = THREE.WebGLRenderer | WebGPURenderer;

export class ManagedRenderer {
  readonly renderer: SupportedRenderer;
  readonly logger: Logger | undefined;

  constructor(renderer: SupportedRenderer, logger?:Logger) {
    this.renderer = renderer;
    this.logger = logger;
  }

  static createManagedWebGlRenderer(logger?:Logger): ManagedRenderer {
    return new ManagedRenderer(new THREE.WebGLRenderer(), logger);
  }

  static createManagedWebGpuRenderer(logger?:Logger): ManagedRenderer {
    return new ManagedRenderer(new WebGPURenderer(), logger);
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
