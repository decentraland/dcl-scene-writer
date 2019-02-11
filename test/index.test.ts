import test from 'ava'
import * as DCL from 'decentraland-ecs'

import SceneWriter from '../src'

test('Unit - write entity cube - should output TS of cube', t => {
  const sceneWriter = new SceneWriter(DCL)
  sceneWriter.addEntity('cube', new DCL.Entity())
  sceneWriter.addComponent('cube', new DCL.BoxShape())
  sceneWriter.addComponent(
    'cube',
    new DCL.Transform({
      position: new DCL.Vector3(5, 0, 5),
      rotation: new DCL.Quaternion(0, 0, 1, 0)
    })
  )
  const code = sceneWriter.emitCode()

  t.is(
    code,
    'const cube = new Entity()\ncube.set(new BoxShape())\ncube.set(new Transform({ position: new Vector3(5, 0, 5), rotation: new Quaternion(0, 0, 1, 0), scale: new Vector3(1, 1, 1) }))\n\n'
  )
})

test('Unit - write entity GLTF - should output TS of cube', t => {
  const sceneWriter = new SceneWriter(DCL)
  sceneWriter.addEntity('skeleton', new DCL.Entity())
  sceneWriter.addComponent('skeleton', new DCL.GLTFShape('./asd.gltf'))
  sceneWriter.addComponent(
    'skeleton',
    new DCL.Transform({ rotation: new DCL.Quaternion(0, 2, 1, 0) })
  )
  const code = sceneWriter.emitCode()

  t.is(
    code,
    `const skeleton = new Entity()\nskeleton.set(new GLTFShape('./asd.gltf'))\nskeleton.set(new Transform({ position: new Vector3(0, 0, 0), rotation: new Quaternion(0, 2, 1, 0), scale: new Vector3(1, 1, 1) }))\n\n`
  )
})

test('Unit - write 2 entities - should output TS of cube', t => {
  const sceneWriter = new SceneWriter(DCL)
  sceneWriter.addEntity('sphere', new DCL.Entity())
  sceneWriter.addComponent('sphere', new DCL.SphereShape())
  sceneWriter.addEntity('cube', new DCL.Entity())
  sceneWriter.addComponent('cube', new DCL.BoxShape())
  const code = sceneWriter.emitCode()

  t.is(
    code,
    `const sphere = new Entity()\nsphere.set(new SphereShape())\n\nconst cube = new Entity()\ncube.set(new BoxShape())\n\n`
  )
})

test('Unit - write 2 entities with the same name - should throw an error', t => {
  const sceneWriter = new SceneWriter(DCL)
  sceneWriter.addEntity('sphere', new DCL.Entity())
  sceneWriter.addComponent('sphere', new DCL.SphereShape())

  t.throws(
    () => sceneWriter.addEntity('sphere', new DCL.Entity()),
    'There is already an entity with name "sphere"'
  )
})

test('Unit - write an entity with an existing parent - should throw an error', t => {
  const sceneWriter = new SceneWriter(DCL)
  const sphere = new DCL.Entity()
  sceneWriter.addEntity('sphere', sphere)
  sceneWriter.addComponent('sphere', new DCL.SphereShape())

  const cube = new DCL.Entity()
  cube.setParent(sphere)
  sceneWriter.addEntity('cube', cube)
  sceneWriter.addComponent('cube', new DCL.BoxShape())

  const code = sceneWriter.emitCode()

  t.is(
    code,
    `const sphere = new Entity()\nsphere.set(new SphereShape())\n\nconst cube = new Entity()\ncube.setParent(sphere)\ncube.set(new BoxShape())\n\n`
  )
})

test('Unit - write an entity with an inexisting parent - should throw an error', t => {
  const sceneWriter = new SceneWriter(DCL)
  const sphere = new DCL.Entity()
  const cube = new DCL.Entity()
  cube.setParent(sphere)
  sceneWriter.addEntity('cube', cube)
  sceneWriter.addComponent('cube', new DCL.BoxShape())

  t.throws(
    () => sceneWriter.emitCode(),
    'Parent entity of "cube" is missing, you should add parents first.'
  )
})
