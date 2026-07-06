import React, { useState, useRef } from "react";

const C = {
  burdo: "#8D3147",
  beige: "#D3AD8A",
  oliva: "#A6B04B",
  amarillo: "#EBC92B",
  azul: "#A9B5CA",
  crema: "#F5ECD7",
  texto: "#3A2A2E",
};

const F = {
  titulo: "'Playfair Display', serif",
  body: "'Raleway', sans-serif",
};

const WHATSAPP_URL = "https://wa.me/549TUNUMERO?text=" +
  encodeURIComponent(
    "Hola Sandra! Me hice la auditoría gratuita de mi Instagram y quiero avanzar con la Asesoría Estratégica 1:1 💬"
  );

function ReferenceExample() {
  // Illustrative mockup (not a real screenshot) showing what to capture:
  // profile photo + bio + grid of first posts, all in one frame.
  return (
    <svg viewBox="0 0 260 180" width="130" height="90" style={{ display: "block" }}>
      <rect x="0" y="0" width="260" height="180" rx="14" fill="#fff" stroke={C.beige} strokeWidth="2" />
      <circle cx="40" cy="38" r="18" fill={C.beige} />
      <rect x="70" y="24" width="110" height="8" rx="4" fill={C.burdo} opacity="0.8" />
      <rect x="70" y="38" width="80" height="6" rx="3" fill={C.azul} opacity="0.7" />
      <rect x="70" y="48" width="60" height="6" rx="3" fill={C.azul} opacity="0.5" />
      <rect x="14" y="70" width="232" height="1" fill={C.beige} />
      <rect x="14" y="84" width="72" height="72" rx="4" fill={C.oliva} opacity="0.35" />
      <rect x="94" y="84" width="72" height="72" rx="4" fill={C.oliva} opacity="0.55" />
      <rect x="174" y="84" width="72" height="72" rx="4" fill={C.oliva} opacity="0.75" />
    </svg>
  );
}

export default function App() {
  const [step, setStep] = useState("form"); // form | loading | result | error
  const [nombre, setNombre] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [rubro, setRubro] = useState("");
  const [image, setImage] = useState(null); // {file, url, b64}
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef(null);

  function handleFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const b64 = reader.result.split(",")[1];
      setImage({ file, url: reader.result, b64 });
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!nombre || !whatsapp || !rubro || !image) return;
    setStep("loading");
    setErrorMsg("");
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_b64: image.b64,
          image_type: image.file.type,
          nombre,
          rubro,
        }),
      });
      if (!response.ok) throw new Error("Error en el análisis");
      const data = await response.json();
      setResult(data);
      setStep("result");
    } catch (err) {
      setErrorMsg("Algo falló al analizar tu perfil. Probá de nuevo en un minuto.");
      setStep("error");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.crema,
        fontFamily: F.body,
        color: C.texto,
        display: "flex",
        justifyContent: "center",
        padding: "32px 16px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 480 }}>
        <Header />

        {step === "form" && (
          <Form
            nombre={nombre} setNombre={setNombre}
            whatsapp={whatsapp} setWhatsapp={setWhatsapp}
            rubro={rubro} setRubro={setRubro}
            image={image} handleFile={handleFile}
            fileInputRef={fileInputRef}
            onSubmit={handleSubmit}
          />
        )}

        {step === "loading" && <Loading />}

        {step === "error" && (
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <p style={{ color: C.burdo, fontWeight: 600 }}>{errorMsg}</p>
            <button onClick={() => setStep("form")} style={btnSecondary}>
              Volver a intentar
            </button>
          </div>
        )}

        {step === "result" && result && (
          <Result result={result} nombre={nombre} />
        )}
      </div>
    </div>
  );
}

function Header() {
  return (
    <div style={{ textAlign: "center", marginBottom: 28 }}>
      <div style={{ fontFamily: F.titulo, fontWeight: 800, fontSize: 26, color: C.burdo, letterSpacing: 0.3 }}>
        Auditoría de Instagram
      </div>
      <div style={{ fontSize: 14, color: C.texto, opacity: 0.75, marginTop: 4 }}>
        bio · foto de perfil · tus primeros 3 posts — análisis directo, sin vueltas.
      </div>
    </div>
  );
}

