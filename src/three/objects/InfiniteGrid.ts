import * as THREE from "three";
import { ManagedObject3D } from "../lib/ManagedObject3D";
import type { Logger } from "../lib/Logger";

export interface InfiniteGridOptions {
  color?: THREE.Color;
  cellSize?: number;
  size?: number;
  fadeNear?: number;
  fadeFar?: number;
  logger?: Logger;
}

const vertexShader = /* glsl */ `
  varying vec3 vWorldPosition;
  varying vec2 vGridPosition;

  void main() {
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    vGridPosition = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uCellSize;
  uniform float uOffset;
  uniform float uFadeNear;
  uniform float uFadeFar;

  varying vec3 vWorldPosition;
  varying vec2 vGridPosition;

  float gridLine(vec2 coord) {
    vec2 f = abs(fract(coord - 0.5) - 0.5);
    vec2 fw = fwidth(coord);
    vec2 g = f / fw;
    return 1.0 - min(min(g.x, g.y), 1.0);
  }

  void main() {
    // Use the plane's local XY coordinates so the pattern follows its transform.
    vec2 coord = (vGridPosition + vec2(0.0, uOffset)) / uCellSize;

    float line = gridLine(coord);

    float dist = length(vWorldPosition - cameraPosition);
    float fade = 1.0 - smoothstep(uFadeNear, uFadeFar, dist);
    float alpha = line * fade;

    if (alpha < 0.01) discard;

    gl_FragColor = vec4(uColor, alpha);
  }
`;

export class InfiniteGrid extends ManagedObject3D {
  private readonly material: THREE.ShaderMaterial;
  private readonly cellSize: number;
  private scrollOffset = 0;

  constructor(options: InfiniteGridOptions = {}) {
    const color = options.color ?? new THREE.Color(0x990000);
    const cellSize = options.cellSize ?? 2;
    const size = options.size ?? 1000;
    const fadeNear = options.fadeNear ?? 150;
    const fadeFar = options.fadeFar ?? 500;

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: {
        uColor: { value: color },
        uCellSize: { value: cellSize },
        uOffset: { value: 0 },
        uFadeNear: { value: fadeNear },
        uFadeFar: { value: fadeFar },
      },
      vertexShader,
      fragmentShader,
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(size, size), material);
    mesh.rotateX(-Math.PI / 2);
    super(mesh, options.logger);

    this.material = material;
    this.cellSize = cellSize;
  }

  scroll(delta: number, speed: number): void {
    this.scrollOffset = (this.scrollOffset + speed * delta) % this.cellSize;
    this.material.uniforms.uOffset.value = this.scrollOffset;
  }
}
