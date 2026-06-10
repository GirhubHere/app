import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useLang } from "../i18n/LanguageContext";

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

export const Navbar = () => {
  const { t, lang, setLang, langs } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { id: "who", label: t.nav.who },
    { id: "commodities", label: t.nav.commodities },
    { id: "field", label: t.nav.field },
    { id: "markets", label: t.nav.markets },
  ];

  const textColor = scrolled ? "var(--fa-deep-1)" : "#ffffff";

  return (
    <>
      <nav
        className={`fa-nav ${scrolled ? "scrolled" : ""}`}
        data-testid="main-navbar"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollTo("hero")}
            className="flex items-center gap-3 group"
            data-testid="nav-logo"
            style={{ background: "transparent", border: "none", cursor: "pointer" }}
          >
            <span
              className="inline-flex items-center justify-center"
              style={{
                width: 44,
                height: 44,
                borderRadius: 9999,
                background: scrolled ? "var(--fa-deep-1)" : "rgba(255,255,255,0.08)",
                border: `1px solid ${scrolled ? "var(--fa-deep-1)" : "rgba(255,255,255,0.25)"}`,
                overflow: "hidden",
              }}
            >
              <img
                src="/images/logo.jpeg"
                alt="Five Agra Select"
                style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 9999 }}
              />
            </span>
            <span
              className="font-display leading-tight text-left"
              style={{ color: textColor, fontWeight: 700, letterSpacing: "0.04em" }}
            >
              <span style={{ display: "block", fontSize: 13 }}>FIVE AGRA</span>
              <span style={{ display: "block", fontSize: 11, color: "var(--fa-gold-1)", letterSpacing: "0.2em" }}>
                SELECT
              </span>
            </span>
          </button>

          {/* Center links */}
          <div className="hidden lg:flex items-center gap-9">
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="nav-link"
                style={{ color: textColor }}
                data-testid={`nav-link-${l.id}`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Right: language + CTA */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1" data-testid="lang-switcher">
              {langs.map((L) => (
                <button
                  key={L.code}
                  onClick={() => setLang(L.code)}
                  data-testid={`lang-${L.code}`}
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    padding: "6px 10px",
                    borderRadius: 9999,
                    background: lang === L.code ? "var(--fa-gold-1)" : "transparent",
                    color: lang === L.code ? "var(--fa-deep-1)" : textColor,
                    border: `1px solid ${lang === L.code ? "var(--fa-gold-1)" : (scrolled ? "rgba(12,33,19,0.18)" : "rgba(255,255,255,0.25)")}`,
                    cursor: "pointer",
                    transition: "all 200ms ease",
                  }}
                >
                  {L.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => scrollTo("contact")}
              className="btn-gold hidden md:inline-flex"
              data-testid="nav-cta-quote"
            >
              {t.nav.cta}
            </button>
            <button
              className="lg:hidden"
              onClick={() => setOpen(true)}
              data-testid="nav-menu-open"
              style={{ background: "transparent", border: "none", color: textColor, cursor: "pointer" }}
              aria-label="Open menu"
            >
              <Menu size={26} />
            </button>
          </div>
        </div>
      </nav>

      {open && (
        <div className="mobile-menu" data-testid="mobile-menu">
          <div className="flex items-center justify-between">
            <span className="font-display" style={{ color: "#fff", letterSpacing: "0.06em", fontWeight: 700 }}>
              FIVE AGRA <span style={{ color: "var(--fa-gold-1)" }}>· SELECT</span>
            </span>
            <button
              onClick={() => setOpen(false)}
              style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer" }}
              data-testid="nav-menu-close"
              aria-label="Close menu"
            >
              <X size={28} />
            </button>
          </div>
          <div className="flex flex-col gap-4 mt-6">
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => { scrollTo(l.id); setOpen(false); }}
                data-testid={`mobile-nav-${l.id}`}
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  color: "#fff",
                  textAlign: "left",
                  background: "transparent",
                  border: "none",
                  padding: "8px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  cursor: "pointer",
                }}
              >
                {l.label}
              </button>
            ))}
            <div className="flex items-center gap-2 mt-2">
              {langs.map((L) => (
                <button
                  key={L.code}
                  onClick={() => setLang(L.code)}
                  data-testid={`mobile-lang-${L.code}`}
                  style={{
                    fontSize: 12, fontWeight: 700, letterSpacing: "0.1em",
                    padding: "8px 14px", borderRadius: 9999,
                    background: lang === L.code ? "var(--fa-gold-1)" : "transparent",
                    color: lang === L.code ? "var(--fa-deep-1)" : "#fff",
                    border: `1px solid ${lang === L.code ? "var(--fa-gold-1)" : "rgba(255,255,255,0.2)"}`,
                    cursor: "pointer",
                  }}
                >
                  {L.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => { scrollTo("contact"); setOpen(false); }}
              className="btn-gold self-start mt-4"
              data-testid="mobile-nav-cta"
            >
              {t.nav.cta}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
