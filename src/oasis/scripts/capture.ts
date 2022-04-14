import { FramebufferPicker } from "@oasis-engine/framebuffer-picker";
import {
  BackgroundMode,
  Camera,
  Entity,
  RenderColorTexture,
  RenderTarget,
  Script,
  WebCanvas,
} from "oasis-engine";

/** 截图器 */
export class Capture extends Script {
  camera?: Camera;

  /**截图 */
  screenshotCanvas!: HTMLCanvasElement;
  flipYCanvas!: HTMLCanvasElement;

  constructor(entity: Entity) {
    super(entity);
  }

  init(camera: Camera) {
    this.camera = camera;
    return this
  }

  /**
   * @description 截图方法
   * @param {number} width 生成的图片的宽 1-2048
   * @param height 生成的图片的高 1-2048
   * @param isPNG 是否导出png。true：png。false: jpg
   * @param jpgQuality 导出jpg格式时的图片质量。0-1
   */
  screenshot(width: number, height: number, isPNG = true, jpgQuality = 1) {
    if (!this.camera) return;

    if (!this.screenshotCanvas) {
      this.screenshotCanvas = document.createElement("canvas");
    }
    let canvas = this.screenshotCanvas;

    this.screenshotCanvas.width = width;
    this.screenshotCanvas.height = height;

    const context = this.screenshotCanvas.getContext(
      "2d"
    ) as CanvasRenderingContext2D;
    let { background } = this.engine.sceneManager.activeScene;

    const isPaused = this.engine.isPaused;
    /**记录截图前的背景模式 */
    const beforeBackgroundMode = background.mode;

    /**将背景模式改为solidcolor 以便截取透明背景 */
    background.mode = BackgroundMode.SolidColor;
    this.engine.pause();

    const originalTarget = this.camera.renderTarget;
    const renderColorTexture = new RenderColorTexture(
      this.engine,
      width,
      height
    );
    const renderTargetData = new Uint8Array(width * height * 4);
    const renderTarget = new RenderTarget(
      this.engine,
      width,
      height,
      renderColorTexture,
      undefined,
      8
    );

    // render to off-screen
    this.camera.renderTarget = renderTarget;
    this.camera.aspectRatio = width / height;
    this.camera.render();

    renderColorTexture.getPixelBuffer(
      null,
      0,
      0,
      width,
      height,
      0,
      renderTargetData
    );

    const imageData = context.createImageData(width, height);
    imageData.data.set(renderTargetData);
    context.putImageData(imageData, 0, 0);

    if (!this.flipYCanvas) {
      this.flipYCanvas = document.createElement("canvas");
    }
    canvas = this.flipYCanvas;

    this.flipYCanvas.width = width;
    this.flipYCanvas.height = height;

    const ctx2 = this.flipYCanvas.getContext("2d") as CanvasRenderingContext2D;

    ctx2.translate(0, height);
    ctx2.scale(1, -1);
    ctx2.drawImage(this.screenshotCanvas, 0, 0);

    // download
    canvas.toBlob(
      (blob) => {
        if (!this.camera) return;
        const url = window.URL.createObjectURL(blob as Blob);
        const a = document.createElement("a");

        document.body.appendChild(a);
        a.style.display = "none";
        a.href = url;
        a.download = "screenshot";

        a.addEventListener("click", () => {
          if (a.parentElement) {
            a.parentElement.removeChild(a);
          }
        });

        a.click();

        window.URL.revokeObjectURL(url);

        // revert
        this.camera.renderTarget = originalTarget;
        this.camera.resetAspectRatio();
        !isPaused && this.engine.resume();
        background.mode = beforeBackgroundMode;
      },
      isPNG ? "image/png" : "image/jpeg",
      !isPNG && jpgQuality
    );
  }
}
