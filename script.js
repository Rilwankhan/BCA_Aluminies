/* ============================================================
   BCA ALUMNI CONNECT — APP LOGIC
   Vanilla JS. All data lives in ALUMNI_DATA below so it can be
   swapped for a real API response later without touching the
   rendering functions.
   ============================================================ */

/* ---------------------------------------------------------------
   1. DATA
   --------------------------------------------------------------- */

// WhatsApp number the "Connect with Me" form sends requests to.
const DEPARTMENT_WHATSAPP_NUMBER = "918608865811";

// Alumni records. Replace this array with a fetch() call to a real
// backend later — every function below takes "a list of alumni
// objects" as input, so nothing else needs to change.
const ALUMNI_DATA = [
  {
    id: 1,
    name: "Kishore Kumaar A",
    photo: "https://ui-avatars.com/api/?name=Kishore+Kumar&background=1E4FD8&color=fff&size=200&font-size=0.36&bold=true",
    batch: "2018 - 2021",
    company: "DSM SOFT Trichy",
    position: "Software Engineer",
    careerPath: "Software Development",
    skills: [" Python", "JavaScript", "HTML", "CSS", "C#", "SQL", "VB.NET", "Flask API"],
    experience: "3 years",
    contactNumber: "919578570560",
    bio: "Started as a graduate trainee at TCS and now builds backend services for the retail banking team. Happy to guide juniors on service-based company interviews."
  },
  {
    id: 2,
    name: "Krishna kumar L",
    photo: "https://ui-avatars.com/api/?name=Krishna+Kumar&background=F2B100&color=1a1a1a&size=200&font-size=0.36&bold=true",
    batch: "2018 - 2021",
    company: "Zoho Corporation",
    position: "Product Analyst",
    careerPath: "Data Science",
    skills: ["Python", "Node.js", "SQL", "MS-Excel", "ETL", "ASP.net", "Javascript"],
    experience: "5 years",
    contactNumber: "918220343494",
    bio: "Moved from support engineering into product analytics at Zoho. Enjoys mentoring students who want to break into data roles without a core CS background."
  },
  {
    id: 3,
    name: "Naveen Raj",
    photo: "https://ui-avatars.com/api/?name=Naveen+Raj&background=0C2461&color=fff&size=200&font-size=0.36&bold=true",
    batch: "2018 - 2021",
    company: "Devquad software private limited Chennai ",
    position: "Back-End Developer",
    careerPath: "Java Developer",
    skills: ["Java", "Springboot", "Microservices", "MySQL", "Angular"],
    experience: "2.4 years",
    contactNumber: "916383005655",
    bio: "Self-taught frontend developer who landed at Freshworks straight out of college. Runs a small YouTube channel on web development basics."
  },
  {
    id: 4,
    name: "Alexander K",
    photo: "https://ui-avatars.com/api/?name=Alexander+K&background=1E4FD8&color=fff&size=200&font-size=0.36&bold=true",
    batch: "2018 - 2021",
    company: "Cognizant, chennai",
    position: "Engineer",
    careerPath: "Sr System engineer",
    skills: ["Incident management", "Technical support"],
    experience: "4 years",
    contactNumber: "919585509291",
    bio: "Cleared TNPSC Group II after two years of preparation alongside a private job. Guides juniors on balancing exam prep with work."
  },
  {
    id: 5,
    name: " Arun Kumar R ",
    photo: "https://ui-avatars.com/api/?name=Arun+Kumar+R&background=F2B100&color=1a1a1a&size=200&font-size=0.36&bold=true",
    batch: "2018 - 2021",
    company: "The Veeram groups of Company",
    position: "Founder",
    careerPath: "E-Commerce Websites",
    skills: ["E-commerce", "AI handling", "Web Application"],
    experience: "6 years",
    contactNumber: "919952155525",
    bio: "Left a stable IT job in year two to start a wholesale trading business. Open to talking to anyone considering entrepreneurship over placements."
  },
  {
    id: 6,
    name: "Sudharsan S",
    photo: "https://ui-avatars.com/api/?name=Sudharsan+S&background=0C2461&color=fff&size=200&font-size=0.36&bold=true",
    batch: "2021 - 2024",
    company: "Coimbatore Company",
    position: "Web developer",
    careerPath: "Technical Support",
    skills: ["Java", "C", "C++", "Python", "HTML", "CSS"],
    experience: "2 year",
    contactNumber: "917305004039",
    bio: "Went straight into MCA after BCA instead of placements. Happy to talk through the PG entrance exam process and university options."
  },
  {
    id: 7,
    name: "Alwin Raj V",
    photo: "https://ui-avatars.com/api/?name=Alwin+RajV&background=1E4FD8&color=fff&size=200&font-size=0.36&bold=true",
    batch: "2018 - 2021",
    company: "Coimbatore Rogan credit management ",
    position: "Human Resources Manager",
    careerPath: "Human Resource Management",
    skills: ["Recruitment ", "Digital marketing"],
    experience: "3 years",
    contactNumber: "919003399414",
    bio: "Leads a five-member backend team at Infosys after climbing up from a system engineer role. Actively mentors juniors preparing for off-campus drives."
  },
  {
    id: 8,
    name: "Venkat Kumar S",
    photo: "https://ui-avatars.com/api/?name=Venkat+KumarS&background=F2B100&color=1a1a1a&size=200&font-size=0.36&bold=true",
    batch: "2018 - 2021",
    company: "BIS Software Solutions",
    position: "Senior Associate ",
    careerPath: "Data Analyst",
    skills: ["Html", "CSS"],
    experience: "2.5 years",
    contactNumber: "918190801357",
    bio: "Transitioned from a support role into analytics within Cognizant. Can help with interview prep for analyst roles at service companies."
  },
  {
    id: 9,
    name: "Yogeshwaran",
    photo: "https://ui-avatars.com/api/?name=Yogesh+Waran&background=0C2461&color=fff&size=200&font-size=0.36&bold=true",
    batch: "2018 - 2021",
    company: "Sathya Agencies ",
    position: "Sales Executive ",
    careerPath: "Sales and Marketing",
    skills: ["Html", "CSS"],
    experience: "3 years",
    contactNumber: "917305273628",
    bio: "Intrusted in the sales and marketing field. Can help with interview prep for sales and marketing roles at service companies."
  },
  {
    id: 10,
    name: "Jayakandhan K M",
    photo: "https://ui-avatars.com/api/?name=Jayakandhan+KM&background=1E4FD8&color=fff&size=200&font-size=0.36&bold=true",
    batch: "2018 - 2021",
    company: "Malaria Hospital valaady",
    position: "Admin and Head of emergency department ",
    careerPath: "Quality Assurance",
    skills: ["Emergency care Paramedic"],
    experience: "4 years",
    contactNumber: "918270562733",
    bio: "Specialized in emergency care and paramedic services. Can provide guidance on healthcare administration and emergency response protocols."
  },
  {
    id: 11,
    name: "Abiyunksivabala M",
    photo: "https://ui-avatars.com/api/?name=Abiyunksivabala+M&background=F2B100&color=1a1a1a&size=200&font-size=0.36&bold=true",
    batch: "2018 - 2021",
    company: "Accenture ",
    position: "software developer ",
    careerPath: "UI UX Designer",
    skills: ["UI/UX"],
    experience: "1 years",
    contactNumber: "916369258192",
    bio: "Specialized in UI/UX design and front-end development. Can provide guidance on design principles, prototyping, and user experience best practices."
  },
  {
    id: 12,
    name: "Raju M",
    photo: "https://ui-avatars.com/api/?name=Raju+M&background=0C2461&color=fff&size=200&font-size=0.36&bold=true",
    batch: "2018 - 2021",
    company: "Woyage.ai",
    position: "Software Engineer QA",
    careerPath: "Software Testing",
    skills: ["playwright-Python", "Selenium-Java", "Postman", "Jira", "Testrail"],
    experience: "2 years",
    contactNumber: "919629113839",
    bio: "Specialized in software testing and quality assurance. Can provide guidance on test automation, test case design, and QA best practices."
  },
  {
    id: 13,
    name: "Santhosh S M",
    photo: "https://ui-avatars.com/api/?name=Santhosh+SM&background=1E4FD8&color=fff&size=200&font-size=0.36&bold=true",
    batch: "2018 - 2021",
    company: "HCLTech",
    position: "Senior cloud engineer",
    careerPath: "Cloud Computing",
    skills: ["AWS Cloud", "CI/CD", "DevOps", "Automation"],
    experience: "5 years",
    contactNumber: "917708402204",
    bio: "Specialized in cloud computing and infrastructure. Can provide guidance on cloud architecture, deployment, and management."
  },
  {
    id: 14,
    name: "Harthesh M ",
    photo: "https://ui-avatars.com/api/?name=Harsath+M&background=F2B100&color=1a1a1a&size=200&font-size=0.36&bold=true",
    batch: "2018 - 2021",
    company: "Chennai",
    position: "Developer (Frappe)",
    careerPath: "Full Stack Development",
    skills: ["Python"],
    experience: "2 years",
    contactNumber: "916383070720",
    bio: "Specialized in full stack development with a focus on Python and web frameworks. Can provide guidance on building scalable web applications and best practices in software development."
  },
  {
    id: 15,
    name: "Raju M",
    photo: "https://ui-avatars.com/api/?name=Raju+M&background=0C2461&color=fff&size=200&font-size=0.36&bold=true",
    batch: "2018 - 2021",
    company: "Japers Engineering and Automotive Services",
    position: "Software Developer",
    careerPath: "Software Development",
    skills: ["Python", "App Development"],
    experience: "2 years",
    contactNumber: "919677648585",
    bio: "Specialized in software development and application building. Can provide guidance on coding best practices, software design, and development methodologies."
  },
  {
    id: 16,
    name: "Sivanesan ",
    photo: "https://ui-avatars.com/api/?name=Sivanesan&background=1E4FD8&color=fff&size=200&font-size=0.36&bold=true",
    batch: "2018 - 2021",
    company: "HDFC Life ",
    position: "Business Analyst ",
    careerPath: "Data Analytics",
    skills: ["SQL", "Power BI", "Data Management"],
    experience: "3 years",
    contactNumber: "919894148874",
    bio: "Specialized in data analytics and business intelligence. Can provide guidance on data analysis, reporting, and decision-making."
  },
  {
    id: 17,
    name: "Aravind",
    photo: "https://ui-avatars.com/api/?name=Aravind&background=F2B100&color=1a1a1a&size=200&font-size=0.36&bold=true",
    batch: "2018 - 2021",
    company: "Chennai",
    position: "Senior Software Developer",
    careerPath: "Full Stack Development",
    skills: ["Angular Developer "],
    experience: "5 years",
    contactNumber: "918300266064",
    bio: "Specialized in full stack development with a focus on Angular. Can provide guidance on front-end frameworks, application architecture, and best practices in web development."
  },
  {
    id: 18,
    name: "Anirudh kumar",
    photo: "https://ui-avatars.com/api/?name=Anirudh+Kumar&background=0C2461&color=fff&size=200&font-size=0.36&bold=true",
    batch: "2018 - 2021",
    company: "Innoright solution",
    position: "Customer Success Lead",
    careerPath: "Software Development",
    skills: ["HTML", "css", "JavaScript", "DBMS", "Marketing & Sales", "Operation Management"],
    experience: "2 years",
    contactNumber: "916382779989",
    bio: "Specialized in software development and application building. Can provide guidance on coding best practices, software design, and development methodologies."
  },
  {
    id: 19,
    name: " Deepan P",
    photo: "https://ui-avatars.com/api/?name=Deepan+P&background=1E4FD8&color=fff&size=200&font-size=0.36&bold=true",
    batch: "2018 - 2021",
    company: "Conserve Solution, Trichy",
    position: "Global Digital Branding Executive",
    careerPath: "Data Analytics",
    skills: ["SEO", "AEC/BIM", "Data Maraketing", "Landing Page Development", "Linkdin Marketing", "Brand Positioning", "Creative Direction"],
    experience: "3 years",
    contactNumber: "918610772090",
    bio: "More that of a digital marketing professional who bridges marketing, content, branding, SEO, AI, and AEC/BIM domain expertise."
  },
  {
    id: 20,
    name: "Prabhu E",
    photo: "https://ui-avatars.com/api/?name=Prabhu+E&background=F2B100&color=1a1a1a&size=200&font-size=0.36&bold=true",
    batch: "2018 - 2021",
    company: "Brila opus paint",
    position: "PC",
    careerPath: "Management",
    skills: ["UI/UX"],
    experience: "2 years",
    contactNumber: "919500039194",
    bio: "Specialized in full stack development with a focus on Angular. Can provide guidance on front-end frameworks, application architecture, and best practices in web development."
  },
  {
    id: 21,
    name: "Gunasekaran U",
    photo: "https://ui-avatars.com/api/?name=Gunasekaran+U&background=0C2461&color=fff&size=200&font-size=0.36&bold=true",
    batch: "2018 - 2021",
    company: "Japers Engineering and Automotive Services",
    position: "Software Developer",
    careerPath: "Software Development",
    skills: ["Python", "App Development"],
    experience: "2 years",
    contactNumber: "919677648585",
    bio: "Specialized in software development and application building. Can provide guidance on coding best practices, software design, and development methodologies."
  },
];

