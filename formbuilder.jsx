import { useState } from "react";
import "./styles.css";

const FIELD_TYPES = ["Text", "Email", "Number", "Textarea", "Dropdown", "Checkbox", "Radio"];

const defaultField = () => ({
  id: Date.now() + Math.random(),
  type: "Text",
  label: "",
  placeholder: "",
  required: false,
  options: "",
});

function FieldEditor({ field, onChange, onRemove, onMoveUp, onMoveDown, isFirst, isLast }) {
  const hasOptions = ["Dropdown", "Radio"].includes(field.type);
  return (
    <div className="field-card">
      <div className="field-card-header">
        <span className="field-type-badge">{field.type.toUpperCase()} FIELD</span>
        <button onClick={onMoveUp} disabled={isFirst} className="icon-btn">↑</button>
        <button onClick={onMoveDown} disabled={isLast} className="icon-btn">↓</button>
        <button onClick={onRemove} className="icon-btn danger">X</button>
      </div>

      <div className="field-grid">
        <div>
          <label className="field-label">Field Type</label>
          <select value={field.type} onChange={e => onChange({ ...field, type: e.target.value, options: "" })}>
            {FIELD_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label">Label</label>
          <input
            type="text"
            value={field.label}
            onChange={e => onChange({ ...field, label: e.target.value })}
            placeholder="e.g. Full Name"
          />
        </div>
      </div>

      {!["Checkbox"].includes(field.type) && (
        <div style={{ marginBottom: 12 }}>
          <label className="field-label">Placeholder</label>
          <input
            type="text"
            value={field.placeholder}
            onChange={e => onChange({ ...field, placeholder: e.target.value })}
            placeholder="Placeholder text"
          />
        </div>
      )}

      {hasOptions && (
        <div style={{ marginBottom: 12 }}>
          <label className="field-label">
            Options <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(comma-separated)</span>
          </label>
          <input
            type="text"
            value={field.options}
            onChange={e => onChange({ ...field, options: e.target.value })}
            placeholder="Option 1, Option 2, Option 3"
          />
        </div>
      )}

      <label className="required-toggle">
        <input
          type="checkbox"
          checked={field.required}
          onChange={e => onChange({ ...field, required: e.target.checked })}
        />
        Required field
      </label>
    </div>
  );
}

function PreviewField({ field }) {
  const opts = field.options ? field.options.split(",").map(o => o.trim()).filter(Boolean) : [];

  const label = (
    <label className="preview-field-label">
      {field.label || <span style={{ color: "#b8c0d0" }}>Untitled</span>}
      {field.required && <span className="required-star">*</span>}
    </label>
  );

  if (field.type === "Textarea") return (
    <div className="preview-field">
      {label}
      <textarea placeholder={field.placeholder} rows={3} />
    </div>
  );

  if (field.type === "Checkbox") return (
    <div className="preview-field" style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <input type="checkbox" id={`prev-${field.id}`} />
      <label htmlFor={`prev-${field.id}`} className="preview-field-label" style={{ margin: 0 }}>
        {field.label || <span style={{ color: "#b8c0d0" }}>Untitled</span>}
        {field.required && <span className="required-star">*</span>}
      </label>
    </div>
  );

  if (field.type === "Dropdown") return (
    <div className="preview-field">
      {label}
      <select>
        <option value="">{field.placeholder || "Select an option"}</option>
        {opts.map((o, i) => <option key={i}>{o}</option>)}
      </select>
    </div>
  );

  if (field.type === "Radio") return (
    <div className="preview-field">
      {label}
      {opts.length === 0
        ? <p style={{ fontSize: 12, color: "#b8c0d0", margin: 0 }}>No options added yet</p>
        : opts.map((o, i) => (
          <label key={i} className="required-toggle" style={{ marginBottom: 4 }}>
            <input type="radio" name={`radio-${field.id}`} />
            {o}
          </label>
        ))
      }
    </div>
  );

  return (
    <div className="preview-field">
      {label}
      <input type={field.type.toLowerCase()} placeholder={field.placeholder} />
    </div>
  );
}

export default function FormBuilder() {
  const [fields, setFields] = useState([{ ...defaultField(), label: "Full Name", placeholder: "Enter your name" }]);
  const [formTitle, setFormTitle] = useState("Untitled Form");
  const [tab, setTab] = useState("build");

  const addField = () => setFields(f => [...f, defaultField()]);
  const updateField = (id, updated) => setFields(f => f.map(x => x.id === id ? updated : x));
  const removeField = (id) => setFields(f => f.filter(x => x.id !== id));
  const moveField = (idx, dir) => {
    const n = [...fields];
    const [r] = n.splice(idx, 1);
    n.splice(idx + dir, 0, r);
    setFields(n);
  };

  return (
    <div className="form-builder">

      {/* Header */}
      <input
        className="form-title-input"
        value={formTitle}
        onChange={e => setFormTitle(e.target.value)}
      />

      {/* Tabs */}
      <div className="tabs">
        {["build", "preview"].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`tab-btn${tab === t ? " active" : ""}`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Build Tab */}
      {tab === "build" && (
        <div>
          {fields.length === 0 && (
            <div className="empty-state">No fields yet. Add one below.</div>
          )}
          {fields.map((field, idx) => (
            <FieldEditor
              key={field.id}
              field={field}
              onChange={updated => updateField(field.id, updated)}
              onRemove={() => removeField(field.id)}
              onMoveUp={() => moveField(idx, -1)}
              onMoveDown={() => moveField(idx, 1)}
              isFirst={idx === 0}
              isLast={idx === fields.length - 1}
            />
          ))}
          <button className="add-field-btn" onClick={addField}>+ Add Field</button>
        </div>
      )}

      {/* Preview Tab */}
      {tab === "preview" && (
        <div className="preview-panel">
          <h2 className="preview-form-title">{formTitle}</h2>
          {fields.length === 0
            ? <p style={{ color: "#b8c0d0", fontSize: 14 }}>No fields to preview. Go to Build to add some.</p>
            : fields.map(f => <PreviewField key={f.id} field={f} />)
          }
          {fields.length > 0 && <button className="submit-btn">Submit</button>}
        </div>
      )}

    </div>
  );
}