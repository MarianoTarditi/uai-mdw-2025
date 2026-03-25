const API_BASE_URL = import.meta.env.VITE_API_URL as string | undefined;
const STATIC_BASE_URL = import.meta.env.VITE_STATIC_URL as string | undefined;

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const getStaticBase = () => {
  if (STATIC_BASE_URL) return trimTrailingSlash(STATIC_BASE_URL);

  if (API_BASE_URL) {
    return trimTrailingSlash(API_BASE_URL.replace(/\/api\/?$/, ""));
  }

  return "";
};

const appendCacheBust = (url: string) => {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}t=${Date.now()}`;
};

export const resolveMediaUrl = (
  mediaPath?: string | null,
  withCacheBust = true,
) => {
  if (!mediaPath) return null;

  const normalized = mediaPath.trim();
  if (!normalized) return null;

  const isAbsolute = /^https?:\/\//i.test(normalized);
  const url = isAbsolute ? normalized : `${getStaticBase()}${normalized}`;

  return withCacheBust ? appendCacheBust(url) : url;
};

