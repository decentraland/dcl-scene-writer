export const boxSample = `const box = new Entity()
engine.addEntity(box)
const boxShape = new BoxShape()
box.addComponentOrReplace(boxShape)
const transform = new Transform({
  position: new Vector3(5, 0, 5),
  rotation: new Quaternion(0, 0, 1, 0),
  scale: new Vector3(1, 1, 1)
})
box.addComponentOrReplace(transform)`

export const gltfSample = `const skeleton = new Entity()
engine.addEntity(skeleton)
const gltfShape = new GLTFShape('./Skeleton.gltf')
skeleton.addComponentOrReplace(gltfShape)
const transform = new Transform({
  position: new Vector3(0, 0, 0),
  rotation: new Quaternion(0, 2, 1, 0),
  scale: new Vector3(1, 1, 1)
})
skeleton.addComponentOrReplace(transform)`

export const ntfShape = `
const kitty = new Entity()
engine.addEntity(kitty)
const nftShape = new NFTShape('ethereum://0x06012c8cf97BEaD5deAe237070F9587f8E7A266d/38376')
kitty.addComponentOrReplace(nftShape)`

export const sphereAndBoxSample = `
const sphere = new Entity()
engine.addEntity(sphere)
const sphereShape = new SphereShape()
sphere.addComponentOrReplace(sphereShape)

const box = new Entity()
engine.addEntity(box)
const boxShape = new BoxShape()
box.addComponentOrReplace(boxShape)`

export const parentSample = `
const sphere = new Entity()
engine.addEntity(sphere)
const sphereShape = new SphereShape()
sphere.addComponentOrReplace(sphereShape)

const box = new Entity()
engine.addEntity(box)
box.setParent(sphere)
const boxShape = new BoxShape()
box.addComponentOrReplace(boxShape)`

export const reuseComponentSample = `
const skeleton1 = new Entity()
engine.addEntity(skeleton1)
const gltfShape = new GLTFShape('./Skeleton.gltf')
skeleton1.addComponentOrReplace(gltfShape)

const skeleton2 = new Entity()
engine.addEntity(skeleton2)
skeleton2.addComponentOrReplace(gltfShape)`

export const multipleComponentsSample = `
const tree = new Entity()
engine.addEntity(tree)
const gltfShape = new GLTFShape('./Tree.gltf')
tree.addComponentOrReplace(gltfShape)

const rock = new Entity()
engine.addEntity(rock)
const gltfShape_2 = new GLTFShape('./Rock.gltf')
rock.addComponentOrReplace(gltfShape_2)

const ground = new Entity()
engine.addEntity(ground)
const gltfShape_3 = new GLTFShape('./Ground.gltf')
ground.addComponentOrReplace(gltfShape_3)`
