"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type LogEntry = {
  id: string;
  date: string;
  task: string;
  category: string;
  site: string;
  hours: number;
  notes: string;
  status: "pending" | "signed";
  createdAt: string;
};

const CATEGORIES = [
  "Electrical Installation",
  "Switchboard & Distribution",
  "Cable Management",
  "Testing & Commissioning",
  "Fault Finding",
  "Motor Circuits",
  "Lighting Systems",
  "Safety & Compliance",
];

const SAMPLE_ENTRIES: LogEntry[] = [
  { id: "1", date: "2026-07-07", task: "Cable installation — conduit run, Level 3", category: "Cable Management", site: "Commercial Site, CBD", hours: 6.5, notes: "", status: "signed", createdAt: "2026-07-07T09:00:00Z" },
  { id: "2", date: "2026-07-08", task: "Switchboard wiring — main distribution board", category: "Switchboard & Distribution", site: "Commercial Site, CBD", hours: 4, notes: "Assisted senior sparky", status: "signed", createdAt: "2026-07-08T08:30:00Z" },
  { id: "3", date: "2026-07-09", task: "Testing and tagging — portable appliances", category: "Testing & Commissioning", site: "Office Fitout, North", hours: 3.5, notes: "", status: "pending", createdAt: "2026-07-09T14:00:00Z" },
  { id: "4", date: "2026-07-10", task: "Motor circuit installation — 3 phase", category: "Motor Circuits", site: "Industrial Plant", hours: 5, notes: "First 3-phase install", status: "pending", createdAt: "2026-07-10T07:30:00Z" },
];

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export default function LogPage() {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [form, setForm] = useState({
    date: todayISO(),
    task: "",
    category: CATEGORIES[0],
    site: "",
    hours: 4,
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("al_logs");
      if (raw) {
        const parsed = JSON.parse(raw) as LogEntry[];
        setEntries(parsed.length > 0 ? parsed : SAMPLE_ENTRIES);
      } else {
        setEntries(SAMPLE_ENTRIES);
      }
    } catch {
      setEntries(SAMPLE_ENTRIES);
    }
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newEntry: LogEntry = {
      id: Date.now().toString(),
      date: form.date,
      task: form.task,
      category: form.category,
      site: form.site,
      hours: form.hours,
      notes: form.notes,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem("al_logs", JSON.stringify(updated));
    setForm({ date: todayISO(), task: "", category: CATEGORIES[0], site: "", hours: 4, notes: "" });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }

  const totalHours = entries.reduce((s, e) => s + e.hours, 0);
  const progressPct = Math.min((totalHours / 800) * 100, 100);
  const recent = entries.slice(0, 10);

  function formatDate(iso: string) {
    const [y, m, d] = iso.split("-");
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "var(--radius-sm)",
    background: "var(--bg3)",
    border: "1px solid var(--border)",
    color: "var(--text)",
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color 0.2s",
    fontFamily: "inherit",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.78rem",
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    color: "var(--text-dim)",
    marginBottom: "0.4rem",
  };

  return (
    <>
      {/* NAV */}
      <nav className="nav">
        <Link href="/" className="nav-logo">
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
            <rect width="34" height="34" rx="9" fill="url(#al-bg-log)"/>
            <path d="M11 24l6-14 6 14M13 20h8" stroke="url(#al-text-log)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <defs>
              <linearGradient id="al-bg-log" x1="0" y1="0" x2="34" y2="34"><stop offset="0%" stopColor="#061220"/><stop offset="100%" stopColor="#030810"/></linearGradient>
              <linearGradient id="al-text-log" x1="11" y1="10" x2="23" y2="24"><stop offset="0%" stopColor="#00C8FF"/><stop offset="100%" stopColor="#0090BB"/></linearGradient>
            </defs>
          </svg>
          <span className="nav-name">ApprenticeLog</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <Link href="/" style={{ color: "var(--text-dim)", textDecoration: "none", fontSize: "0.875rem", fontWeight: 500 }}>Home</Link>
          <Link href="/log" style={{ color: "var(--ink)", textDecoration: "none", fontSize: "0.875rem", fontWeight: 700 }}>Log Hours</Link>
          <Link href="/dashboard" style={{ color: "var(--text-dim)", textDecoration: "none", fontSize: "0.875rem", fontWeight: 500 }}>Dashboard</Link>
          <Link href="/supervisor" style={{ color: "var(--text-dim)", textDecoration: "none", fontSize: "0.875rem", fontWeight: 500 }}>Supervisor</Link>
        </div>
      </nav>

      <main style={{ paddingTop: "5rem", minHeight: "100vh", background: "var(--bg)" }}>
        {/* PAGE HEADER */}
        <div style={{ background: "var(--bg2)", borderBottom: "1px solid var(--border)", padding: "2.5rem 2rem" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--ink)" }}>Hours Logging</span>
            </div>
            <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "0.4rem" }}>
              Log Hours
            </h1>
            <p style={{ color: "var(--text-dim)", fontSize: "0.95rem" }}>
              Record your work sessions. Each entry is submitted for supervisor sign-off.
            </p>
          </div>
        </div>

        {/* SPLIT LAYOUT */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 2rem 4rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }} className="log-split">
            <style>{`
              @media (min-width: 1024px) {
                .log-split { grid-template-columns: 3fr 2fr !important; }
              }
              input:focus, select:focus, textarea:focus {
                border-color: rgba(0,200,255,0.5) !important;
                box-shadow: 0 0 0 3px rgba(0,200,255,0.08);
              }
              .entry-card:hover { border-color: rgba(0,200,255,0.25) !important; }
            `}</style>

            {/* LEFT: FORM */}
            <div>
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
                <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)", background: "rgba(0,200,255,0.05)" }}>
                  <div style={{ fontWeight: 800, fontSize: "1rem" }}>New Log Entry</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-dim)", marginTop: "2px" }}>Fill in the details for your work session</div>
                </div>

                {submitted && (
                  <div style={{ margin: "1rem 1.5rem 0", padding: "0.875rem 1.25rem", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: "var(--radius-sm)", color: "var(--pass)", fontWeight: 700, fontSize: "0.875rem" }}>
                    Entry logged — awaiting supervisor sign-off.
                  </div>
                )}

                <form onSubmit={handleSubmit} style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  {/* Date + Hours row */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={labelStyle}>Date</label>
                      <input
                        type="date"
                        required
                        value={form.date}
                        onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))}
                        style={{ ...inputStyle, colorScheme: "dark" }}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Hours Worked</label>
                      <input
                        type="number"
                        required
                        min={0.5}
                        max={12}
                        step={0.5}
                        value={form.hours}
                        onChange={(e) => setForm(f => ({ ...f, hours: parseFloat(e.target.value) }))}
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  {/* Task */}
                  <div>
                    <label style={labelStyle}>Task Description</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Describe the work performed (e.g. Cable installation — conduit run, Level 3)"
                      value={form.task}
                      onChange={(e) => setForm(f => ({ ...f, task: e.target.value }))}
                      style={{ ...inputStyle, resize: "vertical", minHeight: "72px" }}
                    />
                  </div>

                  {/* Category + Site row */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={labelStyle}>Category</label>
                      <select
                        required
                        value={form.category}
                        onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
                        style={{ ...inputStyle, cursor: "pointer" }}
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Site / Location</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Commercial Site, CBD"
                        value={form.site}
                        onChange={(e) => setForm(f => ({ ...f, site: e.target.value }))}
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label style={labelStyle}>Notes <span style={{ fontWeight: 400, opacity: 0.6 }}>(optional)</span></label>
                    <textarea
                      rows={2}
                      placeholder="Any additional notes for your supervisor"
                      value={form.notes}
                      onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
                      style={{ ...inputStyle, resize: "vertical", minHeight: "64px" }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ alignSelf: "flex-start", marginTop: "0.25rem" }}
                  >
                    Log Hours →
                  </button>
                </form>
              </div>
            </div>

            {/* RIGHT: RECENT ENTRIES */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Progress summary card */}
              <div style={{ background: "var(--surface)", border: "1px solid var(--border-ink)", borderRadius: "var(--radius)", padding: "1.25rem 1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.75rem" }}>
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-dim)" }}>Total Logged</span>
                  <span style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--ink)", letterSpacing: "-0.03em" }}>{totalHours.toFixed(1)} hrs</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--text-mute)", marginBottom: "0.5rem" }}>
                  <span>Progress to 800h</span>
                  <span style={{ color: "var(--text-dim)", fontWeight: 600 }}>{progressPct.toFixed(1)}%</span>
                </div>
                <div style={{ background: "var(--bg3)", borderRadius: 100, height: 6, overflow: "hidden" }}>
                  <div style={{ width: `${progressPct}%`, height: "100%", background: "linear-gradient(90deg, var(--ink), var(--pass))", borderRadius: 100, transition: "width 0.4s" }} />
                </div>
                <div style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "var(--text-mute)" }}>
                  {Math.max(0, 800 - totalHours).toFixed(1)} hours remaining of 800h requirement
                </div>
              </div>

              {/* Entries list */}
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
                <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 800, fontSize: "0.9rem" }}>Recent Entries</span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-mute)" }}>{entries.length} total</span>
                </div>

                {recent.length === 0 ? (
                  <div style={{ padding: "2rem 1.5rem", textAlign: "center", color: "var(--text-mute)", fontSize: "0.875rem" }}>
                    No entries yet. Log your first session.
                  </div>
                ) : (
                  <div>
                    {recent.map((entry) => (
                      <div
                        key={entry.id}
                        className="entry-card"
                        style={{ padding: "0.875rem 1.25rem", borderBottom: "1px solid var(--border)", transition: "border-color 0.2s", cursor: "default" }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem", marginBottom: "0.4rem" }}>
                          <div style={{ fontSize: "0.875rem", fontWeight: 600, lineHeight: 1.35, flex: 1, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                            {entry.task}
                          </div>
                          <span style={{
                            flexShrink: 0,
                            fontSize: "0.7rem", fontWeight: 700,
                            padding: "2px 8px", borderRadius: 100,
                            background: entry.status === "signed" ? "rgba(52,211,153,0.15)" : "rgba(245,158,11,0.15)",
                            color: entry.status === "signed" ? "var(--pass)" : "var(--warn)",
                          }}>
                            {entry.status === "signed" ? "✓ Signed" : "⏳ Pending"}
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
                          <span style={{ fontSize: "0.75rem", color: "var(--text-mute)" }}>{formatDate(entry.date)}</span>
                          <span style={{
                            fontSize: "0.7rem", fontWeight: 600, padding: "1px 7px", borderRadius: 100,
                            background: "rgba(0,200,255,0.1)", color: "var(--ink)", border: "1px solid rgba(0,200,255,0.2)",
                          }}>{entry.category}</span>
                          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-dim)", marginLeft: "auto" }}>{entry.hours}h</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ padding: "1rem 1.25rem", borderTop: entries.length > 0 ? "1px solid var(--border)" : undefined }}>
                  <Link href="/dashboard" style={{ color: "var(--ink)", textDecoration: "none", fontSize: "0.85rem", fontWeight: 600 }}>
                    View All in Dashboard →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer style={{ borderTop: "1px solid var(--border)", padding: "2rem 1.5rem" }}>
        <div className="footer">
          <div className="footer-copy">ApprenticeLog · Built by Brian Josiah</div>
          <a href="https://josiah.rawsignal.dev" target="_blank" rel="noopener" className="footer-link">← Back to Portfolio</a>
        </div>
      </footer>
    </>
  );
}
