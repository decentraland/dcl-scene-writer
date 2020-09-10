import * as DCL from 'decentraland-ecs'
import { toCamelCase, blacklist } from './utils'
import { ComponentMap } from './ComponentMap'

export class SceneWriter {
  protected entities: Map<string, DCL.Entity> = new Map<string, DCL.Entity>()
  private DCL: any
  private map: any

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
            componentName = `${variableName}${attempt}`
          }
          const componentCode = this.writeComponent(
            componentName,
            constructorName,
            componentInstance
          )
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
    return `const ${name} = new Entity('${name}')\n`
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
    const ecs = this.map.members[0]

    const namesArray = ecs.members
      .filter(member => member.kind === 'Class' && !blacklist.includes(member.name))
      .map(member => member.name)

    for (const name of namesArray) {
      if (component instanceof this.DCL[name]) {
        return name
      }
    }
  }

  protected writeComponent(
    instanceName: string,
    constructorName: string,
    component: DCL.ObservableComponent
  ) {
    if (constructorName === 'Transform') {
      return `new Transform(${this.getTransformComponentData(component.data)})`
    } else {
      let code = `new ${constructorName}(${this.getConstructorValues(
        constructorName,
        component.data
      )})`

      const parameters = this.getConstructorParameters(constructorName).reduce(
        (set, parameter) => set.add(parameter),
        new Set<string>()
      )
      const readOnlyProperties = this.getReadOnlyProperties(constructorName).reduce(
        (set, property) => set.add(property),
        new Set<string>()
      )
      // Write everything on component.data that is not part of the constructor parameters and that is not read only as component attributes
      const attributes = Object.keys(component.data).filter(
        key => !parameters.has(key) && !readOnlyProperties.has(key)
      )
      for (const attribute of attributes) {
        code += `\n${instanceName}.${attribute} = ${JSON.stringify(component.data[attribute])}`
      }
      return code
    }
  }

  protected getEntityName(entity: DCL.IEntity): string {
    for (let ent of this.entities) {
      if (ent[1] === entity) {
        return ent[0]
      }
    }
  }

  protected getConstructorValues(constructor: string, data) {
    const parameters = this.getConstructorParameters(constructor)
    if (!parameters) {
      return ''
    }
    const values = parameters.map(parameter => JSON.stringify(data[parameter]))
    return values.join(', ')
  }

  protected getConstructorParameters(name: string): string[] {
    const ecs = this.map.members[0]
    const target = ecs.members.find(member => member.name === name)
    const constructor = target.members.find(member => member.kind === 'Constructor')
    if (constructor) {
      return constructor.parameters.map(parameter => parameter.parameterName) as string[]
    }
    return []
  }

  protected getReadOnlyProperties(name: string): string[] {
    const ecs = this.map.members[0]
    const target = ecs.members.find(member => member.name === name)
    const readOnlyProperties = target.members
      .filter(
        member =>
          member.kind === 'Property' &&
          member.excerptTokens.some(token => token.text.toLowerCase().includes('readonly'))
      )
      .map(member => member.name)
    return readOnlyProperties
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
