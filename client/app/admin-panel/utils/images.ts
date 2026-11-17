export function readImageAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Could not load that image.'));
      }
    };
    reader.onerror = () => reject(new Error('Could not load that image.'));
    reader.readAsDataURL(file);
  });
}
