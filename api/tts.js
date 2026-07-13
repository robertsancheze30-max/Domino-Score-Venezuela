// api/tts.js
// Endpoint serverless de Vercel: recibe { text } por POST y devuelve un audio MP3
// generado con tu voz clonada de ElevenLabs. La API key vive solo aquí (variable
// de entorno en Vercel), nunca se envía al navegador.

const VOICE_ID = "ReneYDUMahwTJa6wB5ED"; // tu voz clonada "Los Malucos"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Falta ELEVENLABS_API_KEY en las variables de entorno de Vercel" });
  }

  const { text } = req.body || {};
  if (!text || typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ error: "Falta 'text' en el body" });
  }

  try {
    const elevenRes = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text: text.slice(0, 2500), // límite de seguridad (subido de 800 a 2500 para que no corte frases combinadas largas)
          model_id: "eleven_turbo_v2_5",
          language_code: "es", // fuerza español (evita que "adivine" inglés)
          voice_settings: {
            stability: 0.55,       // un poco más variable = entonación más natural, menos "plano"
            similarity_boost: 0.85,
            style: 0.25,           // un poco más de expresividad, sin pasarse
            use_speaker_boost: true,
            // quitamos "speed" (podía generar cortes/artefactos raros en algunas frases)
          },
        }),
      }
    );

    if (!elevenRes.ok) {
      const errText = await elevenRes.text().catch(() => "");
      console.error("ElevenLabs error:", elevenRes.status, errText);
      return res.status(502).json({ error: "Error al generar audio con ElevenLabs" });
    }

    const arrayBuffer = await elevenRes.arrayBuffer();
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).send(Buffer.from(arrayBuffer));
  } catch (e) {
    console.error("Error en /api/tts:", e);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
