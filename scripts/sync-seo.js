import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';

const rootDir = process.cwd();
const configPath = resolve(rootDir, 'firebase-applet-config.json');
const indexHtmlPath = resolve(rootDir, 'index.html');
const sitemapPath = resolve(rootDir, 'public/sitemap.xml');

async function syncSEO() {
  console.log('🔄 Starting SEO & Sitemap Synchronization with Firestore...');

  let posts = [];
  let siteConfig = null;

  if (existsSync(configPath)) {
    try {
      const config = JSON.parse(readFileSync(configPath, 'utf8'));
      const app = initializeApp(config);
      const db = config.firestoreDatabaseId ? getFirestore(app, config.firestoreDatabaseId) : getFirestore(app);

      // 1. Fetch site_config
      const configDoc = await getDoc(doc(db, 'site_config', 'main'));
      if (configDoc.exists()) {
        siteConfig = configDoc.data();
        console.log(`✅ Loaded siteConfig from Firestore. SEO Title: "${siteConfig.seoTitle || siteConfig.siteName}"`);
      }

      // 2. Fetch all posts
      const postsSnap = await getDocs(collection(db, 'posts'));
      posts = postsSnap.docs.map((d) => ({ ...d.data(), id: d.id }));
      console.log(`✅ Loaded ${posts.length} posts from Firestore.`);
    } catch (err) {
      console.warn('⚠️ Could not fetch from Firestore, falling back to local defaults:', err.message);
    }
  }

  if (posts.length === 0) {
    console.log('ℹ️ No Firestore posts found. Skipping static update.');
    return;
  }

  const cleanSnippet = (text) => {
    if (!text) return '';
    return text
      .replace(/\[[^\]]+\]/g, ' ')
      .replace(/\*\*/g, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/[\r\n\t]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // 1. Generate postMap dictionary for index.html inline script
  const postMapEntries = posts.map((post) => {
    const title = `${(post.title || '').replace(/'/g, "\\'")} | 오아시스`;
    let rawSummary = cleanSnippet(post.summary);
    if (rawSummary.length < 50 && post.content) {
      const cleanContent = cleanSnippet(post.content);
      rawSummary = (rawSummary ? `${rawSummary} - ` : '') + cleanContent;
    }
    const cleanDesc = rawSummary.slice(0, 160).replace(/'/g, "\\'");
    return `              '${post.id}': {\n                title: '${title}',\n                desc: '${cleanDesc}'\n              }`;
  }).join(',\n');

  // 2. Generate noscript HTML articles
  const noscriptArticles = posts.map((post) => {
    let rawSummary = cleanSnippet(post.summary);
    if (rawSummary.length < 60 && post.content) {
      const cleanContent = cleanSnippet(post.content);
      rawSummary = (rawSummary ? `${rawSummary} - ` : '') + cleanContent;
    }
    const cleanDesc = rawSummary.slice(0, 180);
    return `        <article style="margin-bottom: 24px;">\n          <h2><a href="https://oasis46.com/?post=${post.id}">${post.title}</a></h2>\n          <p>${cleanDesc}</p>\n        </article>`;
  }).join('\n');

  // 3. Update index.html
  if (existsSync(indexHtmlPath)) {
    let indexHtml = readFileSync(indexHtmlPath, 'utf8');

    // Update postMap in index.html
    const postMapRegex = /var postMap = \{[\s\S]*?\};/;
    const newPostMap = `var postMap = {\n${postMapEntries}\n            };`;
    if (postMapRegex.test(indexHtml)) {
      indexHtml = indexHtml.replace(postMapRegex, newPostMap);
    }

    const targetSiteName = (siteConfig && siteConfig.siteName) || '마닐라 오아시스에이전시';

    // Update noscript block (specifically target crawlable fallback in body, ensure only 1 H1 exists on page)
    const noscriptRegex = /<noscript id="seo-crawlable-fallback">[\s\S]*?<\/noscript>|<noscript>[\s\S]*?<\/main>\s*<\/noscript>/;
    const newNoscript = `<noscript id="seo-crawlable-fallback">\n      <main style="padding: 20px; font-family: sans-serif; max-width: 900px; margin: 0 auto;">\n        <h2 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 0.75rem;">${targetSiteName} | 오아시스 VIP 에이전시 공식 커뮤니티 및 가이드</h2>\n        <p>${targetSiteName} 공식 웹사이트 - 필리핀 마닐라 & 클락 최고급 카지노 VIP 정킷 에이전시 오아시스의 공식 안내, 멤버십 혜택, 호텔 프로모션 및 여행 가이드입니다.</p>\n        \n${noscriptArticles}\n      </main>\n    </noscript>`;
    if (noscriptRegex.test(indexHtml)) {
      indexHtml = indexHtml.replace(noscriptRegex, newNoscript);
    }

    // Ensure og:site_name matches targetSiteName
    const ogSiteNameRegex = /<meta property="og:site_name" content=".*?" \/>/;
    if (ogSiteNameRegex.test(indexHtml)) {
      indexHtml = indexHtml.replace(ogSiteNameRegex, `<meta property="og:site_name" content="${targetSiteName}" />`);
    }

    // If siteConfig has a custom seoTitle/seoDescription, ensure fallback in index.html is also updated
    if (siteConfig && siteConfig.seoTitle) {
      const titleRegex = /<title>.*?<\/title>/;
      indexHtml = indexHtml.replace(titleRegex, `<title>${siteConfig.seoTitle}</title>`);
      
      const ogTitleRegex = /<meta property="og:title" content=".*?" \/>/;
      indexHtml = indexHtml.replace(ogTitleRegex, `<meta property="og:title" content="${siteConfig.seoTitle}" />`);
    }

    if (siteConfig && siteConfig.seoDescription) {
      const descRegex = /<meta name="description" content=".*?" \/>/;
      indexHtml = indexHtml.replace(descRegex, `<meta name="description" content="${siteConfig.seoDescription}" />`);

      const ogDescRegex = /<meta property="og:description" content=".*?" \/>/;
      indexHtml = indexHtml.replace(ogDescRegex, `<meta property="og:description" content="${siteConfig.seoDescription}" />`);
    }

    writeFileSync(indexHtmlPath, indexHtml, 'utf8');
    console.log('✅ Updated index.html with all latest posts and SEO tags.');
  }

  // 4. Update public/sitemap.xml
  const todayStr = new Date().toISOString().split('T')[0];
  const sitemapUrls = [
    `  <!-- Main Home Page -->\n  <url>\n    <loc>https://oasis46.com/</loc>\n    <lastmod>${todayStr}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n    <image:image>\n      <image:loc>https://oasis46.com/logo.jpg</image:loc>\n      <image:title>오아시스 VIP 에이전시 공식 로고</image:title>\n    </image:image>\n  </url>`,
    `  <!-- Community Individual Posts (${posts.length} entries) -->`,
    ...posts.map((post) => {
      const postDate = post.date || todayStr;
      const thumb = post.thumbnail || 'https://oasis46.com/logo.jpg';
      const cleanTitle = (post.title || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      return `  <url>\n    <loc>https://oasis46.com/?post=${post.id}</loc>\n    <lastmod>${postDate}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n    <image:image>\n      <image:loc>${thumb.replace(/&/g, '&amp;')}</image:loc>\n      <image:title>${cleanTitle}</image:title>\n    </image:image>\n  </url>`;
    })
  ].join('\n\n');

  const fullSitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"\n        xmlns:xhtml="http://www.w3.org/1999/xhtml"\n        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${sitemapUrls}\n</urlset>\n`;

  writeFileSync(sitemapPath, fullSitemapXml, 'utf8');
  console.log(`✅ Successfully generated public/sitemap.xml with ${posts.length} dynamic posts.`);
}

syncSEO().then(() => {
  console.log('🎉 SEO sync completed successfully.');
  process.exit(0);
}).catch((e) => {
  console.error('❌ SEO sync error:', e);
  process.exit(1);
});
