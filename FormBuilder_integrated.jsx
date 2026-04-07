import { useState, useReducer, useEffect, useCallback, useMemo, createContext, useContext, useRef, memo } from "react";


// CONSTANTS & HELPERS

const FIELD_TYPES = ["Text", "Email", "Number", "Textarea", "Dropdown", "Checkbox", "Radio"];
const STORAGE_KEY = "form-builder-schema";
const DEBOUNCE_MS = 500;
const genId = () => `f_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
const defaultField = () => ({ id: genId(), type: "Text", label: "", placeholder: "", required: false, options: "" });
const initialSchema = {
  title: "Untitled Form",
  fields: [{ ...defaultField(), label: "Full Name", placeholder: "Enter your name" }],
  _ver: 0,
};


// 1. REDUX-PATTERN REDUCER

function schemaReducer(state, action) {
  switch (action.type) {
    case "SET_TITLE":
      return { ...state, title: action.payload, _ver: state._ver + 1 };
    case "ADD_FIELD":
      return { ...state, fields: [...state.fields, defaultField()], _ver: state._ver + 1 };
    case "UPDATE_FIELD":
      return { ...state, fields: state.fields.map(f => f.id === action.payload.id ? action.payload : f), _ver: state._ver + 1 };
    case "REMOVE_FIELD":
      return { ...state, fields: state.fields.filter(f => f.id !== action.payload), _ver: state._ver + 1 };
    case "MOVE_FIELD": {
      const a = [...state.fields];
      const [item] = a.splice(action.payload.index, 1);
      a.splice(action.payload.index + action.payload.dir, 0, item);
      return { ...state, fields: a, _ver: state._ver + 1 };
    }
    case "LOAD":
      return { ...action.payload };
    default:
      return state;
  }
}

// 2. FOUR SPLIT CONTEXTS

const SchemaCtx = createContext(null);
const DispatchCtx = createContext(null);
const UICtx = createContext(null);
const RouterCtx = createContext(null);


// 3. HASH ROUTER

function useHashRouter() {
  const read = () => window.location.hash.replace("#", "") || "/";
  const [path, setPath] = useState(read);
  useEffect(() => {
    const h = () => setPath(read());
    window.addEventListener("hashchange", h);
    return () => window.removeEventListener("hashchange", h);
  }, []);
  const navigate = useCallback((p) => { window.location.hash = p; }, []);
  return useMemo(() => ({ path, navigate }), [path, navigate]);
}


// 4. PERSISTENCE — OPTIMISTIC + ROLLBACK
function usePersistentReducer() {
  const [schema, rawDispatch] = useReducer(schemaReducer, initialSchema);
  const rollbackRef = useRef(null);
  const timerRef = useRef(null);
  const hydratedRef = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get(STORAGE_KEY);
        if (r?.value) rawDispatch({ type: "LOAD", payload: { ...JSON.parse(r.value), _ver: 0 } });
      } catch (e) {}
      hydratedRef.current = true;
    })();
  }, []);

  const dispatch = useCallback((action) => {
    if (action.type === "LOAD") { rawDispatch(action); return; }
    rollbackRef.current = schema;
    rawDispatch(action);
  }, [schema]);

  useEffect(() => {
    if (!hydratedRef.current || schema._ver === 0) return;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      try {
        const { _ver, ...data } = schema;
        await window.storage.set(STORAGE_KEY, JSON.stringify(data));
      } catch (e) {
        if (rollbackRef.current) rawDispatch({ type: "LOAD", payload: rollbackRef.current });
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(timerRef.current);
  }, [schema._ver]);

  return [schema, dispatch];
}

// 5. MEMOIZED SELECTORS

function useField(id) {
  const s = useContext(SchemaCtx);
  return useMemo(() => s.fields.find(f => f.id === id), [s.fields, id]);
}
function useFieldIds() {
  const s = useContext(SchemaCtx);
  return useMemo(() => s.fields.map(f => f.id), [s.fields]);
}
function useTitle() {
  return useContext(SchemaCtx).title;
}


// CSS — derived from the provided stylesheet patterns

const css = `
  :root {
    --accent: #646cff;
    --accent-light: #747bff;
    --accent-bg: rgba(100, 108, 255, 0.08);
    --accent-border: rgba(100, 108, 255, 0.35);
    --text-h: #213547;
    --text: #4a5568;
    --text-muted: #8e99a4;
    --bg: #ffffff;
    --bg-card: #f9fafb;
    --border: #e2e8f0;
    --shadow: 0 2px 8px rgba(100, 108, 255, 0.12);
    --social-bg: #f1f5f9;
    --danger: #ef4444;
    --danger-bg: rgba(239, 68, 68, 0.08);
    --font: system-ui, -apple-system, sans-serif;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --accent: #747bff;
      --accent-light: #9198ff;
      --accent-bg: rgba(116, 123, 255, 0.1);
      --accent-border: rgba(116, 123, 255, 0.35);
      --text-h: #e2e8f0;
      --text: #a0aec0;
      --text-muted: #636e7b;
      --bg: #1a1a2e;
      --bg-card: #22223a;
      --border: #2d2d4a;
      --shadow: 0 2px 8px rgba(0,0,0,0.3);
      --social-bg: #2a2a42;
      --danger: #f87171;
      --danger-bg: rgba(248, 113, 113, 0.1);
    }
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .fb-shell {
    max-width: 700px;
    margin: 0 auto;
    font-family: var(--font);
    color: var(--text);
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  /* Center section (from #center) */
  .fb-center {
    display: flex;
    flex-direction: column;
    gap: 25px;
    place-content: center;
    flex-grow: 1;
    padding: 32px 20px 24px;
  }
  @media (max-width: 1024px) {
    .fb-center { padding: 24px 16px 20px; gap: 18px; }
  }

  /*  Title input (counter style) */
  .fb-title {
    font-size: 22px;
    font-weight: 600;
    padding: 8px 14px;
    border-radius: 8px;
    color: var(--text-h);
    background: var(--accent-bg);
    border: 2px solid transparent;
    transition: border-color 0.3s, box-shadow 0.3s;
    width: 100%;
    outline: none;
    font-family: var(--font);
  }
  .fb-title:hover { border-color: var(--accent-border); }
  .fb-title:focus { border-color: var(--accent); box-shadow: var(--shadow); }

  /*  Status bar (next-steps style border-top) */
  .fb-status-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--border);
    padding: 12px 0;
  }
  .fb-status-left { display: flex; align-items: center; gap: 12px; }
  .fb-field-count {
    font-size: 14px;
    color: var(--text-muted);
    padding: 4px 10px;
    border-radius: 5px;
    background: var(--social-bg);
  }
  .fb-save-dot {
    width: 7px; height: 7px; border-radius: 50%;
    display: inline-block; margin-right: 5px;
    transition: background 0.3s;
  }
  .fb-save-text { font-size: 12px; color: var(--text-muted); display: flex; align-items: center; }

  /*  Reset button (social link style)  */
  .fb-reset {
    font-size: 13px; color: var(--text-muted); background: var(--social-bg);
    border: none; border-radius: 6px; padding: 6px 12px; cursor: pointer;
    transition: box-shadow 0.3s;
    font-family: var(--font);
  }
  .fb-reset:hover { box-shadow: var(--shadow); }

  /* === Field card (counter + next-steps card hybrid) === */
  .fb-field-card {
    padding: 16px 18px;
    border-radius: 10px;
    background: var(--bg-card);
    border: 2px solid transparent;
    transition: border-color 0.3s, box-shadow 0.3s;
  }
  .fb-field-card:hover { border-color: var(--accent-border); }
  .fb-field-card.active { border-color: var(--accent); box-shadow: var(--shadow); }

  .fb-field-header { display: flex; gap: 8px; align-items: center; margin-bottom: 12px; }
  .fb-field-badge {
    font-size: 11px; font-weight: 600; letter-spacing: 0.5px;
    color: var(--accent); flex: 1;
  }

  /* == Icon buttons == */
  .fb-icon-btn {
    background: var(--social-bg); border: none; border-radius: 6px;
    cursor: pointer; padding: 4px 10px; font-size: 13px;
    color: var(--text-muted); transition: box-shadow 0.3s, color 0.2s;
    font-family: var(--font); line-height: 20px;
  }
  .fb-icon-btn:hover { box-shadow: var(--shadow); color: var(--text-h); }
  .fb-icon-btn:disabled { opacity: 0.35; cursor: default; box-shadow: none; }
  .fb-icon-btn.danger { color: var(--danger); background: var(--danger-bg); }
  .fb-icon-btn.danger:hover { box-shadow: 0 2px 8px rgba(239,68,68,0.15); }

  /* === Form inputs === */
  .fb-input, .fb-select {
    width: 100%; padding: 8px 12px; border-radius: 7px;
    border: 2px solid var(--border); background: var(--bg);
    color: var(--text-h); font-size: 13px; outline: none;
    transition: border-color 0.3s, box-shadow 0.3s;
    font-family: var(--font);
  }
  .fb-input:hover, .fb-select:hover { border-color: var(--accent-border); }
  .fb-input:focus, .fb-select:focus { border-color: var(--accent); box-shadow: var(--shadow); }
  .fb-input::placeholder { color: var(--text-muted); }

  .fb-label { display: block; font-size: 12px; font-weight: 600; margin-bottom: 5px; color: var(--text); letter-spacing: 0.3px; }
  .fb-label-hint { font-weight: 400; color: var(--text-muted); letter-spacing: 0; }
  .fb-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }

  .fb-required-toggle {
    display: flex; align-items: center; gap: 7px; font-size: 13px;
    color: var(--text); cursor: pointer; margin-top: 4px;
  }

  /* === Add field (dashed, social-bg hover) === */
  .fb-add-btn {
    width: 100%; padding: 12px; border: 2px dashed var(--border);
    border-radius: 10px; background: transparent; color: var(--text-muted);
    font-size: 13px; cursor: pointer; transition: border-color 0.3s, background 0.3s, color 0.3s;
    font-family: var(--font);
  }
  .fb-add-btn:hover { border-color: var(--accent-border); background: var(--accent-bg); color: var(--accent); }

  /* === Primary / secondary buttons (counter style) === */
  .fb-btn {
    padding: 9px 20px; border-radius: 8px; font-size: 14px; font-weight: 500;
    cursor: pointer; transition: box-shadow 0.3s, border-color 0.3s;
    font-family: var(--font); display: inline-flex; align-items: center; gap: 6px;
  }
  .fb-btn-primary {
    background: var(--accent); color: #fff; border: 2px solid transparent;
  }
  .fb-btn-primary:hover { box-shadow: var(--shadow); border-color: var(--accent-border); }
  .fb-btn-primary:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
  .fb-btn-secondary {
    background: transparent; color: var(--accent); border: 2px solid var(--accent-border);
  }
  .fb-btn-secondary:hover { box-shadow: var(--shadow); border-color: var(--accent); }

  /* === Preview container (next-steps / #docs style) === */
  .fb-preview-box {
    border: 1px solid var(--border); border-radius: 12px;
    padding: 28px; background: var(--bg-card);
  }
  .fb-preview-title { font-size: 18px; font-weight: 600; color: var(--text-h); margin-bottom: 22px; }
  .fb-preview-field { margin-bottom: 16px; }
  .fb-preview-label { display: block; font-size: 13px; font-weight: 500; margin-bottom: 6px; color: var(--text-h); }
  .fb-required-star { color: var(--danger); margin-left: 3px; }
  .fb-muted { color: var(--text-muted); }

  .fb-radio-option {
    display: flex; align-items: center; gap: 7px; font-size: 13px;
    margin-bottom: 5px; color: var(--text-h); cursor: pointer;
  }

  /* === Empty state === */
  .fb-empty { text-align: center; padding: 48px 20px; color: var(--text-muted); font-size: 14px; }

  /* === Bottom spacer (from #spacer) === */
  .fb-spacer { height: 48px; border-top: 1px solid var(--border); }

  /* === Ticks decorator (from .ticks) === */
  .fb-ticks {
    position: relative; width: 100%; height: 1px; background: var(--border); margin: 8px 0;
  }
  .fb-ticks::before, .fb-ticks::after {
    content: ''; position: absolute; top: -4px;
    border: 5px solid transparent;
  }
  .fb-ticks::before { left: 0; border-left-color: var(--border); }
  .fb-ticks::after { right: 0; border-right-color: var(--border); }
