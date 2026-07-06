/** Base path for GitHub Pages project sites (e.g. /left-brain-right-pixels). Empty for local dev. */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a public asset path with the configured base path. */
export function withBasePath(path) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalized}`;
}
