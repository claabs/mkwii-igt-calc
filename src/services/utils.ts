export function rotateArray<K>(ary: K[], n: number): K[] {
  const l = ary.length;
  const offset = (n + l) % l;
  return ary.slice(offset).concat(ary.slice(0, offset));
}
