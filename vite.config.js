import { defineConfig, loadEnv } from 'vite';
import contactHandler from './api/contact.js';

export default defineConfig(({ mode }) => {
  // Load local server-only secrets from .env.local for the Vite dev API.
  for (const [key, value] of Object.entries(loadEnv(mode, process.cwd(), ''))) {
    if (process.env[key] === undefined) process.env[key] = value;
  }

  const attachContactApi = server => {
    // Match the full path before Vite's SPA fallback, for dev and preview.
    server.middlewares.use(async (req, res, next) => {
      if (new URL(req.url || '/', 'http://localhost').pathname !== '/api/contact') return next();
      const response = {
        status(code) { res.statusCode = code; return this; },
        json(payload) {
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify(payload));
        },
      };
      try { await contactHandler(req, response); }
      catch (error) { next(error); }
    });
  };

  return {
    plugins: [{
      name: 'local-contact-api',
      configureServer: attachContactApi,
      configurePreviewServer: attachContactApi,
    }],
  };
});
