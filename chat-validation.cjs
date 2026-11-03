const ALLOWED_ROLES = new Set(['user', 'assistant']);
const MAX_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 2500;

function validateMessages(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return { error: 'El cuerpo de la petición no es válido.' };
  if (!Array.isArray(payload.messages)) return { error: 'La conversación enviada no tiene un formato válido.' };
  const messages = payload.messages
    .filter(message => message && typeof message === 'object' && ALLOWED_ROLES.has(message.role) && typeof message.content === 'string')
    .map(message => ({ role: message.role, content: message.content.trim().slice(0, MAX_MESSAGE_LENGTH) }))
    .filter(message => message.content.length > 0)
    .slice(-MAX_MESSAGES);
  if (!messages.some(message => message.role === 'user')) return { error: 'Escribe una pregunta para iniciar la conversación.' };
  return { messages };
}
module.exports = { validateMessages };
