export type Nullable<T> = { [P in keyof T]: T[P] | null }
export type Partial<T> = { [P in keyof T]?: T[P] }

export type Proxy<T> = {
  get(): T
  set(value: T): void
}

export type Proxify<T> = {
  [P in keyof T]: Proxy<T[P]>
  // [P in T]: Proxy<TP>;
}

export function proxify<T>(o: T): Proxify<T> {
  console.log('xxxx')
  const result = {} as Proxify<T>
  for (const key in o) {
    result[key] = {
      get: () => o[key],
      set: (value) => {
        o[key] = value
      },
    }
  }
  return result
  // ... wrap proxies ...
}
function unproxify<T>(t: Proxify<T>): T {
  const result = {} as T
  for (const k in t) {
    result[k] = t[k].get()
  }
  return result
}

const test = ['AAA', 'AAAAS', 'NNN'] as const
const t = proxify(test)
console.log(t)
const xx = t[1]
const o = Object.fromEntries(t.entries())
console.log(o)

type Mutable<T> = {
  -readonly [key in keyof T]: T[key]
}
