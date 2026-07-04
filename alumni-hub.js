// alumni-hub.js — Main frontend logic wired to Firebase backend
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { db } from "./firebase-config.js";
import { registerAlumni, loginAlumni, logoutAlumni, forgotPassword, onAuthChange } from "./firebase-auth.js";
import {
  getPendingAlumni,
  approveAlumni,
  rejectAlumni,
  adminDeletePost,
  getDashboardStats
} from "./firebase-admin.js";

// ─── State ────────────────────────────────────────────────────────────────────
const state = {
  posts: [],
  activeFilter: "All",
  searchQuery: "",
  currentUser: null,       // Firebase Auth user
  userProfile: null,       // Firestore user document
  editingPostId: null
};

// Derived role helpers
const isVerifiedAlumni = () => state.userProfile?.verified === true && state.userProfile?.role === "alumni";
const isAdmin = () => state.userProfile?.role === "admin";
const canPublish = () => isVerifiedAlumni() || isAdmin();
const canManagePost = (post) => isAdmin() || (isVerifiedAlumni() && post.alumniId === state.currentUser?.uid);

// ─── Init ─────────────────────────────────────────────────────────────────────
function init() {
  document.getElementById("currentYear").textContent = new Date().getFullYear();
  bindEvents();
  listenToPosts();

  // Auth state drives all role-based UI
  onAuthChange((user, profile) => {
    state.currentUser = user;
    state.userProfile = profile;
    updateAuthUI();
    renderPosts();
  });
}

// ─── Deadline helpers ─────────────────────────────────────────────────────────
function isExpired(deadline) {
  if (!deadline) return false;
  // deadline is "YYYY-MM-DD"; compare against today at midnight local time
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(deadline + "T00:00:00");
  return due < today;
}

// ─── Firestore real-time listener ─────────────────────────────────────────────
function listenToPosts() {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  onSnapshot(q, (snap) => {
    const expired = [];
    state.posts = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((post) => {
        if (isExpired(post.deadline)) {
          expired.push(post.id);
          return false;
        }
        return true;
      });

    // Delete expired posts from Firestore silently
    expired.forEach((id) =>
      deleteDoc(doc(db, "posts", id)).catch((err) =>
        console.warn("Auto-delete failed for post", id, err)
      )
    );

    renderPosts();
  });
}

// ─── Render ───────────────────────────────────────────────────────────────────
function renderPosts() {
  const postsGrid = document.getElementById("postsGrid");
  const emptyState = document.getElementById("emptyState");
  const resultSummary = document.getElementById("resultSummary");

  const filtered = filterPosts(state.posts, state.activeFilter, state.searchQuery);
  const count = filtered.length;
  resultSummary.textContent = `${count} opportunit${count === 1 ? "y" : "ies"} shown`;

  if (!count) {
    postsGrid.innerHTML = "";
    emptyState.hidden = false;
    emptyState.querySelector("h4").textContent = state.posts.length === 0
      ? "No internships, jobs, or announcements have been posted yet."
      : "No posts match your search.";
    emptyState.querySelector("p").textContent = state.posts.length === 0
      ? "Check back soon — verified alumni will post opportunities here."
      : "Try another keyword or switch the filter.";
    return;
  }

  emptyState.hidden = true;
  postsGrid.innerHTML = filtered.map(createCard).join("");
  bindCardActions();
}

function filterPosts(posts, activeFilter, searchQuery) {
  const q = searchQuery.trim().toLowerCase();
  return posts.filter((post) => {
    const matchesFilter = activeFilter === "All" || post.category === activeFilter;
    const haystack = `${post.title} ${post.company} ${post.location} ${post.description}`.toLowerCase();
    return matchesFilter && (!q || haystack.includes(q));
  });
}

function createCard(post) {
  const initials = getInitials(post.company);
  const canManage = canManagePost(post);
  const logoHtml = post.logoUrl
    ? `<img class="post-logo" src="${post.logoUrl}" alt="${post.company} logo" loading="lazy" />`
    : `<div class="post-logo">${initials}</div>`;

  return `
    <article class="post-card">
      <div class="post-card-top">
        <span class="badge">${post.category}</span>
        ${logoHtml}
      </div>
      <h4 class="post-title">${escapeHtml(post.title)}</h4>
      <p class="post-company"><strong>${escapeHtml(post.company)}</strong></p>
      <p class="post-description">${escapeHtml(post.description)}</p>
      <div class="post-meta">
        <span>📍 ${escapeHtml(post.location)}</span>
        <span>🗓️ ${formatDate(post.deadline)}</span>
      </div>
      <p class="post-meta">Posted by ${escapeHtml(post.author)} · ${formatTimestamp(post.createdAt)}</p>
      <div class="post-actions-row">
        <a class="action-btn primary" href="${post.applyLink}" target="_blank" rel="noreferrer">Apply</a>
        <button class="action-btn" type="button" data-action="share" data-id="${post.id}">Share</button>
        <button class="action-btn" type="button" data-action="save" data-id="${post.id}">Save</button>
      </div>
      ${canManage ? `
      <div class="post-footer">
        <button class="action-btn" type="button" data-action="edit" data-id="${post.id}">Edit</button>
        <button class="action-btn" type="button" data-action="delete" data-id="${post.id}">Delete</button>
      </div>` : ""}
    </article>
  `;
}

