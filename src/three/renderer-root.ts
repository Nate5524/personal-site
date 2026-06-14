import * as THREE from "three";
import { ManagedGltf, ManagedLight, ManagedObject3D } from "./lib/ManagedObject3D";
import { SceneManager } from "./lib/SceneManager";

class TestObject extends ManagedObject3D {
  constructor() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x56789a });
    super(new THREE.Mesh(geometry, material));
    this.object.translateZ(-5);

    this.animationManager.addProcedural("spin", (delta) => {
      this.object.rotation.x += delta / 2;
      this.object.rotation.y += delta;
    });
  }
}

let sceneManager = new SceneManager();
// sceneManager.register(new TestObject());

let gltf = await ManagedGltf.createFromFile("src/assets/low_poly_x-wing/scene.gltf");
gltf.object.traverse((child) => {
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

gltf.object.translateY(3).translateZ(-10);
// gltf.object.rotateY(Math.PI / 2);
// gltf.object.rotateZ(Math.PI / 4);
sceneManager.register(gltf);

gltf.animationManager.addProcedural("spin", (delta) => {
  gltf.object
    .rotateX(delta)
    .rotateY(delta / 2)
    .rotateZ(delta / 4);
});
gltf.animationManager.playAll();

//  point light
// const pointLight = new ManagedLight(new THREE.PointLight(0xffffff, 200));
// let elapsed = 0;
// pointLight.animationManager.addProcedural("orbit", (delta) => {
//   elapsed += delta;
//   pointLight.object.position.setX((elapsed * 10) % 10);
// });
// sceneManager.register(pointLight);
// pointLight.animationManager.play("orbit");

// plane
const gridColor = new THREE.Color(0x990000);
const grid = new ManagedObject3D(new THREE.GridHelper(1000, 500, gridColor, gridColor));
grid.object.translateY(-5).translateZ(-1).rotateX(0.5).translateZ(425);
const startPos = grid.object.position.z;
grid.animationManager.addProcedural("move", (delta) => {
  grid.object.translateZ(32 * delta);
  let diff = grid.object.position.z - startPos;
  grid.object.translateZ(-Math.trunc(diff / 2) * 2);
});
grid.animationManager.playAll()
sceneManager.register(grid);
