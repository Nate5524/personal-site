import WebGL from "three/addons/capabilities/WebGL.js";
import { ManagedGltf, type ManagedObject3D } from "./ManagedObject3D";
import { ManagedPerspectiveCamera, type ManagedCamera } from "./ManagedCamera";
import { ManagedScene } from "./ManagedScene";
import { ManagedRenderer } from "./ManagedRenderer";
import * as THREE from "three";
import type { Logger } from "./Logger";

export interface SceneManagerOptions {
  camera?: ManagedCamera<THREE.Camera>;
  scene?: ManagedScene;
  renderer?: ManagedRenderer;
  logger?: Logger;
}

export class SceneManager {
  protected _camera: ManagedCamera<THREE.Camera>;
  protected _scene: ManagedScene;
  protected _renderer: ManagedRenderer;
  readonly logger: Logger|undefined;
  protected registeredObjects: ManagedObject3D[] = [];
  private lastFrameTime = 0;

  shouldPreserveScaleOnResize = true;

  constructor(options: SceneManagerOptions = {}) {
    const { camera, scene, renderer, logger } = options;

    this._camera = camera ?? ManagedPerspectiveCamera.createManagedPerspectiveCamera({ logger });
    this._scene = scene ?? ManagedScene.createSimpleScene(logger);
    if (renderer) {
      this._renderer = renderer;
    } else {
      this._renderer = ManagedRenderer.createManagedWebGlRenderer(logger);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    this.logger = logger;
    document.body.appendChild(this.renderer.domElement);
    window.addEventListener("resize", (event) => this.onWindowResize(event));
    this.setAnimationLoop();
    this.scene.background = new THREE.Color("#888888"); // TODO remove this temp line
  }

  get camera(){
    return this._camera.camera;
  }

  get renderer(){
    return this._renderer.renderer;
  }

  get scene(){
    return this._scene.scene;
  }

  private setAnimationLoop() {
    if (WebGL.isWebGL2Available()) {
      this.renderer.setAnimationLoop((time) => this.animate(time));
    } else {
      const warning = WebGL.getWebGL2ErrorMessage();
      // TODO: contemplate if this is responsibility of the logger or of this function - this may be sketch ngl
      const container = document.getElementById("container") ?? document.body;
      container.appendChild(warning);
      throw new Error("WebGL not available: Your browser or graphics card does not support WebGL, or it is disabled.");
    }
  }

  register(...object: ManagedObject3D[]): void {
    this.registeredObjects.push(...object);
    this._scene.add(...object);
  }

  async registerGltfFromFile(path: string): Promise<ManagedGltf> {
    const gltfObject = await ManagedGltf.createFromFile(path, undefined, this.logger);
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
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize(_event: Event) {
    if (this.shouldPreserveScaleOnResize) this.preserveScaleOnResize();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.render();
  }

  preserveScaleOnResize() {
    this._camera.preserveScaleAfterResize();
  }
}
