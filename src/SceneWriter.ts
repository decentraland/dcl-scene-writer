import * as DCL from 'decentraland-ecs'
import { toCamelCase } from './utils'
import { ComponentMap } from './ComponentMap'

export class SceneWriter {
  private DCL: any
  private map: any
  private entities: Map<string, DCL.Entity> = new Map<string, DCL.Entity>()

  constructor(dcl, map?: any) {
    this.DCL = dcl
    this.map = map || require('decentraland-ecs/types/dcl/decentraland-ecs.api')
  }

  addEntity(name: string, entity: DCL.Entity) {
    if (this.entities.has(name)) {
      throw new Error(`There is already an entity with name "${name}"`)
    }

    this.entities.set(name, entity)
  }

  emitCode(): string {
    const code = []
    code.push(this.stepPrologue())
    const componentMap: ComponentMap = {
      instanceToName: new Map(),
      takenNames: new Set()
    }
    this.entities.forEach(entity => {
      code.push(this.writeEntity(entity, componentMap).trim() + '\n')
    })
    return code.join('\n')
  }
  protected writeEntity(entity: DCL.Entity, componentMap: ComponentMap): string {
    const code = []
    const name = this.getEntityName(entity)
    code.push(this.stepStartEntity(entity, name))

    const parent = entity.getParent()
    code.push(this.stepSetEntityParent(entity, name, parent))

    const keys = Object.keys(entity.components)
    for (let key of keys) {
      const componentInstance = entity.components[key]
      try {
        let componentName = componentMap.instanceToName.get(componentInstance)
        if (!componentName) {
          const constructorName = this.getConstructorName(componentInstance)
          const variableName = toCamelCase(constructorName)
          let attempt = 1
          componentName = variableName
          while (componentMap.takenNames.has(componentName)) {
            attempt++
            componentName = `${variableName}_${attempt}`
          }
          const componentCode = this.writeComponent(constructorName, componentInstance)
          componentMap.takenNames.add(componentName)
          componentMap.instanceToName.set(componentInstance, componentName)
          code.push(
            this.stepWriteComponentDeclaration(
              entity,
              componentInstance,
              componentName,
              componentCode
            )
          )
        }
        code.push(this.stepSetComponentParent(entity, name, componentName, componentInstance))
      } catch (e) {
        console.log(e, e.stack)
      }
    }
    return code.join('')
  }

  protected stepPrologue(): string {
    return ''
  }

  protected stepStartEntity(_: DCL.Entity, name: string): string {
    return `const ${name} = new Entity()\n`
  }

  protected stepSetEntityParent(_: DCL.Entity, name: string, parent?: DCL.IEntity): string {
    if (parent) {
      const parentName = this.getEntityName(parent)

      if (!parentName) {
        throw new Error(`Parent entity of "${name}" is missing, you should add parents first.`)
      }

      return `engine.addEntity(${name})\n${name}.setParent(${parentName})\n`
    }
    return `engine.addEntity(${name})\n`
  }

  protected stepWriteComponentDeclaration(
    entity: DCL.Entity,
    component: DCL.ComponentLike,
    componentName: string,
    componentCode: string
  ): string {
    return `const ${componentName} = ${componentCode}\n`
  }

  protected stepSetComponentParent(
    _: DCL.Entity,
    entityName: string,
    componentName: string,
    component: any
  ): string {
    return `${entityName}.addComponentOrReplace(${componentName})\n`
  }

  protected getConstructorName(component: DCL.ObservableComponent): string | undefined {
    const typesArray = Object.keys(this.map.exports).filter(
      n => this.map.exports[n].kind === 'class' && n !== 'Shape' && n !== 'ObservableComponent'
    )
    for (let i = 0; i < typesArray.length; i++) {
      if (component instanceof this.DCL[typesArray[i]]) {
        return typesArray[i]
      }
    }
  }

  protected writeComponent(constructorName: string, component: DCL.ObservableComponent) {
    return constructorName === 'Transform'
      ? `new Transform(${this.getTransformComponentData(component.data)})`
      : `new ${constructorName}(${this.getConstructorValues(constructorName, component.data)})`
  }

  protected getEntityName(entity: DCL.IEntity): string {
    for (let ent of this.entities) {
      if (ent[1] === entity) {
        return ent[0]
      }
    }
  }

  protected getConstructorValues(constructor: string, data) {
    const types = this.getConstructorTypes(constructor)

    if (!types || !types.parameters) {
      return ''
    }

    const values = Object.keys(types.parameters).map(p => {
      if (types.parameters[p].type === 'number') {
        return data[p]
      }

      return `'${data[p]}'`
    })
    return values.join(', ')
  }

  protected getConstructorTypes(name: string) {
    if (!this.map.exports[name] || !this.map.exports[name].members) {
      return null
    }

    return this.map.exports[name].members.__constructor
  }

  protected getTransformComponentData(data): string {
    const props = []
    for (const prop in data) {
      if (data[prop] instanceof this.DCL.Vector3) {
        props.push(`${prop}: new Vector3(${data[prop].x}, ${data[prop].y}, ${data[prop].z})`)
      }

      if (data[prop] instanceof this.DCL.Quaternion) {
        props.push(
          `${prop}: new Quaternion(${data[prop].x}, ${data[prop].y}, ${data[prop].z}, ${
            data[prop].w
          })`
        )
      }
    }
    return `{\n  ${props.join(',\n  ')}\n}`
  }
}
