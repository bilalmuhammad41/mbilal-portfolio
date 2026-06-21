import { blogPosts } from "@/constants/blog";
import PageTitle from "@/components/PageTransition/PageTitle";
import TransitionLink from "@/components/PageTransition/TransitionLink";
import "./views.css";

export default function BlogView() {
  return (
    <div className="view-page">
      <section className="blog section-container">
        <div className="page-header">
          <p className="section-label page-enter-fade">Journal</p>
          <PageTitle title="Blog" />
        </div>

        <div className="page-enter-fade">
        <div className="blog-list">
          {blogPosts.map((post) => (
            <article key={post.slug} className="blog-card">
              <div className="blog-card-meta">
                <span className="blog-card-tag">{post.tag}</span>
                <span className="blog-card-date">{post.date}</span>
              </div>
              <h3 className="blog-card-title">{post.title}</h3>
              <p className="blog-card-excerpt">{post.excerpt}</p>
            </article>
          ))}
        </div>

        <TransitionLink href="/contact" className="link-arrow blog-footer-link">
          Get in touch
        </TransitionLink>
        </div>
      </section>
    </div>
  );
}
