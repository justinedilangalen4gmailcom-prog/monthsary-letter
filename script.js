/* ============================================================
   ✏️  PERSONALIZE HERE — change these before sharing!
   ============================================================ */
const CONFIG = {
  to: "My Love",                 // her/his name or nickname
  from: "ACHICHING",             // your name
  // Date you two started (YYYY-MM-DD). Used for the live counter.
  // 31 months = 2 years and 7 months.
  startDate: "2024-03-22",
  paragraphs: [
    "Happy 31st monthsary, my love! I can't believe it has been thirty-one months since you first made my world a little brighter. Every month with you feels like a new chapter I never want to end.",
    "Thank you for staying through the sweet days and the hard ones. Thank you for your patience, your laughter, and the way you hold my hand like you never plan to let go. You turned ordinary days into memories I treasure.",
    "I love how safe I feel with you. I love how you listen, how you care, and how even a simple moment beside you feels like home. You make me want to be better every single day.",
    "I don't know what the future holds, but I know I want you in every part of it. Thirty-one months down, and I would choose you again for every month still to come.",
    "I love you more than words can say, today and always. 💕"
  ]
};
/* ============================================================ */

const $ = (id) => document.getElementById(id);
const envelope = $("envelope");
const envelopeWrap = $("envelopeWrap");
const letterWrap = $("letterWrap");
const bodyEl = $("body");
const musicPlayer = $("musicPlayer");

let typingToken = 0;      // lets us cancel an in-progress typing run
let skipRequested = false;

/* ---------- Floating hearts ---------- */
const heartChars = ["♥", "💖", "💕", "💗", "❤"];
function spawnHeart(burst = false) {
  const h = document.createElement("span");
  h.className = "heart";
  h.textContent = heartChars[Math.floor(Math.random() * heartChars.length)];
  const size = 14 + Math.random() * 26;
  h.style.left = (burst ? 35 + Math.random() * 30 : Math.random() * 100) + "vw";
  h.style.fontSize = size + "px";
  h.style.setProperty("--drift", (Math.random() * 160 - 80) + "px");
  h.style.setProperty("--spin", (Math.random() * 80 - 40) + "deg");
  const dur = 6 + Math.random() * 6;
  h.style.animationDuration = dur + "s";
  $("hearts").appendChild(h);
  setTimeout(() => h.remove(), dur * 1000 + 200);
}
setInterval(spawnHeart, 700);
for (let i = 0; i < 8; i++) setTimeout(spawnHeart, i * 150);

/* ---------- Open envelope ---------- */
function openEnvelope() {
  if (envelope.classList.contains("open")) return;
  envelope.classList.add("open");
  const videoId = "0rdvK_J_wkM";
  musicPlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&loop=1&playlist=${videoId}&playsinline=1`;
  for (let i = 0; i < 14; i++) setTimeout(() => spawnHeart(true), i * 60);
  setTimeout(() => {
    envelopeWrap.classList.add("gone");
    setTimeout(() => {
      envelopeWrap.style.display = "none";
      showLetter();
    }, 500);
  }, 900);
}
envelope.addEventListener("click", openEnvelope);
envelope.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openEnvelope(); }
});

/* ---------- Letter ---------- */
function showLetter() {
  letterWrap.style.display = "block";
  requestAnimationFrame(() => requestAnimationFrame(() => letterWrap.classList.add("show")));
  startLetter();
}

function formatDate(d) {
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function startLetter() {
  const myToken = ++typingToken;
  skipRequested = false;

  // reset
  bodyEl.innerHTML = "";
  $("signoff").classList.remove("show");
  $("counter").classList.remove("show");
  $("date").textContent = formatDate(new Date());
  $("greeting").textContent = "Dear " + CONFIG.to + ",";
  $("from").textContent = CONFIG.from;

  for (const text of CONFIG.paragraphs) {
    const p = document.createElement("p");
    bodyEl.appendChild(p);
    p.classList.add("cursor");

    for (let i = 0; i < text.length; i++) {
      if (myToken !== typingToken) return;
      if (skipRequested) { p.textContent = text; break; }
      p.textContent = text.slice(0, i + 1);
      const ch = text[i];
      await sleep(ch === "." || ch === "!" ? 260 : ch === "," ? 140 : 28);
    }
    p.classList.remove("cursor");
    if (!skipRequested) await sleep(350);
  }

  if (myToken !== typingToken) return;
  finishLetter();
}

function finishLetter() {
  // fill any unfinished paragraphs if skipped mid-way
  const done = bodyEl.querySelectorAll("p").length;
  if (done < CONFIG.paragraphs.length) {
    bodyEl.innerHTML = "";
    CONFIG.paragraphs.forEach((t) => {
      const p = document.createElement("p");
      p.textContent = t;
      bodyEl.appendChild(p);
    });
  }
  bodyEl.querySelectorAll(".cursor").forEach((el) => el.classList.remove("cursor"));
  $("signoff").classList.add("show");
  updateCounter();
  $("counter").classList.add("show");
  for (let i = 0; i < 16; i++) setTimeout(() => spawnHeart(true), i * 70);
}

/* ---------- Counter ---------- */
function updateCounter() {
  const start = new Date(CONFIG.startDate + "T00:00:00");
  const now = new Date();
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();
  if (days < 0) {
    months--;
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  if (months < 0) { years--; months += 12; }
  $("cYears").textContent = Math.max(years, 0);
  $("cMonths").textContent = Math.max(months, 0);
  $("cDays").textContent = Math.max(days, 0);
}

/* ---------- Buttons ---------- */
$("skipBtn").addEventListener("click", () => {
  skipRequested = true;
  typingToken++;           // stop the running loop
  finishLetter();
});
$("heartBtn").addEventListener("click", () => {
  for (let i = 0; i < 30; i++) setTimeout(() => spawnHeart(true), i * 50);
});
$("replayBtn").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  startLetter();
});
