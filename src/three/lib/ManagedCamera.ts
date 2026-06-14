import * as THREE from "three";

export abstract class ManagedCamera<T extends THREE.Camera> {
  readonly camera: T;

  constructor(camera: T) {
    this.camera = camera;
  }

  lookAt(vector: THREE.Vector3) {
    this.camera.lookAt(vector);
  }

  abstract preserveScaleAfterResize(): void;
}

export class ManagedPerspectiveCamera extends ManagedCamera<THREE.PerspectiveCamera> {
  private readonly initTanFOV: number;
  private readonly initWindowHeight: number;

  constructor(camera: THREE.PerspectiveCamera) {
    super(camera);
    this.initTanFOV = Math.tan(((Math.PI / 180) * camera.fov) / 2);
    this.initWindowHeight = window.innerHeight;
  }

  preserveScaleAfterResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.fov = (360 / Math.PI) * Math.atan(this.initTanFOV * (window.innerHeight / this.initWindowHeight));
    this.camera.updateProjectionMatrix();
  }

  static createManagedPerspectiveCamera(fov: number = 75, aspect: number = window.innerWidth / window.innerHeight, near: number = 0.1, far: number = 1000): ManagedPerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    return new ManagedPerspectiveCamera(camera);
  }
}

export class ManagedOrthographicCamera extends ManagedCamera<THREE.OrthographicCamera> {
  constructor(camera: THREE.OrthographicCamera) {
    super(camera);
  }

  preserveScaleAfterResize(): void {
    // TODO
    throw Error("Not Implemented");
  }

  static createManagedOrthographicCamera(): ManagedOrthographicCamera {
    // TODO
    throw new Error("Not Implemented");
  }
}
