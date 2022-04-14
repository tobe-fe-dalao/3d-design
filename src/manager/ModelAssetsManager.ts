import { ModelConfigJsonType } from "@/common/interface";

const modelFiles = import.meta.globEager<{ default: string }>(
  "/public/models/list/*.gl*"
);
const modelPngs = import.meta.globEager<{ default: string }>(
  "/public/models/list/*.png"
);
const modelDefaultConfigJSONs = import.meta.globEager<{
  default: ModelConfigJsonType;
}>("/public/models/list/*.json");

/**
 * 本地模型文件类型
 */
export interface LocalModelType {
  /**以文件名作为模型名 */
  name: string;
  /**文件路径 */
  path: string;
  /**图片路径 */
  img: string | null;
  /**默认配置路径 */
  defaultConfig: ModelConfigJsonType | null;
}

/**
 * public目录下的模型静态资源管理类
 */
export class ModelAssetsManager {
  /**
   *
   */
  static ModelList: LocalModelType[] = [];
}

for (let x in modelFiles) {
  ModelAssetsManager.ModelList.push({
    name: x.slice(x.lastIndexOf("/") + 1, x.lastIndexOf(".")),
    path: x.replace("/public", "."),
    img:
      Object.keys(modelPngs)
        .find((i) => i.includes(x.slice(0, x.lastIndexOf("."))))
        ?.replace("/public", ".") || null,
    defaultConfig:
      modelDefaultConfigJSONs[
        Object.keys(modelDefaultConfigJSONs).find((i) =>
          i.includes(x.slice(0, x.lastIndexOf(".")))
        ) || ""
      ]?.default || null,
  });
}