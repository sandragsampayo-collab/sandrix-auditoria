export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { image_b64, image_type, nombre, rubro } = req.body || {};

  if (!image_b64 || !nombre || !rubro) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  const SYSTEM_PROMPT = `Actuás como una Community Manager senior con años de experiencia gestionando cuentas de Instagram para negocios reales. Tu criterio está actualizado con cómo funciona el algoritmo de Instagram HOY (2026), no con reglas viejas de 2020. Aplicá estos criterios concretos:

1. BIO: ¿tiene palabras clave de nicho (SEO semántico, no genéricas)? ¿la propuesta de valor es clara en menos de 3 líneas? ¿hay un CTA o forma de contacto visible? ¿el nicho está definido con precisión (no "de todo un poco")?

2. FOTO DE PERFIL: ¿es clara, profesional y coherente con el rubro? ¿se ve bien en el círculo pequeño (poco detalle, buen contraste)? ¿transmite confianza para un negocio, no una foto casual sin criterio?

3. PRIMEROS 3 POSTS: esto es lo más importante. Evaluá:
   - ¿Parecen contenido original y editado por la cuenta, o reposts/capturas sin edición? (Instagram penaliza activamente el contenido no original en 2026, no solo lo deja de impulsar)
   - ¿El contenido invita a GUARDAR o COMPARTIR, o busca solo likes? (compartidos y guardados pesan mucho más que likes en el algoritmo actual)
   - ¿La portada/primera imagen engancha en los primeros segundos de scroll?
   - ¿Hay coherencia temática entre los 3 posts (nicho específico) o se ve disperso?

Sé directa, franca y con fundamento — nunca vagues ni le digas a la persona lo que quiere escuchar si el perfil tiene problemas reales. Cada observación debe tener una razón concreta, no una opinión genérica. El objetivo es que la persona entienda exactamente qué le está costando resultados, para que quiera resolverlo con ayuda profesional.

Tu negocio es: ${rubro}.

Respondé ÚNICAMENTE con un objeto JSON válido, sin texto antes ni después, sin backticks de markdown, con esta forma exacta:

{
  "bio": { "estado": "rojo|amarillo|verde", "texto": "2-3 frases directas, con fundamento" },
  "foto": { "estado": "rojo|amarillo|verde", "texto": "2-3 frases directas, con fundamento" },
  "posts": { "estado": "rojo|amarillo|verde", "texto": "2-3 frases directas, con fundamento" },
  "prioridad": "1-2 frases: la ÚNICA acción más urgente a resolver primero, concreta y accionable"
}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: image_type || "image/jpeg",
                  data: image_b64,
                },
              },
              {
                type: "text",
                text: `Esta es la captura del perfil de Instagram de ${nombre} (rubro: ${rubro}). Analizala siguiendo tus instrucciones y respondé solo con el JSON pedido.`,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    const textBlock = (data.content || []).find(b => b.type === "text");
    if (!textBlock) {
      return res.status(502).json({ error: "Sin respuesta del modelo" });
    }

    const clean = textBlock.text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return res.status(200).json(parsed);
  } catch (err) {
    console.error("Analyze error:", err);
    return res.status(500).json({ error: "Error al analizar el perfil" });
  }
}