// ─── Card action bindings ─────────────────────────────────────────────────────
function bindCardActions() {
  document.querySelectorAll("[data-action='share']").forEach((btn) =>
    btn.addEventListener("click", () => handleShare(btn.dataset.id))
  );
  document.querySelectorAll("[data-action='save']").forEach((btn) =>
    btn.addEventListener("click", () => { btn.textContent = "Saved"; btn.disabled = true; })
  );
  document.querySelectorAll("[data-action='delete']").forEach((btn) =>
    btn.addEventListener("click", () => handleDeletePost(btn.dataset.id))
  );
  document.querySelectorAll("[data-action='edit']").forEach((btn) =>
    btn.addEventListener("click", () => handleEditPost(btn.dataset.id))
  );
}

// ─── Post CRUD ────────────────────────────────────────────────────────────────
async function handleFormSubmit(event) {
  event.preventDefault();

  if (!canPublish()) {
    showFormError("Only verified alumni can publish opportunities.");
    return;
  }

  const formData = new FormData(event.target);
  const validationMsg = validateForm(formData);
  if (validationMsg) { showFormError(validationMsg); return; }

  const submitBtn = event.target.querySelector("[type='submit']");
  submitBtn.disabled = true;
  submitBtn.textContent = "Publishing…";

  try {
    const payload = {
      title: formData.get("title").trim(),
      description: formData.get("description").trim(),
      category: formData.get("category"),
      company: formData.get("company").trim(),
      location: formData.get("location").trim(),
      applyLink: formData.get("applyLink").trim(),
      deadline: formData.get("deadline"),
      author: state.userProfile?.name || "Alumni",
      alumniId: state.currentUser.uid,
      logoUrl: "",
      updatedAt: serverTimestamp()
    };

    if (state.editingPostId) {
      await updateDoc(doc(db, "posts", state.editingPostId), payload);
    } else {
      await addDoc(collection(db, "posts"), { ...payload, createdAt: serverTimestamp() });
    }

    closeModal();
  } catch (err) {
    showFormError("Failed to publish. Please try again.");
    console.error(err);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Publish Opportunity";
  }
}

async function handleDeletePost(postId) {
  if (!confirm("Delete this post? This cannot be undone.")) return;
  try {
    if (isAdmin()) {
      await adminDeletePost(postId);
    } else {
      await deleteDoc(doc(db, "posts", postId));
    }
  } catch (err) {
    alert("Failed to delete post.");
    console.error(err);
  }
}

function handleEditPost(postId) {
  const post = state.posts.find((p) => p.id === postId);
  if (!post) return;
  state.editingPostId = postId;
  document.getElementById("postId").value = postId;
  document.getElementById("title").value = post.title;
  document.getElementById("category").value = post.category;
  document.getElementById("company").value = post.company;
  document.getElementById("location").value = post.location;
  document.getElementById("description").value = post.description;
  document.getElementById("applyLink").value = post.applyLink;
  document.getElementById("deadline").value = post.deadline;
  openModal();
}

// ─── Auth UI ──────────────────────────────────────────────────────────────────
function updateAuthUI() {
  const badge = document.getElementById("currentRoleBadge");
  const fabBtn = document.getElementById("fabBtn");
  const roleToggleBtn = document.getElementById("roleToggleBtn");
  const authBtn = document.getElementById("authBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const adminPanelBtn = document.getElementById("adminPanelBtn");

  if (state.currentUser && state.userProfile) {
    const label = isAdmin() ? "Admin" : isVerifiedAlumni() ? "Verified Alumni" : "Alumni (Pending)";
    badge.textContent = `${label} View`;
    roleToggleBtn.style.display = "none";
    authBtn.textContent = state.userProfile.name || "Account";
    logoutBtn.hidden = false;
    adminPanelBtn.hidden = !isAdmin();
    fabBtn.hidden = !canPublish();
  } else {
    badge.textContent = "Student View";
    roleToggleBtn.style.display = "";
    authBtn.textContent = "Alumni Login";
    logoutBtn.hidden = true;
    adminPanelBtn.hidden = true;
    fabBtn.hidden = true;
  }
}

// ─── Auth Modal ───────────────────────────────────────────────────────────────
function openAuthModal(tab = "login") {
  document.getElementById("authError").textContent = "";
  switchAuthTab(tab);
  document.getElementById("authModalOverlay").classList.add("open");
}

function closeAuthModal() {
  document.getElementById("authModalOverlay").classList.remove("open");
  document.getElementById("authError").textContent = "";
}

function switchAuthTab(tab) {
  document.getElementById("loginForm").hidden = tab !== "login";
  document.getElementById("registerForm").hidden = tab !== "register";
  document.getElementById("forgotForm").hidden = tab !== "forgot";
  document.querySelectorAll(".auth-tab").forEach((t) =>
    t.classList.toggle("active", t.dataset.tab === tab)
  );
}

async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const btn = event.target.querySelector("button[type='submit']");
  btn.disabled = true;
  try {
    await loginAlumni(email, password);
    closeAuthModal();
  } catch (err) {
    showAuthError(friendlyAuthError(err.code));
  } finally {
    btn.disabled = false;
  }
}

