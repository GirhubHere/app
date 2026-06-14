import React, { useState, useRef, useEffect } from "react";
import {
  ChevronDown, ArrowRight, CheckCircle2, Sprout, FlaskConical, Truck, Ship,
  Wheat, FileCheck2, Handshake, Globe2, Mail, Phone, MapPin, Clock,
} from "lucide-react";
import { useLang } from "../i18n/LanguageContext";
import { Reveal, CountUp } from "../components/Reveal";
import { subscribeScrollY } from "../hooks/scrollStore";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const IconMap = { Sprout, FlaskConical, Truck, Ship, Wheat, FileCheck2, Handshake, Globe2 };

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

/* ─── Parallax layer — bypasses React re-renders via direct DOM ─── */
const ParallaxEl = ({ speed = 0.3, style, className, children }) => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const unsub = subscribeScrollY((y) => {
      if (el) el.style.transform = `translateY(${y * speed}px)`;
    });
    return unsub;
  }, [speed]);
  return <div ref={ref} style={style} className={className}>{children}</div>;
};

/* Parallax relative to element's own section top */
const ParallaxSection = ({ speed = 0.2, style, children }) => {
  const ref = useRef(null);
  const top = useRef(0);
  useEffect(() => {
    const el = ref.current;
    top.current = el.getBoundingClientRect().top + window.scrollY;
    const unsub = subscribeScrollY((y) => {
      if (el) el.style.transform = `translateY(${(y - top.current) * speed}px)`;
    });
    return unsub;
  }, [speed]);
  return <div ref={ref} style={style}>{children}</div>;
};

/* ─── Floating grain particles ─── */
const GRAINS = [
  { x: 13, y: 18, w: 34, h: 13, rot: 22,  op: 0.30, spd: 0.14, col: "#E8B923" },
  { x: 78, y: 30, w: 20, h: 8,  rot: -18, op: 0.22, spd: 0.22, col: "#E8B923" },
  { x: 87, y: 12, w: 26, h: 10, rot: 48,  op: 0.18, spd: 0.10, col: "#fff" },
  { x: 5,  y: 62, w: 16, h: 6,  rot: -32, op: 0.28, spd: 0.31, col: "#E8B923" },
  { x: 58, y: 80, w: 22, h: 9,  rot: 12,  op: 0.20, spd: 0.18, col: "#fff" },
  { x: 36, y: 92, w: 18, h: 7,  rot: -42, op: 0.24, spd: 0.12, col: "#E8B923" },
  { x: 93, y: 56, w: 28, h: 11, rot: 36,  op: 0.16, spd: 0.27, col: "#fff" },
  { x: 24, y: 44, w: 12, h: 5,  rot: -24, op: 0.22, spd: 0.38, col: "#E8B923" },
  { x: 68, y: 8,  w: 16, h: 6,  rot: 55,  op: 0.15, spd: 0.20, col: "#fff" },
  { x: 45, y: 22, w: 10, h: 4,  rot: -10, op: 0.18, spd: 0.16, col: "#E8B923" },
];

const COMMODITY_IMAGES = {
  corn: "/images/corn.png",
  wheat: "/images/wheat.png",
  sunflower: "/images/sunflower.png",
  barley: "/images/barley.png",
  rapeseed: "/images/rapeseed.png",
  soybean: "/images/soybean.png",
};

/* ════════════════════════════════════════════════
   HERO  — 3-layer parallax + floating grains
   ════════════════════════════════════════════════ */
