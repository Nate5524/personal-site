import * as THREE from "three";
import { ManagedGltf } from "./lib/ManagedObject3D";
import { InfiniteGrid } from "./objects/InfiniteGrid";
import { SceneManager } from "./lib/SceneManager";
import xwingUrl from "../assets/low_poly_x-wing/scene.gltf?url";
import xwingBufferUrl from "../assets/low_poly_x-wing/scene.bin?url";
import { Logger, LogLevel } from "./lib/Logger";

const logger = new Logger(LogLevel.Debug)
let sceneManager = new SceneManager({logger});

sceneManager.camera.translateY(5)

const grid = new InfiniteGrid({ color: new THREE.Color(0x990000), cellSize: .5, size: 1000, logger});
grid.animationManager.addProcedural("move", (delta) => {
  grid.scroll(delta, 16);
});
grid.animationManager.playAll();
sceneManager.register(grid);

// The glTF references scene.bin; Vite emits that buffer with a hashed filename.
const modelLoadingManager = new THREE.LoadingManager();
modelLoadingManager.setURLModifier((url) => url.endsWith("/scene.bin") ? xwingBufferUrl : url);
let gltf = await ManagedGltf.createFromFile(xwingUrl, modelLoadingManager, sceneManager.logger);
gltf.wireframe();

gltf.renderUnitVectors();
gltf.object.translateY(3).translateZ(-10);
// gltf.object.rotateY(Math.PI / 2);
// gltf.object.rotateZ(Math.PI / 4);
sceneManager.register(gltf);

// gltf.animationManager.addProcedural("spin", (delta) => {
//   gltf.object
//     .rotateX(delta)
//     .rotateY(delta / 2)
//     .rotateZ(delta / 4);
// });
gltf.object.rotateX(Math.PI/8);
gltf.object.rotateY(Math.PI);
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