async function handleRegister(event) {
  event.preventDefault();
  const f = event.target;
  const data = {
    name: f.regName.value.trim(),
    registerNo: f.regNo.value.trim(),
    graduationYear: f.gradYear.value.trim(),
    department: f.dept.value.trim(),
    company: f.regCompany.value.trim(),
    designation: f.designation.value.trim(),
    email: f.regEmail.value.trim(),
    password: f.regPassword.value
  };
  const btn = f.querySelector("button[type='submit']");
  btn.disabled = true;
  try {
    await registerAlumni(data);
    closeAuthModal();
    alert("Registration successful! Your account is pending admin approval before you can post.");
  } catch (err) {
    showAuthError(friendlyAuthError(err.code));
  } finally {
    btn.disabled = false;
  }
}

async function handleForgotPassword(event) {
  event.preventDefault();
  const email = document.getElementById("forgotEmail").value.trim();
  try {
    await forgotPassword(email);
    showAuthError("Password reset email sent. Check your inbox.", "success");
  } catch (err) {
    showAuthError(friendlyAuthError(err.code));
  }
}

function showAuthError(msg, type = "error") {
  const el = document.getElementById("authError");
  el.textContent = msg;
  el.style.color = type === "success" ? "#1a7a3c" : "#c33a3a";
}

function friendlyAuthError(code) {
  const map = {
    "auth/email-already-in-use": "This email is already registered.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
    "auth/invalid-credential": "Invalid email or password."
  };
  return map[code] || "Something went wrong. Please try again.";
}

// ─── Admin Panel ──────────────────────────────────────────────────────────────
async function openAdminPanel() {
  document.getElementById("adminPanelOverlay").classList.add("open");
  await refreshAdminPanel();
}

function closeAdminPanel() {
  document.getElementById("adminPanelOverlay").classList.remove("open");
}

async function refreshAdminPanel() {
  const list = document.getElementById("pendingList");
  const statTotalPosts = document.getElementById("statTotalPosts");
  const statVerifiedAlumni = document.getElementById("statVerifiedAlumni");
  const statPending = document.getElementById("statPending");

  // Show loading state
  list.innerHTML = "<p style='color:var(--ink-soft)'>Loading…</p>";
  statTotalPosts.textContent = "…";
  statVerifiedAlumni.textContent = "…";
  statPending.textContent = "…";

  try {
    const [stats, pending] = await Promise.all([getDashboardStats(), getPendingAlumni()]);

    statTotalPosts.textContent = stats.totalPosts;
    statVerifiedAlumni.textContent = stats.verifiedAlumni;
    statPending.textContent = stats.pendingApprovals;

    if (!pending.length) {
      list.innerHTML = "<p style='color:var(--ink-soft)'>No pending approvals.</p>";
      return;
    }

    list.innerHTML = pending.map((a) => `
      <div class="pending-item">
        <div>
          <strong>${escapeHtml(a.name)}</strong> — ${escapeHtml(a.email)}<br/>
          <small>${escapeHtml(a.department)} | Batch ${escapeHtml(a.graduationYear)} | ${escapeHtml(a.company)}</small>
        </div>
        <div class="pending-actions">
          <button class="action-btn primary" data-approve="${a.uid}">Approve</button>
          <button class="action-btn" data-reject="${a.uid}">Reject</button>
        </div>
      </div>
    `).join("");

    list.querySelectorAll("[data-approve]").forEach((btn) =>
      btn.addEventListener("click", async () => {
        btn.disabled = true;
        btn.textContent = "Approving…";
        await approveAlumni(btn.dataset.approve);
        await refreshAdminPanel();
      })
    );
    list.querySelectorAll("[data-reject]").forEach((btn) =>
      btn.addEventListener("click", async () => {
        if (confirm("Reject and remove this alumni registration?")) {
          btn.disabled = true;
          btn.textContent = "Rejecting…";
          await rejectAlumni(btn.dataset.reject);
          await refreshAdminPanel();
        }
      })
    );
  } catch (err) {
    list.innerHTML = `<p style='color:#c33a3a'>Failed to load admin data. Check console for details.<br><small>${err.message}</small></p>`;
    statTotalPosts.textContent = "—";
    statVerifiedAlumni.textContent = "—";
    statPending.textContent = "—";
    console.error("Admin panel error:", err);
  }
}

