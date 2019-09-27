export const boxSample = `
dcl.subscribe('sceneStart');

dcl.addEntity('box');
dcl.setParent('box', '0');
dcl.componentCreated('boxShape', 'engine.shape', 16);
dcl.componentUpdated('boxShape', JSON.stringify({"withCollisions":false,"visible":true}));
dcl.attachEntityComponent('box', 'engine.shape', 'boxShape');
dcl.updateEntityComponent('box', 'engine.transform', 1, JSON.stringify({"position":{"x":5,"y":0,"z":5},"rotation":{"x":0,"y":0,"z":1,"w":0},"scale":{"x":1,"y":1,"z":1}}));
`

export const gltfSample = `
dcl.subscribe('sceneStart');

dcl.addEntity('skeleton');
dcl.setParent('skeleton', '0');
dcl.componentCreated('gltfShape', 'engine.shape', 54);
dcl.componentUpdated('gltfShape', JSON.stringify({"withCollisions":true,"visible":true,"src":"./Skeleton.gltf"}));
dcl.attachEntityComponent('skeleton', 'engine.shape', 'gltfShape');
dcl.updateEntityComponent('skeleton', 'engine.transform', 1, JSON.stringify({"position":{"x":0,"y":0,"z":0},"rotation":{"x":0,"y":2,"z":1,"w":0},"scale":{"x":1,"y":1,"z":1}}));
`

export const ntfShape = `
dcl.subscribe('sceneStart');

dcl.addEntity('kitty');
dcl.setParent('kitty', '0');
dcl.componentCreated('nftShape', 'engine.shape', 22);
dcl.componentUpdated('nftShape', JSON.stringify({"withCollisions":true,"visible":true,"src":"ethereum://0x06012c8cf97BEaD5deAe237070F9587f8E7A266d/38376"}));
dcl.attachEntityComponent('kitty', 'engine.shape', 'nftShape');
`

export const sphereAndBoxSample = `
dcl.subscribe('sceneStart');

dcl.addEntity('sphere');
dcl.setParent('sphere', '0');
dcl.componentCreated('sphereShape', 'engine.shape', 17);
dcl.componentUpdated('sphereShape', JSON.stringify({"withCollisions":true,"visible":true}));
dcl.attachEntityComponent('sphere', 'engine.shape', 'sphereShape');

dcl.addEntity('box');
dcl.setParent('box', '0');
dcl.componentCreated('boxShape', 'engine.shape', 16);
dcl.componentUpdated('boxShape', JSON.stringify({"withCollisions":true,"visible":true}));
dcl.attachEntityComponent('box', 'engine.shape', 'boxShape');
`

export const parentSample = `
dcl.subscribe('sceneStart');

dcl.addEntity('sphere');
dcl.setParent('sphere', '0');
dcl.componentCreated('sphereShape', 'engine.shape', 17);
dcl.componentUpdated('sphereShape', JSON.stringify({"withCollisions":true,"visible":true}));
dcl.attachEntityComponent('sphere', 'engine.shape', 'sphereShape');

dcl.addEntity('box');
dcl.setParent('box', 'sphere');
dcl.componentCreated('boxShape', 'engine.shape', 16);
dcl.componentUpdated('boxShape', JSON.stringify({"withCollisions":true,"visible":true}));
dcl.attachEntityComponent('box', 'engine.shape', 'boxShape');
`

export const reuseComponentSample = `
dcl.subscribe('sceneStart');

dcl.addEntity('skeleton1');
dcl.setParent('skeleton1', '0');
dcl.componentCreated('gltfShape', 'engine.shape', 54);
dcl.componentUpdated('gltfShape', JSON.stringify({"withCollisions":true,"visible":true,"src":"./Skeleton.gltf"}));
dcl.attachEntityComponent('skeleton1', 'engine.shape', 'gltfShape');

dcl.addEntity('skeleton2');
dcl.setParent('skeleton2', '0');
dcl.attachEntityComponent('skeleton2', 'engine.shape', 'gltfShape');
`

export const multipleComponentsSample = `
dcl.subscribe('sceneStart');

dcl.addEntity('tree');
dcl.setParent('tree', '0');
dcl.componentCreated('gltfShape', 'engine.shape', 54);
dcl.componentUpdated('gltfShape', JSON.stringify({"withCollisions":true,"visible":true,"src":"./Tree.gltf"}));
dcl.attachEntityComponent('tree', 'engine.shape', 'gltfShape');

dcl.addEntity('rock');
dcl.setParent('rock', '0');
dcl.componentCreated('gltfShape_2', 'engine.shape', 54);
dcl.componentUpdated('gltfShape_2', JSON.stringify({"withCollisions":true,"visible":true,"src":"./Rock.gltf"}));
dcl.attachEntityComponent('rock', 'engine.shape', 'gltfShape_2');

dcl.addEntity('ground');
dcl.setParent('ground', '0');
dcl.componentCreated('gltfShape_3', 'engine.shape', 54);
dcl.componentUpdated('gltfShape_3', JSON.stringify({"withCollisions":true,"visible":true,"src":"./Ground.gltf"}));
dcl.attachEntityComponent('ground', 'engine.shape', 'gltfShape_3');`
