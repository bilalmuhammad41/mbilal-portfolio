import { skills } from "../../constants";
import "./Skills.css";

const Skills = () => {
  return (
    <section className="skills section-container" id="skills">
      <p className="section-label">Expertise</p>
      <h2 className="section-heading">What I do</h2>
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
        <a href="#projects" className="link-arrow">
          View all projects
        </a>
      </div>
    </section>
  );
};

export default Skills;
