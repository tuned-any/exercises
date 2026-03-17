import { useState } from "react";

// ProfileCard Component 
function ProfileCard({ name, bio, avatarUrl, accentColor = "#6366f1" }) {
  const [highlighted, setHighlighted] = useState(false);
  const [hovered, setHovered]         = useState(false);
  const [imgError, setImgError]       = useState(false);

  // Fallback avatar using initials
  const initials = name.split(" ").map(w => w[0]).join("").toUpperCase();

  // Dynamic styles (ternary-driven)
  const cardStyle = {
    width: 280,
    borderRadius: 16,
    padding: "28px 24px 24px",
    background: highlighted ? `linear-gradient(135deg, ${accentColor}18, #fff)` : "#fff",
    boxShadow: highlighted
      ? `0 8px 32px ${accentColor}55, 0 2px 8px rgba(0,0,0,0.08)`
      : hovered
        ? "0 8px 24px rgba(0,0,0,0.13)"
        : "2px 2px 10px rgba(0,0,0,0.10)",
    border: highlighted ? `2px solid ${accentColor}` : "2px solid transparent",
    transform: hovered ? "translateY(-4px)" : "translateY(0)",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    cursor: "default",
    fontFamily: "'Segoe UI', sans-serif",
    position: "relative",
  };

  const avatarWrapStyle = {
    width: 88,
    height: 88,
    borderRadius: "50%",
    border: highlighted ? `3px solid ${accentColor}` : "3px solid #e5e7eb",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: accentColor,
    transition: "border 0.3s ease",
    flexShrink: 0,
  };

  const imgStyle = { width: "100%", height: "100%", objectFit: "cover" };

  const initialsStyle = {
    color: "#fff",
    fontSize: 30,
    fontWeight: 700,
    letterSpacing: 1,
    userSelect: "none",
  };

  const nameStyle = {
    fontSize: 18,
    fontWeight: 700,
    color: highlighted ? accentColor : "#1f2937",
    margin: 0,
    transition: "color 0.3s",
    textAlign: "center",
  };

  const bioStyle = {
    fontSize: 13,
    color: "#6b7280",
    margin: 0,
    textAlign: "center",
    lineHeight: 1.5,
  };

  const badgeStyle = {
    display: highlighted ? "inline-block" : "none",
    background: accentColor,
    color: "#fff",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 1,
    padding: "2px 8px",
    borderRadius: 99,
    textTransform: "uppercase",
  };

  const dividerStyle = {
    width: "100%",
    height: 1,
    background: highlighted ? `${accentColor}40` : "#f3f4f6",
    transition: "background 0.3s",
  };

  const btnStyle = {
    marginTop: 4,
    padding: "8px 22px",
    borderRadius: 99,
    border: "none",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
    background: highlighted ? accentColor : "#f3f4f6",
    color: highlighted ? "#fff" : "#374151",
    boxShadow: highlighted ? `0 4px 14px ${accentColor}66` : "none",
    transform: highlighted ? "scale(1.05)" : "scale(1)",
    transition: "all 0.25s ease",
    letterSpacing: 0.3,
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Highlight badge */}
      <span style={badgeStyle}>Highlighted</span>

      {/* Avatar */}
      <div style={avatarWrapStyle}>
        {avatarUrl && !imgError ? (
          <img src={avatarUrl} alt={name} style={imgStyle} onError={() => setImgError(true)} />
        ) : (
          <span style={initialsStyle}>{initials}</span>
        )}
      </div>

      {/* Info */}
      <h3 style={nameStyle}>{name}</h3>
      <p style={bioStyle}>{bio}</p>

      <div style={dividerStyle} />

      {/* Highlight toggle button */}
      <button style={btnStyle} onClick={() => setHighlighted(h => !h)}>
        {highlighted ? "✦ Highlighted" : "Highlight"}
      </button>
    </div>
  );
}

// Demo 
const profiles = [
  {
    name: "Nwediwe Brian",
    bio: "Front-end developer who loves code reviews, strong coffee, and open-source.",
    avatarUrl: "https://i.pravatar.cc/150?img=47",
    accentColor: "#6366f1",
  },
  {
    name: "Tunde Oluseye",
    bio: "UI/UX designer crafting great user-friendly experiences through designs.",
    avatarUrl: "https://i.pravatar.cc/150?img=12",
    accentColor: "#f59e0b",
  },
  {
    name: "Abokina Abdulkareem",
    bio: "IT support expert turning support into actionable insights for analysis.",
    avatarUrl: null, // will render initials fallback
    accentColor: "#10b981",
  },
];

export default function App() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #9fa8bf 0%, #faf5ff 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "48px 24px",
      fontFamily: "'Segoe UI', sans-serif",
    }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1f2937", marginBottom: 6 }}>
        ProfileCard Component
      </h1>
      <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 40 }}>
        Hover a card or click <strong>Highlight</strong> to see dynamic styling
      </p>

      <div style={{ display: "flex", gap: 28, flexWrap: "wrap", justifyContent: "center" }}>
        {profiles.map(p => (
          <ProfileCard key={p.name} {...p} />
        ))}
      </div>

      {/* Props reference */}
      <div style={{
        marginTop: 52,
        background: "#333341",
        borderRadius: 12,
        padding: "20px 28px",
        width: "100%",
        maxWidth: 620,
        color: "#cdd6f4",
        fontSize: 13,
        fontFamily: "monospace",
        lineHeight: 1.8,
      }}>
        <div style={{ color: "#89b4fa", marginBottom: 6 }}>{"// ProfileCard props"}</div>
        <div><span style={{color:"#f38ba8"}}>name</span>        <span style={{color:"#a6e3a1"}}>string</span>   — Full display name</div>
        <div><span style={{color:"#f38ba8"}}>bio</span>         <span style={{color:"#a6e3a1"}}>string</span>   — Short biography</div>
        <div><span style={{color:"#f38ba8"}}>avatarUrl</span>   <span style={{color:"#a6e3a1"}}>string|null</span> — Remote image URL (falls back to initials)</div>
        <div><span style={{color:"#f38ba8"}}>accentColor</span> <span style={{color:"#a6e3a1"}}>string</span>   — Hex color for highlight theme (default: #6366f1)</div>
      </div>
    </div>
  );
}