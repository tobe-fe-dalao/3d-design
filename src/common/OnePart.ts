import { GameManager } from "@/oasis";
import { MeshRenderer, PBRMaterial } from "oasis-engine";
import tinycolor, { ColorFormats } from "tinycolor2";
import { OneMaterial } from "./OneMaterial";
import { TextureManager } from "@/manager/TextureManager";
import { MaterialPresetsManager } from "@/manager/MaterialPresetsManager";

/**
 * 编辑器中用的 部件类
 */
export class OnePart {
  constructor(renderer: MeshRenderer) {
    this.renderer = renderer;
    this.name = renderer.entity.name;
    this.material = new OneMaterial(renderer.getInstanceMaterial() as PBRMaterial);
  }

  /** 部件名称 */
  name: string;

  /**此部件对应的渲染器 */
  renderer?: MeshRenderer;

  material: OneMaterial;

  /**
   * 更换材质
   * @param name {string} 材质名
   */
  changeMaterial(name: string) {
    let material = MaterialPresetsManager.List.find(
      (i) => i.name == name
    )?.material;
    if (material) {
      // 更新此实例中的材质数据
      this.material.changeMaterial(material);
  
      // 更新引擎模型视图数据
      GameManager.ins.changePartMaterial(this.name, name);
    }
  }

  /**
   * 加载材质配置
   * @param {OneMaterial} config 材质配置
   */
  loadMaterialConfig(config: OneMaterial) {
    this.material.name = config.name;
    this.changeMetallic(config.metallic);
    this.changeRoughness(config.roughness);
    this.changeOpacity(config.opacity);
    this.changeColor(config.baseColor);
    this.changeEmissiveColor(config.emissiveColor);
    this.changeIsTransparent(config.isTransparent);
  }

  /**
   * 修改颜色
   * @param color 颜色值
   */
  changeColor(color: ColorFormats.RGBA) {
    this.material.baseColor = color;

    GameManager.ins.changePartColor(this.name, color);
  }

  /**
   * 修改 EmissiveColor 颜色
   * @param color 颜色值
   */
  changeEmissiveColor(color: ColorFormats.RGBA) {
    this.material.emissiveColor = color;

    GameManager.ins.changePartEmissiveColor(this.name, color);
  }

  /**
   * 修改 roughness
   * @param {number} value
   */
  changeRoughness(value: number) {
    this.material.roughness = value;
    GameManager.ins.changeRoughness(this.name, value);
  }
  /**
   * 修改 Metallic
   * @param {number} value
   */
  changeMetallic(value: number) {
    this.material.metallic = value;
    GameManager.ins.changeMetallic(this.name, value);
  }
  /**
   * 修改 IsTransparent
   * @param {boolean} value
   */
  changeIsTransparent(value: boolean) {
    this.material.isTransparent = value;
    GameManager.ins.changeIsTransparent(this.name, value);
  }
  /**
   * 修改 Opacity
   * @param {boolean} value
   */
  changeOpacity(value: number) {
    this.material.opacity = value;
    let color = tinycolor(this.material.baseColor).toRgb();
    color.a = value;
    this.material.baseColor = color;
    GameManager.ins.changeOpacity(this.name, value);
  }

  /**
   * 修改部件的材质纹理
   * @param textureName 纹理名称
   * @param textureType 纹理的类型 'baseTexture'| 'normalTexture'| 'emissiveTexture'| 'occlusionTexture'| 'roughnessMetallicTexture'
   */
  async changeTexture(textureName: string, textureType: string) {
    let texture = TextureManager.defaultTextures[textureName];
    if (!texture.texture) {
      console.log("texture.path", texture.path);
      texture.texture = await GameManager.ins.engine.resourceManager.load(
        texture.path
      );
    }
    // 有可能加载纹理失败，所以还是要判断纹理是否存在
    if (texture.texture) {
      let material_in_engine = this.renderer?.getInstanceMaterial() as PBRMaterial;

      console.log("material_in_engine", material_in_engine);
      console.log("textureType", textureType);
      console.log("texture.texture", texture.texture);
      material_in_engine[textureType] = texture.texture;
      this.material[textureType] = texture.texture;
    }
  }

  /**
   * 修改 normalTexture 纹理的 程度
   */
  changeNormalTextureIntensity(value: number) {
    this.material.normalTextureIntensity = value;
    (this.renderer?.getInstanceMaterial() as PBRMaterial).normalTextureIntensity =
      value;
  }
}
