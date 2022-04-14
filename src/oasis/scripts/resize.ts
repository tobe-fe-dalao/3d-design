import { debounce } from "@/utils/utils";
import { Entity, Script, WebCanvas } from "oasis-engine";

/** 画布尺寸适配 */
export class Resize extends Script {
  constructor(entity: Entity) {
    super(entity);
  }


  public init(webCanvas: WebCanvas){
    
    webCanvas.resizeByClientSize();

    // 监听尺寸变化 调整画布大小
    const resizeObserver = new ResizeObserver(debounce(() => {
        webCanvas.resizeByClientSize();
    }, 10));
    resizeObserver.observe(webCanvas._webCanvas);
  }
  
}