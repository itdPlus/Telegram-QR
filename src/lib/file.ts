const EXTENSION_MIME: Record<string, string> = {
  svg: 'image/svg+xml',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp'
};

const inferMimeFromName = (fileName: string): string | undefined => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  return extension ? EXTENSION_MIME[extension] : undefined;
};

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// Some platforms hand FileReader a File with an empty `type` for .svg
// uploads, which produces a mime-less `data:;base64,...` URL that browsers
// then refuse to decode as an image. Re-stamping the mime from the file
// extension makes the resulting data URL reliably decodable everywhere.
export async function readImageFileAsDataUrl(file: File): Promise<string> {
  const dataUrl = await readFileAsDataUrl(file);
  if(file.type) return dataUrl;

  const inferredMime = inferMimeFromName(file.name);
  if(!inferredMime) return dataUrl;

  const base64Index = dataUrl.indexOf('base64,');
  if(base64Index === -1) return dataUrl;

  return `data:${inferredMime};base64,${dataUrl.slice(base64Index + 'base64,'.length)}`;
}
