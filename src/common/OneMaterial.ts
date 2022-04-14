import { GameManager } from "@/oasis";
import { PBRMaterial, Texture2D } from "oasis-engine";
import tinycolor from "tinycolor2";
import { ColorFormats } from "tinycolor2";

/**
 * 编辑器中用的材质类型
 *
 */
export class OneMaterial {
  constructor(info?: PBRMaterial | Partial<OneMaterial>) {
    this.name = info?.name || "";
    this.metallic = info?.metallic || 0;
    this.roughness = info?.roughness || 0;
    this.isTransparent = !!info?.isTransparent;

    this.normalTextureIntensity = info?.normalTextureIntensity || 0.5;
    this.baseTexture = info?.baseTexture;
    this.emissiveTexture = info?.emissiveTexture;
    this.normalTexture = info?.normalTexture;
    this.occlusionTexture = info?.occlusionTexture;
    this.roughnessMetallicTexture = info?.roughnessMetallicTexture;

    const createTinyColorFun =
      info instanceof PBRMaterial ? tinycolor.fromRatio : tinycolor;
    this.baseColor = createTinyColorFun(
      info?.baseColor || { r: 1, g: 1, b: 1, a: 1 }
    ).toRgb();
    this.emissiveColor = createTinyColorFun(
      info?.emissiveColor || { r: 1, g: 1, b: 1, a: 1 }
    ).toRgb();

    this.opacity = this.baseColor.a;
  }

  name: string; // 材质名
  baseColor: ColorFormats.RGBA;
  emissiveColor: ColorFormats.RGBA;
  metallic: number;
  roughness: number;
  isTransparent: boolean;
  opacity: number; // baseColor的alpha值，0-1

  /**
   * PBRMaterial 支持的纹理
   * https://oasisengine.cn/0.6/docs/material-cn
   */
  /**基础颜色纹理。搭配基础颜色使用，是个相乘的关系。 */
  baseTexture: Texture2D | undefined;
  /**法线纹理。可以设置法线纹理 ，在视觉上造成一种凹凸感，还可以通过法线强度来控制凹凸程度。*/
  normalTexture: Texture2D | undefined;
  normalTextureIntensity: number | undefined;
  /**自发射光纹理。我们可以设置自发光纹理和自发光颜色（emissiveFactor）达到自发光的效果，即使没有光照也能渲染出颜色。 */
  emissiveTexture: Texture2D | undefined;
  /**阴影遮蔽纹理。我们可以设置阴影遮蔽纹理来提升物体的阴影细节。 */
  occlusionTexture: Texture2D | undefined;
  /**金属粗糙度纹理。搭配金属粗糙度使用，是相乘的关系。 */
  roughnessMetallicTexture: Texture2D | undefined;

  /**
   * 修改颜色
   * @param color {any} 颜色值
   */
  changeColor(color: any) {
    this.baseColor = color;
  }

  /**
   * 更换材质
   */
  changeMaterial(material: PBRMaterial | Partial<OneMaterial>) {
    const createTinyColorFun =
      material instanceof PBRMaterial ? tinycolor.fromRatio : tinycolor;
    this.name = material?.name || "";
    this.baseColor = createTinyColorFun(
      material?.baseColor || { r: 1, g: 1, b: 1, a: 1 }
    ).toRgb();
    this.opacity = this.baseColor.a;
    this.emissiveColor = createTinyColorFun(
      material?.emissiveColor || { r: 1, g: 1, b: 1, a: 1 }
    ).toRgb();
    this.metallic = material?.metallic || 0;
    this.roughness = material?.roughness || 0;
    this.isTransparent = !!material?.isTransparent;
  }
}
