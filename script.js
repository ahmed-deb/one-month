/* =========================================================
   ✏️  EDIT YOUR LETTER HERE — each string is typed out as
   one paragraph, in order, with a pause between paragraphs.
   ========================================================= */
const LETTER_LINES = [
  "my love,",
  "it's been exactly one month since the day we met, and somehow it already feels like you've always been part of my life.",
  "every single day with you has been something i look forward to.",
  "i made this little page because i wanted to tell you, in my own way, something simple but true: i love you.",
  "here's to many more months, memories, and moments together. happy one month, my love.",
];
/* ========================================================= */

const TYPE_SPEED_MS = 32; // ms per character
const LINE_PAUSE_MS = 550; // pause between paragraphs
const LOADING_DURATION_MS = 1800; // how long the fake loading bar runs

// ---------- DOM refs ----------
const envelope = document.getElementById("pixel-envelope");
const stageEnvelope = document.getElementById("stage-envelope");
const stageLoading = document.getElementById("stage-loading");
const stageLetter = document.getElementById("stage-letter");
const progressFill = document.getElementById("progress-fill");
const loadingPercent = document.getElementById("loading-percent");
const letterText = document.getElementById("letter-text");
const typeCursor = document.getElementById("type-cursor");
const signature = document.getElementById("signature");
const closeBtn = document.getElementById("close-btn");
const statusMsg = document.getElementById("status-msg");
const heartsBg = document.getElementById("hearts-bg");

// ---------- Floating background hearts ----------
const heartSymbols = ["♥", "❤", "♡", "💕"];

function spawnHeart() {
  const heart = document.createElement("div");
  heart.classList.add("pixel-heart");
  heart.textContent =
    heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.fontSize = 14 + Math.random() * 18 + "px";
  heart.style.animationDuration = 7 + Math.random() * 6 + "s";
  heartsBg.appendChild(heart);
  setTimeout(() => heart.remove(), 14000);
}
setInterval(spawnHeart, 450);

// ---------- Stage switching ----------
function switchStage(hideEl, showEl) {
  hideEl.classList.remove("active-stage");
  showEl.classList.add("active-stage");
}

// ---------- Envelope click ----------
envelope.addEventListener("click", () => {
  envelope.classList.add("open");
  statusMsg.textContent = "OPENING...";

  setTimeout(() => {
    switchStage(stageEnvelope, stageLoading);
    runLoadingBar();
  }, 550);
});

// ---------- Fake loading bar ----------
function runLoadingBar() {
  statusMsg.textContent = "LOADING";
  let start = null;

  function step(timestamp) {
    if (!start) start = timestamp;
    const elapsed = timestamp - start;
    const pct = Math.min(
      100,
      Math.floor((elapsed / LOADING_DURATION_MS) * 100),
    );
    progressFill.style.width = pct + "%";
    loadingPercent.textContent = pct + "%";

    if (pct < 100) {
      requestAnimationFrame(step);
    } else {
      setTimeout(() => {
        switchStage(stageLoading, stageLetter);
        statusMsg.textContent = "LOVE.DAT LOADED";
        launchConfetti();
        typeLetter();
      }, 300);
    }
  }
  requestAnimationFrame(step);
}

// ---------- Typewriter effect ----------
function typeLetter() {
  letterText.innerHTML = "";
  let lineIndex = 0;
  let charIndex = 0;
  let currentP = document.createElement("p");
  currentP.style.marginBottom = "14px";
  letterText.appendChild(currentP);

  function typeChar() {
    if (lineIndex >= LETTER_LINES.length) {
      typeCursor.classList.add("hide");
      signature.classList.add("show");
      return;
    }

    const line = LETTER_LINES[lineIndex];

    if (charIndex < line.length) {
      currentP.textContent += line[charIndex];
      charIndex++;
      setTimeout(typeChar, TYPE_SPEED_MS);
    } else {
      lineIndex++;
      charIndex = 0;
      if (lineIndex < LETTER_LINES.length) {
        currentP = document.createElement("p");
        currentP.style.marginBottom = "14px";
        letterText.appendChild(currentP);
        setTimeout(typeChar, LINE_PAUSE_MS);
      } else {
        setTimeout(typeChar, LINE_PAUSE_MS);
      }
    }
  }

  typeChar();
}

// ---------- Pixel confetti burst ----------
function launchConfetti() {
  const colors = ["#ff2fb0", "#2ff9ff", "#9d4eff", "#fff94e", "#ffffff"];

  for (let i = 0; i < 80; i++) {
    const piece = document.createElement("div");
    piece.classList.add("confetti-piece");
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.boxShadow = `0 0 6px ${piece.style.background}`;
    const duration = 2 + Math.random() * 2.5;
    piece.style.animation = `confettiFall ${duration}s ease-in forwards`;
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), (duration + 0.5) * 1000);
  }
}

// Confetti fall keyframes (injected here so script.js is self-contained)
const styleTag = document.createElement("style");
styleTag.textContent = `
  @keyframes confettiFall {
    to { transform: translateY(115vh) rotate(720deg); opacity: 0.2; }
  }
`;
document.head.appendChild(styleTag);

// ---------- Close button: reset back to envelope ----------
closeBtn.addEventListener("click", () => {
  switchStage(stageLetter, stageEnvelope);
  envelope.classList.remove("open");
  progressFill.style.width = "0%";
  loadingPercent.textContent = "0%";
  typeCursor.classList.remove("hide");
  signature.classList.remove("show");
  letterText.innerHTML = "";
  statusMsg.textContent = "READY";
});
