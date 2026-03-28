"use client";

/**
 * FabricVisualizer — "Poshak Visualizer"
 * Teal + warm cream theme, mobile-first, bottom nav, pill chips,
 * line-art dress style selectors, Pollinations.ai real AI image generation.
 * States: IDLE → UPLOADING → SELECTING_STYLE → GENERATING → RESULT
 */

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Sparkles,
  Share2,
  RotateCcw,
  Home,
  Heart,
  User,
  Eye,
  Download,
  Layers,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type AppState = "IDLE" | "UPLOADING" | "SELECTING_STYLE" | "GENERATING" | "RESULT" | "ERROR";
type StyleKey = "shalwar-kameez" | "anarkali" | "saree";
type DupattaStyle = "draped" | "folded" | "nortan" | "elovr";
type EmbroideryLevel = "light" | "heavy";
type FitStyle = "regular" | "slim";

interface StyleOption {
  key: StyleKey;
  label: string;
}

// ─── Design Tokens ────────────────────────────────────────────────────────────

const T = "#1B6B6B";
const T_RING = "rgba(27,107,107,0.15)";
const CREAM = "#F5F0E8";
const CARD = "#FFFFFF";
const BORDER = "#E5E7EB";
const BORDER_SUBTLE = "#EDE9E1";
const TEXT_DARK = "#1C1C1C";
const TEXT_MID = "#6B7280";
const TEXT_LIGHT = "#9CA3AF";

// ─── Dress Style Options ──────────────────────────────────────────────────────

const STYLES: StyleOption[] = [
  { key: "shalwar-kameez", label: "Shalwar Kameez" },
  { key: "anarkali", label: "Anarkali Suit" },
  { key: "saree", label: "Saree" },
];

// ─── AI Image URL Builder (backend /api/generate — HuggingFace FLUX) ──────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

function buildImageUrl(
  style: StyleKey,
  dupatta: DupattaStyle,
  embroidery: EmbroideryLevel,
  fit: FitStyle,
  seed: number,
): string {
  const params = new URLSearchParams({ style, dupatta, embroidery, fit, seed: String(seed) });
  return `${API_BASE}/generate?${params.toString()}`;
}

// ─── Line-Art SVG Illustrations (Style selector cards only) ──────────────────

function ShalwarKameezIllustration({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 72 108" fill="none" className="w-full h-full">
      <ellipse cx="36" cy="12" rx="8" ry="9" stroke={color} strokeWidth="1.6" />
      <line x1="36" y1="21" x2="36" y2="25" stroke={color} strokeWidth="1.6" />
      <path d="M25,25 Q36,21 47,25 L49,59 Q36,63 23,59 Z" stroke={color} strokeWidth="1.6" fill="none" />
      <path d="M30,25 Q36,31 42,25" stroke={color} strokeWidth="1.2" fill="none" />
      <path d="M25,28 Q17,33 15,50" stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M47,28 Q55,33 57,50" stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <line x1="13" y1="50" x2="17" y2="50" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <line x1="55" y1="50" x2="59" y2="50" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M23,59 Q36,63 49,59" stroke={color} strokeWidth="1" fill="none" opacity="0.6" />
      <path d="M27,61 L24,92" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M35,62 L33,92" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M37,62 L39,92" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M45,61 L48,92" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M22,91 Q28.5,94 35,91" stroke={color} strokeWidth="1.1" fill="none" />
      <path d="M37,91 Q43.5,94 50,91" stroke={color} strokeWidth="1.1" fill="none" />
      <path d="M20,27 Q12,40 14,68" stroke={color} strokeWidth="1" fill="none" strokeDasharray="3,2.5" strokeLinecap="round" opacity="0.7" />
      <circle cx="36" cy="35" r="1.1" fill={color} opacity="0.9" />
      <circle cx="32.5" cy="41" r="0.9" fill={color} opacity="0.8" />
      <circle cx="39.5" cy="41" r="0.9" fill={color} opacity="0.8" />
      <circle cx="36" cy="47" r="1.1" fill={color} opacity="0.9" />
    </svg>
  );
}

