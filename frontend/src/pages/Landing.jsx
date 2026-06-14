import React, { useState } from "react";
import {
  ChevronDown, ArrowRight, CheckCircle2, Sprout, FlaskConical, Truck, Ship,
  Wheat, FileCheck2, Handshake, Globe2, Mail, Phone, MapPin, Clock,
} from "lucide-react";
import { useLang } from "../i18n/LanguageContext";
import { Reveal, CountUp } from "../components/Reveal";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const IconMap = { Sprout, FlaskConical, Truck, Ship, Wheat, FileCheck2, Handshake, Globe2 };

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const COMMODITY_IMAGES = {
  corn: "/images/corn.png",
  wheat: "/images/wheat.png",
  sunflower: "/images/sunflower.png",
  barley: "/images/barley.png",
  rapeseed: "/images/rapeseed.png",
  soybean: "/images/soybean.png",
};

// ---------------- Hero ----------------
const Hero = () => {
  const { t } = useLang();
  return (
    <section
      id="hero"
      data-testid="section-hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        backgroundImage: "url('/images/hero.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "flex-end",
        color: "#fff",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute", inset: 0,
          background:
            "linear-gradient(180deg, rgba(12,33,19,0.42) 0%, rgba(12,33,19,0.55) 55%, rgba(12,33,19,0.92) 100%)",
        }}
      />
      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative pb-28 pt-32 lg:pb-36 w-full">
        <div className="max-w-3xl">
          <Reveal>
            <div className="eyebrow on-dark">{t.hero.eyebrow}</div>
          </Reveal>
          <Reveal delay={120}>
            <h1
              className="font-display mt-6"
              style={{
                fontSize: "clamp(40px, 7.2vw, 76px)",
                lineHeight: 1.04,
                fontWeight: 700,
                letterSpacing: "-0.025em",
              }}
              data-testid="hero-title"
            >
              {t.hero.title1}{" "}
              <span style={{ color: "var(--fa-gold-1)" }}>{t.hero.titleGold}</span>
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p
              className="mt-7 max-w-2xl"
              style={{ fontSize: 17, lineHeight: 1.6, color: "rgba(255,255,255,0.86)" }}
            >
              {t.hero.subtitle}
            </p>
          </Reveal>
          <Reveal delay={360}>
            <div className="mt-9 flex flex-wrap items-center gap-6">
              <button
                onClick={() => scrollTo("contact")}
                className="btn-gold"
                data-testid="hero-cta-primary"
              >
                {t.hero.cta}
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => scrollTo("commodities")}
                className="btn-ghost-light"
                data-testid="hero-cta-ghost"
              >
                {t.hero.ghost} <ArrowRight size={16} />
              </button>
            </div>
          </Reveal>
        </div>
      </div>
      <div
        style={{
          position: "absolute", bottom: 22, left: "50%", transform: "translateX(-50%)",
          color: "rgba(255,255,255,0.65)", display: "flex", flexDirection: "column",
          alignItems: "center", gap: 6, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase",
        }}
        className="bounce-down"
      >
        {t.hero.scroll}
        <ChevronDown size={18} />
      </div>
    </section>
  );
};

