import test from 'ava'

import { writeEntity } from '../src'
import { Entity, ComponentType, Component } from '../src/types'
import { Vector3, Quaternion, Transform } from '../src/modifiers'

test('Unit - writeEntity(cube) - should output TS of cube', t => {
  const cube: Entity = {
    name: 'cube',
    components: []
  }

  const boxShape: Component<ComponentType.BoxShape> = { type: ComponentType.BoxShape }
  const transform: Component<ComponentType.Transform> = {
    type: ComponentType.Transform,
    data: new Transform({
      position: new Vector3({ x: 5, y: 0, z: 5 }),
      rotation: new Quaternion({ x: 0, z: 1, y: 0, w: 0 })
    })
  }

  cube.components.push(boxShape, transform)

  const code = writeEntity(cube)
  t.is(
    code,
    'const cube = new Entity()\ncube.set(new BoxShape())\ncube.set(new Transform({ position: new Vector3(5, 0, 5), rotation: new Quaternion(0, 0, 1, 0) }))\n'
  )
})
