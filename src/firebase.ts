import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signOut,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  getDocs,
  query,
  orderBy,
  limit,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App & Services
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Test connection on boot per Firestore integration skill
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore client is offline or starting up.");
    }
  }
}
testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  totalSeconds: number;
  postTestCompleted: boolean;
  postTestScore?: number;
  latihanScore?: number;
  lastUpdated: string;
  createdAt: string;
}

export interface QuizAttempt {
  id?: string;
  userId: string;
  type: 'latihan' | 'post-test';
  score: number;
  maxScore: number;
  percentage: number;
  completedAt: string;
}

/**
 * Fetch or initialize a user's profile document in Firestore
 */
export async function getUserProfile(user: User): Promise<UserProfile> {
  const userDocRef = doc(db, 'users', user.uid);
  try {
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }

    // Default new profile
    const newProfile: UserProfile = {
      uid: user.uid,
      displayName: user.displayName || user.email?.split('@')[0] || 'Apprenant',
      email: user.email || '',
      totalSeconds: 0,
      postTestCompleted: false,
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    await setDoc(userDocRef, newProfile);
    return newProfile;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
  }
}

/**
 * Sync elapsed study timer to Firestore
 */
export async function syncUserStudyTime(uid: string, totalSeconds: number): Promise<void> {
  const userDocRef = doc(db, 'users', uid);
  try {
    await updateDoc(userDocRef, {
      totalSeconds,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    // If doc didn't exist yet, try setDoc with merge
    try {
      await setDoc(userDocRef, {
        totalSeconds,
        lastUpdated: new Date().toISOString()
      }, { merge: true });
    } catch (setErr) {
      handleFirestoreError(setErr, OperationType.UPDATE, `users/${uid}`);
    }
  }
}

/**
 * Save Post-Test final evaluation result
 */
export async function savePostTestResult(uid: string, score: number, maxScore: number = 20): Promise<void> {
  const userDocRef = doc(db, 'users', uid);
  const attemptRef = collection(db, 'users', uid, 'attempts');

  try {
    // Update user root status
    await setDoc(userDocRef, {
      postTestCompleted: true,
      postTestScore: score,
      lastUpdated: new Date().toISOString()
    }, { merge: true });

    // Record in attempts subcollection
    await addDoc(attemptRef, {
      userId: uid,
      type: 'post-test',
      score,
      maxScore,
      percentage: Math.round((score / maxScore) * 100),
      completedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${uid}`);
  }
}

/**
 * Save practice exercise (Latihan) score
 */
export async function saveLatihanResult(uid: string, score: number, maxScore: number = 20): Promise<void> {
  const userDocRef = doc(db, 'users', uid);
  const attemptRef = collection(db, 'users', uid, 'attempts');

  try {
    // Update best/recent latihan score in user profile
    await setDoc(userDocRef, {
      latihanScore: score,
      lastUpdated: new Date().toISOString()
    }, { merge: true });

    // Record in attempts subcollection
    await addDoc(attemptRef, {
      userId: uid,
      type: 'latihan',
      score,
      maxScore,
      percentage: Math.round((score / maxScore) * 100),
      completedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${uid}/attempts`);
  }
}

/**
 * Fetch attempts history for a user
 */
export async function getUserAttempts(uid: string): Promise<QuizAttempt[]> {
  const attemptsRef = collection(db, 'users', uid, 'attempts');
  try {
    const q = query(attemptsRef, orderBy('completedAt', 'desc'), limit(15));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as QuizAttempt[];
  } catch (error) {
    // Return empty list on failure rather than breaking the UI
    console.warn('Could not load attempts:', error);
    return [];
  }
}

// Authentication Wrappers
export async function loginWithEmail(email: string, pass: string) {
  return await signInWithEmailAndPassword(auth, email, pass);
}

export async function registerWithEmail(name: string, email: string, pass: string) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  if (name.trim()) {
    await updateProfile(userCredential.user, { displayName: name.trim() });
  }
  // Immediately initialize profile document
  await getUserProfile(userCredential.user);
  return userCredential;
}

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  await getUserProfile(userCredential.user);
  return userCredential;
}

export async function resetUserPassword(email: string) {
  return await sendPasswordResetEmail(auth, email);
}

export async function logoutUser() {
  return await signOut(auth);
}
