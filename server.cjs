require('dotenv').config();

const express = require('express');
const { rateLimit } = require('express-rate-limit');
const OpenAI = require('openai');
const { validateMessages } = require('./chat-validation.cjs');

const app = express();
const port = Number(process.env.API_PORT) || 3000;
app.disable('x-powered-by');
app.use(express.json({ limit: '32kb', strict: true }));

const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Has enviado varias consultas seguidas. Espera unos minutos e inténtalo de nuevo.' }
});

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', aiConfigured: Boolean(process.env.OPENAI_API_KEY) });
});

app.post('/api/chat', chatLimiter, async (request, response) => {
  const validation = validateMessages(request.body);
  if (validation.error) return response.status(400).json({ error: validation.error });
  if (!process.env.OPENAI_API_KEY) {
    return response.status(503).json({ error: 'Falta configurar OPENAI_API_KEY en el entorno del servidor.' });
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 20000, maxRetries: 1 });
    const completion = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      instructions: [
        'Eres el asistente de FpMatch, una aplicación de orientación laboral en España.',
        'Responde en español, con claridad, empatía y pasos prácticos.',
        'Ayuda sobre empleabilidad, formación, currículum, entrevistas y búsqueda de empleo.',
        'No prometas empleo ni presentes estimaciones como garantías.',
        'No solicites datos personales sensibles; recomienda compartir solo información necesaria.'
      ].join(' '),
      input: validation.messages
    });
    const reply = completion.output_text;
    if (typeof reply !== 'string' || !reply.trim()) {
      return response.status(502).json({ error: 'La IA no devolvió una respuesta utilizable. Inténtalo de nuevo.' });
    }
    return response.json({ reply });
  } catch (error) {
    console.error('Error al consultar OpenAI:', error.status || error.name || 'unknown');
    return response.status(502).json({ error: 'No se pudo obtener respuesta de la IA. Revisa la configuración e inténtalo de nuevo.' });
  }
});

app.listen(port, () => console.log(`API de FpMatch disponible en http://localhost:${port}`));
