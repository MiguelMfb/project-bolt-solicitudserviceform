const getCrypto = () => {
  if (typeof globalThis === 'undefined') {
    return undefined;
  }

  return (globalThis as { crypto?: Crypto }).crypto;
};

const randomWithMath = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = Math.random() * 16 | 0;
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });

export const generateUUID = (): string => {
  const cryptoRef = getCrypto();

  if (cryptoRef?.randomUUID) {
    return cryptoRef.randomUUID();
  }

  if (cryptoRef?.getRandomValues) {
    const array = new Uint8Array(16);
    cryptoRef.getRandomValues(array);

    array[6] = (array[6] & 0x0f) | 0x40;
    array[8] = (array[8] & 0x3f) | 0x80;

    const hex = Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');

    return [
      hex.substring(0, 8),
      hex.substring(8, 12),
      hex.substring(12, 16),
      hex.substring(16, 20),
      hex.substring(20)
    ].join('-');
  }

  return randomWithMath();
};

export default generateUUID;