function AnarkaliIllustration({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 72 108" fill="none" className="w-full h-full">
      <ellipse cx="36" cy="12" rx="8" ry="9" stroke={color} strokeWidth="1.6" />
      <line x1="36" y1="21" x2="36" y2="25" stroke={color} strokeWidth="1.6" />
      <path d="M29,25 Q36,21 43,25 L45,43 Q40,47 36,48 Q32,47 27,43 Z" stroke={color} strokeWidth="1.6" fill="none" />
      <path d="M31,25 L36,33 L41,25" stroke={color} strokeWidth="1.2" fill="none" />
      <path d="M27,43 Q9,73 6,94 L66,94 Q63,73 45,43 Q40,47 36,48 Q32,47 27,43 Z" stroke={color} strokeWidth="1.6" fill="none" />
      <path d="M8,93 Q18,97 28,93 Q38,97 48,93 Q58,97 66,93" stroke={color} strokeWidth="1" fill="none" />
      <path d="M29,27 Q21,33 19,47" stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M43,27 Q51,33 53,47" stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <circle cx="36" cy="36" r="1.2" fill={color} opacity="0.9" />
      <path d="M32,41 Q36,39 40,41" stroke={color} strokeWidth="0.9" fill="none" />
      <path d="M27,53 Q18,69 14,84" stroke={color} strokeWidth="0.8" fill="none" strokeDasharray="2.5,2.5" opacity="0.6" />
      <path d="M45,53 Q54,69 58,84" stroke={color} strokeWidth="0.8" fill="none" strokeDasharray="2.5,2.5" opacity="0.6" />
      <line x1="36" y1="48" x2="36" y2="90" stroke={color} strokeWidth="0.8" strokeDasharray="2.5,2.5" opacity="0.5" />
    </svg>
  );
}

function SareeIllustration({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 72 108" fill="none" className="w-full h-full">
      <ellipse cx="36" cy="12" rx="8" ry="9" stroke={color} strokeWidth="1.6" />
      <circle cx="36" cy="7" r="1.4" fill={color} opacity="0.9" />
      <circle cx="28.5" cy="17" r="0.9" fill={color} opacity="0.8" />
      <circle cx="43.5" cy="17" r="0.9" fill={color} opacity="0.8" />
      <line x1="36" y1="21" x2="36" y2="25" stroke={color} strokeWidth="1.6" />
      <path d="M30,25 Q36,21 42,25 L43,40 Q39,43 36,44 Q33,43 29,40 Z" stroke={color} strokeWidth="1.6" fill="none" />
      <path d="M32,25 Q36,30 40,25" stroke={color} strokeWidth="1.2" fill="none" />
      <path d="M29,40 Q22,47 20,88 Q28,93 36,93 Q44,93 52,88 Q50,47 43,40 Z" stroke={color} strokeWidth="1.6" fill="none" />
      <line x1="33" y1="53" x2="31" y2="86" stroke={color} strokeWidth="0.85" strokeDasharray="2.5,2.5" opacity="0.7" />
      <line x1="36" y1="53" x2="36" y2="86" stroke={color} strokeWidth="0.85" strokeDasharray="2.5,2.5" opacity="0.7" />
      <line x1="39" y1="53" x2="41" y2="86" stroke={color} strokeWidth="0.85" strokeDasharray="2.5,2.5" opacity="0.7" />
      <path d="M29,24 Q18,32 15,50 Q12,64 18,80" stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M21,24 Q10,33 7,52 Q4,67 10,82" stroke={color} strokeWidth="0.85" fill="none" strokeDasharray="3,2.5" opacity="0.65" />
      <path d="M43,27 Q51,33 53,47" stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M21,86 Q36,91 51,86" stroke={color} strokeWidth="1.3" fill="none" />
      <path d="M22,90 Q36,95 50,90" stroke={color} strokeWidth="0.85" fill="none" opacity="0.7" />
    </svg>
  );
}

// ─── Style Card ───────────────────────────────────────────────────────────────

