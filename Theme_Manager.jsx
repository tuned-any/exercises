import { createContext, useContext, useReducer, useMemo, useCallback, useState, useRef, useEffect, memo } from "react";

//Theme Definitions
const themes = {
  light: {
    name: "Light",
    bg: "#ffffff",
    surface: "#f1f5f9",
    surfaceHover: "#e2e8f0",
    text: "#0f172a",
    textMuted: "#64748b",
    primary: "#6366f1",
    primaryHover: "#4f46e5",
    primaryText: "#ffffff",
    accent: "#f59e0b",
    border: "#e2e8f0",
    success: "#22c55e",
    shadow: "0 1px 3px rgba(0,0,0,0.08)",
  },
  dark: {
    name: "Dark",
    bg: "#0f172a",
    surface: "#1e293b",
    surfaceHover: "#334155",
    text: "#f1f5f9",
    textMuted: "#94a3b8",
    primary: "#818cf8",
    primaryHover: "#a5b4fc",
    primaryText: "#0f172a",
    accent: "#fbbf24",
    border: "#334155",
    success: "#4ade80",
    shadow: "0 1px 3px rgba(0,0,0,0.3)",
  },
  forest: {
    name: "Forest",
    bg: "#f0fdf4",
    surface: "#dcfce7",
    surfaceHover: "#bbf7d0",
    text: "#14532d",
    textMuted: "#3f6212",
    primary: "#16a34a",
    primaryHover: "#15803d",
    primaryText: "#ffffff",
    accent: "#ea580c",
    border: "#bbf7d0",
    success: "#22c55e",
    shadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  ocean: {
    name: "Ocean",
    bg: "#0c1222",
    surface: "#1a2744",
    surfaceHover: "#243660",
    text: "#e0f2fe",
    textMuted: "#7dd3fc",
    primary: "#0ea5e9",
    primaryHover: "#38bdf8",
    primaryText: "#0c1222",
    accent: "#f472b6",
    border: "#243660",
    success: "#34d399",
    shadow: "0 1px 3px rgba(0,0,0,0.3)",
  },
};

// Reducer 
const themeReducer = (state, action) => {
  switch (action.type) {
    case "SET_THEME":
      return { ...state, current: action.payload, colors: themes[action.payload] };
    case "TOGGLE_FONT_SIZE":
      return { ...state, fontSize: state.fontSize === "normal" ? "large" : "normal" };
    case "TOGGLE_RADIUS":
      return { ...state, borderRadius: state.borderRadius === "rounded" ? "sharp" : "rounded" };
    default:
      return state;
  }
};

const initialState = {
  current: "light",
  colors: themes.light,
  fontSize: "normal",
  borderRadius: "rounded",
};

//  Split Contexts 
const ThemeReadContext = createContext(null);
const ThemeDispatchContext = createContext(null);

// Provider with useMemo for referential stability 
function ThemeProvider({ children }) {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  // Stabilize dispatch actions so consumers don't re-render
  const stableDispatch = useMemo(() => ({
    setTheme: (t) => dispatch({ type: "SET_THEME", payload: t }),
    toggleFontSize: () => dispatch({ type: "TOGGLE_FONT_SIZE" }),
    toggleRadius: () => dispatch({ type: "TOGGLE_RADIUS" }),
  }), [dispatch]);

  // Memoize the read value to avoid new object refs on unrelated parent renders
  const readValue = useMemo(() => state, [state]);

  return (
    <ThemeReadContext.Provider value={readValue}>
      <ThemeDispatchContext.Provider value={stableDispatch}>
        {children}
      </ThemeDispatchContext.Provider>
    </ThemeReadContext.Provider>
  );
}

//  Custom hooks
function useTheme() {
  const ctx = useContext(ThemeReadContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

function useThemeDispatch() {
  const ctx = useContext(ThemeDispatchContext);
  if (!ctx) throw new Error("useThemeDispatch must be used within ThemeProvider");
  return ctx;
}

// Context Selector Optimization 
// Only re-renders when the *selected* slice changes
function useThemeSelector(selector) {
  const theme = useTheme();
  const prevRef = useRef();
  const selected = selector(theme);

  // Return stable reference if value hasn't changed
  if (prevRef.current !== undefined && JSON.stringify(prevRef.current) === JSON.stringify(selected)) {
    return prevRef.current;
  }
  prevRef.current = selected;
  return selected;
}

//  Render Counter 
function RenderBadge({ label }) {
  const count = useRef(0);
  count.current++;
  return (
    <span style={{
      fontSize: 11,
      background: "rgba(99,102,241,0.15)",
      color: "#818cf8",
      padding: "2px 8px",
      borderRadius: 99,
      fontWeight: 600,
      letterSpacing: 0.3,
    }}>
      {label}: {count.current} renders
    </span>
  );
}

//  Components 

// This component ONLY uses dispatch -> never re-renders on theme state changes
const ThemeSwitcher = memo(function ThemeSwitcher() {
  const { setTheme } = useThemeDispatch();
  const [active, setActive] = useState("light");

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Theme Switcher (dispatch only)</h3>
        <RenderBadge label="Switcher" />
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {Object.entries(themes).map(([key, t]) => (
          <button
            key={key}
            onClick={() => { setTheme(key); setActive(key); }}
            style={{
              flex: 1,
              minWidth: 70,
              padding: "10px 6px",
              border: active === key ? `2px solid ${t.primary}` : "2px solid transparent",
              borderRadius: 10,
              background: t.surface,
              color: t.text,
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 13,
              transition: "all 0.2s",
            }}
          >
            <span style={{
              display: "inline-block",
              width: 10, height: 10,
              borderRadius: 99,
              background: t.primary,
              marginRight: 6,
              verticalAlign: "middle",
            }} />
            {t.name}
          </button>
        ))}
      </div>
    </div>
  );
});

// This ONLY reads colors via selector -> re-renders only when colors change
const ColorPreview = memo(function ColorPreview() {
  const colors = useThemeSelector((t) => t.colors);

  const swatches = [
    ["bg", "Background"], ["surface", "Surface"], ["text", "Text"],
    ["primary", "Primary"], ["accent", "Accent"], ["success", "Success"],
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Color Palette (selector: colors)</h3>
        <RenderBadge label="Palette" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
        {swatches.map(([key, label]) => (
          <div key={key} style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "8px 10px", borderRadius: 8,
            background: "rgba(128,128,128,0.07)",
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 6,
              background: colors[key],
              border: "1px solid rgba(128,128,128,0.2)",
              flexShrink: 0,
            }} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{label}</div>
              <div style={{ fontSize: 10, opacity: 0.6, fontFamily: "monospace" }}>{colors[key]}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

// Reads fontSize only via selector
const FontSizeDisplay = memo(function FontSizeDisplay() {
  const fontSize = useThemeSelector((t) => t.fontSize);
  const { toggleFontSize } = useThemeDispatch();

  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "14px 16px", borderRadius: 10,
      background: "rgba(128,128,128,0.06)",
    }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600 }}>Font Size</div>
        <div style={{ fontSize: 12, opacity: 0.6 }}>selector: fontSize → "{fontSize}"</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <RenderBadge label="Font" />
        <button onClick={toggleFontSize} style={{
          padding: "6px 14px", borderRadius: 8, border: "none",
          background: "#6366f1", color: "#fff", cursor: "pointer",
          fontWeight: 600, fontSize: 13,
        }}>
          Toggle
        </button>
      </div>
    </div>
  );
});

// Reads borderRadius only
const BorderRadiusDisplay = memo(function BorderRadiusDisplay() {
  const radius = useThemeSelector((t) => t.borderRadius);
  const { toggleRadius } = useThemeDispatch();

  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "14px 16px", borderRadius: 10,
      background: "rgba(128,128,128,0.06)",
    }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600 }}>Border Radius</div>
        <div style={{ fontSize: 12, opacity: 0.6 }}>selector: borderRadius → "{radius}"</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <RenderBadge label="Radius" />
        <button onClick={toggleRadius} style={{
          padding: "6px 14px", borderRadius: 8, border: "none",
          background: "#6366f1", color: "#fff", cursor: "pointer",
          fontWeight: 600, fontSize: 13,
        }}>
          Toggle
        </button>
      </div>
    </div>
  );
});

