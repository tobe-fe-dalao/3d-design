import {
  AmbientLight,
  AnimationClip,
  Animator,
  AnimatorController,
  AnimatorControllerLayer,
  AnimatorLayerBlendingMode,
  AnimatorStateMachine,
  AssetType,
  BackgroundMode,
  BlinnPhongMaterial,
  Camera,
  Color,
  DirectLight,
  Entity,
  GLTFResource,
  MeshRenderer,
  PBRMaterial,
  PrimitiveMesh,
  RenderColorTexture,
  RenderTarget,
  Scene,
  SkyBoxMaterial,
  Texture2D,
  Vector3,
  WebGLEngine,
} from "oasis-engine";
import tinycolor from "tinycolor2";
import { IO } from "./utils/io";
import { Twinkle } from "./scripts/twinkle";
import { DEFAULT_IBLURL } from "../common/constants";
import { useStore } from "@/store";
import { Resize } from "./scripts/resize";
import { Picker } from "./scripts/picker";
import { CameraControl } from "./scripts/cameraControl";
import { MaterialPresetsManager } from "@/manager/MaterialPresetsManager";
import { Capture } from "./scripts/capture";

const store = useStore();

/**预置材质配置 */
const directivesMaterial = import.meta.globEager(
  "/public/models/material/*.json"
);
/**预置材质的预览图 */
const directivesMaterialPng = import.meta.globEager(
  "/public/models/material/*.png"
);

/**截图材质球时的建议相机位置 */
const suggestCamPosWhenCaptureMaterialBall = new Vector3(
  1.964221319575091,
  1.4529260900852612,
  1.138435273893277
);

export class GameManager {
  constructor() {}

  /**单例模式 */
  private static _ins: GameManager;
  public static get ins(): GameManager {
    if (!this._ins) {
      this._ins = new GameManager();
    }
    return this._ins;
  }

  /**编辑的模型 */
  public modelGltf!: GLTFResource;
  /** 编辑的模型 中的 渲染器数组 */
  public renderers_in_modelGltf: Array<MeshRenderer> = [];
  /** 正交相机控制器 */
  public controler?: CameraControl;
  /** 每个模型初始化的 controler.target */
  public initControlerTarget?: Vector3;

  /** 引擎 */
  public engine!: WebGLEngine;
  /** 相机 */
  public camera!: Camera;
  /** 根实体 */
  private rootEntity!: Entity;
  /** 模型实体 */
  private modelEntity!: Entity;
  /** 直射光 */
  public directLight?: DirectLight;

  /** 初始化的相机位置 */
  private initCameraPoi = new Vector3(2, 3, 10);

  /**
   * 初始化渲染引擎
   * @param {string} id canvas的id
   * @returns
   */
  public async createEngine(id: string) {
    this.engine = new WebGLEngine(id, undefined, {
      alpha: true,
      premultipliedAlpha: false,
    });

    const scene = this.engine.sceneManager.activeScene;
    this.rootEntity = scene.createRootEntity();

    // 背景
    await this.initBg(scene);

    /**添加画布尺寸适配 */
    this.rootEntity.addComponent(Resize).init(this.engine.canvas);

    // 创建模型实体
    this.modelEntity = this.rootEntity.createChild("modelEntity");

    // 初始化相机
    this.initCamera();

    // 初始化光照
    this.initLight(scene);

    // 添加拾取器
    this.rootEntity.addComponent(Picker).init({
      webCanvas: this.engine.canvas,
      camera: this.camera,
      onPick: this.onPickOnePart,
    });

    this.engine.run();

    return this.engine;
  }

  /**初始化背景 */
  async initBg(scene: Scene) {
    const { background } = scene;
    background.solidColor.setValue(0.45, 0.45, 0.45, 0);
    // 背景图填充模式 AspectFitWidth: 0, AspectFitHeight: 1, Fill: 2
    background.textureFillMode = 0;
    background.texture = await this.engine.resourceManager.load<Texture2D>(
      "imgs/bg.jpg"
    );
    return background;
  }

  /**初始化相机 */
  initCamera() {
    const cameraEntity = this.rootEntity.createChild("camera");
    this.camera = cameraEntity.addComponent(Camera);
    this.controler = cameraEntity.addComponent(CameraControl);

    const pos = cameraEntity.transform.position;
    pos.setValue(
      this.initCameraPoi.x,
      this.initCameraPoi.y,
      this.initCameraPoi.z
    );
    cameraEntity.transform.position = pos;
    cameraEntity.transform.lookAt(new Vector3(0, 0, 0));
  }