// Rotating career tips — one is chosen at random every page load.
const CAREER_TIPS = [
  "Tailor your resume for every application — recruiters spend under 10 seconds on a first scan.",
  "A strong LinkedIn profile gets you noticed even before you apply. Keep it updated every semester.",
  "Build two or three solid projects instead of ten half-finished ones. Depth beats breadth in interviews.",
  "Practice explaining your projects out loud — most interview rejections come from poor communication, not poor code.",
  "Start preparing for aptitude tests early. Companies filter on this stage before they even look at your resume.",
  "Reach out to alumni before an interview at their company — insider context is worth more than any prep guide.",
  "Contribute to at least one open-source repository. It shows initiative that a resume line can't.",
  "Don't chase every technology at once. Pick a stack, go deep, and let breadth come with experience.",
  "Mock interviews matter more than mock tests. Get comfortable speaking under pressure before the real thing.",
  "Internships are auditions, not formalities. Treat every task like it could turn into a full-time offer."
];

// Department news items shown in the scrolling ticker.
const NEWS_ITEMS = [
  "Alumni Meet 2026 scheduled for August — registrations open soon",
  "12 students placed in the latest campus drive by Cognizant",
  "Guest lecture on Cloud Computing by a 2018 batch alumnus this Friday",
  "BCA final year project submissions due by end of this month",
  "New elective on Data Analytics introduced from the next semester",
  "Alumni mentorship program now open for Second and Third Year students"
];

