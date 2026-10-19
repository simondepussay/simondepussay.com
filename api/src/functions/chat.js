// POST /api/chat : Azure Function (fonctions gérées de Static Web Apps)
const { app } = require('@azure/functions');
const { chat, clientIp } = require('../coeur');

app.http('chat', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'chat',
  handler: async (request) => {
    const ip = clientIp(request.headers.get('x-forwarded-for'), request.headers.get('x-client-ip') || '');
    const { status, body } = await chat(await request.text(), ip);
    return { status, jsonBody: body };
  },
});
