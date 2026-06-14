import * as THREE from "three";

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

  constructor(name: string, action: THREE.AnimationAction) {
    this.name = name;
    this.action = action;
  }

  play(): void {
    this.action.reset().play();
  }

  pause(): void {
    this.action.paused = true;
  }

  stop(): void {
    this.action.stop();
  }

  resume(): void {
    this.action.paused = false;
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
  private running = false;
  private paused = false;

  constructor(name: string, fn: (delta: number) => void) {
    this.name = name;
    this.fn = fn;
  }

  update(delta: number): void {
    if (this.running && !this.paused) {
      this.fn(delta);
    }
  }

  play(): void {
    this.running = true;
    this.paused = false;
  }

  pause(): void {
    this.paused = true;
  }

  stop(): void {
    this.running = false;
    this.paused = false;
  }

  resume(): void {
    this.play();
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

  constructor(root: THREE.Object3D) {
    this.mixer = new THREE.AnimationMixer(root);
  }

  get needsUpdate(): boolean {
    return this.animations.size > 0;
  }

  get names(): string[] {
    return [...this.animations.keys()];
  }

  get(name: string): ManagedAnimation | undefined {
    return this.animations.get(name);
  }

  has(name: string): boolean {
    return this.animations.has(name);
  }

  addClip(clip: THREE.AnimationClip): ManagedAnimation {
    if (this.animations.has(clip.name)) {
      throw new Error(`Animation "${clip.name}" is already registered.`);
    }
    const action = this.mixer.clipAction(clip);
    const managedAnimation = new ClipAnimation(clip.name, action);
    this.animations.set(clip.name, managedAnimation);
    return managedAnimation;
  }

  addProcedural(name: string, fn: (delta: number) => void): ManagedAnimation {
    if (this.animations.has(name)) {
      throw new Error(`Animation "${name}" is already registered.`);
    }

    const managedAnimation = new ProceduralAnimation(name, fn);
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

  remove(name: string): void {
    this.animations.get(name)?.stop();
    this.animations.delete(name);
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
    for (const name of names) {this.animations.get(name).play();}
  }

  playAll(): void {
    for (const animation of this.animations.values()) {
      animation.play();
    }
  }

  pause(...names: string[]): void {
    for (const name of names) {this.animations.get(name).pause();}
  }

  pauseAll(): void {
    for (const animation of this.animations.values()) {
      animation.pause();
    }
  }

  resume(...names: string[]){
    for(const name of names){
      this.animations.get(name).resume();
    }
  }

  resumeAll(): void {
    for (const animation of this.animations.values()) {
      animation.resume();
    }
  }

  stop(...names: string[]): void {
    for (const name of names) {this.animations.get(name).stop();}
  }

  stopAll(): void {
    for (const animation of this.animations.values()) {
      animation.stop();
    }
  }
}