/* ---------------------------------------------------------------
   2. STATE
   --------------------------------------------------------------- */

// Tracks the currently active filters so search + chip filtering
// can be combined instead of overwriting each other.
const appState = {
  searchQuery: "",
  activeCareerPath: "All"
};

// Remembers which alumnus is open in a modal so the Connect form
// knows who the request is about.
let activeAlumnusId = null;

/* ---------------------------------------------------------------
   3. INITIALISATION
   --------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", initApp);

function initApp() {
  document.getElementById("currentYear").textContent = new Date().getFullYear();

  renderHeroStats(ALUMNI_DATA);
  renderNewsTicker(NEWS_ITEMS);
  showRandomCareerTip();
  renderCareerChips(ALUMNI_DATA);
  renderAlumniCards(getFilteredAlumni());
  drawHeroNetwork();

  bindNavToggle();
  bindStickyNavShadow();
  bindSearch();
  bindTipRefresh();
  bindModalEvents();
  bindConnectForm();
}

/* ---------------------------------------------------------------
   4. HERO STATS
   --------------------------------------------------------------- */

function renderHeroStats(alumniList) {
  const companyCount = new Set(alumniList.map(a => a.company)).size;
  const stats = [
    { value: `${alumniList.length}+`, label: "Alumni Listed" },
    { value: `${companyCount}+`, label: "Companies" },
    { value: "2013-2025", label: "Batches Covered" }
  ];

  const container = document.getElementById("heroStats");
  container.innerHTML = stats
    .map(s => `<div class="hero-stat"><strong>${s.value}</strong><span>${s.label}</span></div>`)
    .join("");
}

