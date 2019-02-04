import { Entity, ComponentData, ComponentType } from './types'
import { stringify } from './utils'
import { Vector3, Quaternion, Transform } from './modifiers'

export function writeEntity(entity: Entity) {
  let code = ''
  code += `const ${entity.name} = new Entity()\n`
  for (const component of entity.components) {
    code += `${entity.name}.set(new ${component.type}(${writeComponentData(component.data)}))\n`
  }
  return code
}

function writeComponentData<T extends ComponentType>(data: ComponentData[T]) {
  if (data instanceof Transform) {
    const props = []
    for (const prop in data) {
      if (data[prop] instanceof Vector3) {
        props.push(`${prop}: new Vector3(${data[prop].x}, ${data[prop].y}, ${data[prop].z})`)
      }

      if (data[prop] instanceof Quaternion) {
        props.push(
          `${prop}: new Quaternion(${data[prop].x}, ${data[prop].y}, ${data[prop].z}, ${
            data[prop].w
          })`
        )
      }
    }
    return `{ ${props.join(', ')} }`
  }

  return stringify(data)
}
