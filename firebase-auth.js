// firebase-auth.js — Authentication: register, login, logout, forgot password, auth state
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { auth, db } from "./firebase-config.js";

/**
 * Register a new alumni account.
 * Creates Firebase Auth user + Firestore user document (verified = false).
 */
export async function registerAlumni({ name, registerNo, graduationYear, department, company, designation, email, password }) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = credential.user.uid;

  await setDoc(doc(db, "users", uid), {
    uid,
    name,
    registerNo,
    graduationYear,
    department,
    company,
    designation,
    email,
    role: "alumni",
    verified: false,
    createdAt: serverTimestamp()
  });

  return credential.user;
}

/**
 * Sign in an existing alumni with email and password.
 */
export async function loginAlumni(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

/**
 * Sign out the current user.
 */
export async function logoutAlumni() {
  await signOut(auth);
}

/**
 * Send a password reset email.
 */
export async function forgotPassword(email) {
  await sendPasswordResetEmail(auth, email);
}

/**
 * Fetch the Firestore user profile for a given uid.
 * Returns null if the document does not exist.
 */
export async function getUserProfile(uid) {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.error("getUserProfile failed — check Firestore rules:", err.code, err.message);
    return null;
  }
}

/**
 * Listen to auth state changes.
 * Calls callback(user, profile) where profile is the Firestore document or null.
 * profile.role === "admin" for admins, "alumni" for alumni.
 * profile.verified === true for approved alumni.
 */
export function onAuthChange(callback) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      callback(null, null);
      return;
    }
    let profile = await getUserProfile(user.uid);
    // Retry once if profile fetch returned null (transient Firestore issue)
    if (!profile) profile = await getUserProfile(user.uid);
    console.log("[Auth] uid:", user.uid, "| profile:", profile);
    callback(user, profile);
  });
}