/* ---------------------------------------------------------------
   5. NEWS TICKER
   --------------------------------------------------------------- */

function renderNewsTicker(newsList) {
  const track = document.getElementById("newsTrack");
  // Duplicate the list so the CSS marquee (which translates -50%)
  // loops seamlessly with no visible gap.
  const doubledList = [...newsList, ...newsList];
  track.innerHTML = doubledList.map(item => `<li>${item}</li>`).join("");
}

/* ---------------------------------------------------------------
   6. CAREER TIP OF THE DAY
   --------------------------------------------------------------- */

function showRandomCareerTip() {
  const randomIndex = Math.floor(Math.random() * CAREER_TIPS.length);
  document.getElementById("tipText").textContent = CAREER_TIPS[randomIndex];
}

function bindTipRefresh() {
  document.getElementById("tipRefresh").addEventListener("click", showRandomCareerTip);
}

/* ---------------------------------------------------------------
   7. CAREER PATH CHIPS (built from the data, not hardcoded)
   --------------------------------------------------------------- */

function renderCareerChips(alumniList) {
  const uniquePaths = ["All", ...new Set(alumniList.map(a => a.careerPath))];
  const chipRow = document.getElementById("chipRow");

  chipRow.innerHTML = uniquePaths
    .map(path => `<button class="chip${path === appState.activeCareerPath ? " active-chip" : ""}" data-path="${path}">${path}</button>`)
    .join("");

  chipRow.querySelectorAll(".chip").forEach(chip => {
    chip.addEventListener("click", () => handleChipClick(chip.dataset.path));
  });
}

