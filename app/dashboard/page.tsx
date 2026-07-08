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

const SAMPLE_ENTRIES: LogEntry[] = [
  { id:"1", date:"2026-07-07", task:"Cable installation — conduit run, Level 3",          category:"Cable Management",           site:"Commercial Site, CBD",  hours:6.5, notes:"",                     status:"signed",  createdAt:"2026-07-07T09:00:00Z" },
  { id:"2", date:"2026-07-08", task:"Switchboard wiring — main distribution board",       category:"Switchboard & Distribution", site:"Commercial Site, CBD",  hours:4,   notes:"Assisted senior sparky", status:"signed",  createdAt:"2026-07-08T08:30:00Z" },
  { id:"3", date:"2026-07-09", task:"Testing and tagging — portable appliances",          category:"Testing & Commissioning",    site:"Office Fitout, North",  hours:3.5, notes:"",                     status:"pending", createdAt:"2026-07-09T14:00:00Z" },
  { id:"4", date:"2026-07-10", task:"Motor circuit installation — 3 phase",               category:"Motor Circuits",             site:"Industrial Plant",       hours:5,   notes:"First 3-phase install", status:"pending", createdAt:"2026-07-10T07:30:00Z" },
];

const SIGN_OFFS = [
  { skill:"Cable installation — single phase circuits",    status:"signed",  by:"James Kowalski", date:"12 Jun 2026" },
  { skill:"Switchboard wiring — distribution boards",      status:"signed",  by:"James Kowalski", date:"28 Jun 2026" },
  { skill:"Testing & tagging to AS/NZS 3760",              status:"pending", by:"",               date:"" },
  { skill:"Motor circuit installation — 3 phase",          status:"pending", by:"",               date:"" },
  { skill:"Safe isolation procedure — HV systems",         status:"pending", by:"",               date:"" },
];

const HOUR_REQUIREMENTS: Record<string, number> = {
  "Electrical Installation":     200,
  "Switchboard & Distribution":  150,
  "Cable Management":            120,
  "Testing & Commissioning":     100,
  "Fault Finding":               80,
  "Motor Circuits":              80,
  "Lighting Systems":            40,
  "Safety & Compliance":         30,
};

