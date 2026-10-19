require('dotenv').config();

const express = require('express');
const { rateLimit } = require('express-rate-limit');
const OpenAI = require('openai');

const app = express();
const port = Number(process.env.API_PORT) || 3000;

app.use(express.json({ limit: '32kb' }));

const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    error: 'Has enviado varias consultas seguidas. Espera unos minutos e inténtalo de nuevo.'
  }
});

app.get('/api/health', (_request, response) => {
  response.json({ configured: Boolean(process.env.OPENAI_API_KEY) });
});

app.post('/api/chat', chatLimiter, async (request, response) => {
  const incomingMessages = request.body?.messages;

  if (!Array.isArray(incomingMessages)) {
    return response.status(400).json({
      error: 'La conversación enviada no tiene un formato válido.'
    });
  }

  const messages = incomingMessages
    .slice(-12)
    .filter(message =>
      ['user', 'assistant'].includes(message?.role) &&
      typeof message?.content === 'string'
    )
    .map(message => ({
      role: message.role,
      content: message.content.trim().slice(0, 2500)
    }))
    .filter(message => message.content.length > 0);

  if (!messages.some(message => message.role === 'user')) {
    return response.status(400).json({
      error: 'Escribe una pregunta para iniciar la conversación.'
    });
  }

  if (!process.env.OPENAI_API_KEY) {
    return response.status(503).json({
      error: 'Falta configurar OPENAI_API_KEY en el archivo .env del servidor.'
    });
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      instructions: [
        'Eres el asistente de OrientaLab, una aplicación de orientación laboral en España.',
        'Responde en español, con claridad, empatía y pasos prácticos.',
        'Ayuda sobre empleabilidad, formación, currículum, entrevistas y búsqueda de empleo.',
        'No prometas empleo ni presentes estimaciones como garantías.',
        'No solicites datos personales sensibles; recomienda compartir solo información necesaria.'
      ].join(' '),
      input: messages
    });

    return response.json({ reply: completion.output_text });
  } catch (error) {
    console.error('Error al consultar OpenAI:', error.status || error.message);
    return response.status(502).json({
      error: 'No se pudo obtener respuesta de la IA. Revisa la clave y el modelo configurados.'
    });
  }
});

app.listen(port, () => {
  console.log(`API de OrientaLab disponible en http://localhost:${port}`);
});