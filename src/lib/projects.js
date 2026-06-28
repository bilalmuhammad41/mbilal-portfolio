import { projects } from "@/constants";

export function getProjectBySlug(slug) {
  return projects.find((project) => project.slug === slug) ?? null;
}

export function getProjectDetailSlug(project) {
  return `/projects/${project.slug}`;
}
