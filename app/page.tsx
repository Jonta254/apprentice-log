"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const FEATURES = [
  { icon: "📋", color: "rgba(0,200,255,0.12)", title: "Hours Logging", desc: "Log work hours by task type, site, and trade area. Automatic running totals against your required hours for each competency." },
  { icon: "✅", color: "rgba(52,211,153,0.12)", title: "Skill Sign-offs", desc: "Supervisors sign off skills digitally, with timestamps and notes. No paper books that go missing on the last day of placement." },
  { icon: "📊", color: "rgba(168,85,247,0.12)", title: "Compliance Reports", desc: "Generate submission-ready PDF reports for your training authority — formatted to the exact layout they require." },
  { icon: "👤", color: "rgba(240,165,0,0.12)", title: "Supervisor Portal", desc: "Supervisors get their own login. They approve, reject, and add notes to sign-offs without the apprentice seeing pending changes." },
  { icon: "🏫", color: "rgba(0,200,255,0.08)", title: "TAFE / College Integration", desc: "Assessors can view progress across their entire cohort. No chasing apprentices for logbooks the week before assessment." },
  { icon: "🔔", color: "rgba(255,68,68,0.08)", title: "Milestone Alerts", desc: "Get notified when you hit 25%, 50%, and 75% of required hours, and when sign-offs are overdue for review." },
];

const DEMO_LOGS = [
  { task: "Cable installation — conduit run, Level 3", hours: "6.5", date: "Mon 30 Jun", status: "signed" },
  { task: "Switchboard wiring — main distribution board", hours: "4.0", date: "Tue 1 Jul", status: "signed" },
  { task: "Testing and tagging — portable appliances", hours: "3.5", date: "Wed 2 Jul", status: "pending" },
  { task: "Motor circuit installation — 3 phase", hours: "5.0", date: "Thu 3 Jul", status: "pending" },
];