function handleChipClick(path) {
  appState.activeCareerPath = path;
  document.querySelectorAll(".chip").forEach(chip => {
    chip.classList.toggle("active-chip", chip.dataset.path === path);
  });
  renderAlumniCards(getFilteredAlumni());
}

/* ---------------------------------------------------------------
   8. SEARCH (name, skills, company, position)
   --------------------------------------------------------------- */

function bindSearch() {
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");

  // Live search as the user types, lightly debounced.
  let debounceTimer;
  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      appState.searchQuery = searchInput.value.trim().toLowerCase();
      renderAlumniCards(getFilteredAlumni());
    }, 200);
  });

  // Also support explicit submit (Enter key / Search button).
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    appState.searchQuery = searchInput.value.trim().toLowerCase();
    renderAlumniCards(getFilteredAlumni());
    document.getElementById("alumni").scrollIntoView({ behavior: "smooth" });
  });
}

/**
 * Returns true if a single alumnus record matches the current
 * search query across name, skills, company and position.
 */
function alumnusMatchesSearch(alumnus, query) {
  if (!query) return true;
  const haystack = [
    alumnus.name,
    alumnus.company,
    alumnus.position,
    alumnus.careerPath,
    ...alumnus.skills
  ].join(" ").toLowerCase();
  return haystack.includes(query);
}

/**
 * Combines the active career-path chip and the search box into a
 * single filtered list. This is the single source of truth used
 * before every re-render of the grid.
 */
function getFilteredAlumni() {
  return ALUMNI_DATA.filter(alumnus => {
    const matchesPath =
      appState.activeCareerPath === "All" || alumnus.careerPath === appState.activeCareerPath;
    const matchesSearch = alumnusMatchesSearch(alumnus, appState.searchQuery);
    return matchesPath && matchesSearch;
  });
}

/* ---------------------------------------------------------------
   9. ALUMNI CARDS
   --------------------------------------------------------------- */

function renderAlumniCards(alumniList) {
  const grid = document.getElementById("alumniGrid");
  const emptyState = document.getElementById("emptyState");
  const resultCount = document.getElementById("resultCount");

  resultCount.textContent = `Showing ${alumniList.length} of ${ALUMNI_DATA.length} alumni`;

  if (alumniList.length === 0) {
    grid.innerHTML = "";
    emptyState.hidden = false;
    return;
  }
  emptyState.hidden = true;

  grid.innerHTML = alumniList.map(buildAlumniCardHTML).join("");

  // Attach button listeners after the cards exist in the DOM.
  grid.querySelectorAll(".profile-btn").forEach(btn => {
    btn.addEventListener("click", () => openProfileModal(Number(btn.dataset.id)));
  });
  grid.querySelectorAll(".connect-btn").forEach(btn => {
    btn.addEventListener("click", () => openConnectModal(Number(btn.dataset.id)));
  });
}

