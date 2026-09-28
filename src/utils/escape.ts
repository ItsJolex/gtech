export function escapeHtml(str: string | null | undefined): string {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function safeUrl(url: string | null | undefined): string {
  if (typeof url !== 'string' || !url) return '/images/default.webp';
  if (url.startsWith('/') || url.startsWith('https://')) {
    return escapeHtml(url);
  }
  return '/images/default.webp';
}
