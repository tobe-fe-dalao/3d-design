import {
  Entity,
  MeshRenderer,
  ModelMesh,
  PrimitiveMesh,
} from "@oasis-engine/core";
import { BlinnPhongMaterial, Color, Vector3, Component } from "oasis-engine";

/**坐标辅助器 */
export class AxesHelper extends Component {
  constructor(entity: Entity) {
    super(entity);
    // Create material

    let rootEntity = entity;
    let radius = 0.05;
    this.cylinderX = this.generatePrimitiveEntity(
      rootEntity,
      "cylinderX",
      new Vector3(this.height / 2, 0, 0),
      PrimitiveMesh.createCylinder(entity.engine, radius, radius, this.height),
      new Color(1, 0, 0, 1),
      { x: 0, y: 0, z: -90 }
    );
    this.cylinderY = this.generatePrimitiveEntity(
      rootEntity,
      "cylinderY",
      new Vector3(0, this.height / 2, 0),
      PrimitiveMesh.createCylinder(entity.engine, radius, radius, this.height),
      new Color(0, 1, 0, 1)
    );
    this.cylinderZ = this.generatePrimitiveEntity(
      rootEntity,
      "cylinderZ",
      new Vector3(0, 0, this.height / 2),
      PrimitiveMesh.createCylinder(entity.engine, radius, radius, this.height),
      new Color(0, 0, 1, 1),
      { x: 90, y: 0, z: 0 }
    );
    // generatePrimitiveEntity(rootEntity, 'cylinder1', new Vector3(), PrimitiveMesh.createSphere(entity.engine,0.5), material)
  }

  private cylinderX!: Entity;
  private cylinderY!: Entity;
  private cylinderZ!: Entity;
  private height: number = 5;

  /**
   * generate primitive mesh entity.
   */

  private generatePrimitiveEntity(
    rootEntity: Entity,
    name: string,
    position: Vector3,
    mesh: ModelMesh,
    color: Color,
    transform?: { x: number; y: number; z: number }
  ): Entity {
    const material = new BlinnPhongMaterial(this.entity.engine);
    material.baseColor = color;
    const entity = rootEntity.createChild(name);
    entity.transform.setPosition(position.x, position.y, position.z);
    transform &&
      entity.transform.setRotation(transform.x, transform.y, transform.z);
    const renderer = entity.addComponent(MeshRenderer);
    renderer.mesh = mesh;
    renderer.setMaterial(material);

    let coneEntity = entity.createChild("cone");
    coneEntity.transform.setPosition(0, this.height / 2, 0);
    const coneRenderer = coneEntity.addComponent(MeshRenderer);
    coneRenderer.mesh = PrimitiveMesh.createCone(this.entity.engine, 0.2, 0.5);
    coneRenderer.setMaterial(material);

    return entity;
  }
}
