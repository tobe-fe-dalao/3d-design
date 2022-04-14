import { OneMaterial } from "@/common/OneMaterial";

const materialPngs = import.meta.globEager<{ default: string }>(
  "/public/models/material/*.png"
);
const materialPresets = import.meta.globEager<{
  default: Partial<OneMaterial>;
}>("/public/models/material/*.json");

/**
 * 本地模型文件类型
 */
export interface MaterialPresetType {
  name: string;
  /**图片路径 */
  img: string | null;
  material: OneMaterial
}

/**
 * public目录下的 材质预设管理类
 */
export class MaterialPresetsManager {
  static List: MaterialPresetType[] = []
}

for (let x in materialPresets) {
  const material = new OneMaterial(materialPresets[x].default)
  MaterialPresetsManager.List.push({
    name: material.name,
    img:
      Object.keys(materialPngs)
        .find((i) => i.includes(x.slice(0, x.lastIndexOf("."))))
        ?.replace("/public", ".") || null,
    material
  });
}