// ─── Modal helpers ────────────────────────────────────────────────────────────
function openModal() {
  const overlay = document.getElementById("postModalOverlay");
  document.getElementById("modalTitle").textContent = state.editingPostId ? "Edit Opportunity" : "Create Opportunity";
  document.getElementById("postForm").reset();
  document.getElementById("formError").textContent = "";
  if (!state.editingPostId) document.getElementById("postId").value = "";
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("postModalOverlay").classList.remove("open");
  document.body.style.overflow = "";
  state.editingPostId = null;
  document.getElementById("postForm").reset();
  document.getElementById("formError").textContent = "";
}

function showFormError(msg) {
  document.getElementById("formError").textContent = msg;
}

// ─── Event bindings ───────────────────────────────────────────────────────────
function bindEvents() {
  document.getElementById("searchInput").addEventListener("input", (e) => {
    state.searchQuery = e.target.value;
    renderPosts();
  });

  document.querySelectorAll(".filter-pill").forEach((btn) =>
    btn.addEventListener("click", () => {
      state.activeFilter = btn.dataset.filter;
      document.querySelectorAll(".filter-pill").forEach((b) =>
        b.classList.toggle("active", b.dataset.filter === state.activeFilter)
      );
      renderPosts();
    })
  );

  document.getElementById("fabBtn").addEventListener("click", () => openModal());
  document.getElementById("closeModalBtn").addEventListener("click", closeModal);
  document.getElementById("cancelBtn").addEventListener("click", closeModal);
  document.getElementById("postModalOverlay").addEventListener("click", (e) => {
    if (e.target === document.getElementById("postModalOverlay")) closeModal();
  });
  document.getElementById("postForm").addEventListener("submit", handleFormSubmit);

  // Auth modal
  document.getElementById("authBtn").addEventListener("click", () => openAuthModal("login"));
  document.getElementById("closeAuthModalBtn").addEventListener("click", closeAuthModal);
  document.getElementById("authModalOverlay").addEventListener("click", (e) => {
    if (e.target === document.getElementById("authModalOverlay")) closeAuthModal();
  });
  document.querySelectorAll(".auth-tab").forEach((tab) =>
    tab.addEventListener("click", () => switchAuthTab(tab.dataset.tab))
  );
  document.getElementById("loginForm").addEventListener("submit", handleLogin);
  document.getElementById("registerForm").addEventListener("submit", handleRegister);
  document.getElementById("forgotForm").addEventListener("submit", handleForgotPassword);
  document.getElementById("logoutBtn").addEventListener("click", async () => {
    await logoutAlumni();
  });

  // Admin panel
  document.getElementById("adminPanelBtn").addEventListener("click", openAdminPanel);
  document.getElementById("closeAdminPanelBtn").addEventListener("click", closeAdminPanel);
  document.getElementById("adminPanelOverlay").addEventListener("click", (e) => {
    if (e.target === document.getElementById("adminPanelOverlay")) closeAdminPanel();
  });

  // Role toggle (for visitors/students who are not logged in — preview only)
  document.getElementById("roleToggleBtn").addEventListener("click", () => {
    if (!state.currentUser) openAuthModal("login");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { closeModal(); closeAuthModal(); closeAdminPanel(); }
  });
}

// ─── Utilities ────────────────────────────────────────────────────────────────
function validateForm(formData) {
  const fields = ["title", "category", "company", "location", "description", "applyLink", "deadline"];
  for (const f of fields) {
    if (!formData.get(f)?.trim()) return "Please complete all fields before publishing.";
  }
  if (!/^https?:\/\//i.test(formData.get("applyLink").trim())) {
    return "Please enter a valid application URL starting with http:// or https://";
  }
  return "";
}

function handleShare(postId) {
  const post = state.posts.find((p) => p.id === postId);
  if (!post) return;
  const text = `${post.title} — ${post.company}`;
  if (navigator.share) {
    navigator.share({ title: post.title, text, url: post.applyLink }).catch(() => {});
    return;
  }
  navigator.clipboard.writeText(`${text}\n${post.applyLink}`).catch(() => {});
}

function getInitials(text) {
  return String(text).split(" ").slice(0, 2).map((w) => w.charAt(0).toUpperCase()).join("");
}

function formatDate(value) {
  const d = new Date(value);
  return isNaN(d) ? value : new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(d);
}

function formatTimestamp(ts) {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(d);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

document.addEventListener("DOMContentLoaded", init);
