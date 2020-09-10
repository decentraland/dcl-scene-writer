export const boxSample = `
dcl.subscribe('sceneStart');

dcl.addEntity('1');
dcl.setParent('1', '0');
dcl.componentCreated('boxShape', 'engine.shape', 16);
dcl.componentUpdated('boxShape', JSON.stringify({"withCollisions":true,"isPointerBlocker":true,"visible":true}));
dcl.attachEntityComponent('1', 'engine.shape', 'boxShape');
dcl.updateEntityComponent('1', 'engine.transform', 1, JSON.stringify({"position":{"x":5,"y":0,"z":5},"rotation":{"x":0,"y":0,"z":1,"w":0},"scale":{"x":1,"y":1,"z":1}}));
`

export const gltfSample = `
dcl.subscribe('sceneStart');

dcl.addEntity('1');
dcl.setParent('1', '0');
dcl.componentCreated('gltfShape', 'engine.shape', 54);
dcl.componentUpdated('gltfShape', JSON.stringify({"withCollisions":true,"isPointerBlocker":true,"visible":true,"src":"./Skeleton.gltf"}));
dcl.attachEntityComponent('1', 'engine.shape', 'gltfShape');
dcl.updateEntityComponent('1', 'engine.transform', 1, JSON.stringify({"position":{"x":0,"y":0,"z":0},"rotation":{"x":0,"y":2,"z":1,"w":0},"scale":{"x":1,"y":1,"z":1}}));
`

export const ntfShape = `
dcl.subscribe('sceneStart');

dcl.addEntity('1');
dcl.setParent('1', '0');
dcl.componentCreated('nftShape', 'engine.shape', 22);
dcl.componentUpdated('nftShape', JSON.stringify({"withCollisions":true,"isPointerBlocker":true,"visible":true,"src":"ethereum://0x06012c8cf97BEaD5deAe237070F9587f8E7A266d/38376","color":{"r":255,"g":0,"b":0},"style":0}));
dcl.attachEntityComponent('1', 'engine.shape', 'nftShape');
`

export const correctTransformName = `
dcl.subscribe('sceneStart');

dcl.addEntity('1');
dcl.setParent('1', '0');
dcl.updateEntityComponent('1', 'engine.transform', 1, JSON.stringify({"position":{"x":0,"y":0,"z":0},"rotation":{"x":0,"y":2,"z":1,"w":0},"scale":{"x":1,"y":1,"z":1}}));

dcl.addEntity('2');
dcl.setParent('2', '0');
dcl.updateEntityComponent('2', 'engine.transform', 1, JSON.stringify({"position":{"x":0,"y":0,"z":0},"rotation":{"x":0,"y":2,"z":1,"w":0},"scale":{"x":1,"y":1,"z":1}}));
`

export const sphereAndBoxSample = `
dcl.subscribe('sceneStart');

dcl.addEntity('1');
dcl.setParent('1', '0');
dcl.componentCreated('sphereShape', 'engine.shape', 17);
dcl.componentUpdated('sphereShape', JSON.stringify({"withCollisions":true,"isPointerBlocker":true,"visible":true}));
dcl.attachEntityComponent('1', 'engine.shape', 'sphereShape');

dcl.addEntity('2');
dcl.setParent('2', '0');
dcl.componentCreated('boxShape', 'engine.shape', 16);
dcl.componentUpdated('boxShape', JSON.stringify({"withCollisions":true,"isPointerBlocker":true,"visible":true}));
dcl.attachEntityComponent('2', 'engine.shape', 'boxShape');
`

export const parentSample = `
dcl.subscribe('sceneStart');

dcl.addEntity('1');
dcl.setParent('1', '0');
dcl.componentCreated('sphereShape', 'engine.shape', 17);
dcl.componentUpdated('sphereShape', JSON.stringify({"withCollisions":true,"isPointerBlocker":true,"visible":true}));
dcl.attachEntityComponent('1', 'engine.shape', 'sphereShape');

dcl.addEntity('2');
dcl.setParent('2', '1');
dcl.componentCreated('boxShape', 'engine.shape', 16);
dcl.componentUpdated('boxShape', JSON.stringify({"withCollisions":true,"isPointerBlocker":true,"visible":true}));
dcl.attachEntityComponent('2', 'engine.shape', 'boxShape');
`

export const reuseComponentSample = `
dcl.subscribe('sceneStart');

dcl.addEntity('1');
dcl.setParent('1', '0');
dcl.componentCreated('gltfShape', 'engine.shape', 54);
dcl.componentUpdated('gltfShape', JSON.stringify({"withCollisions":true,"isPointerBlocker":true,"visible":true,"src":"./Skeleton.gltf"}));
dcl.attachEntityComponent('1', 'engine.shape', 'gltfShape');

dcl.addEntity('2');
dcl.setParent('2', '0');
dcl.attachEntityComponent('2', 'engine.shape', 'gltfShape');
`

export const multipleComponentsSample = `
dcl.subscribe('sceneStart');

dcl.addEntity('1');
dcl.setParent('1', '0');
dcl.componentCreated('gltfShape', 'engine.shape', 54);
dcl.componentUpdated('gltfShape', JSON.stringify({"withCollisions":true,"isPointerBlocker":true,"visible":true,"src":"./Tree.gltf"}));
dcl.attachEntityComponent('1', 'engine.shape', 'gltfShape');

dcl.addEntity('2');
dcl.setParent('2', '0');
dcl.componentCreated('gltfShape2', 'engine.shape', 54);
dcl.componentUpdated('gltfShape2', JSON.stringify({"withCollisions":true,"isPointerBlocker":true,"visible":true,"src":"./Rock.gltf"}));
dcl.attachEntityComponent('2', 'engine.shape', 'gltfShape2');

dcl.addEntity('3');
dcl.setParent('3', '0');
dcl.componentCreated('gltfShape3', 'engine.shape', 54);
dcl.componentUpdated('gltfShape3', JSON.stringify({"withCollisions":true,"isPointerBlocker":true,"visible":true,"src":"./Ground.gltf"}));
dcl.attachEntityComponent('3', 'engine.shape', 'gltfShape3');`

export const componentAttributesSample = `
dcl.subscribe('sceneStart');

dcl.addEntity('1');
dcl.setParent('1', '0');
dcl.componentCreated('gltfShape', 'engine.shape', 54);
dcl.componentUpdated('gltfShape', JSON.stringify({"withCollisions":true,"isPointerBlocker":true,"visible":true,"src":"./Tree.gltf"}));
dcl.attachEntityComponent('1', 'engine.shape', 'gltfShape');

dcl.addEntity('2');
dcl.setParent('2', '0');
dcl.componentCreated('gltfShape2', 'engine.shape', 54);
dcl.componentUpdated('gltfShape2', JSON.stringify({"withCollisions":false,"isPointerBlocker":true,"visible":true,"src":"./Rock.gltf"}));
dcl.attachEntityComponent('2', 'engine.shape', 'gltfShape2');
`
