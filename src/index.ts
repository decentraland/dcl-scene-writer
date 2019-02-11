import * as DCL from 'decentraland-ecs'

type Component = {
  data?: DCL.ObservableComponent
  entityName?: string
}

interface KeyValuePair<K, T> {
  key: K
  value: T
}

export default class SceneWriter {
  private DCL
  private map
  private entities: Map<string, DCL.Entity> = new Map<string, DCL.Entity>()
  private components: Component[] = []

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

  addComponent(entityName: string, component: DCL.ObservableComponent) {
    this.components.push({ data: component, entityName })
  }

  emitCode(): string {
    let code = ''
    this.entities.forEach((entity, name) => {
      code += this.writeEntity(entity, name) + '\n'
    })
    return code
  }

  private writeEntity(entity: DCL.Entity, name: string): string {
    let code = ''
    code += `const ${name} = new Entity()\n`

    const parent = entity.getParent()
    if (parent) {
      let parentEntity: KeyValuePair<string, DCL.Entity>

      this.entities.forEach((ent, name) => {
        if (ent === parent) {
          parentEntity = { key: name, value: ent }
        }
      })

      if (!parentEntity) {
        throw new Error(`Parent entity of "${name}" is missing, you should add parents first.`)
      }

      code += `${name}.setParent(${parentEntity.key})\n`
    }

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
    const typesArray = Object.keys(this.map.exports).filter(
      n => this.map.exports[n].kind === 'class' && n !== 'Shape' && n !== 'ObservableComponent'
    )
    for (let i = 0; i < typesArray.length; i++) {
      if (component instanceof this.DCL[typesArray[i]]) {
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
    return `{ ${props.join(', ')} }`
  }
}
