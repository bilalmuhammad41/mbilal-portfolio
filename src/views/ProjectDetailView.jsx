import PageTitle from "@/components/PageTransition/PageTitle";
import TransitionLink from "@/components/PageTransition/TransitionLink";
import "./ProjectDetailView.css";
import "./views.css";

export default function ProjectDetailView({ project }) {
  if (!project) return null;

  return (
    <div className="view-page">
      <section className="project-detail section-container">
        <div className="page-header">
          <p className="section-label page-enter-fade">Project</p>
          <PageTitle title={project.title} />
        </div>

        <div className="page-enter-fade">
          <p className="project-detail-lead">{project.description}</p>

          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="project-detail-live link-arrow"
            >
              Visit live site
            </a>
          )}
        </div>

        <div className="page-enter-fade project-detail-meta">
          <div className="project-detail-meta-item">
            <h3 className="project-detail-meta-label">Role</h3>
            <p className="project-detail-meta-value">
              Design &amp; Development
            </p>
          </div>
          <div className="project-detail-meta-item">
            <h3 className="project-detail-meta-label">Context</h3>
            <p className="project-detail-meta-value">
              Crafting a premium digital presence with a focus on kinetics and
              typography.
            </p>
          </div>
          <div className="project-detail-meta-item">
            <h3 className="project-detail-meta-label">Timeline</h3>
            <p className="project-detail-meta-value">
              {project.year || "2023 – 2024"}
            </p>
          </div>
        </div>

        <div className="page-enter-fade project-detail-approach">
          <h3 className="project-detail-meta-label">The approach</h3>
          <p className="project-detail-approach-text">
            By prioritizing high-contrast typography and smooth GSAP animations,
            we created a brutalist yet elegant layout that keeps users engaged.
          </p>
        </div>

        <div className="page-enter-fade project-detail-visual">
          <div className="project-detail-visual-frame">
            <span className="project-detail-visual-label">Project visuals</span>
          </div>
        </div>

        <div className="page-enter-fade project-detail-footer">
          <TransitionLink href="/projects" className="link-arrow">
            All projects
          </TransitionLink>
        </div>
      </section>
    </div>
  );
}
