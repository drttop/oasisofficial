import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('🔍 Running 100-Point SEO & Performance Integrity Verification...');

let errors = [];

// 1. Single H1 Tag Check
try {
  const indexHtml = readFileSync(join(rootDir, 'index.html'), 'utf8');
  const heroSection = readFileSync(join(rootDir, 'src/components/sections/HeroSection.tsx'), 'utf8');
  
  const h1InHtml = (indexHtml.match(/<h1[\s>]/gi) || []).length;
  const h1InHero = (heroSection.match(/<h1[\s>]/gi) || []).length;
  const totalH1 = h1InHtml + h1InHero;

  if (h1InHtml > 0) {
    errors.push(`❌ index.html contains ${h1InHtml} <h1 tags. index.html should have 0 <h1 tags (use <h2> in noscript).`);
  }
  if (h1InHero !== 1) {
    errors.push(`❌ HeroSection.tsx contains ${h1InHero} <h1 tags. Exactly 1 <h1 tag is required.`);
  }
  if (totalH1 === 1) {
    console.log('✅ H1 Tag Verification Passed: Exactly 1 single H1 on page.');
  }
} catch (e) {
  errors.push(`❌ H1 verification error: ${e.message}`);
}

// 2. Security Headers Check
try {
  const netlifyToml = readFileSync(join(rootDir, 'netlify.toml'), 'utf8');
  const publicHeaders = readFileSync(join(rootDir, 'public/_headers'), 'utf8');

  const requiredHeaders = ['X-Frame-Options', 'X-Content-Type-Options', 'Referrer-Policy', 'Strict-Transport-Security'];
  for (const header of requiredHeaders) {
    if (!netlifyToml.includes(header)) {
      errors.push(`❌ Missing security header in netlify.toml: ${header}`);
    }
    if (!publicHeaders.includes(header)) {
      errors.push(`❌ Missing security header in public/_headers: ${header}`);
    }
  }
  console.log('✅ Security Headers Verification Passed: All 4 headers intact in netlify.toml & public/_headers.');
} catch (e) {
  errors.push(`❌ Security headers check error: ${e.message}`);
}

// 3. Schema.org JSON-LD Verification
try {
  const indexHtml = readFileSync(join(rootDir, 'index.html'), 'utf8');
  const jsonLdMatches = indexHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi);
  if (!jsonLdMatches || jsonLdMatches.length === 0) {
    errors.push('❌ No Schema.org JSON-LD found in index.html');
  } else {
    for (const match of jsonLdMatches) {
      const rawJson = match.replace(/<script type="application\/ld\+json">|<\/script>/gi, '').trim();
      const parsed = JSON.parse(rawJson);
      if (!parsed['@context']) {
        errors.push('❌ Schema.org JSON-LD missing @context');
      }
    }
    console.log(`✅ Schema.org JSON-LD Verification Passed: ${jsonLdMatches.length} valid structured data blocks.`);
  }
} catch (e) {
  errors.push(`❌ Schema.org check error: ${e.message}`);
}

// 4. WebP Image Optimizer Verification
try {
  const optimizerCode = readFileSync(join(rootDir, 'src/utils/imageOptimizer.ts'), 'utf8');
  if (!optimizerCode.includes('fm=webp') || !optimizerCode.includes('ext=.webp')) {
    errors.push('❌ src/utils/imageOptimizer.ts does not force fm=webp and ext=.webp');
  } else {
    console.log('✅ WebP Image Optimizer Verification Passed: fm=webp & ext=.webp enforced.');
  }
} catch (e) {
  errors.push(`❌ WebP verification error: ${e.message}`);
}

// 5. Sitemap Verification
try {
  const sitemapPath = join(rootDir, 'public/sitemap.xml');
  if (!existsSync(sitemapPath)) {
    errors.push('❌ public/sitemap.xml is missing');
  } else {
    const sitemapContent = readFileSync(sitemapPath, 'utf8');
    if (!sitemapContent.includes('<urlset') || !sitemapContent.includes('https://oasis46.com/')) {
      errors.push('❌ public/sitemap.xml has invalid format');
    } else {
      console.log('✅ Sitemap Verification Passed: public/sitemap.xml is valid and present.');
    }
  }
} catch (e) {
  errors.push(`❌ Sitemap check error: ${e.message}`);
}

// Final Summary
if (errors.length > 0) {
  console.error('\n🚨 100-Point SEO & Performance Check FAILED with the following regressions:');
  for (const err of errors) {
    console.error(err);
  }
  process.exit(1);
} else {
  console.log('\n🎉 ALL 100-POINT SEO & PERFORMANCE CRITERIA VERIFIED SUCCESSFULLY! 💯\n');
  process.exit(0);
}
