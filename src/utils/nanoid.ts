export function nanoid(size = 10): string {
  const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let id = '';
  const cryptoObj = globalThis.crypto || (globalThis as any).msCrypto;
  if (cryptoObj?.getRandomValues) {
    const arr = new Uint32Array(size);
    cryptoObj.getRandomValues(arr);
    for (let i = 0; i < size; i++) id += alphabet[arr[i] % alphabet.length];
    return id;
  }
  for (let i = 0; i < size; i++) id += alphabet[Math.floor(Math.random() * alphabet.length)];
  return id;
}

