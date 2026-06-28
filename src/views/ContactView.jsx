"use client";

import { useState } from "react";
import { interestOptions } from "@/constants/blog";
import PageTitle from "@/components/PageTransition/PageTitle";
import "./ContactView.css";

export default function ContactView() {
  const [interests, setInterests] = useState([]);
  const [fileName, setFileName] = useState("No file chosen");
  const [submitted, setSubmitted] = useState(false);

  const toggleInterest = (option) => {
    setInterests((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="view-page">
      <section className="contact section-container">
        <div className="page-header contact-intro">
          <p className="section-label page-enter-fade">Get in touch</p>
          <PageTitle
            title="Hey! Tell us all the things"
            className="contact-headline page-title"
          />
        </div>

        <form className="contact-form page-enter-fade" onSubmit={handleSubmit} noValidate>
          <fieldset className="contact-fieldset">
            <legend className="contact-legend">I&apos;m interested in...</legend>
            <div className="contact-chips">
              {interestOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`contact-chip ${interests.includes(option) ? "contact-chip--active" : ""}`}
                  onClick={() => toggleInterest(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="contact-fields">
            <label className="contact-label">
              Your name
              <input
                className="contact-input"
                type="text"
                name="name"
                required
                autoComplete="name"
              />
            </label>

            <label className="contact-label">
              Email
              <input
                className="contact-input"
                type="email"
                name="email"
                required
                autoComplete="email"
              />
            </label>

            <label className="contact-label">
              Tell us about your project
              <textarea
                className="contact-input contact-textarea"
                name="message"
                rows={5}
                required
              />
            </label>

            <label className="contact-label">
              Project budget (USD)
              <input
                className="contact-input"
                type="text"
                name="budget"
                inputMode="numeric"
                placeholder="e.g. 5000"
              />
            </label>

            <div className="contact-file">
              <label className="contact-file-label">
                <span>Add attachment</span>
                <input
                  type="file"
                  className="contact-file-input"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    setFileName(file ? file.name : "No file chosen");
                  }}
                />
              </label>
              <span className="contact-file-name">{fileName}</span>
            </div>
          </div>

          <button type="submit" className="contact-submit">
            Send request
          </button>

          {submitted && (
            <p className="contact-success" role="status">
              Thanks — your message has been recorded. We&apos;ll be in touch soon.
            </p>
          )}

          <p className="contact-recaptcha">
            This site is protected by reCAPTCHA and the Google Privacy Policy
            and Terms of Service apply.
          </p>
        </form>
      </section>
    </div>
  );
}
