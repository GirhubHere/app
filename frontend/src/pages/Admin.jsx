import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  LayoutDashboard, MessageSquare, Settings, LogOut,
  RefreshCw, CheckCircle2, AlertCircle, Save, Eye, EyeOff,
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const SESSION_KEY = "fa_admin_key";

/* ── Commodity badge colours ── */
const BADGE_CLASS = {
  corn: "admin-badge admin-badge-corn",
  wheat: "admin-badge admin-badge-wheat",
  sunflower: "admin-badge admin-badge-sunflower",
  barley: "admin-badge admin-badge-barley",
  rapeseed: "admin-badge admin-badge-rapeseed",
  soybean: "admin-badge admin-badge-soybean",
};

/* ─────────────────── LOGIN ─────────────────── */
const Login = ({ onLogin }) => {
  const [key, setKey] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.get(`${API}/quote-requests?limit=1`, {
        headers: { "x-admin-key": key },
      });
      sessionStorage.setItem(SESSION_KEY, key);
      onLogin(key);
    } catch {
      setError("Invalid admin key. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(155deg, var(--fa-deep-1) 0%, var(--fa-deep-2) 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 24,
          padding: "48px 44px",
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 40px 80px -30px rgba(0,0,0,0.45)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <img
            src="/images/logo.jpeg"
            alt="Five Agra Select"
            style={{ width: 44, height: 44, borderRadius: 9999, objectFit: "cover" }}
          />
          <div className="font-display">
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--fa-deep-1)", letterSpacing: "0.05em" }}>
              FIVE AGRA SELECT
            </div>
            <div style={{ fontSize: 11, color: "var(--fa-muted)", letterSpacing: "0.1em" }}>
              ADMIN PANEL
            </div>
          </div>
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--fa-ink)", marginBottom: 6 }}>
          Sign in
        </h1>
        <p style={{ fontSize: 14, color: "var(--fa-muted)", marginBottom: 28 }}>
          Enter your admin key to manage site content and leads.
        </p>

        <form onSubmit={submit}>
          <label className="admin-label">Admin Key</label>
          <div style={{ position: "relative" }}>
            <input
              type={show ? "text" : "password"}
              className="admin-input"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Enter admin key…"
              required
              style={{ paddingRight: 44 }}
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              style={{
                position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                background: "transparent", border: "none", cursor: "pointer",
                color: "var(--fa-muted)",
              }}
            >
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <p style={{ marginTop: 10, fontSize: 13, color: "#DC2626", display: "flex", alignItems: "center", gap: 6 }}>
              <AlertCircle size={14} /> {error}
            </p>
          )}

          <button
            type="submit"
            className="btn-gold"
            disabled={loading || !key}
            style={{ marginTop: 22, width: "100%", justifyContent: "center" }}
          >
            {loading ? "Verifying…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

/* ─────────────────── DASHBOARD ─────────────────── */
const Dashboard = ({ adminKey, onLogout }) => {
  const [tab, setTab] = useState("leads");
  const [leads, setLeads] = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [config, setConfig] = useState({ phone: "", email: "", office: "", hours: "" });
  const [configLoading, setConfigLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle"); // idle | saving | ok | err

  const headers = { "x-admin-key": adminKey };

  /* Load leads */
  const fetchLeads = useCallback(async () => {
    setLeadsLoading(true);
    try {
      const { data } = await axios.get(`${API}/quote-requests?limit=200`, { headers });
      setLeads(data);
    } catch { /* silent */ } finally {
      setLeadsLoading(false);
    }
  }, [adminKey]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Load config */
  const fetchConfig = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API}/site-config`);
      setConfig({
        phone:  data.phone  || "",
        email:  data.email  || "",
        office: data.office || "",
        hours:  data.hours  || "",
      });
    } catch { /* silent */ }
  }, []);

  useEffect(() => { fetchLeads(); fetchConfig(); }, [fetchLeads, fetchConfig]);

  /* Save config */
  const saveConfig = async (e) => {
    e.preventDefault();
    setSaveStatus("saving");
    try {
      await axios.put(`${API}/site-config`, config, { headers });
      setSaveStatus("ok");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch {
      setSaveStatus("err");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const NavItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setTab(id)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: "100%",
        padding: "12px 24px",
        background: tab === id ? "rgba(232,185,35,0.12)" : "transparent",
        border: "none",
        borderLeft: `3px solid ${tab === id ? "var(--fa-gold-1)" : "transparent"}`,
        color: tab === id ? "#fff" : "rgba(255,255,255,0.55)",
        cursor: "pointer",
        fontSize: 14,
        fontWeight: tab === id ? 600 : 400,
        letterSpacing: "0.01em",
        textAlign: "left",
        transition: "all 180ms ease",
      }}
      onMouseEnter={(e) => { if (tab !== id) e.currentTarget.style.color = "rgba(255,255,255,0.8)"; }}
      onMouseLeave={(e) => { if (tab !== id) e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
    >
      <Icon size={17} />
      {label}
    </button>
  );

  const fmt = (iso) => {
    try {
      return new Date(iso).toLocaleDateString("en-GB", {
        day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
      });
    } catch { return iso; }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--fa-bg-off)" }}>
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div style={{ padding: "0 24px 28px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img
              src="/images/logo.jpeg"
              alt=""
              style={{ width: 36, height: 36, borderRadius: 9999, objectFit: "cover" }}
            />
            <div style={{ color: "#fff" }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em" }}>FIVE AGRA</div>
              <div style={{ fontSize: 10, color: "var(--fa-gold-1)", letterSpacing: "0.2em" }}>ADMIN</div>
            </div>
          </div>
        </div>

        <nav style={{ marginTop: 20 }}>
          <NavItem id="leads"    icon={MessageSquare} label="Quote Leads" />
          <NavItem id="settings" icon={Settings}      label="Site Settings" />
        </nav>

        <div style={{ position: "absolute", bottom: 24, left: 0, right: 0, padding: "0 12px" }}>
          <button
            onClick={onLogout}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              width: "100%", padding: "10px 14px",
              background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10, color: "rgba(255,255,255,0.5)",
              cursor: "pointer", fontSize: 13,
              transition: "all 180ms",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
          >
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-content">
        {/* ── LEADS TAB ── */}
        {tab === "leads" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--fa-ink)", margin: 0 }}>Quote Requests</h1>
                <p style={{ margin: "4px 0 0", color: "var(--fa-muted)", fontSize: 14 }}>
                  {leads.length} lead{leads.length !== 1 ? "s" : ""} received
                </p>
              </div>
              <button
                onClick={fetchLeads}
                disabled={leadsLoading}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "10px 18px", borderRadius: 10,
                  background: "#fff", border: "1px solid rgba(12,33,19,0.12)",
                  cursor: "pointer", fontSize: 14, color: "var(--fa-ink)",
                  transition: "box-shadow 180ms",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 12px -6px rgba(12,33,19,0.15)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "")}
              >
                <RefreshCw size={14} style={{ animation: leadsLoading ? "spin 1s linear infinite" : "" }} />
                Refresh
              </button>
            </div>

            <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
              {leads.length === 0 ? (
                <div style={{ padding: "60px 40px", textAlign: "center", color: "var(--fa-muted)" }}>
                  <MessageSquare size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
                  <p style={{ margin: 0 }}>No quote requests yet.</p>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Name</th>
                        <th>Company</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Commodity</th>
                        <th>Volume (t)</th>
                        <th>Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map((lead) => (
                        <tr key={lead.id}>
                          <td style={{ whiteSpace: "nowrap", color: "var(--fa-muted)", fontSize: 12 }}>
                            {fmt(lead.created_at)}
                          </td>
                          <td style={{ fontWeight: 600, whiteSpace: "nowrap" }}>{lead.name}</td>
                          <td style={{ color: "var(--fa-muted)" }}>{lead.company || "—"}</td>
                          <td>
                            <a
                              href={`mailto:${lead.email}`}
                              style={{ color: "var(--fa-green-2)", textDecoration: "none" }}
                            >
                              {lead.email}
                            </a>
                          </td>
                          <td style={{ color: "var(--fa-muted)" }}>{lead.phone || "—"}</td>
                          <td>
                            <span className={BADGE_CLASS[lead.commodity] || "admin-badge"}>
                              {lead.commodity}
                            </span>
                          </td>
                          <td style={{ color: "var(--fa-muted)" }}>{lead.volume_tons || "—"}</td>
                          <td
                            style={{
                              maxWidth: 220, overflow: "hidden",
                              textOverflow: "ellipsis", whiteSpace: "nowrap",
                              color: "var(--fa-muted)",
                            }}
                            title={lead.message}
                          >
                            {lead.message || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SETTINGS TAB ── */}
        {tab === "settings" && (
          <div style={{ maxWidth: 640 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--fa-ink)", margin: "0 0 8px" }}>
              Site Settings
            </h1>
            <p style={{ margin: "0 0 32px", color: "var(--fa-muted)", fontSize: 14 }}>
              Update your contact information. Changes appear live on the website immediately.
            </p>

            <form onSubmit={saveConfig}>
              <div className="admin-card">
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--fa-ink)", margin: "0 0 22px" }}>
                  Contact Information
                </h2>

                {[
                  { key: "phone",  label: "Phone / WhatsApp",   placeholder: "+380 XX XXX-XX-XX" },
                  { key: "email",  label: "Email Address",       placeholder: "export@fiveagraselect.com" },
                  { key: "office", label: "Office Location",     placeholder: "Odesa, Ukraine" },
                  { key: "hours",  label: "Working Hours",       placeholder: "Mon–Fri, 9:00–18:00 EET" },
                ].map((f) => (
                  <div key={f.key} style={{ marginBottom: 20 }}>
                    <label className="admin-label">{f.label}</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={config[f.key]}
                      onChange={(e) => setConfig((s) => ({ ...s, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                    />
                  </div>
                ))}

                <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 14 }}>
                  <button
                    type="submit"
                    className="btn-gold"
                    disabled={saveStatus === "saving"}
                    style={{ gap: 8 }}
                  >
                    <Save size={16} />
                    {saveStatus === "saving" ? "Saving…" : "Save Changes"}
                  </button>

                  {saveStatus === "ok" && (
                    <span style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--fa-green-2)", fontSize: 14, fontWeight: 600 }}>
                      <CheckCircle2 size={16} /> Saved successfully!
                    </span>
                  )}
                  {saveStatus === "err" && (
                    <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#DC2626", fontSize: 14 }}>
                      <AlertCircle size={16} /> Save failed. Check your admin key.
                    </span>
                  )}
                </div>
              </div>
            </form>

            <div className="admin-card" style={{ marginTop: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--fa-ink)", margin: "0 0 10px" }}>
                How to update content
              </h2>
              <ul style={{ margin: 0, padding: "0 0 0 18px", color: "var(--fa-muted)", fontSize: 14, lineHeight: 1.8 }}>
                <li>Phone, email, office, and working hours update <strong style={{ color: "var(--fa-ink)" }}>instantly</strong> — no code changes.</li>
                <li>Quote requests are stored in the database and shown above.</li>
                <li>To update text content (commodities, stats) — edit <code style={{ fontSize: 12, background: "var(--fa-bg-off)", padding: "2px 6px", borderRadius: 4 }}>translations.js</code>.</li>
                <li>To change images — replace files in <code style={{ fontSize: 12, background: "var(--fa-bg-off)", padding: "2px 6px", borderRadius: 4 }}>/public/images/</code>.</li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

/* ─────────────────── ROOT ─────────────────── */
const Admin = () => {
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem(SESSION_KEY) || "");

  const handleLogin  = (key) => setAdminKey(key);
  const handleLogout = () => { sessionStorage.removeItem(SESSION_KEY); setAdminKey(""); };

  if (!adminKey) return <Login onLogin={handleLogin} />;
  return <Dashboard adminKey={adminKey} onLogout={handleLogout} />;
};

export default Admin;