export default function ApprenticeLogPage() {
  const revealRefs = useRef<HTMLElement[]>([]);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    revealRefs.current.forEach((el) => { if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const addReveal = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav-logo">
          <div className="nav-mark">AL</div>
          <span className="nav-name">ApprenticeLog</span>
        </Link>
        <a href="#waitlist" className="nav-cta">Join Waitlist</a>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-badge">⚡ Built for trade apprentices</div>
        <h1 className="hero-title">
          The logbook trade<br />apprentices <span className="accent">deserve.</span>
        </h1>
        <p className="hero-sub">
          Log hours, track skill sign-offs, and generate compliance reports — replacing paper books that go missing, spreadsheets nobody submits, and a process that hasn&apos;t changed in forty years.
        </p>
        <div className="hero-actions">
          <a href="#waitlist" className="btn-primary">Join the Waitlist →</a>
          <a href="#demo" className="btn-ghost">See How It Works</a>
        </div>
      </section>

      {/* PROBLEM STATEMENT */}
      <div style={{ background: "var(--bg2)", padding: "5rem 1.5rem", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <blockquote style={{ fontSize: "clamp(1.3rem,3vw,2rem)", fontWeight: 700, lineHeight: 1.45, letterSpacing: "-0.02em", color: "var(--text)" }}>
            &ldquo;I lost six months of completed logbook pages when my bag got stolen on the bus. My training provider couldn&apos;t accept it. I had to redo the hours.&rdquo;
          </blockquote>
          <p style={{ marginTop: "1.5rem", color: "var(--text-dim)", fontSize: "0.9rem" }}>
            — Electrical apprentice, 2nd year. This should not be possible in 2025.
          </p>
        </div>
      </div>

      {/* FEATURES */}
      <section className="section">
        <p className="section-label reveal" ref={addReveal}>What it does</p>
        <h2 className="section-title reveal" ref={addReveal}>Every part of the process, finally digital.</h2>
        <p className="section-sub reveal" ref={addReveal}>Not a PDF. Not a spreadsheet. A purpose-built logbook with actual workflows.</p>
        <div className="feature-grid">
          {FEATURES.map((f, i) => (
            <div key={i} className="feature-card reveal" ref={addReveal} style={{ transitionDelay: `${i * 0.07}s` }}>
              <div className="feature-icon" style={{ background: f.color }}>{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* DEMO LOGBOOK */}
      <section id="demo" style={{ padding: "5rem 1.5rem", background: "var(--bg2)", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p className="section-label reveal" ref={addReveal}>Live Demo</p>
          <h2 className="section-title reveal" ref={addReveal}>What the logbook looks like.</h2>
          <p className="section-sub reveal" ref={addReveal}>Hours logged this week with supervisor status in real time.</p>
          <div className="logbook-demo reveal" ref={addReveal}>
            <div className="logbook-header">
              <div>
                <div style={{ fontWeight: 800, fontSize: "1rem" }}>Week Log — July 2026</div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-dim)", marginTop: "2px" }}>Brian Josiah · Electrical Trade · Year 2</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--ink)" }}>2,184 h</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>of 3,200h target</div>
              </div>
            </div>
            <div className="logbook-row logbook-row-head">
              <span>Task</span><span>Hours</span><span>Date</span><span>Status</span>
            </div>
            {DEMO_LOGS.map((log, i) => (
              <div key={i} className="logbook-row">
                <span className="logbook-task">{log.task}</span>
                <span className="logbook-hours">{log.hours}h</span>
                <span style={{ fontSize: "0.85rem", color: "var(--text-dim)" }}>{log.date}</span>
                <span className={`logbook-status ${log.status === "signed" ? "status-signed" : "status-pending"}`}>
                  {log.status === "signed" ? "✓ Signed" : "⏳ Pending"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="section">
        <p className="section-label reveal" ref={addReveal}>Pricing</p>
        <h2 className="section-title reveal" ref={addReveal}>Free for apprentices. Always.</h2>
        <p className="section-sub reveal" ref={addReveal}>The apprentice never pays. Institutions and employers fund the platform.</p>
        <div className="price-grid">
          {[
            { tier: "Apprentice", amount: "Free", period: "", desc: "Log hours, get sign-offs, export reports.", features: ["Unlimited hour logging", "Digital sign-off requests", "PDF report export", "Mobile app"], featured: false },
            { tier: "Supervisor", amount: "$9", period: "/mo", desc: "Sign off apprentices, review logs, add notes.", features: ["Unlimited apprentice reviews", "Digital sign-off with notes", "Progress overview dashboard", "Email notifications"], featured: true },
            { tier: "Institution", amount: "$149", period: "/mo", desc: "Full cohort visibility for TAFE and training orgs.", features: ["Unlimited apprentices and supervisors", "Cohort progress dashboard", "Automated compliance checking", "API access for student systems"], featured: false },
          ].map((p, i) => (
            <div key={i} className={`price-card reveal ${p.featured ? "featured" : ""}`} ref={addReveal} style={{ transitionDelay: `${i * 0.08}s` }}>
              <div className="price-tier">{p.tier}</div>
              <div className="price-amount">{p.amount}<span>{p.period}</span></div>
              <div className="price-desc">{p.desc}</div>
              <ul className="price-features">
                {p.features.map((f, j) => <li key={j}>{f}</li>)}
              </ul>
              <a href="#waitlist" className={p.featured ? "btn-primary" : "btn-ghost"} style={{ width: "100%", justifyContent: "center", display: "flex" }}>
                Get Early Access
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* WAITLIST */}
      <section id="waitlist" style={{ padding: "5rem 1.5rem", background: "var(--bg2)", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <p className="section-label" style={{ justifyContent: "center", display: "flex" }}>Early Access</p>
          <h2 className="section-title" style={{ textAlign: "center" }}>Be first when it launches.</h2>
          <p className="section-sub" style={{ margin: "0 auto 2rem", textAlign: "center" }}>
            Join the waitlist and get early access, a free Supervisor account for 3 months, and input on what gets built next.
          </p>
          {submitted ? (
            <div style={{ padding: "2rem", background: "rgba(52,211,153,0.1)", borderRadius: "var(--radius)", border: "1px solid rgba(52,211,153,0.3)", color: "var(--pass)", fontWeight: 700 }}>
              You&apos;re on the list. We&apos;ll be in touch.
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); if (email) setSubmitted(true); }} style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
              <input
                type="email" required placeholder="your@email.com" value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ flex: "1 1 260px", padding: "0.875rem 1.25rem", borderRadius: "var(--radius-sm)", background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", fontSize: "0.95rem", outline: "none" }}
              />
              <button type="submit" className="btn-primary">Join Waitlist →</button>
            </form>
          )}
        </div>
      </section>

      <footer style={{ borderTop: "1px solid var(--border)", padding: "3rem 1.5rem" }}>
        <div className="footer">
          <div className="footer-copy">ApprenticeLog · Built by Brian Josiah</div>
          <a href="https://josiah.rawsignal.dev" target="_blank" rel="noopener" className="footer-link">← Back to Portfolio</a>
        </div>
      </footer>
    </>
  );
}
