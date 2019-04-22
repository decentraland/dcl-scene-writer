import test from 'ava'
import * as DCL from 'decentraland-ecs'

import SceneWriter from '../src'
import {
  boxSample,
  gltfSample,
  sphereAndBoxSample,
  parentSample,
  reuseComponentSample,
  multipleComponentsSample
} from './samples'

function sanitize(sample) {
  return sample.trim()
}

test('Should output code for an entity with BoxShape and Transfrom', t => {
  const sceneWriter = new SceneWriter(DCL)
  const box = new DCL.Entity()
  box.set(new DCL.BoxShape())
  box.set(
    new DCL.Transform({
      position: new DCL.Vector3(5, 0, 5),
      rotation: new DCL.Quaternion(0, 0, 1, 0)
    })
  )
  sceneWriter.addEntity('box', box)
  const code = sceneWriter.emitCode()

  t.is(code, sanitize(boxSample))
})

test('Should output code for an entity with GLTFShape and Transform', t => {
  const sceneWriter = new SceneWriter(DCL)
  const skeleton = new DCL.Entity()
  skeleton.set(new DCL.GLTFShape('./Skeleton.gltf'))
  skeleton.set(new DCL.Transform({ rotation: new DCL.Quaternion(0, 2, 1, 0) }))
  sceneWriter.addEntity('skeleton', skeleton)
  const code = sceneWriter.emitCode()

  t.is(code, sanitize(gltfSample))
})

test('Should output code for two entities with SphereShape and BoxShape', t => {
  const sceneWriter = new SceneWriter(DCL)
  const sphere = new DCL.Entity()
  sphere.set(new DCL.SphereShape())
  sceneWriter.addEntity('sphere', sphere)
  const cube = new DCL.Entity()
  cube.set(new DCL.BoxShape())
  sceneWriter.addEntity('box', cube)
  const code = sceneWriter.emitCode()
  t.is(code, sanitize(sphereAndBoxSample))
})

test('Should throw an error when writing 2 entities with the same name', t => {
  const sceneWriter = new SceneWriter(DCL)
  const sphere = new DCL.Entity()
  sphere.set(new DCL.SphereShape())
  sceneWriter.addEntity('sphere', sphere)

  t.throws(
    () => sceneWriter.addEntity('sphere', new DCL.Entity()),
    'There is already an entity with name "sphere"'
  )
})

test('Should output code for an entity with a parent', t => {
  const sceneWriter = new SceneWriter(DCL)
  const sphere = new DCL.Entity()
  sphere.set(new DCL.SphereShape())
  sceneWriter.addEntity('sphere', sphere)

  const box = new DCL.Entity()
  box.set(new DCL.BoxShape())
  box.setParent(sphere)
  sceneWriter.addEntity('box', box)

  const code = sceneWriter.emitCode()

  t.is(code, sanitize(parentSample))
})

test('Should throw an error when writing an entity with a non-existent parent', t => {
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

test('Should output code for two entities that reuse a gltfShape component', t => {
  const sceneWriter = new SceneWriter(DCL)

  const gltf = new DCL.GLTFShape('./Skeleton.gltf')
  const skeleton1 = new DCL.Entity()
  skeleton1.set(gltf)
  const skeleton2 = new DCL.Entity()
  skeleton2.set(gltf)

  sceneWriter.addEntity('skeleton1', skeleton1)
  sceneWriter.addEntity('skeleton2', skeleton2)
  const code = sceneWriter.emitCode()

  t.is(code, sanitize(reuseComponentSample))
})

test('Should output code for multiple GLTFShape components with unique names', t => {
  const sceneWriter = new SceneWriter(DCL)

  const tree = new DCL.Entity()
  const treeShape = new DCL.GLTFShape('./Tree.gltf')
  tree.set(treeShape)

  const rock = new DCL.Entity()
  const rockShape = new DCL.GLTFShape('./Rock.gltf')
  rock.set(rockShape)

  const ground = new DCL.Entity()
  const groundShape = new DCL.GLTFShape('./Ground.gltf')
  ground.set(groundShape)

  sceneWriter.addEntity('tree', tree)
  sceneWriter.addEntity('rock', rock)
  sceneWriter.addEntity('ground', ground)

  const code = sceneWriter.emitCode()

  t.is(code, sanitize(multipleComponentsSample))
})
