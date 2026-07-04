// firebase-admin.js — Admin: approve/reject alumni, delete any post, dashboard stats
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  getCountFromServer
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { db } from "./firebase-config.js";

/**
 * Fetch all alumni whose verified status is false (pending approval).
 */
export async function getPendingAlumni() {
  try {
    const q = query(collection(db, "users"), where("verified", "==", false), where("role", "==", "alumni"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error("getPendingAlumni failed:", err.code, err.message);
    throw err;
  }
}

/**
 * Approve an alumni by setting verified = true.
 */
export async function approveAlumni(uid) {
  await updateDoc(doc(db, "users", uid), { verified: true });
}

/**
 * Reject (delete) an alumni registration.
 * Removes the Firestore user document. Auth account remains but cannot post.
 */
export async function rejectAlumni(uid) {
  await deleteDoc(doc(db, "users", uid));
}

/**
 * Admin can delete any post regardless of ownership.
 */
export async function adminDeletePost(postId) {
  await deleteDoc(doc(db, "posts", postId));
}

/**
 * Fetch dashboard statistics: total posts, total alumni, pending approvals.
 */
export async function getDashboardStats() {
  try {
    const [postsSnap, alumniSnap, pendingSnap] = await Promise.all([
      getCountFromServer(collection(db, "posts")),
      getCountFromServer(query(collection(db, "users"), where("role", "==", "alumni"), where("verified", "==", true))),
      getCountFromServer(query(collection(db, "users"), where("role", "==", "alumni"), where("verified", "==", false)))
    ]);
    return {
      totalPosts: postsSnap.data().count,
      verifiedAlumni: alumniSnap.data().count,
      pendingApprovals: pendingSnap.data().count
    };
  } catch (err) {
    console.error("getDashboardStats failed:", err.code, err.message);
    throw err;
  }
}
