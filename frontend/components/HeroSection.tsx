"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const TRANSFORMS = [
  {
    id: "red",
    label: "Raw Fabric → 3-Piece",
    tag: "Fabric to Model",
    tagColor: "#E11D48",
    beforeLabel: "Red Floral Fabric",
    afterLabel: "AI Model — 3 Piece",
    before: "/images/Red floral fabric.jpeg",
    after: "/images/Red 3-piece model.jpg",
  },
  {
    id: "white",
    label: "2-Piece → Styled Model",
    tag: "Ready Wear",
    tagColor: "#1D4ED8",
    beforeLabel: "White Embroidered Kurta",
    afterLabel: "AI Model — Styled",
    before: "/images/White kurta flat.jpeg",
    after: "/images/White kurta model.png",
  },
  {
    id: "western",
    label: "Western Outfit → Model",
    tag: "Western Style",
    tagColor: "#7C3AED",
    beforeLabel: "Cream + Maroon Set",
    afterLabel: "AI Model — Western",
    before: "/images/Cream+maroon western flat.jpg",
    after: "/images/Western model.png",
  },
  {
    id: "gents",
    label: "Gents Wear → Model",
    tag: "Menswear",
    tagColor: "#0369A1",
    beforeLabel: "Navy Blue Menswear",
    afterLabel: "AI Model — Gents",
    before: "/images/Navy menswear flat.jpg",
    after: "/images/Navy male model.png",
  },
];

