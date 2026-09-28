import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync, readdirSync } from 'fs';
import { resolve, join } from 'path';

const rootDir = process.cwd();
const distDir = resolve(rootDir, 'dist');
const distHtmlPath = resolve(distDir, 'index.html');

function copyWellKnown() {
  const publicWellKnown = resolve(rootDir, 'public/.well-known');
  const distWellKnown = resolve(distDir, '.well-known');

  if (existsSync(publicWellKnown)) {
    if (!existsSync(distWellKnown)) {
      mkdirSync(distWellKnown, { recursive: true });
    }
    const files = readdirSync(publicWellKnown);
    for (const f of files) {
      copyFileSync(join(publicWellKnown, f), join(distWellKnown, f));
      console.log(`✅ Copied .well-known/${f} to dist/.well-known/${f}`);
    }
  }
}

function optimizeDist() {
  if (!existsSync(distHtmlPath)) {
    console.log('⚠️ dist/index.html not found, skipping post-build optimization.');
    return;
  }

  copyWellKnown();

  let html = readFileSync(distHtmlPath, 'utf8');

  // Convert render-blocking compiled CSS to high-performance non-blocking preload
  const cssRegex = /<link rel="stylesheet"[^>]*href="(\/assets\/index-[^"]+\.css)"[^>]*>/g;
  if (cssRegex.test(html)) {
    html = html.replace(cssRegex, (_match, cssPath) => {
      return `<link rel="preload" href="${cssPath}" as="style" onload="this.onload=null;this.rel='stylesheet'">`;
    });
    console.log('✅ Successfully transformed compiled CSS to non-render-blocking in dist/index.html');
  }

  writeFileSync(distHtmlPath, html, 'utf8');
}

optimizeDist();
