/**
 * 跟 @/components/ModelPreview/preview/index.ts 中的代码保持一致
 */
export let code = `import {
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
  BoundingBox,
  Camera,
  Color,
  DirectLight,
  Entity,
  GLTFResource,
  MeshRenderer,
  PBRMaterial,
  PrimitiveMesh,
  Renderer,
  Script,
  SkinnedMeshRenderer,
  SkyBoxMaterial,
  Vector3,
  WebGLEngine,
} from "oasis-engine";
import { OrbitControl } from "@oasis-engine/controls";
import tinycolor from "tinycolor2";
import * as TWEEN from "@tweenjs/tween.js";
import { FramebufferPicker } from "@oasis-engine/framebuffer-picker";
import { SceneConfig } from "@/common/SceneConfig";
// import { AxesHelper } from '@/oasis/utils/AxesHelper'

let canvasHalfX: number;
let canvasHalfY: number;
let canvasDomId = "";
let modelGltf: GLTFResource;

export class PreviewManager {
  private static _ins: PreviewManager;
  public static get ins(): PreviewManager {
    if (!this._ins) {
      this._ins = new PreviewManager();
    }
    return this._ins;
  }

  /**编辑的模型 */
  public modelGltf!: GLTFResource;
  /** 编辑的模型 中的 渲染器数组 */
  public renderers_in_modelGltf: Array<MeshRenderer> = [];

  public engine!: WebGLEngine;
  public camera!: Camera;
  rootEntity!: Entity;
  private initCameraPoi = new Vector3(2, 3, 10);
  modelEntity!: Entity;
  controler?: OrbitControl;

  /**根据模型尺寸设置合适视角 */
  _boundingBox: BoundingBox = new BoundingBox();
  _center: Vector3 = new Vector3();
  _extent: Vector3 = new Vector3();

  public modelUrl: string = "models/list/3.glb"; // 当前展示的模型的地址

  /**
   * 材质相关配置
   */
  private materialsConfig: any[] = [];

  /**场景配置 */
  private sceneConfig: SceneConfig | undefined;

  /** 所有配置 */
  public allData: any;

  /**
   * 初始化
   * @param {string} id canvas 的id
   * @param {any} config 模型展示的相关配置
   * @param {any} config.materialsConfig 材质的相关配置
   * @param {any} config.modelUrl 模型地址，支持模型链接或者 /public下的模型地址
   * @param {any} config.sceneConfig 场景配置
   * @returns
   */
  public async createEngine(id: string, config?: any) {
    if (config) {
      this.resolveAllConfigData(config);
    }

    canvasDomId = id;
    this.engine = new WebGLEngine(id, null, {
      alpha: true,
      premultipliedAlpha: false,
    });
    this.engine.canvas.resizeByClientSize();

    canvasHalfX = this.engine.canvas.width / 2;
    canvasHalfY = this.engine.canvas.height / 2;

    // 监听尺寸变化
    let resizeT: number;
    const resizeObserver = new ResizeObserver((entries) => {
      if (resizeT) {
        clearTimeout(resizeT);
      }
      resizeT = setTimeout(() => {
        this.engine.canvas.resizeByClientSize();
      }, 10);
    });
    resizeObserver.observe(this.engine.canvas._webCanvas);

    const scene = this.engine.sceneManager.activeScene;
    const { background } = scene;
    background.solidColor.setValue(0.45, 0.45, 0.45, 0);
    this.rootEntity = scene.createRootEntity();

    // init camera
    const cameraEntity = this.rootEntity.createChild("camera");
    this.camera = cameraEntity.addComponent(Camera);
    const pos = cameraEntity.transform.position;
    pos.setValue(
      this.initCameraPoi.x,
      this.initCameraPoi.y,
      this.initCameraPoi.z
    );
    cameraEntity.transform.position = pos;
    this.controler = cameraEntity.addComponent(OrbitControl);

    // camera 的 position 和 controller的target决定了相机的角度
    this.sceneConfig = this.allData?.sceneConfig;
    if (this.allData?.sceneConfig?.cameraConfig?.controlerTarget) {
      let { x, y, z } = this.allData.sceneConfig.cameraConfig.controlerTarget;
      this.controler.target.setValue(x, y, z);
    }

    // init light
    scene.ambientLight.diffuseSolidColor.setValue(0, 0, 0, 0);
    scene.ambientLight.diffuseIntensity = 0;

    // 添加直射光
    const lightEntity = this.rootEntity.createChild("light");
    const directLight = lightEntity.addComponent(DirectLight);

    if (this.sceneConfig?.light.direct) {
      let rgb = tinycolor(this.sceneConfig?.light.direct.color).toRgb();
      directLight.color.setValue(rgb.r / 255, rgb.g / 255, rgb.b / 255, rgb.a);
    } else {
      directLight.color.setValue(1, 1, 1, 1);
    }
    directLight.intensity = this.sceneConfig?.light.direct.intensity || 0;
    lightEntity.transform.setRotation(-30, -30, 0);

    // Create sky
    const sky = background.sky;
    const skyMaterial = new SkyBoxMaterial(this.engine);
    background.mode = this.sceneConfig?.background?.show
      ? BackgroundMode.Sky
      : BackgroundMode.SolidColor;
    sky.material = skyMaterial;
    sky.mesh = PrimitiveMesh.createCuboid(this.engine, 1, 1, 1);

    this.setIBL(
      this.sceneConfig?.light.IBLUrl ||
        "http://uufefile.uupt.com/eic/cdn/glb/env/leadenhall_market_2k.hdr.env"
    );

    // 加载模型
    await this.loadModel(this.modelUrl);

    // 给模型应用材质配置
    this.applyMaterialsConfig();

    if (this.defaultAction) {
      this.setAction(this.defaultAction);
    }

    if (this.modelUrl.includes("图标2") || this.modelUrl.includes("图标3")) {
      // add framebuffer picker component
      const framebufferPicker: FramebufferPicker =
        this.rootEntity.addComponent(FramebufferPicker);
      framebufferPicker.camera = this.camera;
      framebufferPicker.onPick = this.onPickOnePart;

      document
        .getElementById(canvasDomId)
        ?.addEventListener("mousemove", (e) =>
          framebufferPicker.pick(e.offsetX, e.offsetY)
        );
    }

    this.engine.run();

    return this.engine;
  }

  /**解析配置数据 */
  resolveAllConfigData(allData: any) {
    this.allData = allData;
    this.modelUrl = allData.model.url;
    this.materialsConfig = allData.materialsConfig;
    this.sceneConfig = allData.sceneConfig;

    this.defaultAction = allData.action;

    if (
      allData.sceneConfig.cameraConfig &&
      allData.sceneConfig.cameraConfig.position
    ) {
      const { x, y, z } = allData.sceneConfig.cameraConfig.position;
      this.initCameraPoi.setValue(x, y, z);
    }
  }

  /**当点击中一个部件 */
  mouseHoverEntity: Entity | null | undefined;
  onPickOnePart = (obj: { component: MeshRenderer; mesh?: any }) => {
    if (obj) {
      const { component, mesh } = obj;
      let entity = component.entity;
      if (
        (!this.mouseHoverEntity ||
          this.mouseHoverEntity.instanceId != entity.instanceId) &&
        entity.name != "beiban"
      ) {
        this.mouseHoverEntity = entity;
        let rotate = entity.getComponent(Rotate) || entity.addComponent(Rotate);
        rotate.start();
      }
    } else {
      if (this.mouseHoverEntity) {
        let rotate =
          this.mouseHoverEntity.getComponent(Rotate) ||
          this.mouseHoverEntity.addComponent(Rotate);
        rotate.startReverse();
        this.mouseHoverEntity = null;
      }
    }
  };

  /**
   * 更换编辑的模型
   */
  async loadModel(url: string) {
    // 加载模型
    // 移除老模型
    if (this.modelGltf)
      this.rootEntity.removeChild(this.modelGltf.defaultSceneRoot);

    this.modelGltf = await this.engine.resourceManager.load<GLTFResource>(url);
    this.renderers_in_modelGltf = new Array<MeshRenderer>();
    this.modelGltf.defaultSceneRoot.getComponentsIncludeChildren(
      MeshRenderer,
      this.renderers_in_modelGltf
    );

    // 过滤替换材质
    this.checkMaterials();

    // 播放模型中的动画
    this.playAnimation();

    this.modelEntity =
      this.rootEntity.findByName("model") ||
      this.rootEntity.createChild("model");
    this.modelEntity.addChild(this.modelGltf.defaultSceneRoot);
  }

  /**过滤替换材质 */
  checkMaterials() {
    this.renderers_in_modelGltf.forEach((i) => {
      if (i.getMaterial() instanceof BlinnPhongMaterial) {
        // 如果是 BlinnPhongMaterial 材质，则替换为PBR材质
        let pbr = new PBRMaterial(this.engine);
        pbr.roughness = 0;
        pbr.metallic = 0;
        i.setMaterial(pbr);
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

  /**
   * 应用材质配置
   */
  private applyMaterialsConfig() {
    this.materialsConfig.forEach((onePart) => {
      let renderer = this.renderers_in_modelGltf.find(
        (oneRenderer) => oneRenderer.entity.name == onePart.name
      );
      // 要clone ，防止模型中不同部件引用的是同一个材质，导致 材质配置异常。
      let material = (renderer?.getMaterial() as PBRMaterial).clone();
      material.name = onePart.material.name;
      material.metallic = onePart.material.metallic;
      material.roughness = onePart.material.roughness;
      material.isTransparent = onePart.material.isTransparent;
      let baseColor = tinycolor(onePart.material.baseColor).toRgb();
      baseColor.a = onePart.material.opacity;
      material.baseColor = new Color(
        baseColor.r / 255,
        baseColor.g / 255,
        baseColor.b / 255,
        baseColor.a
      );
      let emissiveColor = tinycolor(onePart.material.emissiveColor).toRgb();
      material.emissiveColor = new Color(
        emissiveColor.r / 255,
        emissiveColor.g / 255,
        emissiveColor.b / 255,
        emissiveColor.a
      );
      renderer?.setMaterial(material);
    });
  }

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

  destroy() {
    this.rootEntity.destroy();

    this.rootEntity.clearChildren();
  }

  /**场景配置 */
  private defaultAction: number | undefined;
  setAction(type: number) {
    let actionEntity = this.rootEntity.findByName("action");
    if (actionEntity) {
      actionEntity.destroy();
      actionEntity.clearChildren();
    }
    actionEntity = this.rootEntity.createChild("action");
    this.camera.entity.clearChildren();

    let orbit = this.camera.entity.getComponent(OrbitControl);
    orbit.enableZoom = orbit.enablePan = orbit.enableRotate = false;

    switch (type) {
      case 1:
        orbit.enableZoom = orbit.enablePan = orbit.enableRotate = true;
        break;
      case 2:
        actionEntity.addComponent(SelfRotate);
        break;
      case 3:
        actionEntity.addComponent(MouseMove);
        break;
      case 4:
        // 关闭模型动画
        let { animations } = this.modelGltf;
        if (animations && animations?.length > 0) {
          const animator =
            this.modelGltf.defaultSceneRoot.getComponent(Animator);
          animations?.forEach((clip: AnimationClip, index) => {
            animator.speed = 0;
          });
          actionEntity.addComponent(HoverAnimation);
        }
    }
  }
}

/**自旋转 */
class SelfRotate extends Script {
  private _totalTime: number = 0;
  onUpdate(deltaTime: number): void {
    this._totalTime += deltaTime;
    const rotateFactor = this._totalTime * 0.1;
    this.entity.parent
      .findByName("model")
      .transform.setRotation(0, rotateFactor, 0);
  }
}
/**
 * 相机的鼠标交互
 */
export class MouseMove extends Script {
  constructor(entity: Entity) {
    super(entity);

    document
      .querySelector("#" + canvasDomId)
      ?.addEventListener("mouseenter", this.onDocumentMouseEnter);
    document
      .querySelector("#" + canvasDomId)
      ?.addEventListener("mousemove", this.onDocumentMouseMove);
    document
      .querySelector("#" + canvasDomId)
      ?.addEventListener("mouseout", this.onDocumentMouseout);
  }

  private oringeRot = this.entity.parent
    .findByName("model")
    .transform.rotation.clone();
  private mouseX = 0;
  private mouseY = 0;
  static a = 0.1;
  isOut = true;
  modelEntity = this.entity.parent.findByName("model");

  enterX = 0;
  enterY = 0;
  onDocumentMouseEnter = (e: any) => {
    this.enterX = e.offsetX;
    this.enterY = e.offsetY;
  };

  limit = 300;
  onDocumentMouseMove = (event: any) => {
    this.isOut = false;

    this.mouseX = event.offsetX - this.enterX;
    this.mouseY = event.offsetY - this.enterY;
    if (this.mouseX < this.limit * -1) {
      this.mouseX = this.limit * -1;
    } else if (this.mouseX > this.limit) {
      this.mouseX = this.limit;
    }
    if (this.mouseY < this.limit * -1) {
      this.mouseY = this.limit * -1;
    } else if (this.mouseY > this.limit) {
      this.mouseY = this.limit;
    }
    this.targetRot = new Vector3(
      this.oringeRot.x + this.mouseY * MouseMove.a,
      this.oringeRot.y + this.mouseX * MouseMove.a,
      0
    );
  };

  onDocumentMouseout = (e: any) => {
    this.isOut = true;
    this.targetRot = this.oringeRot;
  };

  speed = 1;
  targetRot = this.entity.parent.findByName("model").transform.rotation;
  onUpdate(deltaTime: number): void {
    let { x, y, z } = this.entity.parent.findByName("model").transform.rotation;
    if (this.isOut) {
      // console.log(this.targetRot)
      let xt =
        this.targetRot.x - x > 0
          ? Math.min(x + this.speed, this.targetRot.x)
          : Math.max(x + this.speed * -1, this.targetRot.x);
      let yt =
        this.targetRot.y - y > 0
          ? Math.min(y + this.speed, this.targetRot.y)
          : Math.max(y + this.speed * -1, this.targetRot.y);
      this.modelEntity.transform.setRotation(xt, yt, z);
    } else {
      // this.modelEntity.transform.setRotation(this.targetRot.x, this.targetRot.y, z);
      this.modelEntity.transform.setRotation(x, this.targetRot.y, z);
    }
  }
}

/**鼠标悬浮播放动画 */
class HoverAnimation extends Script {
  constructor(entity: Entity) {
    super(entity);

    document
      .querySelector("#" + canvasDomId)
      ?.addEventListener("mouseover", this.onmouseover);
    document
      .querySelector("#" + canvasDomId)
      ?.addEventListener("mouseout", this.onmouseout);
  }

  private onmouseover() {
    let { animations } = modelGltf;
    const animator = modelGltf.defaultSceneRoot.getComponent(Animator);
    if (animations && animations?.length > 0 && animator) {
      animations?.forEach((clip: AnimationClip, index) => {
        animator.speed = 1;
      });
    }
  }
  private onmouseout() {
    let { animations } = modelGltf;
    const animator = modelGltf.defaultSceneRoot.getComponent(Animator);
    animations?.forEach((clip: AnimationClip, index) => {
      animator.speed = 0;
    });
  }

  onDestroy(): void {
    document
      .querySelector("#" + canvasDomId)
      ?.removeEventListener("mouseover", this.onmouseover);
    document
      .querySelector("#" + canvasDomId)
      ?.removeEventListener("mouseout", this.onmouseout);
    this.onmouseover();
  }
}

/**自旋转一周 */
class Rotate extends Script {
  isRotating: boolean = false;
  originRot = this.entity.transform.rotation.clone();
  start(): void {
    if (this.isRotating) return;
    let { x: x0, y: y0, z: z0 } = this.originRot;
    this.isRotating = true;
    new TWEEN.Tween({ y: y0 })
      .to({ y: y0 + 360 }, 500)
      .onUpdate(({ y }) => {
        this.entity.transform.setRotation(x0, y, z0);
      })
      // .yoyo(true)
      .onComplete(() => {
        this.isRotating = false;
      })
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .start();
  }
  startReverse() {
    if (this.isRotating) return;
    let { x: x0, y: y0, z: z0 } = this.originRot;
    this.isRotating = true;
    new TWEEN.Tween({ y: y0 + 360 })
      .to({ y: y0 }, 500)
      .onUpdate(({ y }) => {
        this.entity.transform.setRotation(x0, y, z0);
      })
      // .yoyo(true)
      .onComplete(() => {
        this.isRotating = false;
      })
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .start();
  }
  onUpdate(deltaTime: number): void {
    TWEEN.update();
  }
}
`;
