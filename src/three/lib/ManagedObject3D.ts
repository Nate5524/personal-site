import * as THREE from "three";

export abstract class ManagedObject3D {
  readonly object: THREE.Object3D;

  constructor(object: THREE.Object3D) {
    this.object = object;
  }

  abstract animate(time): void;
}