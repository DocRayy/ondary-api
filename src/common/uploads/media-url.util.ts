const MEDIA_BASE_URL =
  process.env.MEDIA_BASE_URL ??
  process.env.APP_URL ??
  process.env.API_URL ??
  'http://localhost:3000';

export function publicMediaUrl(value?: string | null) {
  const publicPath = publicMediaPath(value);
  if (!publicPath) {
    return null;
  }

  return new URL(publicPath, normalizedBaseUrl()).toString();
}

export function publicMediaPath(value?: string | null) {
  if (!value) {
    return null;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const normalized = value.replace(/\\/g, '/');
  const uploadIndex = normalized.indexOf('/uploads/');
  if (uploadIndex >= 0) {
    return normalized.slice(uploadIndex + 1);
  }

  const uploadsIndex = normalized.indexOf('uploads/');
  if (uploadsIndex >= 0) {
    return normalized.slice(uploadsIndex);
  }

  const trimmed = normalized.replace(/^\/+/, '');
  return trimmed;
}

export function withPhotoUrl<T>(data: T): T {
  if (Array.isArray(data)) {
    return data.map((item) => withPhotoUrl(item)) as T;
  }

  if (!data || typeof data !== 'object') {
    return data;
  }

  const record = data as Record<string, unknown>;
  const mapped: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(record)) {
    if (value instanceof Date) {
      mapped[key] = value;
      continue;
    }

    mapped[key] =
      value && typeof value === 'object' ? withPhotoUrl(value) : value;
  }

  if (typeof record.photo === 'string' && record.photo.length > 0) {
    mapped.photo = publicMediaPath(record.photo);
    mapped.photo_url = publicMediaUrl(record.photo);
  }

  if (typeof record.file_url === 'string' && record.file_url.length > 0) {
    mapped.file_url = publicMediaUrl(record.file_url);
  }

  if (typeof record.files === 'string' && record.files.length > 0) {
    mapped.files = publicMediaPath(record.files);
    mapped.file_url = publicMediaUrl(record.files);
  }

  if (typeof record.file_path === 'string' && record.file_path.length > 0) {
    mapped.file_path = record.file_path.replace(/\\/g, '/');
    mapped.file_path_url = publicMediaUrl(record.file_path);
  }

  return mapped as T;
}

function normalizedBaseUrl() {
  return MEDIA_BASE_URL.endsWith('/') ? MEDIA_BASE_URL : `${MEDIA_BASE_URL}/`;
}
