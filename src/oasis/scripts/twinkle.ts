import { Entity, MeshRenderer, PBRMaterial, Script } from "oasis-engine";
import * as TWEEN from "@tweenjs/tween.js";

/** 闪烁效果 */
export class Twinkle extends Script {
  constructor(entity: Entity) {
    super(entity);
  }

  onStart(): void {
    super.onStart();
  }

  /**是否正在动画中 */
  private isTweening = false;
  start() {
    if (this.isTweening) return;

    let meshRenderer = this.entity.getComponent(MeshRenderer);
    let material = meshRenderer.getInstanceMaterial() as PBRMaterial;
    let originAlpha = material.baseColor.a;

    this.isTweening = true;
    new TWEEN.Tween({ a: originAlpha })
      .to({ a: Math.max(originAlpha - 0.5) }, 280)
      .onUpdate(({ a }) => {
        material.baseColor.a = a;
      })
      .repeat(3)
      .yoyo(true)
      .onComplete(() => (this.isTweening = false))
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .start();
  }

  onUpdate(deltaTime: number): void {
    TWEEN.update();
  }
}
