const test = require('node:test');
const assert = require('node:assert/strict');
const { validateMessages } = require('../chat-validation.cjs');

test('rejects missing and malformed payloads', () => {
  assert.equal(validateMessages(null).error, 'El cuerpo de la petición no es válido.');
  assert.equal(validateMessages({ messages: 'hello' }).error, 'La conversación enviada no tiene un formato válido.');
});

test('requires a non-empty user message', () => {
  assert.equal(validateMessages({ messages: [{ role: 'assistant', content: 'Hola' }] }).error, 'Escribe una pregunta para iniciar la conversación.');
  assert.equal(validateMessages({ messages: [{ role: 'user', content: '   ' }] }).error, 'Escribe una pregunta para iniciar la conversación.');
});

test('limits message count and content length and drops unsupported roles', () => {
  const messages = Array.from({ length: 14 }, (_, index) => ({ role: index === 13 ? 'user' : 'assistant', content: 'x'.repeat(3000) }));
  messages.push({ role: 'system', content: 'not forwarded' });
  const result = validateMessages({ messages });
  assert.equal(result.messages.length, 12);
  assert.equal(result.messages[11].role, 'user');
  assert.equal(result.messages[11].content.length, 2500);
  assert.ok(result.messages.every(message => message.role !== 'system'));
});
