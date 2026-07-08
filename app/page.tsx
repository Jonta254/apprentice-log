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
  { icon: "🏛️", color: "rgba(0,200,255,0.08)", title: "Certificate Board Export", desc: "One-click export in the exact format required by your state's certificate board. No reformatting. No rejected submissions." },
  { icon: "🗺️", color: "rgba(52,211,153,0.08)", title: "Multi-Site Supervisor Portal", desc: "Supervisors managing apprentices across multiple job sites see every logbook in one dashboard. Sign off on the go from any device." },
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
  const [menuOpen, setMenuOpen] = useState(false);

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
      <a href="/log" className="float-cta" aria-label="Start logging hours">
        📋 Log Hours
      </a>
      <nav className="nav">
        <Link href="/" className="nav-logo">
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
            <rect width="34" height="34" rx="9" fill="url(#al-bg)"/>
            <path d="M11 24l6-14 6 14M13 20h8" stroke="url(#al-text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <defs>
              <linearGradient id="al-bg" x1="0" y1="0" x2="34" y2="34"><stop offset="0%" stopColor="#061220"/><stop offset="100%" stopColor="#030810"/></linearGradient>
              <linearGradient id="al-text" x1="11" y1="10" x2="23" y2="24"><stop offset="0%" stopColor="#00C8FF"/><stop offset="100%" stopColor="#0090BB"/></linearGradient>
            </defs>
          </svg>
          <span className="nav-name">ApprenticeLog</span>
        </Link>
        <div style={{ display:"flex", alignItems:"center", gap:"1.5rem" }}>
          <Link href="/log" style={{ color:"var(--text-dim)", textDecoration:"none", fontSize:"0.875rem", fontWeight:500 }}>Log Hours</Link>
          <Link href="/dashboard" style={{ color:"var(--text-dim)", textDecoration:"none", fontSize:"0.875rem", fontWeight:500 }}>Dashboard</Link>
          <Link href="/log" className="nav-cta">Start Logging →</Link>
        </div>
        <button className={`hamburger${menuOpen?" open":""}`} onClick={() => setMenuOpen(m => !m)} aria-label="Menu">
          <span/><span/><span/>
        </button>
      </nav>
      <div className={`mobile-nav${menuOpen?" open":""}`}>
        <Link href="/log" onClick={() => setMenuOpen(false)}>Log Hours</Link>
        <Link href="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
        <Link href="/log" className="mobile-cta" onClick={() => setMenuOpen(false)}>Start Logging →</Link>
      </div>

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
          <Link href="/log" className="btn-primary">Start Logging Hours →</Link>
          <Link href="/dashboard" className="btn-ghost">View Dashboard</Link>
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

      {/* HOW IT WORKS */}
      <section style={{ padding: "5rem 1.5rem", background: "var(--bg2)", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p className="section-label reveal" ref={addReveal}>How it works</p>
          <h2 className="section-title reveal" ref={addReveal}>From first day to certification, handled.</h2>
          <p className="section-sub reveal" ref={addReveal}>Four steps. No paper. No chasing. No lost records.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
            {[
              { num: "01", title: "Apprentice logs daily hours", desc: "Every shift, the apprentice records hours worked, tasks completed, and which trade competency each task covers. Takes under two minutes." },
              { num: "02", title: "Supervisor reviews and signs off", desc: "The supervisor receives a notification, reviews the log entry, adds notes if needed, and applies a digital signature — from any device, any location." },
              { num: "03", title: "System auto-generates compliance reports", desc: "ApprenticeLog continuously tracks progress against the required competency matrix. Compliance reports are always current, never a last-minute scramble." },
              { num: "04", title: "Institution exports for certification board", desc: "When the apprenticeship is complete, the training institution exports the full logbook record in the exact format required. One click. Submission ready." },
            ].map((step, i) => (
              <div key={i} className="step-card reveal" ref={addReveal} style={{ transitionDelay: `${i * 0.08}s` }}>
                <div className="step-num">{step.num}</div>
                <div style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem", paddingRight: "3rem" }}>{step.title}</div>
                <div style={{ fontSize: "0.875rem", color: "var(--text-dim)", lineHeight: 1.65 }}>{step.desc}</div>
              </div>
            ))}
          </div>
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
              <Link href="/log" className={p.featured ? "btn-primary" : "btn-ghost"} style={{ width: "100%", justifyContent: "center", display: "flex" }}>
                Get Early Access
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* COMPLIANCE QUOTE */}
      <div style={{ background: "var(--bg2)", padding: "4rem 1.5rem", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <span className="compliance-badge">Training Manager Testimonial</span>
          <blockquote className="quote-block">
            &ldquo;Before ApprenticeLog, I spent 3 hours at the end of every month chasing paper logbooks and chasing supervisors for signatures. Now it takes 20 minutes. The compliance report generates itself.&rdquo;
          </blockquote>
          <p style={{ fontSize: "0.85rem", color: "var(--text-mute)", marginTop: "0.5rem" }}>
            — Sarah Chen, Training Manager, ACT Electrical Institute
          </p>
        </div>
      </div>

      {/* WAITLIST */}
      <section id="waitlist" style={{ padding: "5rem 1.5rem", background: "var(--bg2)", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <p className="section-label" style={{ justifyContent: "center", display: "flex" }}>Early Access</p>
          <h2 className="section-title" style={{ textAlign: "center" }}>Be first when it launches.</h2>
          <p className="section-sub" style={{ margin: "0 auto 2rem", textAlign: "center" }}>
            Join the waitlist and get early access, a free Supervisor account for 3 months, and input on what gets built next.
          </p>
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap", marginBottom:"2rem" }}>
            <Link href="/log" className="btn-primary" style={{ fontSize:"1rem", padding:"1rem 2.5rem" }}>Start Logging Now →</Link>
            <Link href="/dashboard" className="btn-ghost" style={{ fontSize:"1rem", padding:"1rem 2rem" }}>View Dashboard</Link>
          </div>
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