function buildAlumniCardHTML(alumnus) {
  const skillTags = alumnus.skills
    .slice(0, 3)
    .map((skill, index) => `<span class="skill-tag${index === 1 ? " gold-tag" : ""}">${skill}</span>`)
    .join("");

  return `
    <article class="alumni-card">
      <div class="card-photo-wrap">
        <img class="card-photo" src="${alumnus.photo}" alt="Photo of ${alumnus.name}" loading="lazy" />
      </div>
      <h3 class="card-name">${alumnus.name}</h3>
      <p class="card-batch">Batch ${alumnus.batch}</p>
      <p class="card-position">${alumnus.position}</p>
      <p class="card-company">${alumnus.company}</p>
      <div class="card-skills">${skillTags}</div>
      <div class="card-actions">
        <button class="card-btn profile-btn" data-id="${alumnus.id}">Profile</button>
        <button class="card-btn connect-btn" data-id="${alumnus.id}">Contact</button>
      </div>
    </article>
  `;
}

/* ---------------------------------------------------------------
   10. PROFILE MODAL
   --------------------------------------------------------------- */

function findAlumnusById(id) {
  return ALUMNI_DATA.find(alumnus => alumnus.id === id);
}

function openProfileModal(id) {
  const alumnus = findAlumnusById(id);
  if (!alumnus) return;

  activeAlumnusId = id;

  document.getElementById("profileModalPhoto").src = alumnus.photo;
  document.getElementById("profileModalPhoto").alt = `Photo of ${alumnus.name}`;
  document.getElementById("profileModalName").textContent = alumnus.name;
  document.getElementById("profileModalRole").textContent = `${alumnus.position} · ${alumnus.company}`;
  document.getElementById("profileModalBatch").textContent = alumnus.batch;
  document.getElementById("profileModalCompany").textContent = alumnus.company;
  document.getElementById("profileModalPosition").textContent = alumnus.position;
  document.getElementById("profileModalExperience").textContent = alumnus.experience;
  document.getElementById("profileModalBio").textContent = alumnus.bio;

  document.getElementById("profileModalSkills").innerHTML = alumnus.skills
    .map(skill => `<span class="skill-tag">${skill}</span>`)
    .join("");

  openModal("profileModalOverlay");
}

/* ---------------------------------------------------------------
   11. CONNECT MODAL + WHATSAPP INTEGRATION
   --------------------------------------------------------------- */

function openConnectModal(id) {
  const alumnus = findAlumnusById(id);
  if (!alumnus) return;

  activeAlumnusId = id;
  document.getElementById("connectAlumniName").textContent = alumnus.name;
  document.getElementById("connectForm").reset();
  openModal("connectModalOverlay");
}

function bindConnectForm() {
  // "Connect with Me" button inside the profile modal reuses the
  // alumnus currently open in that modal.
  document.getElementById("profileModalConnectBtn").addEventListener("click", () => {
    closeModal("profileModalOverlay");
    openConnectModal(activeAlumnusId);
  });

  document.getElementById("connectForm").addEventListener("submit", handleConnectSubmit);
}

function handleConnectSubmit(event) {
  event.preventDefault();

  const alumnus = findAlumnusById(activeAlumnusId);
  const formData = {
    name: document.getElementById("studentName").value.trim(),
    year: document.getElementById("studentYear").value,
    email: document.getElementById("studentEmail").value.trim(),
    reason: document.getElementById("studentReason").value.trim()
  };

  const contactNumber = alumnus?.contactNumber || DEPARTMENT_WHATSAPP_NUMBER;
  const whatsappMessage = buildWhatsAppMessage(formData, alumnus);
  openWhatsAppChat(whatsappMessage, contactNumber);

  closeModal("connectModalOverlay");
  showToast(`Request sent! Opening WhatsApp to reach ${alumnus ? alumnus.name : "the department"}…`);
}

/**
 * Builds the exact WhatsApp message text requested in the project
 * brief, filled in with the student's form answers.
 */