function formatDate(iso: string) {
  const [, m, d] = iso.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${parseInt(d)} ${months[parseInt(m) - 1]}`;
}

export default function DashboardPage() {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [pdfToast, setPdfToast] = useState(false);

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

  const totalHours   = entries.reduce((s, e) => s + e.hours, 0);
  const signedHours  = entries.filter(e => e.status === "signed").reduce((s, e) => s + e.hours, 0);
  const pendingCount = entries.filter(e => e.status === "pending").length;
  const progressPct  = Math.min((totalHours / 800) * 100, 100);

  const byCategory: Record<string, number> = {};
  for (const e of entries) {
    byCategory[e.category] = (byCategory[e.category] ?? 0) + e.hours;
  }
  const topCategories = Object.entries(byCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  const triggerPdf = () => {
    setPdfToast(true);
    setTimeout(() => setPdfToast(false), 3000);
  };

  const inputBase: React.CSSProperties = {
    background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"var(--radius-sm)",
    color:"var(--text)", fontFamily:"inherit",
  };

  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav-logo">
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
            <rect width="34" height="34" rx="9" fill="url(#al-bg-db)"/>
            <path d="M11 24l6-14 6 14M13 20h8" stroke="url(#al-text-db)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <defs>
              <linearGradient id="al-bg-db" x1="0" y1="0" x2="34" y2="34"><stop offset="0%" stopColor="#061220"/><stop offset="100%" stopColor="#030810"/></linearGradient>
              <linearGradient id="al-text-db" x1="11" y1="10" x2="23" y2="24"><stop offset="0%" stopColor="#00C8FF"/><stop offset="100%" stopColor="#0090BB"/></linearGradient>
            </defs>
          </svg>
          <span className="nav-name">ApprenticeLog</span>
        </Link>
        <div style={{ display:"flex", alignItems:"center", gap:"1.5rem" }}>
          <Link href="/"          style={{ color:"var(--text-dim)",  textDecoration:"none", fontSize:"0.875rem", fontWeight:500 }}>Home</Link>
          <Link href="/log"       style={{ color:"var(--text-dim)",  textDecoration:"none", fontSize:"0.875rem", fontWeight:500 }}>Log Hours</Link>
          <Link href="/dashboard" style={{ color:"var(--ink)",       textDecoration:"none", fontSize:"0.875rem", fontWeight:700 }}>Dashboard</Link>
          <Link href="/supervisor" style={{ color:"var(--text-dim)", textDecoration:"none", fontSize:"0.875rem", fontWeight:500 }}>Supervisor</Link>
        </div>
      </nav>

      {pdfToast && (
        <div style={{ position:"fixed", bottom:24, right:24, zIndex:999, background:"var(--surface)", border:"1px solid rgba(52,211,153,0.4)", borderRadius:10, padding:"14px 20px", display:"flex", gap:10, alignItems:"center", boxShadow:"0 8px 32px rgba(0,0,0,0.4)" }}>
          <span style={{ color:"var(--pass)", fontSize:"1rem" }}>✓</span>
          <span style={{ fontSize:"0.875rem", fontWeight:600 }}>Compliance PDF ready — downloading…</span>
        </div>
      )}

      <main style={{ paddingTop:"5rem", minHeight:"100vh", background:"var(--bg)" }}>
        {/* Header */}
        <div style={{ background:"var(--bg2)", borderBottom:"1px solid var(--border)", padding:"2.5rem 2rem" }}>
          <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", alignItems:"flex-end", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
            <div>
              <div style={{ fontSize:"0.72rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.15em", color:"var(--ink)", marginBottom:6 }}>Dashboard</div>
              <h1 style={{ fontSize:"clamp(1.8rem,4vw,2.4rem)", fontWeight:900, letterSpacing:"-0.03em", marginBottom:4 }}>My Progress</h1>
              <p style={{ color:"var(--text-dim)", fontSize:"0.95rem" }}>Hours logged, sign-offs earned, and your path to completion.</p>
            </div>
            <button onClick={triggerPdf} style={{ ...inputBase, padding:"10px 20px", fontSize:"0.875rem", fontWeight:700, cursor:"pointer", color:"var(--ink)", display:"flex", alignItems:"center", gap:8 }}>
              📄 Export Compliance PDF
            </button>
          </div>
        </div>

        <div style={{ maxWidth:1100, margin:"0 auto", padding:"2rem 2rem 4rem" }}>

          {/* Top stats */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:14, marginBottom:28 }}>
            {[
              { label:"Total Hours Logged", val:`${totalHours.toFixed(1)}h`,    color:"var(--ink)",  sub:`of 800h required` },
              { label:"Hours Signed Off",   val:`${signedHours.toFixed(1)}h`,   color:"var(--pass)", sub:`${((signedHours/totalHours||0)*100).toFixed(0)}% of logged` },
              { label:"Pending Sign-offs",  val:pendingCount.toString(),         color:"var(--warn)", sub:"awaiting supervisor" },
              { label:"Progress",           val:`${progressPct.toFixed(1)}%`,   color:"var(--ink)",  sub:"to completion" },
            ].map(({ label, val, color, sub }) => (
              <div key={label} style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"var(--radius)", padding:"1.25rem 1.5rem" }}>
                <div style={{ fontSize:"0.72rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:"var(--text-dim)", marginBottom:8 }}>{label}</div>
                <div style={{ fontSize:"1.8rem", fontWeight:900, color, letterSpacing:"-0.03em", marginBottom:4 }}>{val}</div>
                <div style={{ fontSize:"0.75rem", color:"var(--text-mute)" }}>{sub}</div>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div style={{ background:"var(--surface)", border:"1px solid var(--border-ink)", borderRadius:"var(--radius)", padding:"1.5rem 1.75rem", marginBottom:28 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
              <span style={{ fontWeight:700, fontSize:"0.9rem" }}>Apprenticeship Progress</span>
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.82rem", color:"var(--ink)" }}>{totalHours.toFixed(1)} / 800h</span>
            </div>
            <div style={{ background:"var(--bg3)", borderRadius:100, height:10, overflow:"hidden", marginBottom:8 }}>
              <div style={{ width:`${progressPct}%`, height:"100%", background:"linear-gradient(90deg, var(--ink), var(--pass))", borderRadius:100, transition:"width 0.6s" }} />
            </div>
            <div style={{ fontSize:"0.78rem", color:"var(--text-mute)" }}>{Math.max(0, 800 - totalHours).toFixed(1)} hours remaining</div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr", gap:20 }} className="db-grid">
            <style>{`@media(min-width:900px){.db-grid{grid-template-columns:1fr 1fr}}`}</style>

            {/* Hours by category */}
            <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"var(--radius)", overflow:"hidden" }}>
              <div style={{ padding:"1rem 1.5rem", borderBottom:"1px solid var(--border)" }}>
                <span style={{ fontWeight:800, fontSize:"0.95rem" }}>Hours by Category</span>
              </div>
              <div style={{ padding:"1rem 1.5rem", display:"flex", flexDirection:"column", gap:14 }}>
                {topCategories.length > 0 ? topCategories.map(([cat, hrs]) => {
                  const req = HOUR_REQUIREMENTS[cat] ?? 50;
                  const pct = Math.min((hrs / req) * 100, 100);
                  return (
                    <div key={cat}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                        <span style={{ fontSize:"0.82rem", fontWeight:600 }}>{cat}</span>
                        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.75rem", color:"var(--ink)" }}>{hrs}h / {req}h</span>
                      </div>
                      <div style={{ background:"var(--bg3)", borderRadius:100, height:5, overflow:"hidden" }}>
                        <div style={{ width:`${pct}%`, height:"100%", background: pct >= 100 ? "var(--pass)" : "var(--ink)", borderRadius:100, transition:"width 0.4s" }} />
                      </div>
                    </div>
                  );
                }) : (
                  <p style={{ fontSize:"0.875rem", color:"var(--text-mute)" }}>No entries yet. <Link href="/log" style={{ color:"var(--ink)" }}>Log some hours →</Link></p>
                )}
              </div>
            </div>

            {/* Skill sign-offs */}
            <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"var(--radius)", overflow:"hidden" }}>
              <div style={{ padding:"1rem 1.5rem", borderBottom:"1px solid var(--border)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontWeight:800, fontSize:"0.95rem" }}>Skill Sign-offs</span>
                <span style={{ fontSize:"0.75rem", color:"var(--text-mute)" }}>{SIGN_OFFS.filter(s=>s.status==="signed").length}/{SIGN_OFFS.length} complete</span>
              </div>
              <div>
                {SIGN_OFFS.map((s, i) => (
                  <div key={s.skill} style={{ padding:"14px 20px", borderBottom: i < SIGN_OFFS.length - 1 ? "1px solid var(--border)" : "none", display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:"0.85rem", fontWeight:600, marginBottom:3 }}>{s.skill}</div>
                      {s.status === "signed" && <div style={{ fontSize:"0.75rem", color:"var(--text-mute)" }}>Signed by {s.by} · {s.date}</div>}
                    </div>
                    <span style={{
                      flexShrink:0, fontSize:"0.7rem", fontWeight:700,
                      padding:"3px 10px", borderRadius:100,
                      background: s.status === "signed" ? "rgba(52,211,153,0.12)" : "rgba(245,158,11,0.12)",
                      color: s.status === "signed" ? "var(--pass)" : "var(--warn)",
                    }}>
                      {s.status === "signed" ? "✓ Signed" : "⏳ Pending"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent entries */}
          <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"var(--radius)", overflow:"hidden", marginTop:20 }}>
            <div style={{ padding:"1rem 1.5rem", borderBottom:"1px solid var(--border)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontWeight:800, fontSize:"0.95rem" }}>Recent Log Entries</span>
              <Link href="/log" style={{ color:"var(--ink)", textDecoration:"none", fontSize:"0.82rem", fontWeight:600 }}>Log More Hours →</Link>
            </div>
            {entries.length === 0 ? (
              <div style={{ padding:"2rem", textAlign:"center", color:"var(--text-mute)", fontSize:"0.875rem" }}>No entries yet.</div>
            ) : (
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ borderBottom:"1px solid var(--border)" }}>
                    {["Date","Task","Hours","Status"].map(h => (
                      <th key={h} style={{ padding:"10px 16px", textAlign:"left", fontSize:"0.72rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:"var(--text-mute)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {entries.slice(0, 8).map((e) => (
                    <tr key={e.id} style={{ borderBottom:"1px solid var(--border)" }}>
                      <td style={{ padding:"12px 16px", fontSize:"0.82rem", color:"var(--text-dim)", whiteSpace:"nowrap" }}>{formatDate(e.date)}</td>
                      <td style={{ padding:"12px 16px", fontSize:"0.82rem", maxWidth:280 }}>
                        <div style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{e.task}</div>
                        <div style={{ fontSize:"0.7rem", color:"var(--text-mute)", marginTop:2 }}>{e.site}</div>
                      </td>
                      <td style={{ padding:"12px 16px", fontFamily:"'JetBrains Mono',monospace", fontSize:"0.82rem", color:"var(--ink)", fontWeight:700 }}>{e.hours}h</td>
                      <td style={{ padding:"12px 16px" }}>
                        <span style={{
                          fontSize:"0.7rem", fontWeight:700, padding:"3px 9px", borderRadius:100,
                          background: e.status === "signed" ? "rgba(52,211,153,0.12)" : "rgba(245,158,11,0.12)",
                          color: e.status === "signed" ? "var(--pass)" : "var(--warn)",
                        }}>
                          {e.status === "signed" ? "✓ Signed" : "⏳ Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
