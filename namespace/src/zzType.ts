namespace zz {
  export function int(x) {
    return x | 0;
  }
  export function uint(x) {
    return x >>> 0;
  }
  export function int8(x) {
    return (x << 24) >> 24;
  }
  export function int16(x) {
    return (x << 16) >> 16;
  }
  export function int32(x) {
    return x | 0;
  }
  export function uint8(x) {
    return x & 255;
  }
  export function uint16(x) {
    return x & 65535;
  }
  export function uint32(x) {
    return x >>> 0;
  }
  export function float(x) {
    return Math.fround(x);
  }
  export function double(x) {
    return +x;
  }
}
window.zz = zz;