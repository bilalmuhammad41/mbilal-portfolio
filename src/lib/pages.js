import HomeView from "@/views/HomeView";
import ProjectsView from "@/views/ProjectsView";
import ProjectDetailView from "@/views/ProjectDetailView";
import ServicesView from "@/views/ServicesView";
import BlogView from "@/views/BlogView";
import ContactView from "@/views/ContactView";
import { projects } from "@/constants";

const projectPages = Object.fromEntries(
  projects.map((project) => [
    `/projects/${project.slug}`,
    {
      component: ProjectDetailView,
      title: project.title,
      project,
    },
  ])
);

export const PAGE_REGISTRY = {
  "/": { component: HomeView, title: "Home" },
  "/projects": { component: ProjectsView, title: "Projects" },
  ...projectPages,
  "/services": { component: ServicesView, title: "Services" },
  "/blog": { component: BlogView, title: "Blog" },
  "/contact": { component: ContactView, title: "Contact" },
};

export const PAGE_SLUGS = Object.keys(PAGE_REGISTRY);
