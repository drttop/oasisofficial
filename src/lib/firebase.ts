import type { FirebaseApp } from 'firebase/app';
import type { Firestore } from 'firebase/firestore';

export interface FirebaseBundle {
  app: FirebaseApp;
  db: Firestore;
  fs: typeof import('firebase/firestore');
}

let bundlePromise: Promise<FirebaseBundle> | null = null;
let cachedDb: Firestore | null = null;

/**
 * Lazy loads Firebase App, Firestore SDK, and configuration.
 * This completely isolates the ~400KB Firebase bundle from the critical rendering path,
 * drastically reducing Total Blocking Time (TBT) and optimizing mobile PageSpeed Insights.
 */
export const loadFirebase = async (): Promise<FirebaseBundle> => {
  if (bundlePromise) return bundlePromise;

  bundlePromise = (async () => {
    const [{ initializeApp }, fsModule, configModule] = await Promise.all([
      import('firebase/app'),
      import('firebase/firestore'),
      import('../../firebase-applet-config.json').then((m) => m.default || m),
    ]);

    const firebaseConfig = configModule;
    const app = initializeApp(firebaseConfig);
    const db = firebaseConfig.firestoreDatabaseId
      ? fsModule.getFirestore(app, firebaseConfig.firestoreDatabaseId)
      : fsModule.getFirestore(app);

    cachedDb = db;
    return { app, db, fs: fsModule };
  })();

  return bundlePromise;
};

export const getDb = async (): Promise<Firestore> => {
  if (cachedDb) return cachedDb;
  const { db } = await loadFirebase();
  return db;
};

export default loadFirebase;
