import * as THREE from "three";
import type { ManagedObject3D } from "./ManagedObject3D";
import type { Logger } from "./Logger";

export class ManagedScene {
  readonly scene: THREE.Scene;
  readonly logger: Logger | undefined;

  constructor(scene: THREE.Scene, logger?:Logger) {
    this.scene = scene;
    this.logger = logger;
  }

  static createSimpleScene(logger?:Logger): ManagedScene {
    return new ManagedScene(new THREE.Scene(), logger);
  }

  add(...object: ManagedObject3D[]) {
    this.scene.add(...object.map((o) => o.object));
  }
}
