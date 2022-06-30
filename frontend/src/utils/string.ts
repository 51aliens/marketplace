export const abbrAddress = (address: string, m?: number, n?: number) => {
  if (!m) {
    m = 7;
  }
  if (!n) {
    n = 3;
  }
  return `${address.slice(0, m)}${'.'.repeat(n)}${address.slice(-n)}`;
};