// Full reader for the live preview
function LivePreview() {
  const theme = useTheme();
  const { colors: c, fontSize: fs, borderRadius: br } = theme;
  const rad = br === "rounded" ? 12 : 2;
  const size = fs === "large" ? 16 : 14;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Live Preview (full reader)</h3>
        <RenderBadge label="Preview" />
      </div>
      <div style={{
        background: c.bg, borderRadius: rad, padding: 20,
        border: `1px solid ${c.border}`, transition: "all 0.3s",
      }}>
        <h4 style={{ color: c.text, margin: "0 0 6px", fontSize: size + 2 }}>Card Title</h4>
        <p style={{ color: c.textMuted, margin: "0 0 14px", fontSize: size }}>
          This preview reacts to all theme changes: colors, font size, and border radius.
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{
            background: c.primary, color: c.primaryText,
            border: "none", padding: "8px 18px", borderRadius: rad,
            fontWeight: 600, fontSize: size - 1, cursor: "pointer",
          }}>Primary</button>
          <button style={{
            background: "transparent", color: c.primary,
            border: `1.5px solid ${c.primary}`, padding: "8px 18px", borderRadius: rad,
            fontWeight: 600, fontSize: size - 1, cursor: "pointer",
          }}>Secondary</button>
          <span style={{
            background: c.success + "22", color: c.success,
            padding: "8px 14px", borderRadius: rad,
            fontSize: size - 2, fontWeight: 600,
            display: "flex", alignItems: "center",
          }}>● Active</span>
        </div>
      </div>
    </div>
  );
}

