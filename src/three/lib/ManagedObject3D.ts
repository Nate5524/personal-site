import * as THREE from "three";
import { GLTFLoader, type GLTF } from "three/addons/loaders/GLTFLoader.js";
import { AnimationManager } from "./AnimationManager";

export class ManagedObject3D {
  readonly object: THREE.Object3D;
  readonly animationManager: AnimationManager;

  constructor(object: THREE.Object3D) {
    this.object = object;
    this.animationManager = new AnimationManager(object);
  }

  update(delta: number): void {
    if (this.animationManager.needsUpdate) {
      this.animationManager.update(delta);
    }
  }
}

export class ManagedGltf extends ManagedObject3D {
  readonly gltf: GLTF;

  constructor(gltf: GLTF) {
    super(gltf.scene);
    this.gltf = gltf;

    for (const clip of gltf.animations) {
      this.animationManager.addClip(clip);
    }
  }

  static async createFromFile(path: string): Promise<ManagedGltf> {
    // Throws error on failed load
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync(path);
    return new ManagedGltf(gltf);
  }
}

export class ManagedLight extends ManagedObject3D {
  constructor(light: THREE.Light) {
    super(light);
  }
}