export function intToIp(ipInt) {
  return `${ipInt >>> 24}.${ipInt >> 16 & 255}.${ipInt >> 8 & 255}.${ipInt & 255}`; // eslint-disable-line no-mixed-operators
}
