export type UnpackAlt<T> = {
  [K in keyof T]: UnpackAlt<T[K]>
}
export type Unpack<T> = {
  [K in keyof T]: T[K] extends object ? Unpack<T[K]> : T[K]
}
