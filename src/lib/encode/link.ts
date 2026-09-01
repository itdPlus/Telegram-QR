export function encodeLink(rawUrl: string): string {
  const url = rawUrl.trim();
  if(!url) return '';

  const lower = url.toLowerCase();
  if(lower.startsWith('http://') || lower.startsWith('https://')) return url;
  if(lower.startsWith('t.me/') || lower.startsWith('tg://')) return 'https://' + url.replace(/^tg:\/\//, 't.me/');

  return 'https://' + url;
}
