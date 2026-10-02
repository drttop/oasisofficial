import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs } from 'firebase/firestore';
import config from '../firebase-applet-config.json' with { type: 'json' };
import { initialPosts } from '../src/data/initialData';

const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

function sanitizeForFirestore(obj: any): any {
  if (obj === undefined) return null;
  if (Array.isArray(obj)) {
    return obj.map(sanitizeForFirestore).filter((v) => v !== undefined);
  }
  if (obj !== null && typeof obj === 'object') {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = sanitizeForFirestore(value);
      }
    }
    return cleaned;
  }
  return obj;
}

async function restoreAllPosts() {
  console.log(`Starting community posts and images restoration to Firestore database [${config.firestoreDatabaseId}]...`);
  console.log(`Total posts to restore: ${initialPosts.length}`);

  for (const post of initialPosts) {
    const cleanData = sanitizeForFirestore(post);
    const postRef = doc(db, 'posts', post.id);
    await setDoc(postRef, cleanData);
    console.log(`✓ Restored [${post.id}]: ${post.title} (thumbnail: ${post.thumbnail}, images count: ${post.images?.length || 0})`);
  }

  console.log('\nVerifying restored posts in Firestore:');
  const snap = await getDocs(collection(db, 'posts'));
  console.log(`Total posts now in Firestore: ${snap.size}`);
  snap.forEach((d) => {
    const data = d.data();
    console.log(`- ${d.id}: "${data.title.substring(0, 35)}..." [thumb: ${data.thumbnail}] [images: ${data.images?.length || 0}]`);
  });

  console.log('\nAll community posts and images successfully restored!');
  process.exit(0);
}

restoreAllPosts().catch((err) => {
  console.error('Restoration failed:', err);
  process.exit(1);
});
