import { Vector3, Quaternion } from './modifiers'

export type Entity = {
  name: string
  parent?: Entity
  components: AnyComponent[]
}

export type AnyComponent = Component<ComponentType>

export type Component<T extends ComponentType> = {
  id?: string
  type: T
  data?: ComponentData[T]
}

export enum ComponentType {
  Transform = 'Transform',
  BoxShape = 'BoxShape'
}

export type ComponentData = {
  [ComponentType.Transform]: {
    position: Vector3
    rotation: Quaternion
  }

  [ComponentType.BoxShape]: null
}
