export function getUniqArray(array: any[]): any[] {
  if (!array || !array.length) return [];

  return Array.from(new Set(array));
}
