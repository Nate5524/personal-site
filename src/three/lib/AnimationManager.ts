import * as THREE from "three";
import type { Logger } from "./Logger";

export interface ManagedAnimation {
  readonly name: string;
  play(): void;
  pause(): void;
  stop(): void;
  resume(): void;
  readonly isPlaying: boolean;
  readonly isPaused: boolean;
}

class ClipAnimation implements ManagedAnimation {
  readonly name: string;
  private readonly action: THREE.AnimationAction;
  readonly logger: Logger | undefined;

  constructor(name: string, action: THREE.AnimationAction, logger?: Logger) {
    this.name = name;
    this.action = action;
    this.logger = logger;
  }

  play(): void {
    this.action.reset().play();
    this.logger?.debug(`Played ClipAnimation ${this.name}`);
  }

  pause(): void {
    this.action.paused = true;
    this.logger?.debug(`Paused ClipAnimation ${this.name}`);
  }

  stop(): void {
    this.action.stop();
    this.logger?.debug(`Stopped ClipAnimation ${this.name}`);
  }

  resume(): void {
    this.action.paused = false;
    this.logger?.debug(`Resumed ClipAnimation ${this.name}`);
  }

  get isPlaying(): boolean {
    return this.action.isRunning();
  }

  get isPaused(): boolean {
    return this.action.paused;
  }
}

class ProceduralAnimation implements ManagedAnimation {
  readonly name: string;
  private readonly fn: (delta: number) => void;
  readonly logger: Logger | undefined;
  private running = false;
  private paused = false;

  constructor(name: string, fn: (delta: number) => void, logger?: Logger) {
    this.name = name;
    this.fn = fn;
    this.logger = logger;
  }

  update(delta: number): void {
    if (this.running && !this.paused) {
      this.fn(delta);
    }
    this.logger?.debug(`Updated ProceduralAnimation ${this.name}`);
  }

  play(): void {
    this.running = true;
    this.paused = false;
    this.logger?.debug(`Played ProceduralAnimation ${this.name}`);
  }

  pause(): void {
    this.paused = true;
    this.logger?.debug(`Paused ProceduralAnimation ${this.name}`);
  }

  stop(): void {
    this.running = false;
    this.paused = false;
    this.logger?.debug(`Stopped ProceduralAnimation ${this.name}`);
  }

  resume(): void {
    this.play();
    this.logger?.debug(`Resumed ProceduralAnimation ${this.name}`);
  }

  get isPlaying(): boolean {
    return this.running && !this.paused;
  }

  get isPaused(): boolean {
    return this.paused;
  }
}

export class AnimationManager {
  private readonly animations = new Map<string, ManagedAnimation>();
  private readonly mixer: THREE.AnimationMixer;
  readonly logger: Logger | undefined;

  constructor(root: THREE.Object3D, logger?: Logger) {
    this.mixer = new THREE.AnimationMixer(root);
    this.logger = logger;
  }

  get needsUpdate(): boolean {
    return this.animations.size > 0;
  }

  get names(): string[] {
    return [...this.animations.keys()];
  }

  get(name: string): ManagedAnimation | undefined {
    const animation = this.animations.get(name);
    if (!animation) {
      this.logger?.warn(`ManagedAnimation with name ${name} does not exist in this manager.`);
    }
    return animation;
  }

  getAll(): Iterator<ManagedAnimation> {
    return this.animations.values();
  }

  has(name: string): boolean {
    return this.animations.has(name);
  }

  addClip(clip: THREE.AnimationClip, logger: Logger | undefined = this.logger): ManagedAnimation {
    if (this.animations.has(clip.name)) {
      throw new Error(`Animation "${clip.name}" is already registered.`);
    }
    const action = this.mixer.clipAction(clip);
    const managedAnimation = new ClipAnimation(clip.name, action, logger);
    this.animations.set(clip.name, managedAnimation);
    return managedAnimation;
  }

  addProcedural(name: string, fn: (delta: number) => void, logger: Logger | undefined = this.logger): ManagedAnimation {
    if (this.animations.has(name)) {
      throw new Error(`Animation "${name}" is already registered.`);
    }

    const managedAnimation = new ProceduralAnimation(name, fn, logger);
    this.animations.set(name, managedAnimation);
    return managedAnimation;
  }

  add(...animation: ManagedAnimation[]): void {
    for (const a of animation) {
      this.animations.set(a.name, a);
      if (a instanceof ClipAnimation) {
      }
    }
  }

  remove(...names: string[]): void {
    for (const name of names) {
      this.get(name)?.stop();
      this.animations.delete(name);
    }
  }

  update(delta: number): void {
    this.mixer.update(delta);

    for (const animation of this.animations.values()) {
      if (animation instanceof ProceduralAnimation) {
        animation.update(delta);
      }
    }
  }

  play(...names: string[]): void {
    for (const name of names) {
      this.get(name)?.play();
    }
  }

  playAll(): void {
    for (const animation of this.animations.values()) {
      animation.play();
    }
  }

  pause(...names: string[]): void {
    for (const name of names) {
      this.get(name)?.pause();
    }
  }

  pauseAll(): void {
    for (const animation of this.animations.values()) {
      animation.pause();
    }
  }

  resume(...names: string[]) {
    for (const name of names) {
      this.get(name)?.resume();
    }
  }

  resumeAll(): void {
    for (const animation of this.animations.values()) {
      animation.resume();
    }
  }

  stop(...names: string[]): void {
    for (const name of names) {
      this.get(name)?.stop();
    }
  }

  stopAll(): void {
    for (const animation of this.animations.values()) {
      animation.stop();
    }
  }
}