  /**初始化 光照 */
  initLight(scene: Scene) {
    scene.ambientLight.diffuseSolidColor.setValue(0, 0, 0, 0);
    scene.ambientLight.diffuseIntensity = 0;

    // 添加直射光
    const lightEntity = this.rootEntity.createChild("light");
    this.directLight = lightEntity.addComponent(DirectLight);
    this.directLight.color.setValue(1, 1, 1, 1);
    this.directLight.intensity = 0.8;

    lightEntity.transform.setRotation(-30, -30, 0);

    // Create sky
    const background = scene.background;
    const sky = background.sky;
    const skyMaterial = new SkyBoxMaterial(this.engine);
    background.mode = BackgroundMode.Texture;
    sky.material = skyMaterial;
    sky.mesh = PrimitiveMesh.createCuboid(this.engine, 1, 1, 1);

    this.setIBL(DEFAULT_IBLURL.url);
  }

  /**
   * 通过部件名寻找部件
   */
  findPartRendererByName(partName: string) {
    return this.renderers_in_modelGltf.find((i) => i.entity.name == partName);
  }

  /**
   * 修改某个部件的材质
   * @param {string} partName 部件名
   * @param {string} materialName 材质名
   */
  changePartMaterial(partName: string, materialName: string) {
    let newMaterial = MaterialPresetsManager.List.find(
      (i) => i.name == materialName
    )?.material;

    if (newMaterial) {
      this.changeRoughness(partName, newMaterial.roughness);
      this.changeMetallic(partName, newMaterial.metallic);
      this.changeIsTransparent(partName, newMaterial.isTransparent);
      this.changeOpacity(partName, newMaterial.baseColor.a);
      this.changePartEmissiveColor(partName, newMaterial.emissiveColor);
      this.changePartColor(partName, newMaterial.baseColor);
    }
  }

  /**
   * 修改某个部件的颜色
   */
  changePartColor(partName: string, color: Color | any) {
    let renderer = this.findPartRendererByName(partName);
    const material = renderer?.getInstanceMaterial() as PBRMaterial;
    if (color instanceof Color) {
      material.baseColor = color;
    } else {
      let rgb = tinycolor(color).toRgb();
      material.baseColor = new Color(
        rgb.r / 255,
        rgb.g / 255,
        rgb.b / 255,
        rgb.a
      );
    }
  }

  /**
   * 修改某个部件的 EmissiveColor 颜色
   */
  changePartEmissiveColor(partName: string, color: Color | any) {
    let renderer = this.findPartRendererByName(partName);

    const material = renderer?.getInstanceMaterial() as PBRMaterial;
    if (color instanceof Color) {
      material.emissiveColor = color;
    } else {
      let rgb = tinycolor(color).toRgb();
      material.emissiveColor = new Color(
        rgb.r / 255,
        rgb.g / 255,
        rgb.b / 255,
        rgb.a
      );
    }
  }

  /**
   * 修改某个部件的 Roughness
   */
  changeRoughness(partName: string, roughness: any) {
    let renderer = this.findPartRendererByName(partName);
    (renderer?.getInstanceMaterial() as PBRMaterial).roughness = roughness;
  }
  /**
   * 修改某个部件的 Metallic
   */
  changeMetallic(partName: string, value: number) {
    let renderer = this.findPartRendererByName(partName);
    (renderer?.getInstanceMaterial() as PBRMaterial).metallic = value;
  }
  /**
   * 修改某个部件的 IsTransparent
   */
  changeIsTransparent(partName: string, value: boolean) {
    let renderer = this.findPartRendererByName(partName);
    (renderer?.getInstanceMaterial() as PBRMaterial).isTransparent = value;
  }
  /**
   * 调整透明度 其实就是调baseColor 的alpha
   */
  changeOpacity(partName: string, value: any) {
    let renderer = this.findPartRendererByName(partName);
    (renderer?.getInstanceMaterial() as PBRMaterial).baseColor.a = value;
  }

  /**
   * 切换是否显示hdr背景
   */
  toggleBackground(show: boolean) {
    this.engine.sceneManager.activeScene.background.mode = show
      ? BackgroundMode.Sky
      : BackgroundMode.Texture;
  }
  /**
   * 调整直射光强度
   * @param value
   */
  changeDirectLightIntensity(value: number) {
    let arr: DirectLight[] = [];
    this.engine.sceneManager.activeScene
      .getRootEntity()
      ?.getComponentsIncludeChildren(DirectLight, arr);
    arr[0].intensity = value;
  }
  /**
   * 调整直射光颜色
   * @param color
   */
  changeDirectLightColor(color: any) {
    let arr: DirectLight[] = [];
    this.engine.sceneManager.activeScene
      .getRootEntity()
      ?.getComponentsIncludeChildren(DirectLight, arr);
    let rgb = tinycolor(color).toRgb();
    arr[0].color.setValue(rgb.r / 255, rgb.g / 255, rgb.b / 255, rgb.a);
  }

