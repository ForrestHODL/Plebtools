import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

/** Match production .htaccess: /treasury → treasury.html */
function htmlExtensionFallback() {
  return {
    name: 'html-extension-fallback',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const raw = req.url ?? '';
        const q = raw.indexOf('?');
        const path = q === -1 ? raw : raw.slice(0, q);
        const query = q === -1 ? '' : raw.slice(q);

        if (!path || path === '/' || path.includes('.')) {
          next();
          return;
        }

        const slug = path.replace(/^\//, '').replace(/\/$/, '');
        const htmlPath = join(server.config.root, `${slug}.html`);
        if (slug && existsSync(htmlPath)) {
          req.url = `/${slug}.html${query}`;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  // Static HTML tools + one React page — not a SPA
  appType: 'mpa',
  plugins: [
    // Only transform JSX/TSX (Monte Carlo). Do not inject react-refresh into static HTML.
    react({ include: /\.(jsx|tsx)$/ }),
    htmlExtensionFallback(),
  ],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api/yahoo': {
        target: 'https://query1.finance.yahoo.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/yahoo/, ''),
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Plebtools/1.0)',
          Accept: 'application/json',
        },
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        'portfolio-monte-carlo': 'portfolio-monte-carlo.html',
      },
    },
  },
});
