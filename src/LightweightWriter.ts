import * as DCL from 'decentraland-ecs'

import { SceneWriter } from './SceneWriter'

export class LightweightWriter extends SceneWriter {
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
        throw new Error(`Parent entity of "${name}" is missing, you should add parents first.`)
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

  protected writeComponent(constructorName: string, component: DCL.ObservableComponent) {
    return ''
  }
}
