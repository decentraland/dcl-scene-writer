export function isLowerCaseChar(char: string) {
  return !!char && char.length === 1 && char.toLowerCase() === char
}

/*
Trasnform -> transfrom
BoxShape -> boxShape
GLTFShape -> gltfShape
*/
export function toCamelCase(pascalCase: string) {
  let camelCase = ''
  let shouldForceLowerCase = true
  for (let i = 0; i < pascalCase.length; i++) {
    camelCase += shouldForceLowerCase ? pascalCase[i].toLowerCase() : pascalCase[i]
    // when the char following the next char to process is lowercase we stop forcing lower case
    if (i < pascalCase.length - 2 && isLowerCaseChar(pascalCase[i + 2])) {
      shouldForceLowerCase = false
    }
  }
  return camelCase
}

// Blacklist of ECS names

export const blacklist = ['Shape', 'ObservableComponent']
