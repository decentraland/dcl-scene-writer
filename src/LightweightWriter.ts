import * as DCL from 'decentraland-ecs'

import { SceneWriter } from './SceneWriter'

export class LightweightWriter extends SceneWriter {
  protected instanceCount: number = 0
  protected nameMapping: Record<string, number> = {}

  addEntity(name: string, entity: DCL.Entity) {
    if (this.entities.has(name)) {
      throw new Error(`There is already an entity with name "${name}"`)
    }
    this.nameMapping[name] = ++this.instanceCount
    this.entities.set(name, entity)
  }
  getEntityName(entity: DCL.IEntity) {
    const entityName = super.getEntityName(entity)
    if (!entityName) {
      return entityName
    }
    return '' + this.nameMapping[entityName]
  }

  protected stepPrologue(): string {
    return `dcl.subscribe('sceneStart');\n`
  }

  protected stepStartEntity(_: DCL.Entity, name: string): string {
    return `dcl.addEntity('${name}');\n`
  }

  protected stepSetEntityParent(_: DCL.Entity, name: string, parent?: DCL.IEntity): string {
    let parentName = '0'
    if (parent) {
      parentName = this.getEntityName(parent)
      if (!parentName) {
        throw new Error(
          `Parent entity of "${super.getEntityName(_)}" is missing, you should add parents first.`
        )
      }
    }
    return `dcl.setParent('${name}', '${parentName}');\n`
  }

  protected stepWriteComponentDeclaration(
    entity: DCL.Entity,
    component: any,
    componentName: string,
    componentCode: string
  ): string {
    if (DCL.getComponentName(component) === 'engine.transform') {
      return `dcl.updateEntityComponent('${this.getEntityName(
        entity
      )}', 'engine.transform', ${DCL.getComponentClassId(
        component
      )}, JSON.stringify(${JSON.stringify(component)}));\n`
    }
    return `dcl.componentCreated('${componentName}', '${DCL.getComponentName(
      component
    )}', ${DCL.getComponentClassId(
      component
    )});\ndcl.componentUpdated('${componentName}', JSON.stringify(${JSON.stringify(component)}));\n`
  }

  protected stepSetComponentParent(
    _: DCL.Entity,
    entityName: string,
    componentName: string,
    component
  ): string {
    const classId = DCL.getComponentClassId(component)

    if (classId !== null) {
      if (DCL.isDisposableComponent(component)) {
        return `dcl.attachEntityComponent('${entityName}', '${DCL.getComponentName(
          component
        )}', '${componentName}');\n`
      }
    }
    return ''
  }

  protected writeComponent(
    instanceName: string,
    constructorName: string,
    component: DCL.ObservableComponent
  ) {
    return ''
  }
}