export default function AnimatedHero() {
  const [current, setCurrent] = useState(0);
  const [showAfter, setShowAfter] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanPos, setScanPos] = useState(0);
  const [mounted, setMounted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const item = TRANSFORMS[current];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Reset state
    setShowAfter(false);
    setScanning(false);
    setScanPos(0);

    // Show before for 2s then scan
    timerRef.current = setTimeout(() => {
      setScanning(true);
      let pos = 0;

      intervalRef.current = setInterval(() => {
        pos += 3;
        setScanPos(pos);
        if (pos >= 100) {
          clearInterval(intervalRef.current!);
          setScanning(false);
          setShowAfter(true);

          // Show after 2.5s then next
          timerRef.current = setTimeout(() => {
            setCurrent(c => (c + 1) % TRANSFORMS.length);
          }, 2500);
        }
      }, 30);
    }, 2000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [current, mounted]);

  if (!mounted) return null;

  return (
    <section style={{
      maxWidth: 1160, margin: "0 auto",
      padding: "72px 48px 80px",
      display: "grid",
      gridTemplateColumns: "1fr 440px",
      gap: 72, alignItems: "center",
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulseGlow{0%,100%{opacity:.4}50%{opacity:1}}
        @keyframes floatY{0%,100%{transform:translateY(0) rotate(-1.5deg)}50%{transform:translateY(-10px) rotate(-1.5deg)}}
        @keyframes badgePop{0%{opacity:0;transform:scale(.75)}100%{opacity:1;transform:scale(1)}}
        @keyframes shimText{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        .pulse-dot{animation:pulseGlow 1.8s ease-in-out infinite}
        .phone-float{animation:floatY 4s ease-in-out infinite}
        .badge-pop{animation:badgePop .4s cubic-bezier(.175,.885,.32,1.275) forwards}
        .shim{background:linear-gradient(90deg,#0f172a 0%,#0EA5E9 50%,#0f172a 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimText 5s linear infinite}
        .tag-pill{display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border-radius:50px;font-size:11.5px;font-weight:700;letter-spacing:.06em;cursor:pointer;transition:all .2s ease;border:1.5px solid transparent}
        .ai-badge{animation:badgePop .35s cubic-bezier(.175,.885,.32,1.275) forwards}
      `}} />

      {/* ── LEFT — Text content ── */}
      <div>
        {/* Badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 50, padding: "5px 14px", marginBottom: 26 }}>
          <div className="pulse-dot" style={{ width: 5, height: 5, borderRadius: "50%", background: "#0EA5E9" }} />
          <span style={{ fontSize: 11.5, color: "#0369a1", fontWeight: 700, letterSpacing: ".07em" }}>
            AI-POWERED FASHION TRANSFORMATION
          </span>
        </div>

        {/* Headline */}
        <h1 style={{ fontSize: "clamp(36px,5vw,60px)", fontWeight: 800, lineHeight: 1.06, letterSpacing: "-.04em", marginBottom: 18, fontFamily: "'DM Sans',sans-serif" }}>
          From Any Fabric
          <br />
          <span className="shim">or Dress</span>
          <br />
          <span style={{ fontStyle: "italic", fontFamily: "'DM Serif Display',serif", fontWeight: 400, fontSize: ".88em", color: "#475569" }}>
            to a Stunning Model
          </span>
        </h1>

        {/* Subtext */}
        <p style={{ fontSize: 16.5, lineHeight: 1.74, color: "#64748b", marginBottom: 28, maxWidth: 460, fontWeight: 400 }}>
          Upload raw fabric, ready-made dress, western outfit, or gents wear — our AI generates a photorealistic model in{" "}
          <strong style={{ color: "#0EA5E9" }}>30 seconds</strong>.
        </p>

        {/* Category pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}>
          {TRANSFORMS.map((t, i) => (
            <button
              key={t.id}
              className="tag-pill"
              onClick={() => setCurrent(i)}
              style={{
                background: current === i ? t.tagColor : "#f8fafc",
                color: current === i ? "#fff" : "#64748b",
                borderColor: current === i ? t.tagColor : "#e2e8f0",
                boxShadow: current === i ? `0 4px 14px ${t.tagColor}40` : "none",
              }}
            >
              {t.tag}
            </button>
          ))}
        </div>

        {/* CTA Buttons */}
        <div style={{ display: "flex", gap: 10, marginBottom: 40 }}>
          <Link href="/try-on" style={{ background: "#0f172a", color: "#fff", padding: "13px 28px", borderRadius: 9, fontSize: 14, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, letterSpacing: "-.01em", transition: "all .2s", boxShadow: "0 4px 14px rgba(0,0,0,.15)" }}>
            Start Creating Free →
          </Link>
          <Link href="/try-on" style={{ background: "#fff", color: "#0f172a", padding: "13px 22px", borderRadius: 9, fontSize: 14, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, border: "1.5px solid #e2e8f0", transition: "all .2s" }}>
            View Examples
          </Link>
        </div>

        {/* Trust row */}
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {[
            { i: "✦", t: "Save 90% vs photoshoot" },
            { i: "⚡", t: "30-second results" },
            { i: "◈", t: "5 pose angles" },
          ].map(b => (
            <div key={b.t} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, color: "#94a3b8", fontWeight: 500 }}>
              <span style={{ color: "#0EA5E9" }}>{b.i}</span>{b.t}
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT — Phone mockup ── */}
      <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>

        {/* Background glow */}
        <div style={{
          position: "absolute", width: 340, height: 340,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${item.tagColor}14 0%, transparent 70%)`,
          pointerEvents: "none",
          transition: "background .8s ease",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
        }} />

        {/* Phone */}
        <div className="phone-float" style={{
          width: 270, position: "relative", zIndex: 1,
          background: "#0f172a",
          borderRadius: 46,
          padding: "14px 10px 18px",
          boxShadow: "0 48px 80px rgba(0,0,0,.22), 0 0 0 1px rgba(255,255,255,.07), inset 0 0 0 1px rgba(255,255,255,.04)",
        }}>
          {/* Notch */}
          <div style={{ width: 72, height: 6, background: "#1e293b", borderRadius: 3, margin: "0 auto 10px" }} />

          {/* Screen */}
          <div style={{ borderRadius: 34, overflow: "hidden", position: "relative", height: 400, background: "#000" }}>

            {/* BEFORE image */}
            <img
              src={item.before}
              alt={item.beforeLabel}
              style={{
                width: "100%", height: "100%", objectFit: "cover",
                objectPosition: "center top",
                position: "absolute", inset: 0,
                opacity: showAfter ? 0 : 1,
                transition: "opacity .5s ease",
              }}
            />

            {/* AFTER image */}
            <img
              src={item.after}
              alt={item.afterLabel}
              style={{
                width: "100%", height: "100%", objectFit: "cover",
                objectPosition: "center top",
                position: "absolute", inset: 0,
                opacity: showAfter ? 1 : 0,
                transition: "opacity .5s ease .15s",
              }}
            />

            {/* Scan line */}
            {scanning && (
              <div style={{
                position: "absolute", left: 0, right: 0,
                height: "22%",
                background: `linear-gradient(to bottom, transparent 0%, ${item.tagColor}50 50%, transparent 100%)`,
                top: `${Math.max(0, scanPos - 11)}%`,
                pointerEvents: "none", zIndex: 5,
                transition: "top .03s linear",
              }} />
            )}

            {/* Scan progress bar */}
            {scanning && (
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "rgba(255,255,255,.1)", zIndex: 10 }}>
                <div style={{ height: "100%", width: `${scanPos}%`, background: item.tagColor, borderRadius: 2, boxShadow: `0 0 8px ${item.tagColor}`, transition: "width .03s linear" }} />
              </div>
            )}

            {/* Top labels */}
            <div style={{ position: "absolute", top: 12, left: 12, right: 12, display: "flex", justifyContent: "space-between", zIndex: 10 }}>
              <div style={{ background: "rgba(0,0,0,.65)", backdropFilter: "blur(8px)", borderRadius: 50, padding: "5px 12px", fontSize: 10, fontWeight: 700, color: "#fff", letterSpacing: ".04em" }}>
                {showAfter ? item.afterLabel : item.beforeLabel}
              </div>
              <div style={{ background: item.tagColor, borderRadius: 50, padding: "5px 12px", fontSize: 10, fontWeight: 800, color: "#fff", letterSpacing: ".04em", boxShadow: `0 4px 12px ${item.tagColor}60` }}>
                {item.tag}
              </div>
            </div>

            {/* AI badge — appears after transform */}
            {showAfter && (
              <div className="ai-badge" style={{
                position: "absolute", bottom: 14, left: 12, right: 12,
                background: "rgba(0,0,0,.78)", backdropFilter: "blur(14px)",
                borderRadius: 13, padding: "10px 14px",
                display: "flex", alignItems: "center", gap: 10, zIndex: 10,
              }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: item.tagColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0, boxShadow: `0 4px 10px ${item.tagColor}60` }}>✨</div>
                <div>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>AI Generated in 30s</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,.5)", marginTop: 1 }}>Poshak Visualizer</div>
                </div>
                <div style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, color: item.tagColor, background: `${item.tagColor}18`, padding: "3px 8px", borderRadius: 50 }}>DONE ✓</div>
              </div>
            )}
          </div>

          {/* Home bar */}
          <div style={{ width: 90, height: 4, background: "#334155", borderRadius: 2, margin: "12px auto 0" }} />
        </div>

        {/* Floating badge — top left */}
        <div style={{
          position: "absolute", top: "8%", left: "-5%",
          background: "#fff", borderRadius: 14, padding: "10px 16px",
          boxShadow: "0 8px 32px rgba(0,0,0,.1)", border: "1px solid #f1f5f9",
          zIndex: 5,
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: ".06em", marginBottom: 2 }}>TRANSFORMATION</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>{current + 1} / {TRANSFORMS.length}</div>
        </div>

        {/* Floating badge — bottom left */}
        <div style={{
          position: "absolute", bottom: "10%", left: "-8%",
          background: "#fff", borderRadius: 14, padding: "10px 16px",
          boxShadow: "0 8px 32px rgba(0,0,0,.1)", border: "1px solid #f1f5f9",
          zIndex: 5, display: "flex", alignItems: "center", gap: 8,
        }}>
          <div className="pulse-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
          <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>Live AI Processing</div>
        </div>

        {/* Dot indicators */}
        <div style={{ position: "absolute", bottom: -28, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 7 }}>
          {TRANSFORMS.map((t, i) => (
            <div
              key={t.id}
              onClick={() => setCurrent(i)}
              style={{
                width: current === i ? 20 : 7, height: 7,
                borderRadius: 50,
                background: current === i ? item.tagColor : "#cbd5e1",
                cursor: "pointer",
                transition: "all .3s ease",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
