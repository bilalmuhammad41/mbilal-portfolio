"use client";

import { useState } from "react";
import { projects } from "../../constants";
import "./Projects.css";
import ProjectDetails from "../../components/ProjectDetails/ProjectDetails";

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <section className="projects section-container" id="projects">
      <p className="section-label">Portfolio</p>
      <h2 className="section-heading"></h2>

      <div className="projects-list">
        {projects.map((project, index) => (
          <a
            key={index}
            href={project.link}
            className="project-card"
            onClick={(e) => {
              e.preventDefault();
              setSelectedProject(project);
            }}
          >
            <div className="project-card-visual">
              <div className="project-card-placeholder">
                <span className="project-card-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
            </div>
            <div className="project-card-info">
              <h3 className="project-card-title">
                <strong>{project.title}</strong>
                <span className="project-card-dash"> – </span>
                {project.description}
              </h3>
              <span className="project-card-year">{project.year}</span>
            </div>
          </a>
        ))}
      </div>

      <div className="projects-footer">
        <a href="#contact" className="link-arrow">
          Get in touch
        </a>
      </div>

      <ProjectDetails
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};

export default Projects;