const Hero = () => {
  const { t } = useLang();
  const bgRef = useRef(null);
  const orbRef = useRef(null);
  const grainRefs = useRef([]);
  const textRef = useRef(null);

  useEffect(() => {
    const bg = bgRef.current;
    const orb = orbRef.current;
    const txt = textRef.current;
    const grains = grainRefs.current;

    const unsub = subscribeScrollY((y) => {
      /* Background drifts at 38% — appears far away (camera pulls back) */
      if (bg) bg.style.transform = `translateY(${y * 0.38}px) scale(${1 + y * 0.00004})`;
      /* Golden orb drifts mid-distance */
      if (orb) orb.style.transform = `translateY(${y * 0.52}px)`;
      /* Text content subtle pull */
      if (txt) txt.style.transform = `translateY(${y * 0.12}px)`;
      /* Each grain at its own speed → depth */
      grains.forEach((el, i) => {
        if (el) {
          el.style.transform =
            `translateY(${y * GRAINS[i].spd}px) rotate(${GRAINS[i].rot + y * 0.02}deg)`;
        }
      });
    });
    return unsub;
  }, []);

  return (
    <section
      id="hero"
      data-testid="section-hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "flex-end",
        color: "#fff",
        overflow: "hidden",
        background: "var(--fa-deep-1)",
      }}
    >
      {/* Layer 1 — parallax hero image */}
      <div
        ref={bgRef}
        style={{
          position: "absolute",
          inset: "-15% 0",
          backgroundImage: "url('/images/hero.png')",
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
          willChange: "transform",
        }}
      />

      {/* Layer 2 — rich gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(11,30,16,0.38) 0%, rgba(11,30,16,0.5) 45%, rgba(11,30,16,0.94) 100%)," +
            "linear-gradient(120deg, rgba(232,185,35,0.08) 0%, transparent 60%)",
          zIndex: 1,
        }}
      />

      {/* Layer 3 — floating golden orb (light source) */}
      <div
        ref={orbRef}
        className="orb"
        style={{
          top: "8%",
          right: "12%",
          width: 380,
          height: 380,
          background:
            "radial-gradient(circle at 40% 40%, rgba(232,185,35,0.22) 0%, rgba(232,185,35,0.06) 50%, transparent 70%)",
          zIndex: 2,
          willChange: "transform",
        }}
      />

      {/* Grain particles — each speed is different → 3-D depth */}
      {GRAINS.map((g, i) => (
        <div
          key={i}
          ref={(el) => (grainRefs.current[i] = el)}
          className="grain-particle"
          style={{
            left: `${g.x}%`,
            top: `${g.y}%`,
            width: g.w,
            height: g.h,
            background: g.col,
            opacity: g.op,
            transform: `rotate(${g.rot}deg)`,
            zIndex: 3,
          }}
        />
      ))}

      {/* Content */}
      <div
        ref={textRef}
        className="max-w-7xl mx-auto px-6 lg:px-10 relative pb-28 pt-32 lg:pb-36 w-full"
        style={{ zIndex: 4, willChange: "transform" }}
      >
        <div className="max-w-3xl">
          <Reveal>
            <div className="eyebrow on-dark">{t.hero.eyebrow}</div>
          </Reveal>
          <Reveal delay={130}>
            <h1
              className="font-display mt-6"
              style={{
                fontSize: "clamp(40px,7.2vw,78px)",
                lineHeight: 1.03,
                fontWeight: 700,
                letterSpacing: "-0.028em",
              }}
              data-testid="hero-title"
            >
              {t.hero.title1}{" "}
              <span style={{ color: "var(--fa-gold-1)" }}>{t.hero.titleGold}</span>
            </h1>
          </Reveal>
          <Reveal delay={260}>
            <p
              className="mt-7 max-w-2xl"
              style={{ fontSize: 17, lineHeight: 1.65, color: "rgba(255,255,255,0.83)" }}
            >
              {t.hero.subtitle}
            </p>
          </Reveal>
          <Reveal delay={380}>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <button onClick={() => scrollTo("contact")} className="btn-gold" data-testid="hero-cta-primary">
                {t.hero.cta}
                <ArrowRight size={18} />
              </button>
              <button onClick={() => scrollTo("commodities")} className="btn-ghost-light" data-testid="hero-cta-ghost">
                {t.hero.ghost} <ArrowRight size={16} />
              </button>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="bounce-down"
        style={{
          position: "absolute",
          bottom: 26,
          left: "50%",
          color: "rgba(255,255,255,0.6)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 7,
          fontSize: 10,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          zIndex: 5,
        }}
      >
        {t.hero.scroll}
        <ChevronDown size={17} />
      </div>
    </section>
  );
};

/* ════════════════════════════════════════════════
   STATS
   ════════════════════════════════════════════════ */
