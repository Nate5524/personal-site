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

  renderDirectionVectors(){
    const dirX = new THREE.Vector3(1, 0, 0).normalize();
    const dirY = new THREE.Vector3(0, 1, 0).normalize();
    const dirZ = new THREE.Vector3(0, 0, 1).normalize();

    // 2. Set the starting origin at the object's local center
    const origin = new THREE.Vector3(0, 0, 0);

    // 3. Create Arrow Helpers (length = 2 units)
    const arrowX = new THREE.ArrowHelper(dirX, origin, 2, 0xff0000); 
    const arrowY = new THREE.ArrowHelper(dirY, origin, 2, 0x00ff00);
    const arrowZ = new THREE.ArrowHelper(dirZ, origin, 2, 0x0000ff);

    // 4. Attach arrows directly to your object
    this.object.add(arrowX);
    this.object.add(arrowY);
    this.object.add(arrowZ);
  }

  wireframe(){
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