// ---------------- Stats ----------------
const Stats = () => {
  const { t } = useLang();
  return (
    <section id="stats" data-testid="section-stats" style={{ background: "#fff", padding: "96px 0" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <Reveal>
          <div className="eyebrow">{t.stats.eyebrow}</div>
        </Reveal>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14 mt-10">
          {t.stats.items.map((s, i) => (
            <Reveal key={i} delay={i * 90}>
              <div
                style={{
                  borderLeft: "2px solid var(--fa-gold-1)",
                  paddingLeft: 20,
                }}
                data-testid={`stat-${i}`}
              >
                <div
                  className="font-display"
                  style={{
                    fontSize: "clamp(40px, 5vw, 64px)",
                    color: "var(--fa-deep-1)",
                    fontWeight: 700,
                    lineHeight: 1,
                    letterSpacing: "-0.03em",
                  }}
                >
                  <CountUp to={s.value} suffix={s.suffix} />
                </div>
                <div style={{ marginTop: 14, fontSize: 14, color: "var(--fa-muted)", lineHeight: 1.5 }}>
                  {s.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// ---------------- Purpose ----------------
const Purpose = () => {
  const { t } = useLang();
  return (
    <section id="who" data-testid="section-purpose" style={{ background: "var(--fa-bg-off)", padding: "120px 0" }}>
      <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center">
        <Reveal>
          <div className="eyebrow center-bar">{t.purpose.eyebrow}</div>
        </Reveal>
        <Reveal delay={120}>
          <h2
            className="font-display mt-7"
            style={{
              fontSize: "clamp(28px, 3.6vw, 46px)",
              lineHeight: 1.25,
              fontWeight: 600,
              letterSpacing: "-0.015em",
              color: "var(--fa-deep-1)",
            }}
          >
            {t.purpose.headline1}
            <span style={{ fontWeight: 700 }} className="gold-underline">{t.purpose.headlineGold}</span>
            {t.purpose.headline2}
          </h2>
        </Reveal>
        <Reveal delay={260}>
          <p
            className="mt-10 mx-auto"
            style={{ maxWidth: 720, fontSize: 16, lineHeight: 1.75, color: "var(--fa-body)" }}
          >
            {t.purpose.body}
          </p>
        </Reveal>
      </div>
    </section>
  );
};

// ---------------- Commodities ----------------
const Commodities = () => {
  const { t } = useLang();
  return (
    <section id="commodities" data-testid="section-commodities" style={{ background: "var(--fa-bg-off)", padding: "120px 0" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-3 gap-10 items-end mb-14">
          <Reveal className="lg:col-span-2">
            <div className="eyebrow">{t.commodities.eyebrow}</div>
            <h2
              className="font-display mt-4"
              style={{
                fontSize: "clamp(32px, 4vw, 52px)",
                fontWeight: 700,
                letterSpacing: "-0.025em",
                color: "var(--fa-deep-1)",
                lineHeight: 1.08,
              }}
            >
              {t.commodities.title}
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p style={{ fontSize: 14, lineHeight: 1.65, color: "var(--fa-muted)" }}>
              {t.commodities.side}
            </p>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {t.commodities.items.map((item, i) => (
            <Reveal key={item.key} delay={(i % 3) * 90}>
              <article className="fa-card h-full" data-testid={`commodity-${item.key}`}>
                <div className="img-wrap" style={{ position: "relative" }}>
                  <img src={COMMODITY_IMAGES[item.key]} alt={item.title} loading="lazy" />
                  {item.badge && (
                    <span
                      style={{
                        position: "absolute", top: 14, left: 14,
                        background: "var(--fa-gold-1)", color: "var(--fa-deep-1)",
                        fontSize: 10, fontWeight: 700, letterSpacing: "0.16em",
                        padding: "6px 11px", borderRadius: 9999, textTransform: "uppercase",
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <div style={{ padding: "26px 26px 28px", display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
                  <h3 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: "var(--fa-deep-1)", letterSpacing: "-0.01em" }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: 14, lineHeight: 1.65, color: "var(--fa-body)", flex: 1 }}>
                    {item.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {item.chips.map((c, ci) => (
                      <span key={ci} className="chip">{c}</span>
                    ))}
                  </div>
                  <button
                    onClick={() => scrollTo("contact")}
                    className="btn-ghost-dark mt-2"
                    data-testid={`commodity-cta-${item.key}`}
                  >
                    {t.commodities.cta} <ArrowRight size={14} />
                  </button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// ---------------- Our Story ----------------
const OurStory = () => {
  const { t } = useLang();
  return (
    <section id="story" data-testid="section-story" style={{ background: "#fff", padding: "120px 0" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-16 items-center">
        <Reveal>
          <div className="photo-frame" style={{ aspectRatio: "4 / 5" }}>
            <img src="/images/farmer.png" alt="Farmer and agronomist" loading="lazy" />
          </div>
        </Reveal>
        <Reveal delay={150}>
          <div className="eyebrow">{t.story.eyebrow}</div>
          <h2
            className="font-display mt-4"
            style={{
              fontSize: "clamp(30px, 3.8vw, 48px)",
              fontWeight: 700, letterSpacing: "-0.025em",
              color: "var(--fa-deep-1)", lineHeight: 1.1,
            }}
          >
            {t.story.title}
          </h2>
          <p className="mt-6" style={{ fontSize: 16, lineHeight: 1.75, color: "var(--fa-body)" }}>
            {t.story.body}
          </p>
          <ul className="mt-8 flex flex-col gap-4">
            {t.story.checks.map((c, i) => (
              <li key={i} className="flex items-start gap-3" data-testid={`story-check-${i}`}>
                <span
                  style={{
                    width: 26, height: 26, borderRadius: 9999,
                    background: "var(--fa-bg-tint)",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, marginTop: 2,
                  }}
                >
                  <CheckCircle2 size={18} color="var(--fa-green-2)" />
                </span>
                <span style={{ fontSize: 15, lineHeight: 1.6, color: "var(--fa-body)" }}>{c}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => scrollTo("contact")}
            className="btn-gold mt-9"
            data-testid="story-cta"
          >
            {t.story.cta} <ArrowRight size={18} />
          </button>
        </Reveal>
      </div>
    </section>
  );
};

// ---------------- Supply chain (dark) ----------------
const SupplyChain = () => {
  const { t } = useLang();
  return (
    <section
      id="field"
      data-testid="section-supply-chain"
      className="dark-parallax"
      style={{ padding: "140px 0", position: "relative", color: "#fff", backgroundImage: "url('/images/field-aerial.png')" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
        <Reveal>
          <div className="eyebrow on-dark">{t.nav.field}</div>
        </Reveal>
        <Reveal delay={100}>
          <h2
            className="font-display mt-5"
            style={{
              fontSize: "clamp(32px, 4.4vw, 56px)",
              fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.1,
              maxWidth: 700,
            }}
          >
            {t.chain.title}
          </h2>
        </Reveal>

        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-10 relative">
          {/* connecting line on desktop */}
          <div
            className="hidden lg:block"
            style={{
              position: "absolute", top: 8, left: "6%", right: "6%", height: 1,
              background: "linear-gradient(90deg, transparent, var(--fa-gold-1) 20%, var(--fa-gold-1) 80%, transparent)",
              opacity: 0.4,
            }}
          />
          {t.chain.steps.map((s, i) => {
            const Icon = IconMap[s.icon] || Sprout;
            return (
              <Reveal key={i} delay={i * 120}>
                <div className="relative" data-testid={`chain-step-${i}`}>
                  <div className="timeline-dot mb-7" />
                  <Icon size={26} color="var(--fa-gold-1)" />
                  <h3
                    className="font-display mt-4"
                    style={{ fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}
                  >
                    {s.title}
                  </h3>
                  <p className="mt-3" style={{ fontSize: 14, lineHeight: 1.65, color: "rgba(255,255,255,0.72)" }}>
                    {s.desc}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={200}>
          <blockquote
            className="font-display mx-auto text-center mt-24"
            style={{
              fontSize: "clamp(22px, 2.6vw, 34px)",
              fontWeight: 400, fontStyle: "italic", lineHeight: 1.35,
              maxWidth: 880, color: "rgba(255,255,255,0.94)",
              letterSpacing: "-0.005em",
            }}
            data-testid="supply-quote"
          >
            “{t.chain.quote}
            <span style={{ color: "var(--fa-gold-1)", fontStyle: "normal", fontWeight: 600 }}>
              {t.chain.quoteGold}
            </span>
            {t.chain.quote2}”
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
};

// ---------------- Values / Why us ----------------
const Values = () => {
  const { t } = useLang();
  return (
    <section data-testid="section-values" style={{ background: "#fff", padding: "120px 0" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <Reveal>
          <div className="eyebrow">{t.values.eyebrow}</div>
        </Reveal>
        <Reveal delay={100}>
          <h2
            className="font-display mt-5"
            style={{
              fontSize: "clamp(32px, 4.2vw, 54px)",
              fontWeight: 700, letterSpacing: "-0.025em",
              color: "var(--fa-deep-1)", lineHeight: 1.08, maxWidth: 720,
            }}
          >
            {t.values.title}
          </h2>
        </Reveal>

        <div
          className="values-grid grid md:grid-cols-2 lg:grid-cols-3 mt-14"
          style={{ borderTop: "1px solid rgba(12,33,19,0.08)", borderLeft: "1px solid rgba(12,33,19,0.08)" }}
        >
          {t.values.items.map((v, i) => {
            const Icon = IconMap[v.icon] || Wheat;
            return (
              <Reveal key={i} delay={(i % 3) * 80} className="">
                <div style={{ padding: "36px 32px", transition: "background 240ms ease", height: "100%" }} data-testid={`value-${i}`}>
                  <span
                    style={{
                      width: 48, height: 48, borderRadius: 14,
                      background: "var(--fa-bg-tint)",
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <Icon size={22} color="var(--fa-green-2)" />
                  </span>
                  <h3
                    className="font-display mt-5"
                    style={{ fontSize: 19, fontWeight: 700, color: "var(--fa-deep-1)", letterSpacing: "-0.01em" }}
                  >
                    {v.title}
                  </h3>
                  <p style={{ marginTop: 10, fontSize: 14, lineHeight: 1.65, color: "var(--fa-body)" }}>
                    {v.desc}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={200}>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-14">
            {t.values.certs.map((c, i) => (
              <span key={i} className="chip-outline" data-testid={`cert-${i}`}>{c}</span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

// ---------------- Global Markets ----------------
const Markets = () => {
  const { t } = useLang();
  return (
    <section id="markets" data-testid="section-markets" style={{ background: "var(--fa-bg-off)", padding: "120px 0" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-16">
        <Reveal>
          <div className="eyebrow">{t.markets.eyebrow}</div>
          <h2
            className="font-display mt-5"
            style={{
              fontSize: "clamp(30px, 3.8vw, 48px)",
              fontWeight: 700, letterSpacing: "-0.025em",
              color: "var(--fa-deep-1)", lineHeight: 1.1,
            }}
          >
            {t.markets.title}
          </h2>
          <ul className="mt-10">
            {t.markets.regions.map((r, i) => (
              <li
                key={i}
                className="flex items-baseline justify-between gap-6 py-5"
                style={{ borderBottom: "1px solid rgba(12,33,19,0.1)" }}
                data-testid={`market-${i}`}
              >
                <span className="font-display" style={{ fontSize: 18, fontWeight: 700, color: "var(--fa-deep-1)" }}>
                  {r.name}
                </span>
                <span style={{ fontSize: 13, color: "var(--fa-muted)", textAlign: "right" }}>{r.crops}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={150}>
          <div
            className="gold-glow"
            style={{
              background: "linear-gradient(160deg, var(--fa-deep-1), var(--fa-deep-2))",
              color: "#fff",
              borderRadius: 22,
              padding: "44px 40px",
              position: "relative",
              height: "100%",
            }}
          >
            <div className="eyebrow on-dark" style={{ position: "relative" }}>Incoterms 2020</div>
            <h3
              className="font-display mt-5"
              style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.015em", color: "#fff", position: "relative" }}
            >
              {t.markets.termsTitle}
            </h3>
            <div className="mt-8 flex flex-col gap-6 relative">
              {t.markets.terms.map((term, i) => (
                <div key={i} data-testid={`term-${i}`}>
                  <div style={{ color: "var(--fa-gold-1)", fontWeight: 700, fontSize: 14, letterSpacing: "0.08em" }}>
                    {term.code}
                  </div>
                  <div style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.82)", marginTop: 4 }}>
                    {term.desc}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-10 relative">
              {t.markets.tags.map((tag, i) => (
                <span key={i} className="chip-outline on-dark">{tag}</span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

// ---------------- Contact form ----------------
const ContactSection = () => {
  const { t, lang } = useLang();
  const [form, setForm] = useState({
    name: "", company: "", email: "", phone: "",
    commodity: "", volume_tons: "", message: "",
  });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const onChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.commodity) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      await axios.post(`${API}/quote-requests`, { ...form, language: lang });
      setStatus("success");
      setForm({ name: "", company: "", email: "", phone: "", commodity: "", volume_tons: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const commodityOptions = t.commodities.items.map((it) => ({ key: it.key, title: it.title }));

  return (
    <section
      id="contact"
      data-testid="section-contact"
      style={{
        background: "linear-gradient(160deg, var(--fa-deep-1) 0%, var(--fa-deep-2) 100%)",
        color: "#fff",
        padding: "120px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute", top: "-120px", right: "-100px",
          width: 460, height: 460,
          background: "radial-gradient(circle, rgba(232,185,35,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative grid lg:grid-cols-2 gap-16">
        <Reveal>
          <div className="eyebrow on-dark">{t.contact.eyebrow}</div>
          <h2
            className="font-display mt-5"
            style={{
              fontSize: "clamp(32px, 4.2vw, 54px)",
              fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.08,
            }}
          >
            {t.contact.title}
          </h2>
          <p className="mt-6" style={{ fontSize: 16, lineHeight: 1.7, color: "rgba(255,255,255,0.78)", maxWidth: 540 }}>
            {t.contact.subtitle}
          </p>

          <div className="mt-12 grid sm:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <MapPin size={20} color="var(--fa-gold-1)" />
              <div>
                <div className="contact-label">{t.contact.labels.office}</div>
                <div style={{ fontSize: 15, color: "#fff" }}>{t.contact.values.office}</div>
              </div>
            </div>
            <div className="flex gap-4">
              <Mail size={20} color="var(--fa-gold-1)" />
              <div>
                <div className="contact-label">{t.contact.labels.email}</div>
                <a href={`mailto:${t.contact.values.email}`} style={{ fontSize: 15, color: "#fff", textDecoration: "none" }}>
                  {t.contact.values.email}
                </a>
              </div>
            </div>
            <div className="flex gap-4">
              <Phone size={20} color="var(--fa-gold-1)" />
              <div>
                <div className="contact-label">{t.contact.labels.phone}</div>
                <div style={{ fontSize: 15, color: "#fff" }}>{t.contact.values.phone}</div>
              </div>
            </div>
            <div className="flex gap-4">
              <Clock size={20} color="var(--fa-gold-1)" />
              <div>
                <div className="contact-label">{t.contact.labels.hours}</div>
                <div style={{ fontSize: 15, color: "#fff" }}>{t.contact.values.hours}</div>
              </div>
            </div>
          </div>

          <div
            className="mt-12 italic"
            style={{
              borderLeft: "3px solid var(--fa-gold-1)",
              paddingLeft: 18,
              fontSize: 16, lineHeight: 1.6, color: "rgba(255,255,255,0.86)",
              maxWidth: 520,
            }}
          >
            “{t.contact.quote}”
          </div>
        </Reveal>

        <Reveal delay={150}>
          <form className="glass-form" onSubmit={onSubmit} data-testid="quote-form">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label>{t.contact.form.name}</label>
                <input
                  name="name" value={form.name} onChange={onChange} required
                  data-testid="quote-input-name"
                  autoComplete="name"
                />
              </div>
              <div>
                <label>{t.contact.form.company}</label>
                <input
                  name="company" value={form.company} onChange={onChange}
                  data-testid="quote-input-company"
                  autoComplete="organization"
                />
              </div>
              <div>
                <label>{t.contact.form.email}</label>
                <input
                  type="email" name="email" value={form.email} onChange={onChange} required
                  data-testid="quote-input-email"
                  autoComplete="email"
                />
              </div>
              <div>
                <label>{t.contact.form.phone}</label>
                <input
                  name="phone" value={form.phone} onChange={onChange}
                  data-testid="quote-input-phone"
                  autoComplete="tel"
                />
              </div>
              <div>
                <label>{t.contact.form.commodity}</label>
                <select
                  name="commodity" value={form.commodity} onChange={onChange} required
                  data-testid="quote-input-commodity"
                >
                  <option value="">{t.contact.form.commodityPlaceholder}</option>
                  {commodityOptions.map((c) => (
                    <option key={c.key} value={c.key}>{c.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>{t.contact.form.volume}</label>
                <input
                  name="volume_tons" value={form.volume_tons} onChange={onChange}
                  data-testid="quote-input-volume"
                  inputMode="numeric"
                />
              </div>
              <div className="sm:col-span-2">
                <label>{t.contact.form.message}</label>
                <textarea
                  name="message" rows={4}
                  value={form.message} onChange={onChange}
                  placeholder={t.contact.form.messagePlaceholder}
                  data-testid="quote-input-message"
                />
              </div>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-5">
              <button
                type="submit"
                className="btn-gold"
                disabled={status === "sending"}
                data-testid="quote-submit"
              >
                {status === "sending" ? t.contact.form.sending : t.contact.form.submit}
                <ArrowRight size={18} />
              </button>
              {status === "success" && (
                <span
                  data-testid="quote-success"
                  style={{ color: "var(--fa-gold-1)", fontSize: 14, fontWeight: 500 }}
                >
                  {t.contact.form.success}
                </span>
              )}
              {status === "error" && (
                <span
                  data-testid="quote-error"
                  style={{ color: "#F3CC4E", fontSize: 14, fontWeight: 500 }}
                >
                  {t.contact.form.error}
                </span>
              )}
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
};

// ---------------- Footer ----------------
const Footer = () => {
  const { t } = useLang();
  return (
    <footer
      style={{
        background: "var(--fa-deep-1)",
        color: "rgba(255,255,255,0.7)",
        padding: "72px 0 32px",
      }}
      data-testid="footer"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-3">
              <img
                src="/images/logo.jpeg" alt="Five Agra Select"
                style={{ width: 44, height: 44, borderRadius: 9999, objectFit: "cover" }}
              />
              <div className="font-display" style={{ color: "#fff", lineHeight: 1.1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.05em" }}>FIVE AGRA</div>
                <div style={{ fontSize: 11, color: "var(--fa-gold-1)", letterSpacing: "0.22em" }}>SELECT</div>
              </div>
            </div>
            <p className="mt-5" style={{ fontSize: 13, lineHeight: 1.65 }}>
              {t.footer.tagline}
            </p>
          </div>

          <div>
            <h4 style={{ color: "#fff", fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>
              {t.footer.commodities}
            </h4>
            <ul className="mt-5 flex flex-col gap-3">
              {t.commodities.items.map((c) => (
                <li key={c.key}>
                  <button
                    onClick={() => scrollTo("commodities")}
                    className="footer-link"
                    style={{ background: "transparent", border: "none", color: "inherit", cursor: "pointer", fontSize: 13, padding: 0, textAlign: "left", transition: "color 200ms" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fa-gold-1)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "")}
                  >
                    {c.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ color: "#fff", fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>
              {t.footer.company}
            </h4>
            <ul className="mt-5 flex flex-col gap-3">
              {[
                { label: t.footer.companyLinks[0], id: "who" },
                { label: t.footer.companyLinks[1], id: "story" },
                { label: t.footer.companyLinks[2], id: "field" },
                { label: t.footer.companyLinks[3], id: "markets" },
              ].map((l) => (
                <li key={l.id}>
                  <button
                    onClick={() => scrollTo(l.id)}
                    style={{ background: "transparent", border: "none", color: "inherit", cursor: "pointer", fontSize: 13, padding: 0, textAlign: "left", transition: "color 200ms" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fa-gold-1)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "")}
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ color: "#fff", fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>
              {t.footer.contact}
            </h4>
            <ul className="mt-5 flex flex-col gap-3" style={{ fontSize: 13 }}>
              <li>{t.contact.values.office}</li>
              <li>
                <a href={`mailto:${t.contact.values.email}`} style={{ color: "inherit", textDecoration: "none" }}>
                  {t.contact.values.email}
                </a>
              </li>
              <li>{t.contact.values.phone}</li>
              <li>{t.contact.values.hours}</li>
            </ul>
          </div>
        </div>

        <div
          className="mt-14 pt-7 flex flex-wrap items-center justify-between gap-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)", fontSize: 12 }}
        >
          <div>{t.footer.rights}</div>
          <div style={{ color: "rgba(255,255,255,0.6)" }}>{t.footer.origin}</div>
        </div>
      </div>
    </footer>
  );
};

// ---------------- Page composition ----------------
const Landing = () => {
  return (
    <main data-testid="landing-page">
      <Hero />
      <Stats />
      <Purpose />
      <Commodities />
      <OurStory />
      <SupplyChain />
      <Values />
      <Markets />
      <ContactSection />
      <Footer />
    </main>
  );
};

export default Landing;
