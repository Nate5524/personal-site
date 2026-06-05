import WebGL from "three/addons/capabilities/WebGL.js";
import * as THREE from "three";
import type { ManagedObject3D } from "./ManagedObject3D";

export class SceneManager {
    protected camera: THREE.Camera;
    protected scene: THREE.Scene;
    protected renderer: THREE.WebGLRenderer;
    protected registeredObjects: ManagedObject3D[] = [];
  
    constructor(camera?: THREE.Camera, scene?: THREE.Scene, renderer?: THREE.WebGLRenderer) {
      this.camera = camera ?? new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.scene = scene ?? new THREE.Scene();
      if (renderer) {
        this.renderer = renderer;
      } else {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      }
      document.body.appendChild(this.renderer.domElement);
      this.setAnimationLoop();
    }
  
    private setAnimationLoop() {
      if (WebGL.isWebGL2Available()) {
        this.renderer.setAnimationLoop((time) => this.animate(time));
      } else {
        const warning = WebGL.getWebGL2ErrorMessage();
        const container = document.getElementById("container") ?? document.body;
        container.appendChild(warning);
        throw new Error("WebGL not available: Your browser or graphics card does not support WebGL, or it is disabled.");
      }
    }
  
    register(...object: ManagedObject3D[]): void {
      this.registeredObjects.push(...object);
      this.scene.add(...object.map((o) => o.object));
    }
  
    animate(time: DOMHighResTimeStamp) {
      for (const object of this.registeredObjects) {
        object.animate(time);
      }
      this.render();
    }
  
    render() {
      this.renderer.render(this.scene, this.camera);
    }
  }