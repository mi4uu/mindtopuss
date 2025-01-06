export const array_to_object = <T extends Readonly<string>, N>(
  arr: T[],
  mapfn: (i: T) => N,
) => {
  const entries = arr.map((i) => [i, mapfn(i)])
  return Object.fromEntries(entries) as Record<T, N>
}

const t = ['ss', 'ssd', 'sss'] as const