// Architecture Diagram 
function ArchDiagram() {
  const c = useThemeSelector((t) => t.colors);
  return (
    <div style={{
      padding: 16, borderRadius: 10,
      background: "rgba(128,128,128,0.04)",
      border: "1px dashed rgba(128,128,128,0.2)",
    }}>
      <h3 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 600 }}>Context Architecture</h3>
      <div style={{ fontFamily: "monospace", fontSize: 12, lineHeight: 1.8 }}>
        <div>{"ThemeProvider"}</div>
        <div style={{ paddingLeft: 16 }}>├─ <span style={{ color: c.primary, fontWeight: 700 }}>ThemeReadContext</span> - state (memoized)</div>
        <div style={{ paddingLeft: 32 }}>├─ ColorPreview <span style={{ opacity: 0.5 }}>selector(colors)</span></div>
        <div style={{ paddingLeft: 32 }}>├─ FontSizeDisplay <span style={{ opacity: 0.5 }}>selector(fontSize)</span></div>
        <div style={{ paddingLeft: 32 }}>├─ BorderRadiusDisplay <span style={{ opacity: 0.5 }}>selector(borderRadius)</span></div>
        <div style={{ paddingLeft: 32 }}>└─ LivePreview <span style={{ opacity: 0.5 }}>full reader</span></div>
        <div style={{ paddingLeft: 16 }}>└─ <span style={{ color: c.accent, fontWeight: 700 }}>ThemeDispatchContext</span> - actions (stable ref)</div>
        <div style={{ paddingLeft: 32 }}>└─ ThemeSwitcher <span style={{ opacity: 0.5 }}>dispatch only — no read re-renders</span></div>
      </div>
    </div>
  );
}

// App Shell 
export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const { colors: c } = useTheme();

  return (
    <div style={{
      minHeight: "100vh",
      background: c.bg,
      color: c.text,
      padding: 24,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      transition: "background 0.3s, color 0.3s",
    }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>Theme Manager</h1>
          <p style={{ color: c.textMuted, margin: 0, fontSize: 13 }}>
            Split contexts · useMemo stability · Context selectors
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card c={c}><ThemeSwitcher /></Card>
          <Card c={c}><ColorPreview /></Card>
          <Card c={c}>
            <h3 style={{ margin: "0 0 10px", fontSize: 14, fontWeight: 600 }}>Selector Isolation</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <FontSizeDisplay />
              <BorderRadiusDisplay />
            </div>
            <p style={{ fontSize: 11, color: c.textMuted, margin: "10px 0 0" }}>
              Toggle each — watch how only the relevant render counter increments.
            </p>
          </Card>
          <Card c={c}><LivePreview /></Card>
          <Card c={c}><ArchDiagram /></Card>
        </div>
      </div>
    </div>
  );
}

function Card({ c, children }) {
  return (
    <div style={{
      background: c.surface,
      borderRadius: 12,
      padding: 20,
      border: `1px solid ${c.border}`,
      boxShadow: c.shadow,
      transition: "all 0.3s",
    }}>
      {children}
    </div>
  );
}