function Form({ nombre, setNombre, whatsapp, setWhatsapp, rubro, setRubro, image, handleFile, fileInputRef, onSubmit }) {
  const [dragOver, setDragOver] = useState(false);
  const canSubmit = nombre && whatsapp && rubro && image;

  return (
    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Field label="Tu nombre">
        <input style={input} value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej: Paula" required />
      </Field>
      <Field label="Tu WhatsApp">
        <input style={input} value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="Ej: 1155555555" required />
      </Field>
      <Field label="Rubro de tu negocio">
        <input style={input} value={rubro} onChange={e => setRubro(e.target.value)} placeholder="Ej: diseño de interiores" required />
      </Field>

      <Field label="Captura de tu perfil de Instagram completo (foto, bio y tus posts)">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <ReferenceExample />
          <div style={{ fontSize: 11.5, color: C.texto, opacity: 0.75, lineHeight: 1.4 }}>
            Así se ve una captura correcta ✅ — entrá a tu perfil, tomá una captura de pantalla que muestre tu foto, tu bio y el grid con tus primeros posts.
          </div>
        </div>
        <label
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
          style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
            border: `2px dashed ${dragOver ? C.oliva : C.beige}`,
            borderRadius: 16, padding: image ? 12 : 28,
            background: image ? "#fff" : "#fffdf8",
            cursor: "pointer", transition: "all 0.2s",
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={e => handleFile(e.target.files[0])}
          />
          {image ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%" }}>
              <img src={image.url} alt="captura" style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 10, border: `2px solid ${C.oliva}` }} />
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.oliva }}>✓ Captura cargada</div>
                <div style={{ fontSize: 11, color: C.beige, textDecoration: "underline" }}>Cambiar imagen</div>
              </div>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 28 }}>📱</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.burdo }}>Subí tu captura acá</div>
              <div style={{ fontSize: 11.5, color: C.beige }}>Tocá o arrastrá la imagen</div>
            </>
          )}
        </label>
      </Field>

      <button type="submit" disabled={!canSubmit} style={{ ...btnPrimary, opacity: canSubmit ? 1 : 0.5 }}>
        Auditar mi perfil →
      </button>
      <div style={{ fontSize: 10.5, color: C.texto, opacity: 0.55, textAlign: "center" }}>
        Es gratis. Tus datos se usan solo para enviarte el resultado y contactarte por WhatsApp.
      </div>
    </form>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: C.burdo, marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}

const input = {
  width: "100%", padding: "12px 14px", borderRadius: 10,
  border: `1.5px solid ${C.beige}`, fontSize: 14, fontFamily: F.body,
  background: "#fff", color: "#3A2A2E", outline: "none",
};

const btnPrimary = {
  padding: "14px 20px", borderRadius: 12, border: "none",
  background: C.burdo, color: "#fff", fontFamily: F.body,
  fontWeight: 700, fontSize: 15, cursor: "pointer",
};

const btnSecondary = {
  padding: "10px 18px", borderRadius: 10, border: `1.5px solid ${C.burdo}`,
  background: "transparent", color: C.burdo, fontFamily: F.body,
  fontWeight: 600, fontSize: 13, cursor: "pointer", marginTop: 12,
};

function Loading() {
  return (
    <div style={{ textAlign: "center", padding: "60px 0" }}>
      <div style={{ fontSize: 34, marginBottom: 12 }}>🔍</div>
      <div style={{ fontFamily: F.titulo, fontSize: 18, color: C.burdo, fontWeight: 700 }}>
        Analizando tu perfil...
      </div>
      <div style={{ fontSize: 13, color: C.texto, opacity: 0.7, marginTop: 6 }}>
        Bio, foto y tus primeros posts. Esto tarda unos segundos.
      </div>
    </div>
  );
}

const semaforoColor = { rojo: "#C0392B", amarillo: "#D4A017", verde: "#5A7D2A" };
const semaforoEmoji = { rojo: "🔴", amarillo: "🟡", verde: "🟢" };

function SeccionResultado({ titulo, estado, texto }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, padding: 16, marginBottom: 12, borderLeft: `4px solid ${semaforoColor[estado] || C.beige}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 15 }}>{semaforoEmoji[estado] || "⚪"}</span>
        <span style={{ fontFamily: F.titulo, fontWeight: 700, fontSize: 15, color: C.burdo }}>{titulo}</span>
      </div>
      <div style={{ fontSize: 13.5, lineHeight: 1.55, color: C.texto }}>{texto}</div>
    </div>
  );
}

function Result({ result, nombre }) {
  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <div style={{ fontFamily: F.titulo, fontSize: 20, fontWeight: 700, color: C.burdo }}>
          {nombre}, esto encontré en tu perfil
        </div>
      </div>

      <SeccionResultado titulo="Bio" estado={result.bio?.estado} texto={result.bio?.texto} />
      <SeccionResultado titulo="Foto de perfil" estado={result.foto?.estado} texto={result.foto?.texto} />
      <SeccionResultado titulo="Primeros 3 posts" estado={result.posts?.estado} texto={result.posts?.texto} />

      <div style={{ background: C.burdo, borderRadius: 14, padding: 18, marginTop: 16, color: "#fff" }}>
        <div style={{ fontFamily: F.titulo, fontWeight: 700, fontSize: 15, marginBottom: 6 }}>
          Lo prioritario
        </div>
        <div style={{ fontSize: 13.5, lineHeight: 1.55 }}>{result.prioridad}</div>
      </div>

      <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
        <button style={{ ...btnPrimary, width: "100%", marginTop: 16, background: C.oliva }}>
          Quiero mi Asesoría Estratégica 1:1 →
        </button>
      </a>
      <div style={{ fontSize: 11, textAlign: "center", color: C.texto, opacity: 0.6, marginTop: 8 }}>
        Sesión individual de 1 hora, con diagnóstico y plan de acción concreto.
      </div>
    </div>
  );
}
