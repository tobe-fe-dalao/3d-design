import { FramebufferPicker } from "@oasis-engine/framebuffer-picker";
import { Camera, Entity, Script, WebCanvas } from "oasis-engine";

interface Params {
  webCanvas: WebCanvas;
  camera: Camera;
  onPick: Function;
}

/** 拾取器 */
export class Picker extends Script {
  constructor(entity: Entity) {
    super(entity);
  }

  public init({ webCanvas, camera, onPick }: Params) {
    /**添加 FramebufferPicker 实现精准拾取 */
    const framebufferPicker: FramebufferPicker =
      this.entity.addComponent(FramebufferPicker);
    framebufferPicker.camera = camera;
    framebufferPicker.onPick = onPick;

    webCanvas._webCanvas.addEventListener("mousedown", (e: MouseEvent) =>
      framebufferPicker.pick(e.offsetX, e.offsetY)
    );
  }
}