const Stats = () => {
  const { t } = useLang();
  return (
    <section
      id="stats"
      data-testid="section-stats"
      style={{ background: "#fff", padding: "100px 0" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <Reveal>
          <div className="eyebrow">{t.stats.eyebrow}</div>
        </Reveal>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 mt-12">
          {t.stats.items.map((s, i) => (
            <Reveal key={i} delay={i * 100}>
              <div style={{ borderLeft: "2px solid var(--fa-gold-1)", paddingLeft: 22 }} data-testid={`stat-${i}`}>
                <div
                  className="font-display"
                  style={{
                    fontSize: "clamp(42px,5vw,66px)",
                    color: "var(--fa-deep-1)",
                    fontWeight: 700,
                    lineHeight: 1,
                    letterSpacing: "-0.04em",
                  }}
                >
                  <CountUp to={s.value} suffix={s.suffix} />
                </div>
                <div style={{ marginTop: 12, fontSize: 13.5, color: "var(--fa-muted)", lineHeight: 1.55 }}>
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

/* ════════════════════════════════════════════════
   PURPOSE
   ════════════════════════════════════════════════ */
const Purpose = () => {
  const { t } = useLang();
  return (
    <section
      id="who"
      data-testid="section-purpose"
      style={{ background: "var(--fa-bg-cream)", padding: "130px 0" }}
    >
      <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center">
        <Reveal>
          <div className="eyebrow center-bar">{t.purpose.eyebrow}</div>
        </Reveal>
        <Reveal delay={130}>
          <h2
            className="font-display mt-8"
            style={{
              fontSize: "clamp(28px,3.6vw,48px)",
              lineHeight: 1.22,
              fontWeight: 600,
              letterSpacing: "-0.018em",
              color: "var(--fa-deep-1)",
            }}
          >
            {t.purpose.headline1}
            <span className="gold-underline" style={{ fontWeight: 700 }}>{t.purpose.headlineGold}</span>
            {t.purpose.headline2}
          </h2>
        </Reveal>
        <Reveal delay={270}>
          <p
            className="mt-10 mx-auto"
            style={{ maxWidth: 740, fontSize: 16.5, lineHeight: 1.8, color: "var(--fa-body)" }}
          >
            {t.purpose.body}
          </p>
        </Reveal>
        <Reveal delay={360}>
          <div className="section-divider mt-14" />
        </Reveal>
      </div>
    </section>
  );
};

/* ════════════════════════════════════════════════
   COMMODITIES
   ════════════════════════════════════════════════ */
const Commodities = () => {
  const { t } = useLang();
  return (
    <section
      id="commodities"
      data-testid="section-commodities"
      style={{ background: "var(--fa-bg-off)", padding: "130px 0" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-3 gap-12 items-end mb-16">
          <Reveal className="lg:col-span-2" direction="left">
            <div className="eyebrow">{t.commodities.eyebrow}</div>
            <h2
              className="font-display mt-5"
              style={{
                fontSize: "clamp(32px,4.2vw,54px)",
                fontWeight: 700,
                letterSpacing: "-0.026em",
                color: "var(--fa-deep-1)",
                lineHeight: 1.07,
              }}
            >
              {t.commodities.title}
            </h2>
          </Reveal>
          <Reveal delay={160} direction="right">
            <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--fa-muted)" }}>
              {t.commodities.side}
            </p>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {t.commodities.items.map((item, i) => (
            <Reveal key={item.key} delay={(i % 3) * 100} direction="scale">
              <article className="fa-card h-full" data-testid={`commodity-${item.key}`}>
                <div className="img-wrap" style={{ position: "relative" }}>
                  <img src={COMMODITY_IMAGES[item.key]} alt={item.title} loading="lazy" />
                  {item.badge && (
                    <span
                      style={{
                        position: "absolute", top: 14, left: 14,
                        background: "var(--fa-gold-1)", color: "var(--fa-deep-1)",
                        fontSize: 9.5, fontWeight: 800, letterSpacing: "0.18em",
                        padding: "6px 12px", borderRadius: 9999, textTransform: "uppercase",
                        boxShadow: "0 4px 12px -4px rgba(200,155,16,0.6)",
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <div style={{ padding: "28px 28px 30px", display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
                  <h3
                    className="font-display"
                    style={{ fontSize: 21, fontWeight: 700, color: "var(--fa-deep-1)", letterSpacing: "-0.015em" }}
                  >
                    {item.title}
                  </h3>
                  <p style={{ fontSize: 14, lineHeight: 1.68, color: "var(--fa-body)", flex: 1 }}>
                    {item.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {item.chips.map((c, ci) => (
                      <span key={ci} className="chip">{c}</span>
                    ))}
                  </div>
                  <button
                    onClick={() => scrollTo("contact")}
                    className="btn-ghost-dark mt-1"
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

/* ════════════════════════════════════════════════
   OUR STORY  — counter-parallax on photo
   ════════════════════════════════════════════════ */
const OurStory = () => {
  const { t } = useLang();
  const photoRef = useRef(null);
  const sectionTop = useRef(0);

  useEffect(() => {
    const el = photoRef.current;
    if (!el) return;
    const measure = () => {
      sectionTop.current = el.getBoundingClientRect().top + window.scrollY;
    };
    measure();
    window.addEventListener("resize", measure);
    const unsub = subscribeScrollY((y) => {
      if (el) {
        /* Counter-parallax: photo drifts upward as you scroll into section */
        const offset = (y - sectionTop.current) * -0.1;
        el.style.transform = `translateY(${offset}px)`;
      }
    });
    return () => {
      unsub();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section id="story" data-testid="section-story" style={{ background: "#fff", padding: "130px 0" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-18 items-center" style={{ gap: "5rem" }}>
        <Reveal direction="left">
          <div
            ref={photoRef}
            className="photo-frame"
            style={{ aspectRatio: "4 / 5", willChange: "transform" }}
          >
            <img src="/images/farmer.png" alt="Farmer and agronomist" loading="lazy" />
          </div>
        </Reveal>

        <div>
          <Reveal delay={120} direction="right">
            <div className="eyebrow">{t.story.eyebrow}</div>
          </Reveal>
          <Reveal delay={200} direction="right">
            <h2
              className="font-display mt-5"
              style={{
                fontSize: "clamp(30px,3.8vw,50px)",
                fontWeight: 700, letterSpacing: "-0.026em",
                color: "var(--fa-deep-1)", lineHeight: 1.1,
              }}
            >
              {t.story.title}
            </h2>
          </Reveal>
          <Reveal delay={280} direction="right">
            <p className="mt-6" style={{ fontSize: 16, lineHeight: 1.78, color: "var(--fa-body)" }}>
              {t.story.body}
            </p>
          </Reveal>
          <ul className="mt-8 flex flex-col gap-4">
            {t.story.checks.map((c, i) => (
              <Reveal key={i} delay={360 + i * 80} direction="right">
                <li className="flex items-start gap-3" data-testid={`story-check-${i}`}>
                  <span
                    style={{
                      width: 28, height: 28, borderRadius: 9999,
                      background: "var(--fa-bg-tint)",
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, marginTop: 1,
                    }}
                  >
                    <CheckCircle2 size={17} color="var(--fa-green-2)" />
                  </span>
                  <span style={{ fontSize: 15, lineHeight: 1.62, color: "var(--fa-body)" }}>{c}</span>
                </li>
              </Reveal>
            ))}
          </ul>
          <Reveal delay={700} direction="right">
            <button onClick={() => scrollTo("contact")} className="btn-gold mt-10" data-testid="story-cta">
              {t.story.cta} <ArrowRight size={18} />
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

/* ════════════════════════════════════════════════
   SUPPLY CHAIN  — CSS fixed parallax bg + JS orb
   ════════════════════════════════════════════════ */
const SupplyChain = () => {
  const { t } = useLang();
  const orbRef = useRef(null);

  useEffect(() => {
    const orb = orbRef.current;
    const unsub = subscribeScrollY((y) => {
      if (orb) orb.style.transform = `translateY(${y * 0.18}px)`;
    });
    return unsub;
  }, []);

  return (
    <section
      id="field"
      data-testid="section-supply-chain"
      className="dark-parallax"
      style={{
        padding: "150px 0",
        position: "relative",
        color: "#fff",
        backgroundImage: "url('/images/field-aerial.png')",
      }}
    >
      {/* Drifting gold orb */}
      <div
        ref={orbRef}
        className="orb"
        style={{
          top: "10%",
          left: "-8%",
          width: 500,
          height: 500,
          background:
            "radial-gradient(circle at 60% 40%, rgba(232,185,35,0.18) 0%, transparent 65%)",
          zIndex: 1,
          willChange: "transform",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative" style={{ zIndex: 2 }}>
        <Reveal>
          <div className="eyebrow on-dark">{t.nav.field}</div>
        </Reveal>
        <Reveal delay={100}>
          <h2
            className="font-display mt-5"
            style={{
              fontSize: "clamp(32px,4.4vw,58px)",
              fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.08,
              maxWidth: 720,
            }}
          >
            {t.chain.title}
          </h2>
        </Reveal>

        <div className="mt-18 grid md:grid-cols-2 lg:grid-cols-4 gap-10 relative" style={{ marginTop: "4.5rem" }}>
          <div
            className="hidden lg:block"
            style={{
              position: "absolute", top: 8, left: "5%", right: "5%", height: 1,
              background: "linear-gradient(90deg, transparent, var(--fa-gold-1) 15%, var(--fa-gold-1) 85%, transparent)",
              opacity: 0.3,
            }}
          />
          {t.chain.steps.map((s, i) => {
            const Icon = IconMap[s.icon] || Sprout;
            return (
              <Reveal key={i} delay={i * 130}>
                <div className="relative" data-testid={`chain-step-${i}`}>
                  <div className="timeline-dot mb-7" />
                  <Icon size={26} color="var(--fa-gold-1)" />
                  <h3
                    className="font-display mt-4"
                    style={{ fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}
                  >
                    {s.title}
                  </h3>
                  <p className="mt-3" style={{ fontSize: 14, lineHeight: 1.68, color: "rgba(255,255,255,0.72)" }}>
                    {s.desc}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={200}>
          <blockquote
            className="font-display mx-auto text-center"
            style={{
              fontSize: "clamp(20px,2.6vw,34px)",
              fontWeight: 400, fontStyle: "italic",
              lineHeight: 1.38, maxWidth: 900,
              color: "rgba(255,255,255,0.92)",
              letterSpacing: "-0.006em",
              marginTop: "6rem",
              padding: "0 1rem",
            }}
            data-testid="supply-quote"
          >
            "{t.chain.quote}
            <span style={{ color: "var(--fa-gold-1)", fontStyle: "normal", fontWeight: 700 }}>
              {t.chain.quoteGold}
            </span>
            {t.chain.quote2}"
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
};

/* ════════════════════════════════════════════════
   VALUES
   ════════════════════════════════════════════════ */
const Values = () => {
  const { t } = useLang();
  return (
    <section data-testid="section-values" style={{ background: "var(--fa-bg-cream)", padding: "130px 0" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <Reveal>
          <div className="eyebrow">{t.values.eyebrow}</div>
        </Reveal>
        <Reveal delay={100}>
          <h2
            className="font-display mt-6"
            style={{
              fontSize: "clamp(32px,4.2vw,54px)",
              fontWeight: 700, letterSpacing: "-0.025em",
              color: "var(--fa-deep-1)", lineHeight: 1.08, maxWidth: 740,
            }}
          >
            {t.values.title}
          </h2>
        </Reveal>

        <div
          className="values-grid grid md:grid-cols-2 lg:grid-cols-3 mt-14"
          style={{ borderTop: "1px solid rgba(12,33,19,0.07)", borderLeft: "1px solid rgba(12,33,19,0.07)" }}
        >
          {t.values.items.map((v, i) => {
            const Icon = IconMap[v.icon] || Wheat;
            return (
              <Reveal key={i} delay={(i % 3) * 90} direction="scale">
                <div style={{ padding: "38px 34px", height: "100%" }} data-testid={`value-${i}`}>
                  <span
                    style={{
                      width: 50, height: 50, borderRadius: 15,
                      background: "var(--fa-bg-tint)",
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      transition: "background 220ms ease, box-shadow 220ms ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--fa-mint)";
                      e.currentTarget.style.boxShadow = "0 6px 16px -6px rgba(46,125,70,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "var(--fa-bg-tint)";
                      e.currentTarget.style.boxShadow = "";
                    }}
                  >
                    <Icon size={22} color="var(--fa-green-2)" />
                  </span>
                  <h3
                    className="font-display mt-6"
                    style={{ fontSize: 19, fontWeight: 700, color: "var(--fa-deep-1)", letterSpacing: "-0.01em" }}
                  >
                    {v.title}
                  </h3>
                  <p style={{ marginTop: 10, fontSize: 14, lineHeight: 1.68, color: "var(--fa-body)" }}>
                    {v.desc}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={220}>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-16">
            {t.values.certs.map((c, i) => (
              <span key={i} className="chip-outline" data-testid={`cert-${i}`}>{c}</span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

/* ════════════════════════════════════════════════
   GLOBAL MARKETS
   ════════════════════════════════════════════════ */
const Markets = () => {
  const { t } = useLang();
  const decorRef = useRef(null);
  const sectionTop = useRef(0);

  useEffect(() => {
    const el = decorRef.current;
    if (!el) return;
    const measure = () => {
      sectionTop.current = el.getBoundingClientRect().top + window.scrollY;
    };
    measure();
    window.addEventListener("resize", measure);
    const unsub = subscribeScrollY((y) => {
      if (el) el.style.transform = `translateY(${(y - sectionTop.current) * -0.14}px)`;
    });
    return () => { unsub(); window.removeEventListener("resize", measure); };
  }, []);

  return (
    <section id="markets" data-testid="section-markets" style={{ background: "var(--fa-bg-off)", padding: "130px 0", position: "relative" }}>
      {/* Decorative counter-parallax orb */}
      <div
        ref={decorRef}
        style={{
          position: "absolute",
          top: "20%", right: "5%",
          width: 320, height: 320,
          borderRadius: "50%",
          background: "radial-gradient(circle, var(--fa-gold-pale) 0%, transparent 70%)",
          pointerEvents: "none",
          willChange: "transform",
          zIndex: 0,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-16" style={{ position: "relative", zIndex: 1 }}>
        <Reveal direction="left">
          <div className="eyebrow">{t.markets.eyebrow}</div>
          <h2
            className="font-display mt-5"
            style={{
              fontSize: "clamp(30px,3.8vw,50px)",
              fontWeight: 700, letterSpacing: "-0.025em",
              color: "var(--fa-deep-1)", lineHeight: 1.1,
            }}
          >
            {t.markets.title}
          </h2>
          <ul className="mt-10">
            {t.markets.regions.map((r, i) => (
              <Reveal key={i} delay={i * 80}>
                <li
                  className="flex items-baseline justify-between gap-6 py-5"
                  style={{ borderBottom: "1px solid rgba(12,33,19,0.09)" }}
                  data-testid={`market-${i}`}
                >
                  <span className="font-display" style={{ fontSize: 18, fontWeight: 700, color: "var(--fa-deep-1)" }}>
                    {r.name}
                  </span>
                  <span style={{ fontSize: 13, color: "var(--fa-muted)", textAlign: "right", whiteSpace: "nowrap" }}>
                    {r.crops}
                  </span>
                </li>
              </Reveal>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={160} direction="right">
          <div
            className="gold-glow"
            style={{
              background: "linear-gradient(155deg, var(--fa-deep-1) 0%, var(--fa-deep-2) 60%, #1A3A22 100%)",
              color: "#fff",
              borderRadius: 24,
              padding: "46px 42px",
              height: "100%",
            }}
          >
            <div className="eyebrow on-dark" style={{ position: "relative", zIndex: 1 }}>Incoterms 2020</div>
            <h3
              className="font-display mt-5"
              style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.015em", color: "#fff", position: "relative", zIndex: 1 }}
            >
              {t.markets.termsTitle}
            </h3>
            <div className="mt-8 flex flex-col gap-6 relative" style={{ zIndex: 1 }}>
              {t.markets.terms.map((term, i) => (
                <div key={i} data-testid={`term-${i}`}>
                  <div style={{ color: "var(--fa-gold-1)", fontWeight: 800, fontSize: 14, letterSpacing: "0.1em" }}>
                    {term.code}
                  </div>
                  <div style={{ fontSize: 14, lineHeight: 1.62, color: "rgba(255,255,255,0.8)", marginTop: 5 }}>
                    {term.desc}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-10 relative" style={{ zIndex: 1 }}>
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

/* ════════════════════════════════════════════════
   CONTACT FORM
   ════════════════════════════════════════════════ */
const ContactSection = () => {
  const { t, lang } = useLang();
  const orbRef = useRef(null);

  const [form, setForm] = useState({
    name: "", company: "", email: "", phone: "",
    commodity: "", volume_tons: "", message: "",
  });
  const [status, setStatus] = useState("idle");
  const [sitePhone, setSitePhone] = useState(null);
  const [siteEmail, setSiteEmail] = useState(null);
  const [siteOffice, setSiteOffice] = useState(null);
  const [siteHours, setSiteHours] = useState(null);

  /* Load live config from backend (client-editable fields) */
  useEffect(() => {
    axios.get(`${API}/site-config`).then(({ data }) => {
      setSitePhone(data.phone || null);
      setSiteEmail(data.email || null);
      setSiteOffice(data.office || null);
      setSiteHours(data.hours || null);
    }).catch(() => {});
  }, []);

  /* Parallax orb */
  useEffect(() => {
    const orb = orbRef.current;
    const unsub = subscribeScrollY((y) => {
      if (orb) orb.style.transform = `translateY(${y * 0.22}px)`;
    });
    return unsub;
  }, []);

  const onChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.commodity) { setStatus("error"); return; }
    setStatus("sending");
    try {
      await axios.post(`${API}/quote-requests`, { ...form, language: lang });
      setStatus("success");
      setForm({ name: "", company: "", email: "", phone: "", commodity: "", volume_tons: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const phone  = sitePhone  || t.contact.values.phone;
  const email  = siteEmail  || t.contact.values.email;
  const office = siteOffice || t.contact.values.office;
  const hours  = siteHours  || t.contact.values.hours;

  return (
    <section
      id="contact"
      data-testid="section-contact"
      style={{
        background: "linear-gradient(155deg, var(--fa-deep-1) 0%, #0F2517 40%, var(--fa-deep-2) 100%)",
        color: "#fff",
        padding: "130px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        ref={orbRef}
        className="orb"
        style={{
          top: "-140px", right: "-120px",
          width: 520, height: 520,
          background: "radial-gradient(circle, rgba(232,185,35,0.20) 0%, transparent 68%)",
          willChange: "transform",
        }}
      />
      <div
        className="orb"
        style={{
          bottom: "-100px", left: "-80px",
          width: 380, height: 380,
          background: "radial-gradient(circle, rgba(46,125,70,0.20) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative grid lg:grid-cols-2 gap-16" style={{ zIndex: 1 }}>
        <Reveal direction="left">
          <div className="eyebrow on-dark">{t.contact.eyebrow}</div>
          <h2
            className="font-display mt-5"
            style={{
              fontSize: "clamp(32px,4.2vw,54px)",
              fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.08,
            }}
          >
            {t.contact.title}
          </h2>
          <p className="mt-6" style={{ fontSize: 16, lineHeight: 1.72, color: "rgba(255,255,255,0.76)", maxWidth: 540 }}>
            {t.contact.subtitle}
          </p>

          <div className="mt-12 grid sm:grid-cols-2 gap-8">
            {[
              { Icon: MapPin, label: t.contact.labels.office, val: office },
              { Icon: Mail,   label: t.contact.labels.email,  val: email,  href: `mailto:${email}` },
              { Icon: Phone,  label: t.contact.labels.phone,  val: phone },
              { Icon: Clock,  label: t.contact.labels.hours,  val: hours },
            ].map(({ Icon, label, val, href }) => (
              <div key={label} className="flex gap-4">
                <Icon size={20} color="var(--fa-gold-1)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div className="contact-label">{label}</div>
                  {href ? (
                    <a href={href} style={{ fontSize: 15, color: "#fff", textDecoration: "none" }}>{val}</a>
                  ) : (
                    <div style={{ fontSize: 15, color: "#fff" }}>{val}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div
            className="mt-12 italic"
            style={{
              borderLeft: "3px solid var(--fa-gold-1)",
              paddingLeft: 20, fontSize: 16,
              lineHeight: 1.62, color: "rgba(255,255,255,0.84)", maxWidth: 520,
            }}
          >
            "{t.contact.quote}"
          </div>
        </Reveal>

        <Reveal delay={160} direction="right">
          <form className="glass-form" onSubmit={onSubmit} data-testid="quote-form">
            <div className="grid sm:grid-cols-2 gap-5">
              {[
                { name: "name",       label: t.contact.form.name,    type: "text",  required: true },
                { name: "company",    label: t.contact.form.company,  type: "text" },
                { name: "email",      label: t.contact.form.email,    type: "email", required: true },
                { name: "phone",      label: t.contact.form.phone,    type: "text" },
              ].map((f) => (
                <div key={f.name}>
                  <label>{f.label}</label>
                  <input
                    type={f.type}
                    name={f.name}
                    value={form[f.name]}
                    onChange={onChange}
                    required={f.required}
                    data-testid={`quote-input-${f.name}`}
                  />
                </div>
              ))}
              <div>
                <label>{t.contact.form.commodity}</label>
                <select
                  name="commodity"
                  value={form.commodity}
                  onChange={onChange}
                  required
                  data-testid="quote-input-commodity"
                >
                  <option value="">{t.contact.form.commodityPlaceholder}</option>
                  {t.commodities.items.map((c) => (
                    <option key={c.key} value={c.key}>{c.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>{t.contact.form.volume}</label>
                <input
                  name="volume_tons"
                  value={form.volume_tons}
                  onChange={onChange}
                  inputMode="numeric"
                  data-testid="quote-input-volume"
                />
              </div>
              <div className="sm:col-span-2">
                <label>{t.contact.form.message}</label>
                <textarea
                  name="message" rows={4}
                  value={form.message}
                  onChange={onChange}
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
                <span data-testid="quote-success" style={{ color: "var(--fa-gold-1)", fontSize: 14, fontWeight: 600 }}>
                  {t.contact.form.success}
                </span>
              )}
              {status === "error" && (
                <span data-testid="quote-error" style={{ color: "#F3CC4E", fontSize: 14, fontWeight: 600 }}>
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

/* ════════════════════════════════════════════════
   FOOTER
   ════════════════════════════════════════════════ */
const Footer = () => {
  const { t } = useLang();
  return (
    <footer
      style={{
        background: "var(--fa-deep-1)",
        color: "rgba(255,255,255,0.65)",
        padding: "80px 0 36px",
        borderTop: "1px solid rgba(232,185,35,0.12)",
      }}
      data-testid="footer"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-3">
              <img
                src="/images/logo.jpeg" alt="Five Agra Select"
                style={{ width: 46, height: 46, borderRadius: 9999, objectFit: "cover" }}
              />
              <div className="font-display" style={{ color: "#fff", lineHeight: 1.1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.06em" }}>FIVE AGRA</div>
                <div style={{ fontSize: 10.5, color: "var(--fa-gold-1)", letterSpacing: "0.24em" }}>SELECT</div>
              </div>
            </div>
            <p className="mt-5" style={{ fontSize: 13, lineHeight: 1.68 }}>
              {t.footer.tagline}
            </p>
          </div>

          {[
            {
              title: t.footer.commodities,
              items: t.commodities.items.map((c) => ({ label: c.title, id: "commodities" })),
            },
            {
              title: t.footer.company,
              items: [
                { label: t.footer.companyLinks[0], id: "who" },
                { label: t.footer.companyLinks[1], id: "story" },
                { label: t.footer.companyLinks[2], id: "who" },
                { label: t.footer.companyLinks[3], id: "markets" },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 style={{ color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                {col.title}
              </h4>
              <ul className="mt-5 flex flex-col gap-3">
                {col.items.map((l) => (
                  <li key={l.label}>
                    <button
                      onClick={() => scrollTo(l.id)}
                      style={{
                        background: "transparent", border: "none", cursor: "pointer",
                        color: "inherit", fontSize: 13, padding: 0, textAlign: "left",
                        transition: "color 180ms ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fa-gold-1)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "")}
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 style={{ color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>
              {t.footer.contact}
            </h4>
            <ul className="mt-5 flex flex-col gap-3" style={{ fontSize: 13 }}>
              <li>{t.contact.values.office}</li>
              <li>
                <a
                  href={`mailto:${t.contact.values.email}`}
                  style={{ color: "inherit", textDecoration: "none", transition: "color 180ms" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fa-gold-1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "")}
                >
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
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)", fontSize: 12 }}
        >
          <div>{t.footer.rights}</div>
          <div style={{ color: "rgba(255,255,255,0.55)" }}>{t.footer.origin}</div>
        </div>
      </div>
    </footer>
  );
};

/* ════════════════════════════════════════════════
   PAGE COMPOSITION
   ════════════════════════════════════════════════ */
const Landing = () => (
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

export default Landing;
