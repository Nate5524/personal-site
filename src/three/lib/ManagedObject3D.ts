import * as THREE from "three";
import { GLTFLoader, type GLTF } from "three/addons/loaders/GLTFLoader.js";
import { AnimationManager } from "./AnimationManager";
import type { Logger } from "./Logger";

export class ManagedObject3D {
  readonly object: THREE.Object3D;
  readonly animationManager: AnimationManager;
  readonly logger: Logger | undefined;

  constructor(object: THREE.Object3D, logger?: Logger) {
    this.object = object;
    this.animationManager = new AnimationManager(object, logger);
    this.logger = logger
  }

  update(delta: number): void {
    if (this.animationManager.needsUpdate) {
      this.animationManager.update(delta);
    }
  }

  renderUnitVectors() {
    const dirX = new THREE.Vector3(1, 0, 0);
    const dirY = new THREE.Vector3(0, 1, 0);
    const dirZ = new THREE.Vector3(0, 0, 1);

    const origin = new THREE.Vector3(0, 0, 0);

    const arrowX = new THREE.ArrowHelper(dirX, origin, 2, 0xff0000, 0.4, 0.25);
    const arrowY = new THREE.ArrowHelper(dirY, origin, 2, 0x00ff00, 0.4, 0.25);
    const arrowZ = new THREE.ArrowHelper(dirZ, origin, 2, 0x0000ff, 0.4, 0.25);

    // Render overtop other elements
    for (const arrow of [arrowX, arrowY, arrowZ]) {
      for (const part of [arrow.line, arrow.cone]) {
        const materials = Array.isArray(part.material) ? part.material : [part.material];
        for (const material of materials) {
          material.depthTest = false;
          material.depthWrite = false;
          material.transparent = true;
        }
        part.renderOrder = 999;
      }
    }

    this.object.add(arrowX);
    this.object.add(arrowY);
    this.object.add(arrowZ);
  }

  wireframe() {
    this.object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const edges = new THREE.EdgesGeometry(child.geometry);
        const wireframe = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }));
        wireframe.position.copy(child.position);
        wireframe.quaternion.copy(child.quaternion);
        wireframe.scale.copy(child.scale);
        child.parent?.add(wireframe);
        child.visible = false;
      }
    });
  }
}

export class ManagedGltf extends ManagedObject3D {
  readonly gltf: GLTF;

  constructor(gltf: GLTF, logger?:Logger) {
    super(gltf.scene, logger);
    this.gltf = gltf;

    for (const clip of gltf.animations) {
      this.animationManager.addClip(clip, logger);
    }
  }

  static async createFromFile(path: string, manager?: THREE.LoadingManager, logger?:Logger): Promise<ManagedGltf> {
    // Throws error on failed load
    const loader = new GLTFLoader(manager);
    const gltf = await loader.loadAsync(path);
    return new ManagedGltf(gltf, logger);
  }
}

export class ManagedLight extends ManagedObject3D {
  constructor(light: THREE.Light, logger?:Logger) {
    super(light, logger);
  }
}
