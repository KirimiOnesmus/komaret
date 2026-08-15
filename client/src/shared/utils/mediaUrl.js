import config from '../config/env';

export function mediaUrl(pathOrUrl) {
  if (!pathOrUrl) return '';
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const base = config.apiBaseUrl || '';
  const origin = base.replace(/\/api\/v1\/?$/, '');
  const sep = pathOrUrl.startsWith('/') ? '' : '/';
  return `${origin}${sep}${pathOrUrl}`;
}

export default mediaUrl;