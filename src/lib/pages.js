import HomeView from "@/views/HomeView";
import ProjectsView from "@/views/ProjectsView";
import ServicesView from "@/views/ServicesView";
import BlogView from "@/views/BlogView";
import ContactView from "@/views/ContactView";

export const PAGE_REGISTRY = {
  "/": { component: HomeView, title: "Home" },
  "/projects": { component: ProjectsView, title: "Projects" },
  "/services": { component: ServicesView, title: "Services" },
  "/blog": { component: BlogView, title: "Blog" },
  "/contact": { component: ContactView, title: "Contact" },
};

export const PAGE_SLUGS = Object.keys(PAGE_REGISTRY);
