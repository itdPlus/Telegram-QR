export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function buildQrFilename(extension: 'png' | 'svg'): string {
  const stamp = Date.now().toString(36);
  return `Telegram-QR-${stamp}.${extension}`;
}
