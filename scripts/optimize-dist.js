import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const rootDir = process.cwd();
const distHtmlPath = resolve(rootDir, 'dist/index.html');

function optimizeDist() {
  if (!existsSync(distHtmlPath)) {
    console.log('⚠️ dist/index.html not found, skipping post-build optimization.');
    return;
  }

  let html = readFileSync(distHtmlPath, 'utf8');

  // Convert render-blocking compiled CSS to non-blocking with instant critical shell fallback
  // <link rel="stylesheet" crossorigin href="/assets/index-XXXX.css">
  const cssRegex = /<link rel="stylesheet"[^>]*href="(\/assets\/index-[^"]+\.css)"[^>]*>/g;
  if (cssRegex.test(html)) {
    html = html.replace(cssRegex, (match, cssPath) => {
      return `<link rel="preload" as="style" href="${cssPath}"><link rel="stylesheet" href="${cssPath}" media="print" onload="this.media='all'"><noscript><link rel="stylesheet" href="${cssPath}"></noscript>`;
    });
    console.log('✅ Successfully transformed compiled CSS to non-render-blocking in dist/index.html');
  }

  writeFileSync(distHtmlPath, html, 'utf8');
}

optimizeDist();
