// Serveur local de développement : envoie les fichiers de public/ et répond au chat sur /api/chat.
// En ligne, le site est sur Azure Static Web Apps (public/ + la Function api/), ce fichier n'y est pas utilisé.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const PORT = process.env.PORT || 8080;
const PUBLIC_DIR = path.join(__dirname, 'public');
const { chat, clientIp } = require('./api/src/coeur');

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

async function handleChat(req, res) {
  let body = '';
  for await (const chunk of req) {
    body += chunk;
    if (body.length > 20_000) break;
  }
  const { status, body: reply } = await chat(body, clientIp(req.headers['x-forwarded-for'], req.socket.remoteAddress));
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(reply));
}

function serveStatic(req, res) {
  const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const file = path.join(PUBLIC_DIR, urlPath.endsWith('/') ? urlPath + 'index.html' : urlPath);
  if (!file.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end();
  }
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('404');
    }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
}

// Une seule adresse officielle : www et l'ancienne adresse Azure redirigent vers simondepussay.com
const MAIN_HOST = 'simondepussay.com';
const OLD_HOSTS = ['www.simondepussay.com', 'depussay22.azurewebsites.net'];

http
  .createServer((req, res) => {
    const host = (req.headers.host || '').toLowerCase();
    if (OLD_HOSTS.includes(host) && (req.method === 'GET' || req.method === 'HEAD')) {
      res.writeHead(301, { Location: `https://${MAIN_HOST}${req.url}` });
      return res.end();
    }
    if (req.url === '/api/chat' && req.method === 'POST') return handleChat(req, res);
    if (req.method === 'GET' || req.method === 'HEAD') return serveStatic(req, res);
    res.writeHead(405);
    res.end();
  })
  .listen(PORT, () => console.log(`Site sur http://localhost:${PORT}`));
