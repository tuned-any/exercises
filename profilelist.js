import { useState } from "react";

// Utilities
const ACCENT_COLORS = ["#6366f1","#f59e0b","#10b981","#ef4444","#3b82f6","#ec4899","#8b5cf6","#14b8a6"];
const uid = () => Math.random().toString(36).slice(2, 9);
const pickColor = (list) => ACCENT_COLORS[list.length % ACCENT_COLORS.length];

const INITIAL_PROFILES = [
  { id: uid(), name: "Tunde Oluseye", bio: "UI/UX designer crafting great user-friendly experiences through designs.", avatarUrl: "https://i.pravatar.cc/150?img=47", accentColor: "#6366f1", highlighted: false },
  { id: uid(), name: "Abokina Abdulkareem", bio: "IT support expert turning support into actionable insights for analysis.", avatarUrl: "https://i.pravatar.cc/150?img=12", accentColor: "#f59e0b", highlighted: false },
  { id: uid(), name: "Nwediwe Brian", bio: "Front-end developer who loves code reviews, strong coffee, and open-source.", avatarUrl: null, accentColor: "#10b981", highlighted: false },
];

// ProfileCard 
function ProfileCard({ profile, onToggleHighlight, onDelete }) {
  const { name, bio, avatarUrl, accentColor, highlighted } = profile;
  const [hovered, setHovered]   = useState(false);
  const [imgError, setImgError] = useState(false);
  const initials = name.split(" ").map(w => w[0]).join("").toUpperCase();

  const card = {
    width: 260,
    borderRadius: 16,
    padding: "28px 22px 22px",
    background: highlighted ? `linear-gradient(135deg,${accentColor}18,#fff)` : "#fff",
    boxShadow: highlighted
      ? `0 8px 32px ${accentColor}55, 0 2px 8px rgba(0,0,0,0.08)`
      : hovered ? "0 8px 24px rgba(0,0,0,0.13)" : "2px 2px 10px rgba(0,0,0,0.10)",
    border: highlighted ? `2px solid ${accentColor}` : "2px solid transparent",
    transform: hovered ? "translateY(-4px)" : "translateY(0)",
    transition: "all 0.3s ease",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
    fontFamily: "'Segoe UI', sans-serif", position: "relative",
  };
  const avatarWrap = {
    width: 80, height: 80, borderRadius: "50%",
    border: `3px solid ${highlighted ? accentColor : "#e5e7eb"}`,
    overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
    background: accentColor, flexShrink: 0, transition: "border 0.3s",
  };
  const badge = {
    display: highlighted ? "inline-block" : "none",
    background: accentColor, color: "#fff", fontSize: 10, fontWeight: 700,
    letterSpacing: 1, padding: "2px 8px", borderRadius: 99, textTransform: "uppercase",
  };
  const btn = (active, danger) => ({
    flex: 1, padding: "7px 0", borderRadius: 99, border: "none", cursor: "pointer",
    fontSize: 12, fontWeight: 600,
    background: danger ? (hovered ? "#fee2e2" : "#f3f4f6") : active ? accentColor : "#f3f4f6",
    color: danger ? "#ef4444" : active ? "#fff" : "#374151",
    boxShadow: active && !danger ? `0 4px 14px ${accentColor}66` : "none",
    transition: "all 0.25s ease",
  });

  return (
    <div style={card} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {/* Delete */}
      <button onClick={onDelete} style={{
        position:"absolute", top:10, right:12, background:"none", border:"none",
        cursor:"pointer", fontSize:16, color:"#9ca3af", lineHeight:1,
        transition:"color 0.2s"
      }} title="Remove"
        onMouseEnter={e => e.target.style.color="#ef4444"}
        onMouseLeave={e => e.target.style.color="#9ca3af"}
      >×</button>

      <span style={badge}>Highlighted</span>

      {/* Avatar */}
      <div style={avatarWrap}>
        {avatarUrl && !imgError
          ? <img src={avatarUrl} alt={name} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={() => setImgError(true)} />
          : <span style={{color:"#fff",fontSize:26,fontWeight:700,userSelect:"none"}}>{initials}</span>}
      </div>

      <h3 style={{fontSize:16,fontWeight:700,color:highlighted?accentColor:"#1f2937",margin:0,textAlign:"center",transition:"color 0.3s"}}>{name}</h3>
      <p style={{fontSize:12,color:"#6b7280",margin:0,textAlign:"center",lineHeight:1.5}}>{bio}</p>

      <div style={{width:"100%",height:1,background:highlighted?`${accentColor}40`:"#f3f4f6",transition:"background 0.3s"}} />

      {/* Actions */}
      <div style={{display:"flex",gap:8,width:"100%"}}>
        <button style={btn(highlighted, false)} onClick={onToggleHighlight}>
          {highlighted ? "✦ Highlighted" : "Highlight"}
        </button>
        <button style={btn(false, true)} onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
}

// AddProfileForm 
function AddProfileForm({ onAdd, existingCount }) {
  const [open, setOpen]   = useState(false);
  const [form, setForm]   = useState({ name:"", bio:"", avatarUrl:"" });
  const [error, setError] = useState("");

  const set = (k, v) => { setForm(f => ({...f, [k]: v})); setError(""); };

  const handleSubmit = () => {
    if (!form.name.trim())       return setError("Name is required.");
    if (!form.bio.trim())        return setError("Bio is required.");
    onAdd({
      id: uid(),
      name: form.name.trim(),
      bio:  form.bio.trim(),
      avatarUrl: form.avatarUrl.trim() || null,
      accentColor: ACCENT_COLORS[existingCount % ACCENT_COLORS.length],
      highlighted: false,
    });
    setForm({ name:"", bio:"", avatarUrl:"" });
    setOpen(false);
  };

  const inputStyle = {
    width:"100%", padding:"9px 12px", borderRadius:8, fontSize:13,
    border:"1.5px solid #e5e7eb", outline:"none", boxSizing:"border-box",
    fontFamily:"'Segoe UI',sans-serif", transition:"border 0.2s",
  };
  const focusStyle = (e) => e.target.style.borderColor = "#6366f1";
  const blurStyle  = (e) => e.target.style.borderColor = "#e5e7eb";

  return (
    <div style={{width:"100%",maxWidth:540}}>
      {/* Toggle button */}
      <button onClick={() => setOpen(o => !o)} style={{
        display:"flex", alignItems:"center", gap:8,
        padding:"10px 22px", borderRadius:99, border:"2px dashed #6366f1",
        background: open ? "#6366f1" : "transparent",
        color: open ? "#fff" : "#6366f1",
        cursor:"pointer", fontSize:13, fontWeight:700,
        transition:"all 0.25s", marginBottom: open ? 16 : 0,
      }}>
        <span style={{fontSize:18, lineHeight:1}}>{open ? "✕" : "+"}</span>
        {open ? "Cancel" : "Add New Profile"}
      </button>

      {/* Form panel */}
      {open && (
        <div style={{
          background:"#fff", borderRadius:16, padding:"24px 28px",
          boxShadow:"0 8px 32px rgba(99,102,241,0.12)", border:"1.5px solid #e5e7eb",
          display:"flex", flexDirection:"column", gap:14,
        }}>
          <h3 style={{margin:0,fontSize:16,fontWeight:700,color:"#1f2937"}}>New Profile</h3>

          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            <label style={{fontSize:12,fontWeight:600,color:"#374151"}}>Name *</label>
            <input style={inputStyle} placeholder="e.g. Jane Doe" value={form.name}
              onChange={e => set("name", e.target.value)}
              onFocus={focusStyle} onBlur={blurStyle} />
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            <label style={{fontSize:12,fontWeight:600,color:"#374151"}}>Bio *</label>
            <textarea style={{...inputStyle,resize:"vertical",minHeight:70}}
              placeholder="A short description..." value={form.bio}
              onChange={e => set("bio", e.target.value)}
              onFocus={focusStyle} onBlur={blurStyle} />
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            <label style={{fontSize:12,fontWeight:600,color:"#374151"}}>Avatar URL <span style={{color:"#9ca3af",fontWeight:400}}>(optional)</span></label>
            <input style={inputStyle} placeholder="https://..." value={form.avatarUrl}
              onChange={e => set("avatarUrl", e.target.value)}
              onFocus={focusStyle} onBlur={blurStyle} />
          </div>

          {error && <p style={{margin:0,fontSize:12,color:"#ef4444",fontWeight:500}}>⚠ {error}</p>}

          <button onClick={handleSubmit} style={{
            padding:"10px 0", borderRadius:99, border:"none", cursor:"pointer",
            background:"#6366f1", color:"#fff", fontSize:14, fontWeight:700,
            boxShadow:"0 4px 14px rgba(99,102,241,0.4)", transition:"opacity 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.opacity="0.88"}
            onMouseLeave={e => e.currentTarget.style.opacity="1"}
          >
            Add Profile
          </button>
        </div>
      )}
    </div>
  );
}

// ProfileList 
export default function ProfileList() {
  const [profiles, setProfiles] = useState(INITIAL_PROFILES);
  const [filter,   setFilter]   = useState("all"); // all | highlighted

  const addProfile     = (p)  => setProfiles(ps => [...ps, p]);
  const deleteProfile  = (id) => setProfiles(ps => ps.filter(p => p.id !== id));
  const toggleHighlight = (id) => setProfiles(ps => ps.map(p => p.id === id ? {...p, highlighted: !p.highlighted} : p));
  const highlightAll   = ()   => setProfiles(ps => ps.map(p => ({...p, highlighted: true})));
  const clearAll       = ()   => setProfiles(ps => ps.map(p => ({...p, highlighted: false})));

  const visible = filter === "highlighted" ? profiles.filter(p => p.highlighted) : profiles;
  const highlightedCount = profiles.filter(p => p.highlighted).length;

  return (
    <div style={{
      minHeight:"100vh", padding:"40px 24px",
      background:"linear-gradient(135deg,#f0f4ff,#faf5ff)",
      fontFamily:"'Segoe UI',sans-serif", display:"flex", flexDirection:"column", alignItems:"center", gap:28,
    }}>
      {/* Header */}
      <div style={{textAlign:"center"}}>
        <h1 style={{fontSize:26,fontWeight:800,color:"#1f2937",margin:"0 0 6px"}}>Profile List</h1>
        <p style={{fontSize:14,color:"#6b7280",margin:0}}>
          {profiles.length} profile{profiles.length !== 1 ? "s" : ""} · {highlightedCount} highlighted
        </p>
      </div>

      {/* Toolbar */}
      <div style={{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center"}}>
        {["all","highlighted"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding:"7px 18px", borderRadius:99, border:"1.5px solid",
            borderColor: filter===f ? "#6366f1" : "#e5e7eb",
            background: filter===f ? "#6366f1" : "#fff",
            color: filter===f ? "#fff" : "#6b7280",
            fontSize:12, fontWeight:600, cursor:"pointer", transition:"all 0.2s", textTransform:"capitalize",
          }}>
            {f === "all" ? `All (${profiles.length})` : `Highlighted (${highlightedCount})`}
          </button>
        ))}
        <button onClick={highlightAll} style={{padding:"7px 18px",borderRadius:99,border:"1.5px solid #f59e0b",background:"#fffbeb",color:"#92400e",fontSize:12,fontWeight:600,cursor:"pointer"}}>⭐ Highlight All</button>
        <button onClick={clearAll}     style={{padding:"7px 18px",borderRadius:99,border:"1.5px solid #e5e7eb",background:"#fff",color:"#6b7280",fontSize:12,fontWeight:600,cursor:"pointer"}}>✕ Clear All</button>
      </div>

      {/* Add form */}
      <AddProfileForm onAdd={addProfile} existingCount={profiles.length} />

      {/* Cards grid */}
      {visible.length === 0 ? (
        <div style={{marginTop:32,textAlign:"center",color:"#9ca3af",fontSize:14}}>
          {filter === "highlighted" ? "No highlighted profiles yet. Click Highlight on a card!" : "No profiles yet. Add one above!"}
        </div>
      ) : (
        <div style={{display:"flex",flexWrap:"wrap",gap:24,justifyContent:"center",width:"100%",maxWidth:1000}}>
          {visible.map(p => (
            <ProfileCard
              key={p.id}
              profile={p}
              onToggleHighlight={() => toggleHighlight(p.id)}
              onDelete={() => deleteProfile(p.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}