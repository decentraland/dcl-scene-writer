import * as DCL from 'decentraland-ecs'
const typesMap = require('decentraland-ecs/types/dcl/decentraland-ecs.api')

type Component = {
  data?: DCL.ObservableComponent
  entityName?: string
}

export class SceneWriter {
  private entities: Map<string, DCL.Entity> = new Map<string, DCL.Entity>()
  private components: Component[] = []

  addEntity(name: string, entity: DCL.Entity) {
    this.entities.set(name, entity)
  }

  addComponent(entityName: string, component: DCL.ObservableComponent) {
    this.components.push({ data: component, entityName })
  }

  emitCode(): string {
    let code = ''
    this.entities.forEach((entity, name) => {
      code += this.writeEntity(name) + '\n'
    })
    return code
  }

  private writeEntity(name: string): string {
    let code = ''
    code += `const ${name} = new Entity()\n`
    this.components
      .filter(c => c.entityName === name)
      .forEach(c => {
        code += `${name}.set(${this.writeComponent(c.data)})\n`
      })
    return code
  }

  private writeComponent(component: DCL.ObservableComponent) {
    // Get class name
    let constructor
    const typesArray = Object.keys(typesMap.exports).filter(
      n => typesMap.exports[n].kind === 'class' && n !== 'Shape' && n !== 'ObservableComponent'
    )
    for (let i = 0; i < typesArray.length; i++) {
      if (component instanceof DCL[typesArray[i]]) {
        constructor = typesArray[i]
      }
    }

    return constructor === 'Transform'
      ? `new Transform(${this.getTransformComponentData(component.data)})`
      : `new ${constructor}(${this.getConstructorValues(constructor, component.data)})`
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
    if (!typesMap.exports[name].members) {
      return null
    }

    return typesMap.exports[name].members.__constructor
  }

  private getTransformComponentData(data): string {
    const props = []
    for (const prop in data) {
      if (data[prop] instanceof DCL.Vector3) {
        props.push(`${prop}: new Vector3(${data[prop].x}, ${data[prop].y}, ${data[prop].z})`)
      }

      if (data[prop] instanceof DCL.Quaternion) {
        props.push(
          `${prop}: new Quaternion(${data[prop].x}, ${data[prop].y}, ${data[prop].z}, ${
            data[prop].w
          })`
        )
      }
    }
    return `{ ${props.join(', ')} }`
  }
}
