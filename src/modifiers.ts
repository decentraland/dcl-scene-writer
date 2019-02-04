type Vector3Args = { x: number; y: number; z: number }

export class Vector3 {
  public x: number
  public y: number
  public z: number

  constructor({ x, y, z }: Vector3Args) {
    this.x = x
    this.y = y
    this.z = z
  }
}

type QuaternionArgs = { x: number; y: number; z: number; w: number }

export class Quaternion {
  public x: number
  public y: number
  public z: number
  public w: number

  constructor({ x, y, z, w }: QuaternionArgs) {
    this.x = x
    this.y = y
    this.z = z
    this.w = w
  }
}

type TransformArg = {
  position?: Vector3
  rotation?: Quaternion
  scale?: Vector3
}

export class Transform {
  public position: Vector3
  public rotation: Quaternion
  public scale: Vector3

  constructor({ position, rotation, scale }: TransformArg) {
    this.position = position
    this.rotation = rotation
    this.scale = scale
  }
}
