import test from 'ava'
import {
  Entity,
  Transform,
  Vector3,
  BoxShape,
  Quaternion,
  GLTFShape,
  SphereShape
} from 'decentraland-ecs'

import { SceneWriter } from '../src'

test('Unit - write entity cube - should output TS of cube', t => {
  const sceneWriter = new SceneWriter()
  sceneWriter.addEntity('cube', new Entity())
  sceneWriter.addComponent('cube', new BoxShape())
  sceneWriter.addComponent(
    'cube',
    new Transform({ position: new Vector3(5, 0, 5), rotation: new Quaternion(0, 0, 1, 0) })
  )
  const code = sceneWriter.emitCode()

  t.is(
    code,
    'const cube = new Entity()\ncube.set(new BoxShape())\ncube.set(new Transform({ position: new Vector3(5, 0, 5), rotation: new Quaternion(0, 0, 1, 0), scale: new Vector3(1, 1, 1) }))\n\n'
  )
})

test('Unit - write entity GLTF - should output TS of cube', t => {
  const sceneWriter = new SceneWriter()
  sceneWriter.addEntity('skeleton', new Entity())
  sceneWriter.addComponent('skeleton', new GLTFShape('./asd.gltf'))
  sceneWriter.addComponent('skeleton', new Transform({ rotation: new Quaternion(0, 2, 1, 0) }))
  const code = sceneWriter.emitCode()

  t.is(
    code,
    `const skeleton = new Entity()\nskeleton.set(new GLTFShape('./asd.gltf'))\nskeleton.set(new Transform({ position: new Vector3(0, 0, 0), rotation: new Quaternion(0, 2, 1, 0), scale: new Vector3(1, 1, 1) }))\n\n`
  )
})

test('Unit - write 2 entities - should output TS of cube', t => {
  const sceneWriter = new SceneWriter()
  sceneWriter.addEntity('sphere', new Entity())
  sceneWriter.addComponent('sphere', new SphereShape())
  sceneWriter.addEntity('cube', new Entity())
  sceneWriter.addComponent('cube', new BoxShape())
  const code = sceneWriter.emitCode()

  t.is(
    code,
    `const sphere = new Entity()\nsphere.set(new SphereShape())\n\nconst cube = new Entity()\ncube.set(new BoxShape())\n\n`
  )
})
