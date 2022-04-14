import { OrbitControl } from "@oasis-engine/controls";
import { BoundingBox, Camera, Entity, MeshRenderer, Renderer, Script, SkinnedMeshRenderer, Vector3, WebCanvas } from "oasis-engine";

/**
 * 相机控制器 继承轨道控制器
 */
export class CameraControl extends OrbitControl {
  constructor(entity: Entity) {
    super(entity);
  }
  

  /**根据模型尺寸 将其设置为中间 */
  setTargetCenter(modelEntity: Entity) {
    
    const meshRenderers = new Array<MeshRenderer>();
    modelEntity.getComponentsIncludeChildren(
      MeshRenderer,
      meshRenderers
    );

    const skinnedMeshRenderers: SkinnedMeshRenderer[] = [];
    modelEntity.getComponentsIncludeChildren(
      SkinnedMeshRenderer,
      skinnedMeshRenderers
    );

    const renderers = meshRenderers.concat(skinnedMeshRenderers)
    const boundingBox = new BoundingBox();
    const center = new Vector3();
    const extent = new Vector3();

    boundingBox.min.setValue(0, 0, 0);
    boundingBox.max.setValue(0, 0, 0);

    renderers.forEach((renderer) => {
      BoundingBox.merge(renderer.bounds, boundingBox, boundingBox);
    });
    boundingBox.getExtent(extent);
    const size = extent.length();

    boundingBox.getCenter(center);
    this.target.setValue(center.x, center.y, center.z);
    const cameraEntity = this.camera
    const camera = cameraEntity.getComponent(Camera)
    cameraEntity.transform.setPosition(size * 2, size * 1.5, size * 4);
    // 记录模型初始化视角

    camera.farClipPlane = size * 12;

    if (camera.nearClipPlane > size) {
      camera.nearClipPlane = size / 10;
    } else {
      camera.nearClipPlane = 0.1;
    }

    this.maxDistance = size * 10;

  }
}
