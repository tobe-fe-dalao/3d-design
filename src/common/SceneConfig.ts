import { GameManager } from "@/oasis";
import { DEFAULT_IBLURL } from "@/common/constants";
import { Vector3 } from "oasis-engine";

/** 默认配置 */
const DefaultConfig = {
  background: { show: false },
  light: {
    IBLUrl: DEFAULT_IBLURL.url,
    direct: { color: { r: 255, g: 255, b: 255, a: 1 }, intensity: 0.8 },
  },
  cameraConfig: {
    position: new Vector3(),
    controlerTarget: new Vector3()
  }
}
/**
 * 编辑器中的 场景配置数据类
 */
export class SceneConfig {
  constructor(
    config: typeof DefaultConfig = DefaultConfig
  ) {
    this.background = config.background
    this.light = config.light
    this.cameraConfig = config.cameraConfig
  }

  /**背景设置 */
  background = {
    /**是否展示IBL背景图 */
    show: false
  };

  /**光照设置 */
  light: {
    /** 环境光图 */
    IBLUrl: string;
    /** 直射光设置 */
    direct: {
      /**直射光颜色 */
      color: { r: number; g: number; b: number; a: number };
      /**直射光强度 */
      intensity: number;
    };
  };

  cameraConfig: {
    position: Vector3;
    controlerTarget: Vector3;
  };

  /**
   * 隐藏或显示环境光图
   * @param value 
   */
  toggleBackground(value: boolean) {
    this.background.show = value;
    GameManager.ins.toggleBackground(value);
  }

  /**
   * 修改直射光 强度
   * @param value 0-1
   */
  changeDirectLightIntensity(value: number) {
    this.light.direct.intensity = value;
    GameManager.ins.changeDirectLightIntensity(value);
  }

  /**
   * 修改直射光颜色
   * @param color 
   */
  changeDirectLightColor(color: any) {
    this.light.direct.color = color;
    GameManager.ins.changeDirectLightColor(color);
  }

  /**
   * 更换IBL环境图
   * @param url 
   * @returns 
   */
  setIBL(url: string) {
    if (!url) return;
    this.light.IBLUrl = url;
    GameManager.ins.setIBL(url);
  }

  /**
   * 加载 scene 配置数据
   * @param config 
   */
  loadSceneConfig(config: SceneConfig) {
    this.toggleBackground(config.background.show);
    this.changeDirectLightColor(config.light.direct.color);
    this.changeDirectLightIntensity(config.light.direct.intensity);
    this.setIBL(config.light.IBLUrl);
    if (config.cameraConfig) {
      const { x, y, z } = config.cameraConfig.position;
      GameManager.ins.camera.entity.transform.setPosition(x, y, z);
    }
  }
}
