export const boxSample = `
const box = new Entity()
const boxShape = new BoxShape()
box.addComponentOrReplace(boxShape)
const transform = new Transform({
  position: new Vector3(5, 0, 5),
  rotation: new Quaternion(0, 0, 1, 0),
  scale: new Vector3(1, 1, 1)
})
box.addComponentOrReplace(transform)
engine.addEntity(box)`

export const gltfSample = `
const skeleton = new Entity()
const gltfShape = new GLTFShape('./Skeleton.gltf')
skeleton.addComponentOrReplace(gltfShape)
const transform = new Transform({
  position: new Vector3(0, 0, 0),
  rotation: new Quaternion(0, 2, 1, 0),
  scale: new Vector3(1, 1, 1)
})
skeleton.addComponentOrReplace(transform)
engine.addEntity(skeleton)`

export const ntfShape = `
const kitty = new Entity()
const nftShape = new NFTShape('ethereum://0x06012c8cf97BEaD5deAe237070F9587f8E7A266d/38376')
kitty.addComponentOrReplace(nftShape)
engine.addEntity(kitty)`

export const sphereAndBoxSample = `
const sphere = new Entity()
const sphereShape = new SphereShape()
sphere.addComponentOrReplace(sphereShape)
engine.addEntity(sphere)

const box = new Entity()
const boxShape = new BoxShape()
box.addComponentOrReplace(boxShape)
engine.addEntity(box)`

export const parentSample = `
const sphere = new Entity()
const sphereShape = new SphereShape()
sphere.addComponentOrReplace(sphereShape)
engine.addEntity(sphere)

const box = new Entity()
box.setParent(sphere)
const boxShape = new BoxShape()
box.addComponentOrReplace(boxShape)
engine.addEntity(box)`

export const reuseComponentSample = `
const skeleton1 = new Entity()
const gltfShape = new GLTFShape('./Skeleton.gltf')
skeleton1.addComponentOrReplace(gltfShape)
engine.addEntity(skeleton1)

const skeleton2 = new Entity()
skeleton2.addComponentOrReplace(gltfShape)
engine.addEntity(skeleton2)`

export const multipleComponentsSample = `
const tree = new Entity()
const gltfShape = new GLTFShape('./Tree.gltf')
tree.addComponentOrReplace(gltfShape)
engine.addEntity(tree)

const rock = new Entity()
const gltfShape_2 = new GLTFShape('./Rock.gltf')
rock.addComponentOrReplace(gltfShape_2)
engine.addEntity(rock)

const ground = new Entity()
const gltfShape_3 = new GLTFShape('./Ground.gltf')
ground.addComponentOrReplace(gltfShape_3)
engine.addEntity(ground)`
