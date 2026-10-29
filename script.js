// PERSONALIZE THESE THREE VALUES before sharing the website.
const CONFIG = {
  recipientName: "My Favorite Girl",
  senderName: "your person",
  birthdayMessage: "May your life be as lovely as the love you give to the world."
};

document.getElementById("heroName").textContent = CONFIG.recipientName;
document.getElementById("finalName").textContent = CONFIG.recipientName;
document.getElementById("senderName").textContent = CONFIG.senderName;

const screens = [...document.querySelectorAll(".screen")];
const dots = [...document.querySelectorAll(".progress-dot")];
let currentScreen = 0;

function showScreen(index) {
  currentScreen = index;
  screens.forEach((screen, i) => screen.classList.toggle("active", i === index));
  dots.forEach((dot, i) => dot.classList.toggle("current", i === index));
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (index === 6) makeConfetti();
}
document.querySelectorAll("[data-next]").forEach(button => {
  button.addEventListener("click", () => showScreen(Number(button.dataset.next)));
});

// Flower garden: every star tap adds a little blossom.
const blossoms = document.getElementById("blossoms");
let flowerCount = 0;
document.querySelectorAll(".tiny-star").forEach((star, index) => {
  star.addEventListener("click", () => {
    if (flowerCount >= 28) {
      document.getElementById("gardenHint").textContent = "Your garden is full of love. 🌸";
      return;
    }
    const flower = document.createElement("span");
    flower.className = "flower";
    const angle = (flowerCount * 137.5) * Math.PI / 180;
    const radius = 18 + (flowerCount % 5) * 15;
    flower.style.left = `${50 + Math.cos(angle) * radius * 0.8}%`;
    flower.style.top = `${35 + Math.sin(angle) * radius * 0.7}%`;
    flower.style.animationDelay = `${index * 0.04}s`;
    flower.style.filter = `hue-rotate(${(flowerCount * 17) % 50}deg)`;
    blossoms.appendChild(flower);
    flowerCount++;
    star.textContent = ["✦", "✧", "✷"][flowerCount % 3];
    document.getElementById("gardenHint").textContent = flowerCount < 5
      ? "A little more magic… keep tapping the stars."
      : "Look at that—love is growing everywhere. 🌸";
  });
});

// Candle interaction.
const candle = document.getElementById("candle");
const flame = document.getElementById("flame");
let candleLit = true;
candle.addEventListener("click", () => {
  candleLit = !candleLit;
  flame.classList.toggle("off", !candleLit);
  document.getElementById("candleHint").textContent = candleLit
    ? "Your wish is safe with the stars ✨"
    : "Wish made. May it find its way to you. ✨";
});

// Pop balloons with their own little messages.
document.querySelectorAll(".balloon").forEach(balloon => {
  balloon.addEventListener("click", () => {
    if (balloon.classList.contains("popped")) return;
    balloon.classList.add("popped");
    document.getElementById("balloonMessage").textContent = balloon.dataset.message;
    setTimeout(() => balloon.style.visibility = "hidden", 280);
  });
});

// Local photo picker. The chosen photo is displayed only in this browser session.
document.getElementById("photoUpload").addEventListener("change", event => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const img = document.getElementById("memoryPhoto");
    img.src = reader.result;
    img.hidden = false;
    document.getElementById("photoPlaceholder").hidden = true;
  };
  reader.readAsDataURL(file);
});

// Open the letter on tap.
const envelope = document.getElementById("openLetter");
envelope.addEventListener("click", () => {
  envelope.classList.add("open");
  document.getElementById("letter").classList.add("visible");
  document.getElementById("letterHint").textContent = "A few words from my heart, just for you.";
  envelope.setAttribute("aria-label", "Your letter is open");
});

// Finale confetti.
function makeConfetti() {
  const area = document.getElementById("confetti");
  if (area.childElementCount > 0) return;
  for (let i = 0; i < 75; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.animationDelay = `${Math.random() * 2.5}s`;
    piece.style.animationDuration = `${2.5 + Math.random() * 2.5}s`;
    piece.style.background = ["#ff9fbe", "#ffd88a", "#d7b8ff", "#a8f0df", "#fff1f5"][i % 5];
    piece.style.transform = `rotate(${Math.random() * 180}deg)`;
    area.appendChild(piece);
  }
}
document.getElementById("finalReveal").addEventListener("click", () => showScreen(6));
document.getElementById("replay").addEventListener("click", () => {
  flowerCount = 0;
  blossoms.innerHTML = "";
  document.querySelectorAll(".balloon").forEach(balloon => {
    balloon.classList.remove("popped");
    balloon.style.visibility = "visible";
  });
  document.getElementById("balloonMessage").textContent = "A little surprise is waiting inside each one.";
  candleLit = true;
  flame.classList.remove("off");
  envelope.classList.remove("open");
  document.getElementById("letter").classList.remove("visible");
  document.getElementById("letterHint").textContent = "Tap the envelope to open your letter.";
  document.getElementById("confetti").innerHTML = "";
  showScreen(0);
});

// Optional soft sound generated in-browser (no audio file or external track needed).
let audioContext = null;
let soundOn = false;
let soundTimer = null;
const soundButton = document.getElementById("soundToggle");
function playSoftNote() {
  if (!audioContext || !soundOn) return;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.type = "sine";
  osc.frequency.value = [523.25, 659.25, 783.99, 659.25][Math.floor(Math.random() * 4)];
  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.025, audioContext.currentTime + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 1.1);
  osc.connect(gain); gain.connect(audioContext.destination);
  osc.start(); osc.stop(audioContext.currentTime + 1.15);
}
soundButton.addEventListener("click", async () => {
  if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
  if (audioContext.state === "suspended") await audioContext.resume();
  soundOn = !soundOn;
  soundButton.querySelector("span").textContent = soundOn ? "Sound on" : "Sound off";
  soundButton.setAttribute("aria-label", soundOn ? "Turn soft sound off" : "Turn soft sound on");
  if (soundOn) {
    playSoftNote();
    soundTimer = setInterval(playSoftNote, 1800);
  } else {
    clearInterval(soundTimer);
  }
});
