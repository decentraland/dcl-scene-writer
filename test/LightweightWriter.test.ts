import test from 'ava'
import * as DCL from 'decentraland-ecs'

import {
  boxSample,
  gltfSample,
  sphereAndBoxSample,
  parentSample,
  reuseComponentSample,
  multipleComponentsSample,
  ntfShape
} from './samples/LightweightWriter.data'

import { LightweightWriter } from '../src/LightweightWriter'

function sanitize(sample) {
  return sample.trim()
}

test('Should output code for an entity with BoxShape and Transfrom', t => {
  const sceneWriter = new LightweightWriter(DCL)
  const box = new DCL.Entity()
  box.addComponentOrReplace(new DCL.BoxShape())
  box.addComponentOrReplace(
    new DCL.Transform({
      position: new DCL.Vector3(5, 0, 5),
      rotation: new DCL.Quaternion(0, 0, 1, 0)
    })
  )
  sceneWriter.addEntity('box', box)
  const code = sceneWriter.emitCode()

  t.is(sanitize(code), sanitize(boxSample))
})

test('Should output code for an entity with GLTFShape and Transform', t => {
  const sceneWriter = new LightweightWriter(DCL)
  const skeleton = new DCL.Entity()
  const skeletonShape = new DCL.GLTFShape('./Skeleton.gltf')
  skeletonShape.withCollisions = true
  skeleton.addComponentOrReplace(skeletonShape)
  skeleton.addComponentOrReplace(new DCL.Transform({ rotation: new DCL.Quaternion(0, 2, 1, 0) }))
  sceneWriter.addEntity('skeleton', skeleton)
  const code = sceneWriter.emitCode()

  t.is(sanitize(code), sanitize(gltfSample))
})

test('Should output code for an entity with NFTShape', t => {
  const sceneWriter = new LightweightWriter(DCL)
  const kitty = new DCL.Entity()
  const nftShape = new DCL.NFTShape('ethereum://0x06012c8cf97BEaD5deAe237070F9587f8E7A266d/38376')
  nftShape.withCollisions = true
  kitty.addComponentOrReplace(nftShape)
  sceneWriter.addEntity('kitty', kitty)
  const code = sceneWriter.emitCode()

  t.is(sanitize(code), sanitize(ntfShape))
})

test('Should output code for two entities with SphereShape and BoxShape', t => {
  const sceneWriter = new LightweightWriter(DCL)
  const sphere = new DCL.Entity()
  const sphereShape = new DCL.SphereShape()
  sphereShape.withCollisions = true
  sphere.addComponentOrReplace(sphereShape)
  sceneWriter.addEntity('sphere', sphere)
  const cube = new DCL.Entity()
  const boxShape = new DCL.BoxShape()
  boxShape.withCollisions = true
  cube.addComponentOrReplace(boxShape)
  sceneWriter.addEntity('box', cube)
  const code = sceneWriter.emitCode()
  t.is(sanitize(code), sanitize(sphereAndBoxSample))
})

test('Should throw an error when writing 2 entities with the same name', t => {
  const sceneWriter = new LightweightWriter(DCL)
  const sphere = new DCL.Entity()
  sphere.addComponentOrReplace(new DCL.SphereShape())
  sceneWriter.addEntity('sphere', sphere)

  t.throws(
    () => sceneWriter.addEntity('sphere', new DCL.Entity()),
    'There is already an entity with name "sphere"'
  )
})

test('Should output code for an entity with a parent', t => {
  const sceneWriter = new LightweightWriter(DCL)
  const sphere = new DCL.Entity()
  const sphereShape = new DCL.SphereShape()
  sphereShape.withCollisions = true
  sphere.addComponentOrReplace(sphereShape)
  sceneWriter.addEntity('sphere', sphere)

  const box = new DCL.Entity()
  const boxShape = new DCL.BoxShape()
  boxShape.withCollisions = true
  box.addComponentOrReplace(boxShape)
  box.setParent(sphere)
  sceneWriter.addEntity('box', box)

  const code = sceneWriter.emitCode()

  t.is(sanitize(code), sanitize(parentSample))
})

test('Should throw an error when writing an entity with a non-existent parent', t => {
  const sceneWriter = new LightweightWriter(DCL)
  const sphere = new DCL.Entity()
  const cube = new DCL.Entity()
  cube.addComponentOrReplace(new DCL.BoxShape())
  cube.setParent(sphere)
  sceneWriter.addEntity('cube', cube)

  t.throws(
    () => sceneWriter.emitCode(),
    'Parent entity of "cube" is missing, you should add parents first.'
  )
})

test('Should output code for two entities that reuse a gltfShape component', t => {
  const sceneWriter = new LightweightWriter(DCL)

  const gltf = new DCL.GLTFShape('./Skeleton.gltf')
  gltf.withCollisions = true
  const skeleton1 = new DCL.Entity()
  skeleton1.addComponentOrReplace(gltf)
  const skeleton2 = new DCL.Entity()
  skeleton2.addComponentOrReplace(gltf)

  sceneWriter.addEntity('skeleton1', skeleton1)
  sceneWriter.addEntity('skeleton2', skeleton2)
  const code = sceneWriter.emitCode()

  t.is(sanitize(code), sanitize(reuseComponentSample))
})

test('Should output code for multiple GLTFShape components with unique names', t => {
  const sceneWriter = new LightweightWriter(DCL)

  const tree = new DCL.Entity()
  const treeShape = new DCL.GLTFShape('./Tree.gltf')
  treeShape.withCollisions = true
  tree.addComponentOrReplace(treeShape)

  const rock = new DCL.Entity()
  const rockShape = new DCL.GLTFShape('./Rock.gltf')
  rockShape.withCollisions = true
  rock.addComponentOrReplace(rockShape)

  const ground = new DCL.Entity()
  const groundShape = new DCL.GLTFShape('./Ground.gltf')
  groundShape.withCollisions = true
  ground.addComponentOrReplace(groundShape)

  sceneWriter.addEntity('tree', tree)
  sceneWriter.addEntity('rock', rock)
  sceneWriter.addEntity('ground', ground)

  const code = sceneWriter.emitCode()

  t.is(sanitize(code), sanitize(multipleComponentsSample))
})
