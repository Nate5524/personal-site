import * as THREE from "three";
import { ManagedObject3D } from "./lib/ManagedObject3D";
import { SceneManager } from "./lib/SceneManager";

class TestObject extends ManagedObject3D {
  constructor() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x56789a });
    super(new THREE.Mesh(geometry, material));
    this.object.translateZ(-5);
  }

  animate(time: DOMHighResTimeStamp): void {
    this.object.rotation.x = time / 2000;
    this.object.rotation.y = time / 1000;
  }
}

let sceneManager = new SceneManager();
sceneManager.register(new TestObject());