function StyleCard({
  style,
  selected,
  onClick,
  index,
}: {
  style: StyleOption;
  selected: boolean;
  onClick: () => void;
  index: number;
}) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.08, duration: 0.28 }}
      className="flex-shrink-0 flex flex-col items-center gap-2 cursor-pointer transition-all duration-200"
      style={{
        width: 100,
        padding: "10px 8px 12px",
        borderRadius: 16,
        border: `2px solid ${selected ? T : BORDER}`,
        backgroundColor: selected ? "rgba(27,107,107,0.06)" : CARD,
        boxShadow: selected
          ? `0 0 0 3px ${T_RING}, 0 2px 10px rgba(0,0,0,0.06)`
          : "0 1px 5px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ width: 64, height: 80 }}>
        {style.key === "shalwar-kameez" && (
          <ShalwarKameezIllustration color={selected ? T : TEXT_LIGHT} />
        )}
        {style.key === "anarkali" && (
          <AnarkaliIllustration color={selected ? T : TEXT_LIGHT} />
        )}
        {style.key === "saree" && (
          <SareeIllustration color={selected ? T : TEXT_LIGHT} />
        )}
      </div>
      <span
        className="text-center leading-tight"
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: selected ? T : TEXT_DARK,
          lineHeight: 1.3,
        }}
      >
        {style.label}
      </span>
    </motion.button>
  );
}

// ─── Pill Chip ────────────────────────────────────────────────────────────────

function PillChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 15px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 500,
        border: `1.5px solid ${active ? T : BORDER}`,
        backgroundColor: active ? T : CARD,
        color: active ? "#fff" : TEXT_DARK,
        cursor: "pointer",
        whiteSpace: "nowrap",
        flexShrink: 0,
        transition: "all 0.18s ease",
      }}
    >
      {label}
    </button>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner({ size = 44 }: { size?: number }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: `3px solid rgba(27,107,107,0.15)`,
        borderTopColor: T,
        flexShrink: 0,
      }}
    />
  );
}

// ─── Refine Label Row ─────────────────────────────────────────────────────────

function RefineLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="mb-2"
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: TEXT_MID,
        textTransform: "uppercase",
        letterSpacing: "0.07em",
        margin: 0,
        marginBottom: 8,
      }}
    >
      {children}
    </p>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function FabricVisualizer() {
  const [state, setState] = useState<AppState>("IDLE");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<StyleKey | null>(null);
  const [dupatta, setDupatta] = useState<DupattaStyle>("draped");
  const [embroidery, setEmbroidery] = useState<EmbroideryLevel>("light");
  const [fit, setFit] = useState<FitStyle>("regular");
  const [isDragging, setIsDragging] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setUploadedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setState("UPLOADING");
    setTimeout(() => setState("SELECTING_STYLE"), 1100);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

const onGenerate = async () => {
    if (!selectedStyle || !uploadedFile) return;
    const seed = Math.floor(Math.random() * 999983) + 1;
    
    setState("GENERATING");
    setImageLoaded(false);
    
    try {
        const formData = new FormData();
        formData.append("fabric", uploadedFile);
        formData.append("style", selectedStyle);
        formData.append("dupatta", dupatta);
        formData.append("embroidery", embroidery);
        formData.append("fit", fit);
        formData.append("seed", String(seed));
        
        const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
        const resp = await fetch(`${API_BASE}/generate`, {
            method: "POST",
            body: formData,
        });
        
        if (!resp.ok) throw new Error(`API error: ${resp.status}`);
        
        const blob = await resp.blob();
        const url = URL.createObjectURL(blob);
        setGeneratedImageUrl(url);
        setImageLoaded(true);
        setState("RESULT");
    } catch (e) {
        console.error("Generation failed:", e);
        setState("ERROR");
    }
};

const onRegenerate = async () => {
    if (!selectedStyle) return;
    setState("GENERATING");
    setImageLoaded(false);
    
    try {
        const formData = new FormData();
        if (uploadedFile) formData.append("fabric", uploadedFile);
        formData.append("style", selectedStyle);
        formData.append("dupatta", dupatta);
        formData.append("embroidery", embroidery);
        formData.append("fit", fit);
        formData.append("seed", String(Math.floor(Math.random() * 999983) + 1));
        
        const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
        const resp = await fetch(`${API_BASE}/generate`, {
            method: "POST",
            body: formData,
        });
        
        if (!resp.ok) throw new Error(`API error: ${resp.status}`);
        
        const blob = await resp.blob();
        const url = URL.createObjectURL(blob);
        setGeneratedImageUrl(url);
        setImageLoaded(true);
        setState("RESULT");
    } catch (e) {
        setState("ERROR");
    }
};

  const onReset = () => {
    setUploadedFile(null);
    setPreviewUrl(null);
    setSelectedStyle(null);
    setGeneratedImageUrl(null);
    setImageLoaded(false);
    setState("IDLE");
  };

  // ── Derived ──────────────────────────────────────────────────────────────

  const canGenerate = !!selectedStyle && state === "SELECTING_STYLE";
  const showStyleSelector =
    state === "SELECTING_STYLE" || state === "GENERATING" || state === "RESULT" || state === "ERROR";

  const NAV_TABS = [
    { id: "home", label: "Home", Icon: Home },
    { id: "visualize", label: "Visualize", Icon: Eye },
    { id: "favorites", label: "Favorites", Icon: Heart },
    { id: "profile", label: "Profile", Icon: User },
  ] as const;

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div
      className="flex justify-center min-h-screen"
      style={{ backgroundColor: "#EDE8DF", fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <div
        className="relative flex flex-col w-full"
        style={{ maxWidth: 430, backgroundColor: CREAM, minHeight: "100vh" }}
      >
        {/* ══════════════════════════ HEADER ══════════════════════════ */}
        <header
          className="sticky top-0 z-50 flex items-center gap-3 px-5"
          style={{
            height: 64,
            backgroundColor: "rgba(245,240,232,0.94)",
            backdropFilter: "blur(14px)",
            borderBottom: `1px solid ${BORDER_SUBTLE}`,
          }}
        >
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden>
            <circle cx="17" cy="17" r="15" stroke={T} strokeWidth="2" />
            <circle cx="17" cy="17" r="7" stroke={T} strokeWidth="1.6" />
            <circle cx="17" cy="17" r="2.8" fill={T} />
            <line x1="17" y1="2" x2="17" y2="10" stroke={T} strokeWidth="1.8" strokeLinecap="round" />
            <line x1="17" y1="24" x2="17" y2="32" stroke={T} strokeWidth="1.8" strokeLinecap="round" />
            <line x1="2" y1="17" x2="10" y2="17" stroke={T} strokeWidth="1.8" strokeLinecap="round" />
            <line x1="24" y1="17" x2="32" y2="17" stroke={T} strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: TEXT_DARK, lineHeight: 1.2, margin: 0 }}>
              Poshak Visualizer
            </h1>
            <p style={{ fontSize: 11, color: T, fontWeight: 500, margin: 0, letterSpacing: "0.04em" }}>
              Fabric to Image Converter
            </p>
          </div>
        </header>

        {/* ══════════════════════ SCROLLABLE CONTENT ══════════════════ */}
        {/* paddingBottom = action-bar 72 + nav 60 + buffer 20 = 152 */}
        <main className="flex-1 overflow-y-auto" style={{ padding: "20px 16px", paddingBottom: 160 }}>

          {/* ── Step 1: Upload Fabric ── */}
          <section className="mb-6">
            <h2 className="mb-3" style={{ fontSize: 16, fontWeight: 700, color: TEXT_DARK }}>
              Step 1: Upload Fabric
            </h2>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />

            <div
              className="flex items-center gap-3 p-3.5 rounded-2xl"
              style={{ backgroundColor: CARD, boxShadow: "0 2px 14px rgba(0,0,0,0.06)" }}
            >
              {/* Thumbnail / zone */}
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="Fabric swatch"
                  className="rounded-xl object-cover flex-shrink-0"
                  style={{ width: 58, height: 58, border: `1px solid ${BORDER}` }}
                />
              ) : state === "UPLOADING" ? (
                <div
                  className="flex items-center justify-center flex-shrink-0 rounded-xl"
                  style={{ width: 58, height: 58, backgroundColor: CREAM }}
                >
                  <Spinner size={24} />
                </div>
              ) : (
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={onDrop}
                  className="flex items-center justify-center flex-shrink-0 rounded-xl transition-colors duration-200"
                  style={{
                    width: 58,
                    height: 58,
                    backgroundColor: isDragging ? "rgba(27,107,107,0.08)" : CREAM,
                    border: `1.5px dashed ${isDragging ? T : "#C4BFB7"}`,
                  }}
                >
                  <Upload style={{ width: 22, height: 22, color: T }} />
                </div>
              )}

              {/* Label */}
              <div className="flex-1 min-w-0">
                {previewUrl ? (
                  <>
                    <p className="truncate" style={{ fontSize: 13, fontWeight: 600, color: TEXT_DARK, margin: 0 }}>
                      {uploadedFile?.name ?? "Fabric uploaded"}
                    </p>
                    <p style={{ fontSize: 11, color: TEXT_LIGHT, margin: 0 }}>Change Fabric</p>
                  </>
                ) : (
                  <>
                    <p style={{ fontSize: 13, fontWeight: 600, color: TEXT_DARK, margin: 0 }}>
                      {state === "UPLOADING" ? "Processing…" : "No fabric selected"}
                    </p>
                    <p style={{ fontSize: 11, color: TEXT_LIGHT, margin: 0 }}>JPEG, PNG, WebP</p>
                  </>
                )}
              </div>

              {/* Button */}
              <button
                onClick={() => fileRef.current?.click()}
                className="flex-shrink-0 hover:opacity-80 transition-opacity"
                style={{
                  padding: "9px 14px",
                  borderRadius: 10,
                  backgroundColor: T,
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  border: "none",
                  cursor: "pointer",
                  lineHeight: 1.35,
                  textAlign: "center",
                  whiteSpace: "pre-line",
                }}
              >
                {previewUrl ? "CHANGE" : "UPLOAD\nFABRIC"}
              </button>
            </div>
          </section>

          {/* ── Step 2: Select Dress Style ── */}
          <AnimatePresence>
            {showStyleSelector && (
              <motion.section
                key="style-section"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mb-6"
              >
                <h2 className="mb-3" style={{ fontSize: 16, fontWeight: 700, color: TEXT_DARK }}>
                  Step 2: Select Dress Style
                </h2>
                <div
                  className="flex gap-2.5 no-scrollbar"
                  style={{ overflowX: "auto", paddingBottom: 4 }}
                >
                  {STYLES.map((s, i) => (
                    <StyleCard
                      key={s.key}
                      style={s}
                      selected={selectedStyle === s.key}
                      onClick={() => setSelectedStyle(s.key)}
                      index={i}
                    />
                  ))}
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* ── Visualization Preview ── */}
          <section className="mb-6">
            <h2 className="mb-3" style={{ fontSize: 16, fontWeight: 700, color: TEXT_DARK }}>
              Your Dress Visualization
            </h2>

            <div
              className="w-full overflow-hidden rounded-2xl"
              style={{
                backgroundColor: CARD,
                border: `1px solid ${BORDER_SUBTLE}`,
                boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
                minHeight: 300,
              }}
            >
              <AnimatePresence mode="wait">

                {/* IDLE */}
                {state === "IDLE" && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-3 py-16"
                    style={{ color: "#D1D5DB" }}
                  >
                    <Layers style={{ width: 52, height: 52 }} />
                    <p style={{ fontSize: 13, color: TEXT_LIGHT, margin: 0, textAlign: "center" }}>
                      Upload a fabric swatch to begin
                    </p>
                  </motion.div>
                )}

                {/* UPLOADING / SELECTING_STYLE */}
                {(state === "UPLOADING" || state === "SELECTING_STYLE") && (
                  <motion.div
                    key="selecting"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-4 py-12 px-6 w-full"
                  >
                    {previewUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={previewUrl}
                        alt="Fabric preview"
                        className="object-cover rounded-2xl"
                        style={{
                          width: 148,
                          height: 185,
                          border: `1px solid ${BORDER}`,
                          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                        }}
                      />
                    ) : (
                      <Layers style={{ width: 52, height: 52, color: "#D1D5DB" }} />
                    )}
                    <p style={{ fontSize: 13, color: TEXT_LIGHT, margin: 0 }}>
                      {selectedStyle
                        ? `${STYLES.find(s => s.key === selectedStyle)?.label} selected — tap Generate`
                        : "Select a dress style above to continue"}
                    </p>
                  </motion.div>
                )}

                {/* GENERATING — real loading while Pollinations works */}
                {state === "GENERATING" && (
                  <motion.div
                    key="generating"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-5 py-14 px-6"
                  >
                  

                    {/* Animated rings */}
                    <div className="relative flex items-center justify-center" style={{ width: 80, height: 80 }}>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
                        style={{
                          position: "absolute",
                          width: 80, height: 80,
                          borderRadius: "50%",
                          border: `3px solid rgba(27,107,107,0.15)`,
                          borderTopColor: T,
                        }}
                      />
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
                        style={{
                          position: "absolute",
                          width: 56, height: 56,
                          borderRadius: "50%",
                          border: `2px solid rgba(27,107,107,0.1)`,
                          borderBottomColor: T,
                        }}
                      />
                      <Sparkles style={{ width: 24, height: 24, color: T }} />
                    </div>

                    <div className="text-center" style={{ maxWidth: 260 }}>
                      <p style={{ fontSize: 15, fontWeight: 600, color: T, margin: 0, marginBottom: 6 }}>
                        Generating your dress image…
                      </p>
                      <p style={{ fontSize: 12, color: TEXT_LIGHT, margin: 0, lineHeight: 1.5 }}>
                        AI is creating a photorealistic visualization of your fabric as a{" "}
                        <strong style={{ color: TEXT_MID }}>
                          {STYLES.find(s => s.key === selectedStyle)?.label}
                        </strong>
                        . This takes 15–30 seconds.
                      </p>
                    </div>

                    {/* Pulsing dots */}
                    <div className="flex items-center gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.25 }}
                          style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: T }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* RESULT — real AI-generated photo */}
                {state === "RESULT" && generatedImageUrl && imageLoaded && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="relative w-full"
                  >
                    {/* The real photorealistic image */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={generatedImageUrl}
                      alt={`AI-generated ${STYLES.find(s => s.key === selectedStyle)?.label} visualization`}
                      style={{ width: "100%", display: "block", borderRadius: "inherit" }}
                    />

                    {/* Style badge — top left */}
                    <div
                      className="absolute flex flex-col gap-1.5"
                      style={{ top: 12, left: 12 }}
                    >
                      <span
                        style={{
                          backgroundColor: T,
                          color: "#fff",
                          fontSize: 10,
                          padding: "4px 11px",
                          borderRadius: 999,
                          fontWeight: 600,
                          backdropFilter: "blur(4px)",
                        }}
                      >
                        {STYLES.find((s) => s.key === selectedStyle)?.label}
                      </span>
                      <span
                        style={{
                          backgroundColor: "rgba(0,0,0,0.42)",
                          color: "#fff",
                          fontSize: 10,
                          padding: "4px 11px",
                          borderRadius: 999,
                          backdropFilter: "blur(6px)",
                          textTransform: "capitalize",
                        }}
                      >
                        {dupatta} · {embroidery} emb · {fit}
                      </span>
                    </div>

                    {/* AI Visualization watermark — bottom left */}
                    <div
                      className="absolute inset-x-0 bottom-0 flex items-end"
                      style={{
                        height: 72,
                        background: "linear-gradient(to top, rgba(0,0,0,0.45), transparent)",
                        padding: "0 14px 12px",
                        borderRadius: "0 0 inherit inherit",
                      }}
                    >
                      <div className="flex items-center gap-1.5">
                        <Sparkles style={{ width: 12, height: 12, color: "rgba(255,255,255,0.9)" }} />
                        <span style={{ fontSize: 11, color: "#fff", fontWeight: 500 }}>
                          AI Visualization · Poshak Visualizer
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ERROR state */}
                {state === "ERROR" && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-4 py-14 px-6"
                  >
                    <AlertCircle style={{ width: 44, height: 44, color: "#EF4444" }} />
                    <div className="text-center">
                      <p style={{ fontSize: 14, fontWeight: 600, color: TEXT_DARK, margin: 0, marginBottom: 6 }}>
                        Generation failed
                      </p>
                      <p style={{ fontSize: 12, color: TEXT_LIGHT, margin: 0 }}>
                        Could not connect to the image generation service. Check your internet connection and try again.
                      </p>
                    </div>
                    <button
                      onClick={onRegenerate}
                      className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                      style={{
                        padding: "10px 20px",
                        borderRadius: 12,
                        backgroundColor: T,
                        color: "#fff",
                        fontSize: 13,
                        fontWeight: 600,
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <RefreshCw style={{ width: 15, height: 15 }} />
                      Try Again
                    </button>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </section>

          {/* ── Refine Your Style (visible once RESULT or ERROR) ── */}
          <AnimatePresence>
            {(state === "RESULT" || state === "ERROR") && (
              <motion.section
                key="refine"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mb-4 rounded-2xl p-4"
                style={{ backgroundColor: CARD, boxShadow: "0 2px 14px rgba(0,0,0,0.06)" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <p style={{ fontSize: 15, fontWeight: 700, color: TEXT_DARK, margin: 0 }}>
                    Refine Your Style
                  </p>
                  {/* Regenerate with new settings */}
                  <button
                    onClick={onRegenerate}
                    className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: T,
                      background: "none",
                      border: `1px solid ${T}`,
                      borderRadius: 20,
                      padding: "4px 10px",
                      cursor: "pointer",
                    }}
                  >
                    <RefreshCw style={{ width: 11, height: 11 }} />
                    Regenerate
                  </button>
                </div>

                {/* Dupatta Style */}
                <div className="mb-4">
                  <RefineLabel>Dupatta Style</RefineLabel>
                  <div className="flex flex-wrap gap-2">
                    {(["draped", "folded", "nortan", "elovr"] as DupattaStyle[]).map((v) => (
                      <PillChip
                        key={v}
                        label={v.charAt(0).toUpperCase() + v.slice(1)}
                        active={dupatta === v}
                        onClick={() => setDupatta(v)}
                      />
                    ))}
                  </div>
                </div>

                {/* Embroidery Level */}
                <div className="mb-4">
                  <RefineLabel>Embroidery Level</RefineLabel>
                  <div className="flex gap-2">
                    {(["light", "heavy"] as EmbroideryLevel[]).map((v) => (
                      <PillChip
                        key={v}
                        label={v.charAt(0).toUpperCase() + v.slice(1)}
                        active={embroidery === v}
                        onClick={() => setEmbroidery(v)}
                      />
                    ))}
                  </div>
                </div>

                {/* Fit */}
                <div>
                  <RefineLabel>Fit</RefineLabel>
                  <div className="flex gap-2">
                    {(["regular", "slim"] as FitStyle[]).map((v) => (
                      <PillChip
                        key={v}
                        label={v.charAt(0).toUpperCase() + v.slice(1)}
                        active={fit === v}
                        onClick={() => setFit(v)}
                      />
                    ))}
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* Start over */}
          {(state === "RESULT" || state === "ERROR") && (
            <div className="flex justify-center pb-2">
              <button
                onClick={onReset}
                className="flex items-center gap-1.5 hover:opacity-60 transition-opacity"
                style={{
                  fontSize: 12,
                  color: TEXT_LIGHT,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px 16px",
                }}
              >
                <RotateCcw style={{ width: 12, height: 12 }} />
                Start over
              </button>
            </div>
          )}
        </main>

        {/* ════════════ BOTTOM ACTION BAR — fixed, above nav ════════════ */}
        <div
          className="fixed z-40 flex items-center gap-2.5 px-4"
          style={{
            bottom: 60,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: 430,
            height: 72,
            backgroundColor: "rgba(245,240,232,0.96)",
            backdropFilter: "blur(14px)",
            borderTop: `1px solid ${BORDER_SUBTLE}`,
          }}
        >
          {/* ── IDLE / SELECTING_STYLE: Generate button ── */}
          {(state === "IDLE" || state === "UPLOADING" || state === "SELECTING_STYLE") && (
            <motion.button
              disabled={!canGenerate}
              onClick={canGenerate ? onGenerate : undefined}
              whileHover={canGenerate ? { scale: 1.015 } : {}}
              whileTap={canGenerate ? { scale: 0.985 } : {}}
              className="relative flex-1 flex items-center justify-center gap-2 overflow-hidden font-bold"
              style={{
                height: 50,
                borderRadius: 14,
                border: "none",
                fontSize: 13,
                letterSpacing: "0.06em",
                cursor: canGenerate ? "pointer" : "not-allowed",
                backgroundColor: canGenerate ? T : "rgba(27,107,107,0.2)",
                color: canGenerate ? "#fff" : "rgba(27,107,107,0.45)",
                transition: "background-color 0.2s ease",
              }}
            >
              {canGenerate && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)",
                  }}
                  animate={{ x: ["-100%", "220%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1.2 }}
                />
              )}
              <Sparkles style={{ width: 16, height: 16, flexShrink: 0 }} />
              GENERATE MY DRESS IMAGE
            </motion.button>
          )}

          {/* ── GENERATING: spinner indicator ── */}
          {state === "GENERATING" && (
            <div
              className="flex-1 flex items-center justify-center gap-3"
              style={{
                height: 50,
                borderRadius: 14,
                backgroundColor: "rgba(27,107,107,0.08)",
                border: `1.5px solid rgba(27,107,107,0.18)`,
              }}
            >
              <Spinner size={20} />
              <span style={{ fontSize: 13, fontWeight: 600, color: T }}>Generating…</span>
            </div>
          )}

          {/* ── RESULT: "Ready" indicator + save/share ── */}
          {state === "RESULT" && (
            <>
              <div
                className="flex-1 flex items-center justify-center gap-2"
                style={{
                  height: 50,
                  borderRadius: 14,
                  backgroundColor: T,
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                }}
              >
                <Sparkles style={{ width: 15, height: 15 }} />
                VISUALIZATION READY ✓
              </div>

              {/* Save & Share */}
              <motion.div
                initial={{ opacity: 0, scale: 0.75 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex gap-2"
              >
                <a
                  href={generatedImageUrl ?? "#"}
                  download="poshak-visualization.jpg"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center hover:opacity-80 transition-opacity"
                  style={{
                    width: 50, height: 50,
                    borderRadius: 14,
                    backgroundColor: CARD,
                    border: `1px solid ${BORDER}`,
                    boxShadow: "0 1px 5px rgba(0,0,0,0.06)",
                    textDecoration: "none",
                  }}
                >
                  <Download style={{ width: 19, height: 19, color: T }} />
                </a>
                <button
                  onClick={() =>
                    generatedImageUrl &&
                    navigator.share?.({ url: generatedImageUrl, title: "My Poshak Visualization" })
                  }
                  className="flex items-center justify-center hover:opacity-80 transition-opacity"
                  style={{
                    width: 50, height: 50,
                    borderRadius: 14,
                    backgroundColor: CARD,
                    border: `1px solid ${BORDER}`,
                    cursor: "pointer",
                    boxShadow: "0 1px 5px rgba(0,0,0,0.06)",
                  }}
                >
                  <Share2 style={{ width: 19, height: 19, color: T }} />
                </button>
              </motion.div>
            </>
          )}

          {/* ── ERROR: retry button ── */}
          {state === "ERROR" && (
            <button
              onClick={onRegenerate}
              className="flex-1 flex items-center justify-center gap-2 hover:opacity-80 transition-opacity"
              style={{
                height: 50,
                borderRadius: 14,
                border: "none",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.05em",
                backgroundColor: "#EF4444",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              <RefreshCw style={{ width: 16, height: 16 }} />
              RETRY GENERATION
            </button>
          )}
        </div>

        {/* ════════════════ BOTTOM NAVIGATION BAR ════════════════ */}
        <nav
          className="fixed z-50 flex"
          style={{
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: 430,
            height: 60,
            backgroundColor: CARD,
            borderTop: `1px solid ${BORDER}`,
          }}
        >
          {NAV_TABS.map(({ id, label, Icon }) => {
            const active = id === "visualize";
            return (
              <button
                key={id}
                className="flex-1 flex flex-col items-center justify-center gap-0.5"
                style={{ background: "none", border: "none", cursor: "pointer", paddingTop: 8, paddingBottom: 8 }}
              >
                <Icon
                  style={{
                    width: 22,
                    height: 22,
                    color: active ? T : TEXT_LIGHT,
                    strokeWidth: active ? 2.2 : 1.8,
                  }}
                />
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: active ? 600 : 400,
                    color: active ? T : TEXT_LIGHT,
                  }}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
