import "./Home.css";
import { motion } from "framer-motion";

export default function Home() {
  const genres = [
    { name: "Fantasy", desc: "Mythology, epics, and imaginative worlds" },
    { name: "Sci-Fi", desc: "Futuristic science and speculative technology" },
    { name: "Horror", desc: "Dark fiction and psychological thrillers" },
    { name: "Romance", desc: "Love stories and emotional journeys" },
    { name: "History", desc: "Civilizations, events, and biographies" },
    { name: "Psychology", desc: "Human behavior and cognitive studies" },
    { name: "Mystery", desc: "Crime, suspense, and investigations" },
    { name: "Poetry", desc: "Verse, expression, and literary art" },
  ];

  return (
    <div className="home-page">
      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Library Management System</h1>
            <p>
              A centralized platform to manage library collections, enforce
              borrowing policies, and ensure fair access for all users.
            </p>

            <div className="hero-actions">
              <a href="/resources" className="btn-primary">Browse Books</a>
              <a href="#policies" className="btn-secondary">View Policies</a>
            </div>

            <div className="hero-quote">
              “A library is not a luxury but one of the necessities of life.”
              <span className="hero-author">— Henry Ward Beecher</span>
            </div>
          </motion.div>

          <motion.div
            className="tutorial"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3>How to Borrow Books</h3>

            <div className="tutorial-step">
              <div className="step-number">1</div>
              <div>
                <h4>Search & Select</h4>
                <p>Find books by genre, author, or publication year.</p>
              </div>
            </div>

            <div className="tutorial-step">
              <div className="step-number">2</div>
              <div>
                <h4>Borrow Within Limits</h4>
                <p>Borrow up to six books, one copy per title.</p>
              </div>
            </div>

            <div className="tutorial-step">
              <div className="step-number">3</div>
              <div>
                <h4>Manage & Return</h4>
                <p>Track due dates, renew, or return books easily.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* GENRES */}
      <section className="genre-section">
        <div className="genre-inner">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Browse by Genre
          </motion.h2>

          <div className="genre-grid">
            {genres.map((g, i) => (
              <motion.div
                key={g.name}
                className="genre-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                transition={{ delay: i * 0.05 }}
                onClick={() =>
                  (window.location.href =
                    `/resources?genre=${encodeURIComponent(g.name)}`)
                }
              >
                <h4>{g.name}</h4>
                <p>{g.desc}</p>
                <div className="genre-cta">Explore books →</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="highlights-section">
        <div className="highlights-inner">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Library Highlights
          </motion.h2>

          <div className="highlights-grid">
            {[
              {
                title: "Multi-Copy Inventory",
                text: "Each book title can have multiple copies tracked centrally.",
              },
              {
                title: "Automated Borrow Rules",
                text: "Borrow limits and restrictions are enforced automatically.",
              },
              {
                title: "Renewals & Fines",
                text: "Renewals and overdue fines are calculated by the system.",
              },
              {
                title: "Role-Based Access",
                text: "Admin and student roles ensure controlled access.",
              },
              {
                title: "Borrowing History",
                text: "Users can track all past and current borrowed books.",
              },
              {
                title: "Admin Governance",
                text: "Complete control over users, books, and policies.",
              },
            ].map((h, i) => (
              <motion.div
                key={h.title}
                className="highlight-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <h4>{h.title}</h4>
                <p>{h.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* POLICIES */}
      <section className="policy-section" id="policies">
        <motion.div
          className="policy-inner"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Library Rules & Policies</h2>

          <h3>Borrowing Limits</h3>
          <p>
            Each user may borrow up to six books at a time. Only one copy of
            the same title is allowed per user.
          </p>

          <h3>Borrowing Duration</h3>
          <ul>
            <li>7 days – Short-term reading</li>
            <li>15 days – Standard borrowing</li>
            <li>30 days – Extended study</li>
          </ul>

          <h3>Renewals & Returns</h3>
          <p>
            Renewals depend on availability. Books must be returned on time
            to avoid fines.
          </p>

          <h3>Overdue Policy</h3>
          <p>
            Late returns incur a daily fine and may restrict borrowing access.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
