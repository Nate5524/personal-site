import * as THREE from "three";
import type { ManagedObject3D } from "./ManagedObject3D";

export class ManagedScene {
  readonly scene: THREE.Scene;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  static createSimpleScene(): ManagedScene {
    return new ManagedScene(new THREE.Scene());
  }

  add(...object: ManagedObject3D[]) {
    this.scene.add(...object.map((o) => o.object));
  }
}
