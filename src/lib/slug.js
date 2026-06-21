import { basePath } from "./basePath";

/** Normalize pathname to a registry slug (e.g. "/projects"). */
export function normalizeSlug(pathname) {
  let slug = pathname || "/";

  if (basePath && slug.startsWith(basePath)) {
    slug = slug.slice(basePath.length) || "/";
  }

  if (slug.length > 1 && slug.endsWith("/")) {
    slug = slug.slice(0, -1);
  }

  return slug || "/";
}

export function isInternalPath(href) {
  return href.startsWith("/") && !href.startsWith("//");
}
