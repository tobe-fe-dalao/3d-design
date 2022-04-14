import { SceneConfig } from "@/common/SceneConfig";
import { OnePart } from "./OnePart";
/**
 * 模型所有配置的数据类型
 */
export interface ModelConfigJsonType {
  sceneConfig: SceneConfig;
  materialsConfig: OnePart[];
}
