import * as DCL from 'decentraland-ecs'
import { toCamelCase } from './utils'

type ComponentMap = {
  instanceToName: Map<any, string>
  takenNames: Set<string>
}

export default class SceneWriter {
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
    let code = ''
    const componentMap: ComponentMap = {
      instanceToName: new Map(),
      takenNames: new Set()
    }
    this.entities.forEach((entity, name) => {
      code += this.writeEntity(entity, name, componentMap) + '\n'
    })
    return code.trim()
  }

  private writeEntity(entity: DCL.Entity, name: string, componentMap: ComponentMap): string {
    let code = `const ${name} = new Entity()\n`

    const parent = entity.getParent()
    if (parent) {
      const parentName = this.getEntityName(parent)

      if (!parentName) {
        throw new Error(`Parent entity of "${name}" is missing, you should add parents first.`)
      }

      code += `${name}.setParent(${parentName})\n`
    }

    for (let key in entity.components) {
      const componentInstance = entity.components[key]
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
        code += `const ${componentName} = ${componentCode}\n`
      }
      code += `${name}.addComponentOrReplace(${componentName})\n`
    }

    code += `engine.addEntity(${name})\n`

    return code
  }

  private getConstructorName(component: DCL.ObservableComponent) {
    // Get class name
    let constructor: string
    const typesArray = Object.keys(this.map.exports).filter(
      n => this.map.exports[n].kind === 'class' && n !== 'Shape' && n !== 'ObservableComponent'
    )
    for (let i = 0; i < typesArray.length; i++) {
      if (component instanceof this.DCL[typesArray[i]]) {
        constructor = typesArray[i]
      }
    }
    return constructor
  }

  private writeComponent(constructorName: string, component: DCL.ObservableComponent) {
    return constructorName === 'Transform'
      ? `new Transform(${this.getTransformComponentData(component.data)})`
      : `new ${constructorName}(${this.getConstructorValues(constructorName, component.data)})`
  }

  private getEntityName(entity: DCL.Entity) {
    let entityName: string

    this.entities.forEach((ent, name) => {
      if (ent === entity) {
        entityName = name
      }
    })

    return entityName
  }

  private getConstructorValues(constructor: string, data) {
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

  private getConstructorTypes(name: string) {
    if (!this.map.exports[name].members) {
      return null
    }

    return this.map.exports[name].members.__constructor
  }

  private getTransformComponentData(data): string {
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
