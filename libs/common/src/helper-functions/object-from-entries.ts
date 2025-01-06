export const array_to_object = <
  A extends T[number],
  T extends ReadonlyArray<string>,
  N,
>(
  arr: T extends ReadonlyArray<infer A> ? T : never,
  mapfn: (i: A) => N,
) => {
  const entries = arr.map((i) => [i, mapfn(i as unknown as A)])
  return Object.fromEntries(entries) as { [P in T[number]]: P }
}

const t = ['ss', 'ssd', 'sss'] as const
