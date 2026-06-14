import WebGL from "three/addons/capabilities/WebGL.js";
import { ManagedGltf, type ManagedObject3D } from "./ManagedObject3D";
import { ManagedPerspectiveCamera, type ManagedCamera } from "./ManagedCamera";
import { ManagedScene } from "./ManagedScene";
import { ManagedRenderer } from "./ManagedRenderer";
import * as THREE from "three";

export class SceneManager {
  protected camera: ManagedCamera<THREE.Camera>;
  protected scene: ManagedScene;
  protected renderer: ManagedRenderer;
  protected registeredObjects: ManagedObject3D[] = [];
  private lastFrameTime = 0;

  shouldPreserveScaleOnResize = true;

  constructor(camera?: ManagedCamera<THREE.Camera>, scene?: ManagedScene, renderer?: ManagedRenderer) {
    this.camera = camera ?? ManagedPerspectiveCamera.createManagedPerspectiveCamera();
    this.scene = scene ?? ManagedScene.createSimpleScene();
    if (renderer) {
      this.renderer = renderer;
    } else {
      this.renderer = ManagedRenderer.createManagedWebGlRenderer();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    document.body.appendChild(this.renderer.renderer.domElement);
    window.addEventListener("resize", (event) => this.onWindowResize(event));
    this.setAnimationLoop();
    this.scene.scene.background = new THREE.Color("#888888"); // TODO remove this temp line
  }

  private setAnimationLoop() {
    if (WebGL.isWebGL2Available()) {
      this.renderer.setAnimationLoop((time) => this.animate(time));
    } else {
      const warning = WebGL.getWebGL2ErrorMessage();
      const container = document.getElementById("container") ?? document.body;
      container.appendChild(warning);
      throw new Error("WebGL not available: Your browser or graphics card does not support WebGL, or it is disabled.");
    }
  }

  register(...object: ManagedObject3D[]): void {
    this.registeredObjects.push(...object);
    this.scene.add(...object);
  }

  async registerGltfFromFile(path: string): Promise<ManagedGltf> {
    const gltfObject = await ManagedGltf.createFromFile(path);
    this.register(gltfObject);
    return gltfObject;
  }

  animate(time: DOMHighResTimeStamp) {
    const delta = this.lastFrameTime === 0 ? 0 : (time - this.lastFrameTime) / 1000;
    this.lastFrameTime = time;

    for (const object of this.registeredObjects) {
      object.update(delta);
    }
    this.render();
  }

  render() {
    this.renderer.render(this.scene.scene, this.camera.camera);
  }

  onWindowResize(_event: Event) {
    if (this.shouldPreserveScaleOnResize) this.preserveScaleOnResize();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.render();
  }

  preserveScaleOnResize() {
    this.camera.preserveScaleAfterResize();
  }
}
