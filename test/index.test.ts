import test from 'ava'
import * as DCL from 'decentraland-ecs'

import SceneWriter from '../src'

test('Unit - write entity cube - should output TS of cube', t => {
  const sceneWriter = new SceneWriter(DCL)
  const cube = new DCL.Entity()
  cube.set(new DCL.BoxShape())
  cube.set(
    new DCL.Transform({
      position: new DCL.Vector3(5, 0, 5),
      rotation: new DCL.Quaternion(0, 0, 1, 0)
    })
  )
  sceneWriter.addEntity('cube', cube)
  const code = sceneWriter.emitCode()

  t.is(
    code,
    'const cube = new Entity()\ncube.set(new BoxShape())\ncube.set(new Transform({ position: new Vector3(5, 0, 5), rotation: new Quaternion(0, 0, 1, 0), scale: new Vector3(1, 1, 1) }))\n\n'
  )
})

test('Unit - write entity GLTF - should output TS of cube', t => {
  const sceneWriter = new SceneWriter(DCL)
  const skeleton = new DCL.Entity()
  skeleton.set(new DCL.GLTFShape('./asd.gltf'))
  skeleton.set(new DCL.Transform({ rotation: new DCL.Quaternion(0, 2, 1, 0) }))
  sceneWriter.addEntity('skeleton', skeleton)
  const code = sceneWriter.emitCode()

  t.is(
    code,
    `const skeleton = new Entity()\nskeleton.set(new GLTFShape('./asd.gltf'))\nskeleton.set(new Transform({ position: new Vector3(0, 0, 0), rotation: new Quaternion(0, 2, 1, 0), scale: new Vector3(1, 1, 1) }))\n\n`
  )
})

test('Unit - write 2 entities - should output TS of cube', t => {
  const sceneWriter = new SceneWriter(DCL)
  const sphere = new DCL.Entity()
  sphere.set(new DCL.SphereShape())
  sceneWriter.addEntity('sphere', sphere)
  const cube = new DCL.Entity()
  cube.set(new DCL.BoxShape())
  sceneWriter.addEntity('cube', cube)
  const code = sceneWriter.emitCode()

  t.is(
    code,
    `const sphere = new Entity()\nsphere.set(new SphereShape())\n\nconst cube = new Entity()\ncube.set(new BoxShape())\n\n`
  )
})

test('Unit - write 2 entities with the same name - should throw an error', t => {
  const sceneWriter = new SceneWriter(DCL)
  const sphere = new DCL.Entity()
  sphere.set(new DCL.SphereShape())
  sceneWriter.addEntity('sphere', sphere)

  t.throws(
    () => sceneWriter.addEntity('sphere', new DCL.Entity()),
    'There is already an entity with name "sphere"'
  )
})

test('Unit - write an entity with an existing parent - should throw an error', t => {
  const sceneWriter = new SceneWriter(DCL)
  const sphere = new DCL.Entity()
  sphere.set(new DCL.SphereShape())
  sceneWriter.addEntity('sphere', sphere)

  const cube = new DCL.Entity()
  cube.set(new DCL.BoxShape())
  cube.setParent(sphere)
  sceneWriter.addEntity('cube', cube)

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
  cube.set(new DCL.BoxShape())
  cube.setParent(sphere)
  sceneWriter.addEntity('cube', cube)

  t.throws(
    () => sceneWriter.emitCode(),
    'Parent entity of "cube" is missing, you should add parents first.'
  )
})
