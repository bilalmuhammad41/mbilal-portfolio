import { projects } from "@/constants";

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default function ProjectDetailPage() {
  return null;
}
