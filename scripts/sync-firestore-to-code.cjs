const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function syncFirestoreToCode() {
  console.log('[Sync] Starting Firestore -> Source Code sync...');

  const configPath = path.resolve('firebase-applet-config.json');
  const firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  const { initializeApp } = await import('firebase/app');
  const { getFirestore, doc, collection, getDocs, updateDoc } = await import('firebase/firestore');

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || 'app-database');

  // 1. Fetch deleted post IDs
  const deletedSnap = await getDocs(collection(db, 'deleted_posts'));
  const deletedIds = new Set(deletedSnap.docs.map((d) => d.id));
  console.log(`[Sync] Found ${deletedIds.size} deleted post tombstones:`, Array.from(deletedIds));

  // 2. Fetch all posts
  const postsSnap = await getDocs(collection(db, 'posts'));
  console.log(`[Sync] Found ${postsSnap.size} posts in Firestore`);

  const rawPosts = postsSnap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((p) => !deletedIds.has(p.id) && !p.isDeleted && !p.id.startsWith('notice-'));

  console.log(`[Sync] Active non-deleted posts count: ${rawPosts.length}`);

  // Ensure public/images/posts exists
  const postsImgDir = path.resolve('public/images/posts');
  fs.mkdirSync(postsImgDir, { recursive: true });

  const cleanPosts = [];

  for (const post of rawPosts) {
    let docChangedInFirestore = false;
    const cleanPost = { ...post };

    // Handle thumbnail
    if (cleanPost.thumbnail && cleanPost.thumbnail.startsWith('data:image/')) {
      const base64Data = cleanPost.thumbnail.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
      const buf = Buffer.from(base64Data, 'base64');
      const filename = `post_${post.id}_thumb.webp`;
      const filePath = path.join(postsImgDir, filename);

      await sharp(buf)
        .resize({ width: 720, withoutEnlargement: true })
        .webp({ quality: 85, effort: 4 })
        .toFile(filePath);

      cleanPost.thumbnail = `/images/posts/${filename}`;
      docChangedInFirestore = true;
      console.log(`[Sync] Converted thumbnail for ${post.id} -> ${cleanPost.thumbnail}`);
    }

    // Handle images array
    if (Array.isArray(cleanPost.images)) {
      const newImages = [];
      for (let i = 0; i < cleanPost.images.length; i++) {
        const img = cleanPost.images[i];
        if (img && img.startsWith('data:image/')) {
          const base64Data = img.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
          const buf = Buffer.from(base64Data, 'base64');
          const filename = `post_${post.id}_img_${i}.webp`;
          const filePath = path.join(postsImgDir, filename);

          await sharp(buf)
            .resize({ width: 1280, withoutEnlargement: true })
            .webp({ quality: 85, effort: 4 })
            .toFile(filePath);

          newImages.push(`/images/posts/${filename}`);
          docChangedInFirestore = true;
          console.log(`[Sync] Converted image[${i}] for ${post.id} -> /images/posts/${filename}`);
        } else {
          newImages.push(img);
        }
      }
      cleanPost.images = newImages;
    } else {
      cleanPost.images = cleanPost.thumbnail ? [cleanPost.thumbnail] : [];
    }

    // If Firestore document had base64, clean it up in Firestore too
    if (docChangedInFirestore) {
      try {
        await updateDoc(doc(db, 'posts', post.id), {
          thumbnail: cleanPost.thumbnail,
          images: cleanPost.images,
        });
        console.log(`[Sync] Updated Firestore document ${post.id} with clean image URLs`);
      } catch (err) {
        console.warn(`[Sync] Notice updating Firestore document ${post.id}:`, err.message);
      }
    }

    cleanPosts.push(cleanPost);
  }

  // 3. Sort posts: pinned first, then date desc, then createdAt desc
  cleanPosts.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    const dateComp = (b.date || '').localeCompare(a.date || '');
    if (dateComp !== 0) return dateComp;
    return (b.createdAt || 0) - (a.createdAt || 0);
  });

  // 4. Update src/data/initialData.ts
  const initialDataPath = path.resolve('src/data/initialData.ts');
  const fileContent = fs.readFileSync(initialDataPath, 'utf8');

  const startMarker = 'export const initialPosts: PostItem[] = [';
  const startIndex = fileContent.indexOf(startMarker);
  if (startIndex === -1) {
    throw new Error('Could not find start of initialPosts in src/data/initialData.ts');
  }

  // Find the closing bracket followed by semicolon for initialPosts
  // We can look for the next export, e.g. "export const initialInquiryLeads"
  const nextExportMarker = 'export const initialInquiryLeads: InquiryLead[] = [';
  const nextExportIndex = fileContent.indexOf(nextExportMarker, startIndex);
  if (nextExportIndex === -1) {
    throw new Error('Could not find next export after initialPosts in src/data/initialData.ts');
  }

  const postsJsonString = JSON.stringify(cleanPosts, null, 2);
  const updatedFileContent =
    fileContent.substring(0, startIndex) +
    `export const initialPosts: PostItem[] = ${postsJsonString};\n\n` +
    fileContent.substring(nextExportIndex);

  fs.writeFileSync(initialDataPath, updatedFileContent, 'utf8');
  console.log(`[Sync] src/data/initialData.ts updated successfully with ${cleanPosts.length} posts!`);

  process.exit(0);
}

syncFirestoreToCode().catch((err) => {
  console.error('[Sync] Error syncing:', err);
  process.exit(1);
});