  /**
   * 更换编辑的模型
   */
  async loadModel(url: string) {
    // store.toggleLoading(true);

    // 加载模型
    // TODO 如果glb文件地址加上?参数，加载会报错。 提issue

    if (typeof url === "string" && url.endsWith(".gltf")) {
      url += `?${Math.random()}`;
    }
    this.modelGltf = await this.engine.resourceManager.load<GLTFResource>(url);
    await this.handleGltfResource(this.modelGltf);
  }

  async handleGltfResource(asset: GLTFResource) {
    this.renderers_in_modelGltf = new Array<MeshRenderer>();
    asset.defaultSceneRoot.getComponentsIncludeChildren(
      MeshRenderer,
      this.renderers_in_modelGltf
    );

    this.controler?.setTargetCenter(asset.defaultSceneRoot);

    // 过滤替换材质
    this.checkMaterials();

    // 播放模型中的动画
    this.playAnimation();

    // 移除老模型
    this.modelEntity.clearChildren();
    this.modelEntity.addChild(asset.defaultSceneRoot);

    store.toggleLoading(false);
  }

  /**过滤替换材质 */
  checkMaterials() {
    this.renderers_in_modelGltf.forEach(async (i) => {
      if (i.getMaterial() instanceof BlinnPhongMaterial) {
        // 如果是 BlinnPhongMaterial 材质，则替换为PBR材质
        let pbr = new PBRMaterial(this.engine);
        pbr.roughness = 0;
        pbr.metallic = 0;
        i.setMaterial(pbr);
      } else if (i.getMaterial() instanceof PBRMaterial) {
        // 将PRR材质的色彩变为gamma色彩空间
        let material = i.getInstanceMaterial() as PBRMaterial;
        let gammaC = new Color();
        gammaC.a = material.baseColor.a;
        material.baseColor.toGamma(gammaC);
        material.baseColor = gammaC;
      }
    });
  }

  /**播放模型动画 */
  playAnimation() {
    let { animations } = this.modelGltf;
    if (animations && animations.length > 0) {
      const animator = this.modelGltf?.defaultSceneRoot.getComponent(Animator);
      const animatorController = new AnimatorController();
      animations?.forEach((clip: AnimationClip, index) => {
        const layer = new AnimatorControllerLayer("layer" + index);
        const animatorStateMachine = new AnimatorStateMachine();
        animatorController.addLayer(layer);
        layer.stateMachine = animatorStateMachine;
        if (index > 0) layer.blendingMode = AnimatorLayerBlendingMode.Additive;
        const animatorState = animatorStateMachine.addState(clip.name);
        animatorState.clip = clip;
        if (index > 0) animatorState.clipStartTime = 1;
      });
      animator.animatorController = animatorController;
      animator.speed = 1;
      animations?.forEach((clip: AnimationClip, index) => {
        index == 0 && animator.play(clip.name, index);
      });
    }
  }

  /**销毁模型 */
  destroyGLTF() {
    this.modelEntity.getChild(0)?.destroy();
  }

  /**当点击中一个部件 */
  onPickOnePart = (obj: { component: MeshRenderer; mesh?: any }) => {
    if (obj) {
      const { component, mesh } = obj;
      (
        component.entity.getComponent(Twinkle) ||
        component.entity.addComponent(Twinkle)
      ).start();
      this.engine.dispatch(IO.PICK_PART, {
        name: component.entity.name,
        index: this.renderers_in_modelGltf.indexOf(component),
      });
    }
  };

  /**
   * 更换IBL
   * @param url 环境图地址
   */
  async setIBL(url: string) {
    const scene = this.engine.sceneManager.activeScene;
    let ambientLight = await this.engine.resourceManager.load<AmbientLight>({
      type: AssetType.Env,
      url,
    });
    scene.ambientLight = ambientLight;
    ambientLight.diffuseIntensity = 1;
    const skyBoxMaterial = scene.background.sky.material as SkyBoxMaterial;
    skyBoxMaterial.textureCubeMap = ambientLight.specularTexture;
    skyBoxMaterial.textureDecodeRGBM = true;
  }

  /**
   * @description 截图方法
   * @param {number} width 生成的图片的宽 1-2048
   * @param height 生成的图片的高 1-2048
   * @param isPNG 是否导出png。true：png。false: jpg
   * @param jpgQuality 导出jpg格式时的图片质量。0-1
   */
  screenshot(width: number, height: number, isPNG = true, jpgQuality = 1) {
    const capture =
      this.rootEntity.getComponent(Capture) ||
      this.rootEntity.addComponent(Capture).init(this.camera);
    capture.screenshot(width, height, isPNG, jpgQuality);
  }

  /**
   * 重置视角
   */
  resetCamera() {
    this.controler?.setTargetCenter(this.modelGltf.defaultSceneRoot);
  }
}
