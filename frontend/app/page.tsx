"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import AnimatedHero from "@/components/HeroSection";

const GALLERY_IMGS = [
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&q=80&fit=crop&crop=top",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80&fit=crop&crop=top",
  "https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=400&q=80&fit=crop&crop=top",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80&fit=crop&crop=top",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80&fit=crop&crop=top",
  "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&q=80&fit=crop&crop=top",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80&fit=crop&crop=top",
  "https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?w=400&q=80&fit=crop&crop=top",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80&fit=crop&crop=top",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80&fit=crop&crop=top",
];

const BRANDS = ["Khaadi", "Gul Ahmed", "Alkaram", "Sapphire", "Sana Safinaz", "Nishat", "Limelight", "Baroque", "Maria B", "Elan"];

const CATEGORIES = [
  { id: "raw-fabric", title: "Raw Fabric", subtitle: "Unstitched to Model", desc: "Upload any unstitched fabric — AI stitches & styles into a complete outfit.", tag: "Most Popular", color: "#0EA5E9", img: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=500&q=80&fit=crop" },
  { id: "2-piece", title: "2-Piece", subtitle: "Shirt + Trouser / Skirt", desc: "Eastern kurta sets or western shirt-trouser combos on a real AI model.", tag: "Classic", color: "#F59E0B", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80&fit=crop" },
  { id: "3-piece", title: "3-Piece", subtitle: "Shalwar Kameez + Dupatta", desc: "Complete South Asian 3-piece — shirt, shalwar & dupatta for every occasion.", tag: "Trending", color: "#EC4899", img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&q=80&fit=crop" },
  { id: "ready-to-wear", title: "Ready to Wear", subtitle: "Outfit → Model", desc: "Upload any ready-made dress — AI places it perfectly on a professional model.", tag: "New", color: "#8B5CF6", img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&q=80&fit=crop" },
];

const FEATURES = [
  { icon: "👗", title: "AI Virtual Try-On", desc: "Upload any garment and see it on an AI model instantly. Professional on-model photos — no photoshoot needed.", href: "/try-on" },
  { icon: "🧵", title: "Raw Fabric to Model", desc: "Transform unstitched fabric into a complete styled outfit. AI handles stitching, styling, and model placement.", href: "/try-on" },
  { icon: "🎬", title: "Multi-Pose Generation", desc: "Generate front, left, right, back & sitting poses from one single upload. Full 360° visualization.", href: "/try-on" },
  { icon: "✨", title: "3-Piece Styling", desc: "Complete shalwar kameez + dupatta visualization with dupatta style, embroidery level, and fit control.", href: "/try-on" },
  { icon: "🎨", title: "Style Refinement", desc: "Adjust dupatta style (draped/folded), embroidery level (light/heavy), and fit (regular/slim) instantly.", href: "/try-on" },
  { icon: "⚡", title: "30-Second Results", desc: "Professional AI fashion photography delivered in under 30 seconds. Download and share instantly.", href: "/try-on" },
  { icon: "📐", title: "Consistent Models", desc: "Keep the same AI model across your entire collection for cohesive, professional product pages.", href: "/try-on" },
  { icon: "🌟", title: "South Asian Focus", desc: "Built specifically for Pakistani & South Asian fashion — shalwar kameez, saree, lehenga & more.", href: "/try-on" },
];

const HOW_STEPS = [
  { num: "01", title: "Upload Your Product", desc: "Upload any clothing photo — flat-lay, hanger, or on a person. Works with fabric swatches, 2-piece, 3-piece, or any ready-made outfit. No professional equipment required.", img: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=700&q=85&fit=crop" },
  { num: "02", title: "Pick Your Style & Pose", desc: "Choose from 5 pose angles — front, left, right, back, and sitting. Select dress style, dupatta preference, embroidery level, and fit. Full control over the visualization.", img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=700&q=85&fit=crop" },
  { num: "03", title: "Get Professional Photos", desc: "In 30 seconds, get studio-quality on-model images ready for your e-commerce store, social media, or marketing campaign. Download in high resolution.", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=700&q=85&fit=crop" },
];

const USE_CASES = [
  { title: "Fashion Lookbooks", desc: "Create complete fashion lookbooks with AI generated models in minutes instead of weeks.", img: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80&fit=crop", tag: "Designers" },
  { title: "E-Commerce Product Pages", desc: "Transform flat-lay photos into professional on-model images for your online store.", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80&fit=crop", tag: "Sellers" },
  { title: "Social Media Content", desc: "Generate scroll-stopping fashion content for Instagram, TikTok, and Pinterest at scale.", img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80&fit=crop", tag: "Creators" },
  { title: "Brand Campaigns", desc: "Launch fashion campaigns faster with AI models that maintain brand consistency.", img: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&q=80&fit=crop", tag: "Brands" },
];

const REVIEWS = [
  { name: "Ayesha Khan", role: "Fashion Designer, Karachi", text: "Poshak Visualizer ne mera kaam bohat aasaan kar diya. Ab clients ko har style pe model shoot nahi karni padti! Results are stunning.", stars: 5, img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80&fit=crop" },
  { name: "Sana Mirza", role: "Boutique Owner, Lahore", text: "Amazing tool! My clients can now visualize exactly how fabric will look before stitching. Sales have increased 40%.", stars: 5, img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80&fit=crop" },
  { name: "Fatima Malik", role: "E-commerce Seller", text: "I upload the fabric photo and get a professional model image in 30 seconds. This is a game changer for my business!", stars: 5, img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&q=80&fit=crop" },
];

const COMPARISON = [
  { label: "Cost per shoot", old: "Rs. 50,000+", new_: "Free to start" },
  { label: "Time to result", old: "2–4 weeks", new_: "30 seconds" },
  { label: "Poses available", old: "Limited by budget", new_: "5 angles always" },
  { label: "Style variations", old: "One at a time", new_: "Unlimited" },
  { label: "South Asian focus", old: "Generic models", new_: "Pakistani styles" },
  { label: "Instant changes", old: "Reshoot needed", new_: "One click" },
  { label: "Commercial rights", old: "Complex licensing", new_: "Full rights included" },
  { label: "Brand consistency", old: "Varies each session", new_: "Perfect every time" },
];

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [activeCat, setActiveCat] = useState("raw-fabric");
  const galleryRef = useRef<HTMLDivElement>(null);
  const gallery2Ref = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const anim2Ref = useRef<number>(0);

  useEffect(() => {
    setMounted(true);
    let pos1 = 0, pos2 = 0;
    const scroll1 = () => {
      pos1 += 0.6;
      if (galleryRef.current) { if (pos1 >= galleryRef.current.scrollWidth / 2) pos1 = 0; galleryRef.current.scrollLeft = pos1; }
      animRef.current = requestAnimationFrame(scroll1);
    };
    const scroll2 = () => {
      pos2 += 0.4;
      if (gallery2Ref.current) { if (pos2 >= gallery2Ref.current.scrollWidth / 2) pos2 = 0; gallery2Ref.current.scrollLeft = pos2; }
      anim2Ref.current = requestAnimationFrame(scroll2);
    };
    animRef.current = requestAnimationFrame(scroll1);
    anim2Ref.current = requestAnimationFrame(scroll2);
    return () => { cancelAnimationFrame(animRef.current); cancelAnimationFrame(anim2Ref.current); };
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#fff", color: "#111", fontFamily: "'DM Sans','Inter',system-ui,sans-serif", overflowX: "hidden" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,700&family=DM+Serif+Display:ital@0;1&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        .marquee{animation:marquee 25s linear infinite;display:flex;width:max-content}
        .nav-link{color:#64748b;font-size:13.5px;font-weight:500;text-decoration:none;padding:6px 12px;border-radius:6px;transition:color .15s}
        .nav-link:hover{color:#0EA5E9}
        .btn-dark{background:#0f172a;color:#fff;padding:13px 28px;border-radius:9px;font-size:14px;font-weight:600;border:none;cursor:pointer;transition:all .2s;text-decoration:none;display:inline-flex;align-items:center;gap:8px;font-family:'DM Sans',sans-serif;letter-spacing:-.01em}
        .btn-dark:hover{background:#0EA5E9;transform:translateY(-1px);box-shadow:0 6px 20px rgba(14,165,233,.3)}
        .btn-light{background:#fff;color:#0f172a;padding:13px 24px;border-radius:9px;font-size:14px;font-weight:600;border:1.5px solid #e2e8f0;cursor:pointer;transition:all .2s;text-decoration:none;display:inline-flex;align-items:center;gap:8px;font-family:'DM Sans',sans-serif}
        .btn-light:hover{border-color:#0EA5E9;color:#0EA5E9}
        .feat-card{background:#fff;border:1px solid #f1f5f9;border-radius:14px;padding:26px 22px;transition:all .25s;text-decoration:none;display:block;color:inherit}
        .feat-card:hover{border-color:#0EA5E9;box-shadow:0 4px 24px rgba(14,165,233,.1);transform:translateY(-3px)}
        .step-item{padding:18px 20px;border-radius:12px;cursor:pointer;transition:all .2s;border:1.5px solid transparent}
        .step-item.on{background:#0EA5E9;color:#fff;border-color:#0EA5E9;box-shadow:0 6px 20px rgba(14,165,233,.25)}
        .step-item:not(.on){background:#f8fafc;border-color:#f1f5f9}
        .step-item:not(.on):hover{border-color:#cbd5e1}
        .cat-card{border-radius:16px;overflow:hidden;cursor:pointer;transition:all .3s;text-decoration:none;display:block}
        .cat-card:hover{transform:translateY(-6px);box-shadow:0 16px 40px rgba(0,0,0,.12)}
        .use-card{border-radius:14px;overflow:hidden;transition:all .25s;text-decoration:none;display:block;color:inherit;border:1px solid #f1f5f9}
        .use-card:hover{box-shadow:0 8px 32px rgba(0,0,0,.1);transform:translateY(-3px)}
        .rev-card{background:#fafafa;border:1px solid #f1f5f9;border-radius:14px;padding:26px}
        img{display:block}
        .tag{display:inline-block;padding:3px 10px;border-radius:50px;font-size:11px;font-weight:700;letter-spacing:.04em}
      `}} />

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,.96)", backdropFilter: "blur(12px)", borderBottom: "1px solid #f1f5f9", padding: "0 48px", height: 62, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 900, color: "#0EA5E9", flexShrink: 0 }}>P</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-.03em", lineHeight: 1.1 }}>Poshak <span style={{ color: "#0EA5E9" }}>Visualizer</span></div>
            <div style={{ fontSize: 7.5, color: "#94a3b8", letterSpacing: ".12em", fontWeight: 600 }}>AI FASHION STUDIO</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {["Features", "How It Works", "Gallery", "Pricing", "Enterprise"].map(i => <a key={i} href="#" className="nav-link">{i}</a>)}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link href="/try-on" className="btn-light" style={{ padding: "8px 18px", fontSize: 13 }}>Log In</Link>
          <Link href="/try-on" className="btn-dark" style={{ padding: "9px 20px", fontSize: 13 }}>Start Creating</Link>
        </div>
      </nav>

      {/* ── ANIMATED HERO ── */}
      <AnimatedHero />

      {/* GALLERY ROW 1 */}
      <section style={{ paddingBottom: 12, overflow: "hidden" }}>
        <div ref={galleryRef} style={{ display: "flex", gap: 10, overflow: "hidden", padding: "0 48px" }}>
          {[...GALLERY_IMGS, ...GALLERY_IMGS].map((img, i) => (
            <div key={i} style={{ flexShrink: 0, width: 200, height: 280, borderRadius: 14, overflow: "hidden", border: "1px solid #f1f5f9" }}>
              <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} onError={e => { e.currentTarget.parentElement!.style.background = "#f8fafc"; e.currentTarget.style.display = "none"; }} />
            </div>
          ))}
        </div>
      </section>

      {/* GALLERY ROW 2 */}
      <section style={{ paddingBottom: 60, overflow: "hidden" }}>
        <div ref={gallery2Ref} style={{ display: "flex", gap: 10, overflow: "hidden", padding: "12px 48px 0" }}>
          {[...GALLERY_IMGS.slice(4), ...GALLERY_IMGS, ...GALLERY_IMGS.slice(0, 4)].map((img, i) => (
            <div key={i} style={{ flexShrink: 0, width: 160, height: 220, borderRadius: 12, overflow: "hidden", border: "1px solid #f1f5f9" }}>
              <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} onError={e => { e.currentTarget.parentElement!.style.background = "#f8fafc"; e.currentTarget.style.display = "none"; }} />
            </div>
          ))}
        </div>
      </section>

      {/* TRUSTED BY */}
      <section style={{ borderTop: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9", padding: "22px 0", overflow: "hidden", background: "#fafafa" }}>
        <div style={{ overflow: "hidden" }}>
          <div className="marquee">
            {[...BRANDS, ...BRANDS].map((b, i) => (
              <div key={i} style={{ flexShrink: 0, padding: "0 36px", fontSize: 13.5, fontWeight: 700, color: "#94a3b8", letterSpacing: ".04em" }}>{b}</div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: "#0f172a", padding: "60px 48px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 32 }}>
          {[{ v: "-90%", l: "Visual production costs" }, { v: "10x", l: "Faster time to market" }, { v: "+10%", l: "Conversion rates" }, { v: "+12%", l: "Average order value" }, { v: "+30%", l: "Ad click-through rates" }].map(s => (
            <div key={s.l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "clamp(26px,3vw,38px)", fontWeight: 800, color: "#0EA5E9", lineHeight: 1, letterSpacing: "-.03em" }}>{s.v}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.4)", marginTop: 8, fontWeight: 500, lineHeight: 1.4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "96px 48px", maxWidth: 1160, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <p style={{ fontSize: 11.5, color: "#0EA5E9", letterSpacing: ".12em", marginBottom: 10, fontWeight: 700 }}>HOW IT WORKS</p>
          <h2 style={{ fontSize: "clamp(26px,3.5vw,46px)", fontWeight: 800, letterSpacing: "-.03em", lineHeight: 1.1 }}>
            Generate AI Fashion Model Photos
            <br />
            <span style={{ fontStyle: "italic", fontFamily: "'DM Serif Display',serif", fontWeight: 400, color: "#0EA5E9" }}>in 3 Simple Steps</span>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {HOW_STEPS.map((step, i) => (
              <div key={step.num} className={`step-item ${activeStep === i ? "on" : ""}`} onClick={() => setActiveStep(i)}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: activeStep === i ? "rgba(255,255,255,.2)" : "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: activeStep === i ? "#fff" : "#64748b", flexShrink: 0 }}>{step.num}</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: activeStep === i ? "#fff" : "#0f172a", marginBottom: activeStep === i ? 6 : 0, letterSpacing: "-.02em" }}>{step.title}</div>
                    {activeStep === i && <p style={{ fontSize: 13, color: "rgba(255,255,255,.82)", lineHeight: 1.65 }}>{step.desc}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderRadius: 18, overflow: "hidden", aspectRatio: "4/3", background: "#f8fafc", position: "sticky", top: 80, boxShadow: "0 20px 60px rgba(0,0,0,.08)" }}>
            <img src={HOW_STEPS[activeStep].img} alt={HOW_STEPS[activeStep].title} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} onError={e => { e.currentTarget.style.display = "none"; }} />
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ padding: "80px 48px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p style={{ fontSize: 11.5, color: "#0EA5E9", letterSpacing: ".12em", marginBottom: 10, fontWeight: 700 }}>WHAT CAN YOU VISUALIZE</p>
            <h2 style={{ fontSize: "clamp(26px,3.5vw,46px)", fontWeight: 800, letterSpacing: "-.03em", lineHeight: 1.1 }}>
              Every Style, <span style={{ fontStyle: "italic", fontFamily: "'DM Serif Display',serif", fontWeight: 400, color: "#0EA5E9" }}>Every Occasion</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
            {CATEGORIES.map(cat => (
              <Link key={cat.id} href="/try-on" className="cat-card" onClick={() => setActiveCat(cat.id)}>
                <div style={{ height: 220, overflow: "hidden", position: "relative" }}>
                  <img src={cat.img} alt={cat.title} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", transition: "transform .5s ease", transform: activeCat === cat.id ? "scale(1.06)" : "scale(1)" }} onError={e => { e.currentTarget.parentElement!.style.background = "#f1f5f9"; e.currentTarget.style.display = "none"; }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,.7) 0%,transparent 55%)" }} />
                  <div style={{ position: "absolute", top: 12, left: 12 }}>
                    <span className="tag" style={{ background: cat.color, color: "#fff" }}>{cat.tag}</span>
                  </div>
                </div>
                <div style={{ padding: "18px 16px 20px", background: "#fff", borderTop: `3px solid ${activeCat === cat.id ? cat.color : "transparent"}` }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 4, letterSpacing: "-.02em" }}>{cat.title}</h3>
                  <p style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8, fontWeight: 600, letterSpacing: ".04em" }}>{cat.subtitle.toUpperCase()}</p>
                  <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{cat.desc}</p>
                  <div style={{ marginTop: 12, fontSize: 13, fontWeight: 600, color: cat.color }}>Try Now →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "96px 48px", maxWidth: 1160, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ fontSize: 11.5, color: "#0EA5E9", letterSpacing: ".12em", marginBottom: 10, fontWeight: 700 }}>OUR FEATURES</p>
          <h2 style={{ fontSize: "clamp(26px,3.5vw,46px)", fontWeight: 800, letterSpacing: "-.03em", lineHeight: 1.1 }}>
            AI Fashion Model Generator —
            <br /><span style={{ fontStyle: "italic", fontFamily: "'DM Serif Display',serif", fontWeight: 400, color: "#0EA5E9" }}>8 Powerful Features</span>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
          {FEATURES.map(f => (
            <Link key={f.title} href={f.href} className="feat-card">
              <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: "#0f172a", letterSpacing: "-.02em" }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.65 }}>{f.desc}</p>
              <div style={{ marginTop: 14, fontSize: 13, fontWeight: 600, color: "#0EA5E9" }}>Learn more →</div>
            </Link>
          ))}
        </div>
      </section>

      {/* USE CASES */}
      <section style={{ padding: "80px 48px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p style={{ fontSize: 11.5, color: "#0EA5E9", letterSpacing: ".12em", marginBottom: 10, fontWeight: 700 }}>USE CASES</p>
            <h2 style={{ fontSize: "clamp(26px,3.5vw,46px)", fontWeight: 800, letterSpacing: "-.03em", lineHeight: 1.1 }}>
              AI Generated Models for
              <br /><span style={{ fontStyle: "italic", fontFamily: "'DM Serif Display',serif", fontWeight: 400, color: "#0EA5E9" }}>Every Fashion Need</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
            {USE_CASES.map(uc => (
              <Link key={uc.title} href="/try-on" className="use-card">
                <div style={{ height: 200, overflow: "hidden", position: "relative" }}>
                  <img src={uc.img} alt={uc.title} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", transition: "transform .5s" }} onError={e => { e.currentTarget.parentElement!.style.background = "#f1f5f9"; e.currentTarget.style.display = "none"; }} />
                  <div style={{ position: "absolute", top: 12, left: 12 }}>
                    <span className="tag" style={{ background: "rgba(0,0,0,.6)", color: "#fff", backdropFilter: "blur(8px)" }}>{uc.tag}</span>
                  </div>
                </div>
                <div style={{ padding: "16px 16px 18px", background: "#fff" }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 6, letterSpacing: "-.02em" }}>{uc.title}</h3>
                  <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{uc.desc}</p>
                  <div style={{ marginTop: 10, fontSize: 13, fontWeight: 600, color: "#0EA5E9" }}>Learn more →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section style={{ padding: "96px 48px", maxWidth: 1160, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 11.5, color: "#0EA5E9", letterSpacing: ".12em", marginBottom: 10, fontWeight: 700 }}>WHY POSHAK VISUALIZER</p>
            <h2 style={{ fontSize: "clamp(26px,3.5vw,44px)", fontWeight: 800, letterSpacing: "-.03em", lineHeight: 1.12, marginBottom: 20 }}>
              Traditional Photoshoots
              <br /><span style={{ fontStyle: "italic", fontFamily: "'DM Serif Display',serif", fontWeight: 400, color: "#0EA5E9" }}>vs Poshak AI</span>
            </h2>
            <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.72, marginBottom: 28 }}>See why fashion brands switched from traditional photoshoots to AI generated fashion models — cutting costs by 90% while increasing output 10x.</p>
            <Link href="/try-on" className="btn-dark">Try It Now →</Link>
          </div>
          <div style={{ border: "1px solid #f1f5f9", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,.06)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: "#0f172a", padding: "14px 20px" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.4)" }}>Features</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.4)", textAlign: "center" }}>Old Way</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#0EA5E9", textAlign: "center" }}>Poshak AI</div>
            </div>
            {COMPARISON.map((row, i) => (
              <div key={row.label} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "13px 20px", borderBottom: "1px solid #f8fafc", background: i % 2 === 0 ? "#fff" : "#fafafa", alignItems: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>{row.label}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", textAlign: "center" }}>✗ {row.old}</div>
                <div style={{ fontSize: 12, color: "#0EA5E9", fontWeight: 600, textAlign: "center" }}>✓ {row.new_}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section style={{ padding: "80px 48px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p style={{ fontSize: 11.5, color: "#0EA5E9", letterSpacing: ".12em", marginBottom: 10, fontWeight: 700 }}>TESTIMONIALS</p>
            <h2 style={{ fontSize: "clamp(26px,3.5vw,46px)", fontWeight: 800, letterSpacing: "-.03em" }}>Don't Take Our Word for It</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {REVIEWS.map(r => (
              <div key={r.name} className="rev-card">
                <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>{[1,2,3,4,5].map(s => <span key={s} style={{ color: "#F59E0B", fontSize: 15 }}>★</span>)}</div>
                <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.72, marginBottom: 20, fontStyle: "italic" }}>"{r.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: "50%", overflow: "hidden", flexShrink: 0, background: "#0EA5E9" }}>
                    <img src={r.img} alt={r.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.currentTarget.style.display = "none"; }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", letterSpacing: "-.01em" }}>{r.name}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 1 }}>{r.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#0f172a", padding: "100px 48px", textAlign: "center" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <p style={{ fontSize: 11.5, color: "#0EA5E9", letterSpacing: ".12em", marginBottom: 16, fontWeight: 700 }}>START CREATING TODAY</p>
          <h2 style={{ fontSize: "clamp(30px,5vw,56px)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-.035em", color: "#fff", marginBottom: 18 }}>
            Ready to Transform Your
            <br /><span style={{ fontStyle: "italic", fontFamily: "'DM Serif Display',serif", fontWeight: 400, color: "#0EA5E9" }}>Fashion Photography?</span>
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,.45)", marginBottom: 36, lineHeight: 1.7 }}>Join thousands of Pakistani fashion brands using AI generated models. Professional results in 30 seconds — no photoshoot needed.</p>
          <Link href="/try-on" className="btn-dark" style={{ fontSize: 16, padding: "15px 40px", background: "#0EA5E9" }}>Start Creating Now →</Link>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,.25)", marginTop: 16 }}>No account needed · Free to try · Results in 30 seconds · Cancel anytime</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#020617", padding: "56px 48px 32px", borderTop: "1px solid #1e293b" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1fr 1fr", gap: 48, marginBottom: 52 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "#0EA5E9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, color: "#fff" }}>P</div>
                <span style={{ fontSize: 15, fontWeight: 800, color: "#fff", letterSpacing: "-.02em" }}>Poshak Visualizer</span>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,.3)", lineHeight: 1.72, maxWidth: 260 }}>AI-powered fashion photography for Pakistani & South Asian brands. Studio-quality in 30 seconds.</p>
              <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                {["Instagram", "TikTok", "LinkedIn"].map(s => <a key={s} href="#" style={{ fontSize: 11, color: "rgba(255,255,255,.3)", textDecoration: "none", padding: "4px 10px", border: "1px solid #1e293b", borderRadius: 6 }}>{s}</a>)}
              </div>
            </div>
            {[
              { title: "Features", links: ["AI Try-On", "Raw Fabric", "Pose Control", "3-Piece Style", "Consistent Models"] },
              { title: "Solutions", links: ["Fashion Brands", "E-Commerce", "Boutiques", "Designers", "Social Media"] },
              { title: "Resources", links: ["How It Works", "Gallery", "Blog", "Tutorials", "Customer Stories"] },
              { title: "Company", links: ["About", "Pricing", "Enterprise", "Contact", "Privacy"] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: "rgba(255,255,255,.35)", letterSpacing: ".1em", marginBottom: 14 }}>{col.title.toUpperCase()}</div>
                {col.links.map(link => <a key={link} href="#" style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,.45)", textDecoration: "none", marginBottom: 9 }} onMouseEnter={e => (e.currentTarget.style.color = "#0EA5E9")} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,.45)")}>{link}</a>)}
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid #1e293b", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,.2)" }}>© 2026 Poshak Visualizer · Built with Next.js, FastAPI, Claude AI</p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,.2)" }}>Made with ❤️ in Karachi, Pakistan</p>
            <div style={{ display: "flex", gap: 20 }}>
              {["Privacy Policy", "Terms of Use", "Cookie Policy"].map(item => <a key={item} href="#" style={{ fontSize: 12, color: "rgba(255,255,255,.2)", textDecoration: "none" }}>{item}</a>)}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
