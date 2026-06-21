import { skills } from "@/constants";
import PageTitle from "@/components/PageTransition/PageTitle";
import TransitionLink from "@/components/PageTransition/TransitionLink";
import "@/sections/Skills/Skills.css";
import "./views.css";

export default function ServicesView() {
  return (
    <div className="view-page">
      <section className="skills section-container">
        <div className="page-header">
          <p className="section-label">Expertise</p>
          <PageTitle title="Our services" />
        </div>

        <p className="skills-subtitle">
          From motion-driven interfaces to performant web apps — I design and
          build digital experiences for the modern web.
        </p>

        <div className="skills-grid">
          {skills.map((skill, index) => (
            <article key={index} className="skill-card">
              <h3 className="skill-card-title">{skill.title}</h3>
              <p className="skill-card-desc">{skill.description}</p>
            </article>
          ))}
        </div>

        <div className="skills-footer">
          <TransitionLink href="/projects" className="link-arrow">
            View all projects
          </TransitionLink>
        </div>
      </section>
    </div>
  );
}