`;


// FIELD EDITOR (memoized with context selectors)

const FieldEditor = memo(function FieldEditor({ id, index, total }) {
  const field = useField(id);
  const dispatch = useContext(DispatchCtx);
  const { activeId, setActive } = useContext(UICtx);

  const onChange = useCallback((u) => dispatch({ type: "UPDATE_FIELD", payload: u }), [dispatch]);
  const onRemove = useCallback(() => dispatch({ type: "REMOVE_FIELD", payload: id }), [dispatch, id]);
  const onUp = useCallback(() => dispatch({ type: "MOVE_FIELD", payload: { index, dir: -1 } }), [dispatch, index]);
  const onDown = useCallback(() => dispatch({ type: "MOVE_FIELD", payload: { index, dir: 1 } }), [dispatch, index]);

  if (!field) return null;
  const hasOptions = ["Dropdown", "Radio"].includes(field.type);
  const active = activeId === id;

  return (
    <div onClick={() => setActive(id)} className={`fb-field-card${active ? " active" : ""}`}>
      <div className="fb-field-header">
        <span className="fb-field-badge">{field.type.toUpperCase()} FIELD</span>
        <button onClick={onUp} disabled={index === 0} className="fb-icon-btn">↑</button>
        <button onClick={onDown} disabled={index === total - 1} className="fb-icon-btn">↓</button>
        <button onClick={onRemove} className="fb-icon-btn danger">✕</button>
      </div>
      <div className="fb-grid">
        <div>
          <label className="fb-label">Field Type</label>
          <select value={field.type} onChange={e => onChange({ ...field, type: e.target.value, options: "" })} className="fb-select">
            {FIELD_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="fb-label">Label</label>
          <input value={field.label} onChange={e => onChange({ ...field, label: e.target.value })} placeholder="e.g. Full Name" className="fb-input" />
        </div>
      </div>
      {field.type !== "Checkbox" && (
        <div style={{ marginBottom: 12 }}>
          <label className="fb-label">Placeholder</label>
          <input value={field.placeholder} onChange={e => onChange({ ...field, placeholder: e.target.value })} placeholder="Placeholder text" className="fb-input" />
        </div>
      )}
      {hasOptions && (
        <div style={{ marginBottom: 12 }}>
          <label className="fb-label">Options <span className="fb-label-hint">(comma-separated)</span></label>
          <input value={field.options} onChange={e => onChange({ ...field, options: e.target.value })} placeholder="Option 1, Option 2, Option 3" className="fb-input" />
        </div>
      )}
      <label className="fb-required-toggle">
        <input type="checkbox" checked={field.required} onChange={e => onChange({ ...field, required: e.target.checked })} />
        Required field
      </label>
    </div>
  );
});


// PREVIEW FIELD (memoized)
const PreviewField = memo(function PreviewField({ id }) {
  const field = useField(id);
  if (!field) return null;

  const opts = field.options ? field.options.split(",").map(o => o.trim()).filter(Boolean) : [];
  const label = (
    <label className="fb-preview-label">
      {field.label || <span className="fb-muted">Untitled</span>}
      {field.required && <span className="fb-required-star">*</span>}
    </label>
  );

  if (field.type === "Textarea") return (
    <div className="fb-preview-field">{label}<textarea placeholder={field.placeholder} rows={3} className="fb-input" style={{ resize: "vertical" }} /></div>
  );
  if (field.type === "Checkbox") return (
    <div className="fb-preview-field" style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <input type="checkbox" id={`prev-${field.id}`} />
      <label htmlFor={`prev-${field.id}`} className="fb-preview-label" style={{ marginBottom: 0 }}>
        {field.label || <span className="fb-muted">Untitled</span>}
        {field.required && <span className="fb-required-star">*</span>}
      </label>
    </div>
  );
  if (field.type === "Dropdown") return (
    <div className="fb-preview-field">{label}
      <select className="fb-select"><option value="">{field.placeholder || "Select an option"}</option>{opts.map((o, i) => <option key={i}>{o}</option>)}</select>
    </div>
  );
  if (field.type === "Radio") return (
    <div className="fb-preview-field">{label}
      {opts.length === 0
        ? <p className="fb-muted" style={{ fontSize: 12 }}>No options added yet</p>
        : opts.map((o, i) => <label key={i} className="fb-radio-option"><input type="radio" name={`radio-${field.id}`} />{o}</label>)}
    </div>
  );
  return (
    <div className="fb-preview-field">{label}<input type={field.type.toLowerCase()} placeholder={field.placeholder} className="fb-input" /></div>
  );
});


// BUILD PAGE

const BuildPage = memo(function BuildPage() {
  const fieldIds = useFieldIds();
  const dispatch = useContext(DispatchCtx);
  const { navigate } = useContext(RouterCtx);
  const schema = useContext(SchemaCtx);

  const addField = useCallback(() => dispatch({ type: "ADD_FIELD" }), [dispatch]);
  const onTitleChange = useCallback((e) => dispatch({ type: "SET_TITLE", payload: e.target.value }), [dispatch]);

  return (
    <>
      <input className="fb-title" value={schema.title} onChange={onTitleChange} />
      <div className="fb-ticks" />
      {fieldIds.length === 0 && <div className="fb-empty">No fields yet. Add one below.</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {fieldIds.map((id, idx) => (
          <FieldEditor key={id} id={id} index={idx} total={fieldIds.length} />
        ))}
      </div>
      <button className="fb-add-btn" onClick={addField} style={{ marginTop: 12 }}>+ Add Field</button>
      {fieldIds.length > 0 && (
        <button className="fb-btn fb-btn-primary" style={{ marginTop: 16, alignSelf: "flex-start" }} onClick={() => navigate("/preview")}>
          Preview Form →
        </button>
      )}
    </>
  );
});

// PREVIEW PAGE

const PreviewPage = memo(function PreviewPage() {
  const fieldIds = useFieldIds();
  const title = useTitle();
  const { navigate } = useContext(RouterCtx);

  return (
    <>
      <button className="fb-btn fb-btn-secondary" onClick={() => navigate("/")} style={{ alignSelf: "flex-start" }}>
        ← Back to Editor
      </button>
      <div className="fb-preview-box">
        <h2 className="fb-preview-title">{title}</h2>
        {fieldIds.length === 0
          ? <p className="fb-muted" style={{ fontSize: 14 }}>No fields to preview. Go back to add some.</p>
          : fieldIds.map(id => <PreviewField key={id} id={id} />)}
        {fieldIds.length > 0 && (
          <button className="fb-btn fb-btn-primary" style={{ marginTop: 12 }}>Submit</button>
        )}
      </div>
    </>
  );
});


// SAVE STATUS

function SaveStatus({ ver }) {
  const [s, setS] = useState("saved");
  const prev = useRef(ver);
  useEffect(() => {
    if (ver !== prev.current) {
      prev.current = ver;
      setS("saving");
      const t = setTimeout(() => setS("saved"), DEBOUNCE_MS + 150);
      return () => clearTimeout(t);
    }
  }, [ver]);
  return (
    <span className="fb-save-text">
      <span className="fb-save-dot" style={{ background: s === "saving" ? "var(--accent)" : "#22c55e" }} />
      {s === "saving" ? "Saving…" : "Saved"}
    </span>
  );
}


// APP ROOT
export default function App() {
  const [schema, dispatch] = usePersistentReducer();
  const router = useHashRouter();
  const [activeId, setActive] = useState(null);

  const uiVal = useMemo(() => ({ activeId, setActive }), [activeId]);
  const routerVal = useMemo(() => router, [router]);

  const resetAll = useCallback(async () => {
    try { await window.storage.delete(STORAGE_KEY); } catch (e) {}
    dispatch({ type: "LOAD", payload: { ...initialSchema, _ver: 0 } });
  }, [dispatch]);

  const isPreview = router.path === "/preview";

  return (
    <RouterCtx.Provider value={routerVal}>
      <SchemaCtx.Provider value={schema}>
        <DispatchCtx.Provider value={dispatch}>
          <UICtx.Provider value={uiVal}>
            <style>{css}</style>
            <div className="fb-shell">
              <div className="fb-center">
                {/* Status bar */}
                <div className="fb-status-bar">
                  <div className="fb-status-left">
                    <span className="fb-field-count">
                      {schema.fields.length} field{schema.fields.length !== 1 ? "s" : ""}
                    </span>
                    <SaveStatus ver={schema._ver} />
                  </div>
                  <button className="fb-reset" onClick={resetAll}>Reset</button>
                </div>

                {/* Route switch */}
                {isPreview ? <PreviewPage /> : <BuildPage />}
              </div>

              {/* Bottom spacer with ticks */}
              <div className="fb-spacer" />
            </div>
          </UICtx.Provider>
        </DispatchCtx.Provider>
      </SchemaCtx.Provider>
    </RouterCtx.Provider>
  );
}