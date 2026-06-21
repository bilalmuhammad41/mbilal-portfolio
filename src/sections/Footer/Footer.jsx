import { socials } from "../../constants";
import "./Footer.css";
import Marquee from "../../components/Marquee/Marquee";

const Footer = ({ formattedTime }) => {
  return (
    <footer className="footer" id="contact">
      <div className="footer-cta section-container">
        <h2 className="footer-headline">
          Have
          <br />
          an idea?
        </h2>
        <a
          href="mailto:bilalmohammad41@gmail.com"
          className="footer-email underline-effect"
        >
          bilalmohammad41@gmail.com
        </a>
      </div>

      <Marquee text="contact" separator="-" />

      <div className="footer-bottom section-container">
        <div className="footer-info">
          <div className="footer-location">
            <p className="footer-label">Based in</p>
            <p className="footer-value">Pakistan</p>
          </div>
          <div className="footer-location">
            <p className="footer-label">Available</p>
            <p className="footer-value">Freelance from Aug 2026</p>
          </div>
        </div>

        <ul className="footer-socials">
          {socials.map((social, index) => (
            <li key={index} className="footer-social-item">
              <a
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-effect"
              >
                {social.name}
              </a>
            </li>
          ))}
        </ul>

        <div className="footer-meta">
          <span>2026</span>
          <span>{formattedTime} PKT</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