function buildWhatsAppMessage(formData, alumnus) {
  const greeting = alumnus 
    ? `Hello ${alumnus.name}, 👋` 
    : "Hello Sir/Madam, 👋";

  return (
    `${greeting}\n\n` +
    "📩 *BCA Student Request*\n\n" +
    `👤 *Name:* ${formData.name}\n` +
    `🎓 *Year:* ${formData.year}\n` +
    `📧 *Email ID:* ${formData.email}\n` +
    `📝 *Reason:* ${formData.reason}\n\n` +
    "🙏 Thank you for your time and support."
  );
}

/**
 * Opens WhatsApp Web / the WhatsApp app with a pre-filled message
 * to the department number.
 */
function openWhatsAppChat(message, phoneNumber = DEPARTMENT_WHATSAPP_NUMBER) {
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
  window.open(whatsappUrl, "_blank");
}

/* ---------------------------------------------------------------
   12. MODAL HELPERS (shared open/close + outside-click + Escape)
   --------------------------------------------------------------- */

function openModal(overlayId) {
  document.getElementById(overlayId).classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal(overlayId) {
  document.getElementById(overlayId).classList.remove("open");
  document.body.style.overflow = "";
}

function bindModalEvents() {
  const overlays = ["profileModalOverlay", "connectModalOverlay"];

  overlays.forEach(overlayId => {
    const overlay = document.getElementById(overlayId);
    // Click on the dark backdrop closes the modal.
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) closeModal(overlayId);
    });
  });

  document.getElementById("profileModalClose").addEventListener("click", () => closeModal("profileModalOverlay"));
  document.getElementById("connectModalClose").addEventListener("click", () => closeModal("connectModalOverlay"));

  // Escape key closes whichever modal is open.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      overlays.forEach(overlayId => closeModal(overlayId));
    }
  });
}

/* ---------------------------------------------------------------
   13. TOAST NOTIFICATIONS
   --------------------------------------------------------------- */

let toastTimer;
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3500);
}

/* ---------------------------------------------------------------
   14. NAV BEHAVIOUR (mobile toggle + sticky shadow on scroll)
   --------------------------------------------------------------- */

function bindNavToggle() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    toggle.classList.toggle("open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  links.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      links.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active-link"));
      link.classList.add("active-link");
      links.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function bindStickyNavShadow() {
  const nav = document.getElementById("mainNav");
  if (!nav) return;
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 10);
  });
}

/* ---------------------------------------------------------------
   15. HERO NETWORK VISUAL
   A lightweight generated SVG of connected nodes behind the hero
   text — a visual echo of "Alumni Connect" as an actual network.
   --------------------------------------------------------------- */

function drawHeroNetwork() {
  const container = document.getElementById("heroNetwork");
  const width = 900;
  const height = 380;
  const nodeCount = 14;

  const nodes = Array.from({ length: nodeCount }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: 2 + Math.random() * 3
  }));

  let linesSVG = "";
  let dotsSVG = "";

  nodes.forEach((node, i) => {
    // Connect each node to its nearest couple of neighbours only,
    // so the pattern reads as a network rather than a scribble.
    const distances = nodes
      .map((other, j) => ({ j, dist: Math.hypot(node.x - other.x, node.y - other.y) }))
      .filter(d => d.j !== i)
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 2);

    distances.forEach(({ j }) => {
      const other = nodes[j];
      linesSVG += `<line x1="${node.x}" y1="${node.y}" x2="${other.x}" y2="${other.y}" stroke="url(#lineGrad)" stroke-width="1" />`;
    });

    const isGold = i % 5 === 0;
    dotsSVG += `<circle cx="${node.x}" cy="${node.y}" r="${node.r}" fill="${isGold ? "#F2B100" : "#1E4FD8"}" opacity="0.7"><animate attributeName="opacity" values="0.35;0.8;0.35" dur="${3 + (i % 4)}s" repeatCount="indefinite" /></circle>`;
  });

  container.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#1E4FD8" stop-opacity="0.35" />
          <stop offset="1" stop-color="#F2B100" stop-opacity="0.15" />
        </linearGradient>
      </defs>
      ${linesSVG}
      ${dotsSVG}
    </svg>
  `;
}