import * as THREE from "three";
import type { Logger } from "./Logger";

export abstract class ManagedCamera<T extends THREE.Camera> {
  readonly camera: T;
  readonly logger: Logger | undefined;

  constructor(camera: T, logger?: Logger) {
    this.camera = camera;
    this.logger = logger;
  }

  lookAt(vector: THREE.Vector3) {
    this.camera.lookAt(vector);
  }

  abstract preserveScaleAfterResize(): void;
}

export interface PerspectiveCameraOptions {
  fov?: number;
  aspect?: number;
  near?: number;
  far?: number;
  logger?: Logger;
}

export class ManagedPerspectiveCamera extends ManagedCamera<THREE.PerspectiveCamera> {
  private readonly initTanFOV: number;
  private readonly initWindowHeight: number;

  constructor(camera: THREE.PerspectiveCamera, logger?: Logger) {
    super(camera, logger);
    this.initTanFOV = Math.tan(((Math.PI / 180) * camera.fov) / 2);
    this.initWindowHeight = window.innerHeight;
  }

  preserveScaleAfterResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.fov = (360 / Math.PI) * Math.atan(this.initTanFOV * (window.innerHeight / this.initWindowHeight));
    this.camera.updateProjectionMatrix();
    this.logger?.debug(`Updated camera for new window size ${window.innerWidth} x ${window.innerHeight}`);
  }

  static createManagedPerspectiveCamera(options: PerspectiveCameraOptions = {}): ManagedPerspectiveCamera {
    const {
      fov = 75,
      aspect = window.innerWidth / window.innerHeight,
      near = 0.1,
      far = 1000,
      logger,
    } = options;

    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    return new ManagedPerspectiveCamera(camera, logger);
  }
}

export class ManagedOrthographicCamera extends ManagedCamera<THREE.OrthographicCamera> {
  constructor(camera: THREE.OrthographicCamera, logger?: Logger) {
    super(camera, logger);
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
