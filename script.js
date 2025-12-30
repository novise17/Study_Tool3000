// --- VARIABLES ---
let cards = loadCards();
let dueCards = [];
let currentCardIndex = 0;
let quizMode = false;
let quizScore = 0;
let quizTotal = 0;

// --- SAVE & LOAD CARDS ---
function saveCards() {
  localStorage.setItem("cards", JSON.stringify(cards));
}

function loadCards() {
  const saved = localStorage.getItem("cards");
  if (saved) return JSON.parse(saved);

  return [
    { question: "What is a metaphor?", answer: "A comparison without using like or as", subject: "English Literature", interval: 1, due: Date.now() },
    { question: "What is the quadratic formula?", answer: "x = (-b ± √(b²-4ac)) / 2a", subject: "Algebra 2 / Trig", interval: 1, due: Date.now() },
    { question: "What does a for-loop do in Java?", answer: "Repeats a block of code a set number of times", subject: "AP CSA", interval: 1, due: Date.now() },
    { question: "What is a list in Python?", answer: "An ordered, mutable collection", subject: "Python Programming", interval: 1, due: Date.now() }
  ];
}

// --- TAB FUNCTIONALITY ---
function showTab(tabId) {
  const tabs = document.querySelectorAll('.tabContent');
  tabs.forEach(t => t.classList.add('hidden'));
  document.getElementById(tabId).classList.remove('hidden');

  const tabButtons = document.querySelectorAll('#tabs button');
  tabButtons.forEach(b => b.classList.remove('activeTab'));
  event.target.classList.add('activeTab');

  if (tabId !== 'studyTab' && tabId !== 'quizTab') document.getElementById('card').classList.add('hidden');
}

// --- STUDY & QUIZ ---
function startStudy() {
  const selected = document.getElementById("subjectSelect").value;
  dueCards = (selected === "all") ? cards.filter(c => c.due <= Date.now()) : cards.filter(c => c.due <= Date.now() && c.subject === selected);

  if (dueCards.length === 0) { alert("🎉 No cards due!"); return; }
  currentCardIndex = 0;
  quizMode = false;
  document.getElementById("card").classList.remove("hidden");
  loadCard();
}

function startQuiz() {
  const selected = document.getElementById("quizSubjectSelect").value;
  dueCards = (selected === "all") ? cards.filter(c => c.due <= Date.now()) : cards.filter(c => c.due <= Date.now() && c.subject === selected);

  if (dueCards.length === 0) { alert("🎉 No cards due!"); return; }
  currentCardIndex = 0;
  quizMode = true;
  quizScore = 0;
  quizTotal = dueCards.length;
  document.getElementById("card").classList.remove("hidden");
  loadCard();
}

function loadCard() {
  if (!dueCards.length) {
    document.getElementById("question").textContent = "🎉 No cards due today!";
    document.getElementById("subject").textContent = "";
    document.getElementById("answer").textContent = "";
    document.getElementById("showBtn").classList.add("hidden");
    document.getElementById("buttons").classList.add("hidden");
    return;
  }

  const card = dueCards[currentCardIndex];
  document.getElementById("subject").textContent = "📘 " + card.subject;
  document.getElementById("question").textContent = card.question;
  document.getElementById("answer").textContent = card.answer;
  document.getElementById("answer").classList.add("hidden");
  document.getElementById("buttons").classList.add("hidden");
  document.getElementById("showBtn").classList.remove("hidden");
}

function showAnswer() {
  document.getElementById("answer").classList.remove("hidden");
  document.getElementById("buttons").classList.remove("hidden");
  document.getElementById("showBtn").classList.add("hidden");
}

function rateCard(rating) {
  let card = dueCards[currentCardIndex];
  if (!quizMode) {
    if (rating === "again") card.interval = 1;
    if (rating === "good") card.interval *= 2;
    if (rating === "easy") card.interval *= 2.5;
    card.due = Date.now() + card.interval * 86400000;
    saveCards();
  } else {
    if (rating === "good" || rating === "easy") quizScore++;
  }

  currentCardIndex++;
  if (currentCardIndex >= dueCards.length) {
    if (quizMode) alert(`🎉 Quiz finished! Score: ${quizScore}/${quizTotal}`);
    currentCardIndex = 0;
  }
  loadCard();
}

// --- ADD CARD ---
function addCard() {
  const subject = document.getElementById("newSubject").value;
  const question = document.getElementById("newQuestion").value.trim();
  const answer = document.getElementById("newAnswer").value.trim();
  if (!question || !answer) { alert("Please enter both question and answer."); return; }
  cards.push({ subject, question, answer, interval: 1, due: Date.now() });
  saveCards();
  document.getElementById("newQuestion").value = "";
  document.getElementById("newAnswer").value = "";
  document.getElementById("creatorMessage").textContent = "✅ Card added!";
}

// --- STATS DASHBOARD ---
function showStats() {
  const statsContent = document.getElementById("statsContent");
  statsContent.innerHTML = "";
  if (!cards.length) { statsContent.innerHTML = "<p>No cards yet!</p>"; return; }

  const subjects = [...new Set(cards.map(c => c.subject))];
  subjects.forEach(subject => {
    const subjectCards = cards.filter(c => c.subject === subject);
    const total = subjectCards.length;
    const due = subjectCards.filter(c => c.due <= Date.now()).length;
    const efficiency = ((total - due) / total * 100).toFixed(1);

    const div = document.createElement("div");
    div.innerHTML = `<strong>${subject}</strong>: ${total} cards, ${due} due, Efficiency: ${efficiency}%`;

    const barContainer = document.createElement("div");
    barContainer.className = "efficiencyBarContainer";

    const bar = document.createElement("div");
    bar.className = "efficiencyBar";
    bar.style.width = efficiency + "%";

    // Color code
    if (efficiency >= 80) bar.style.background = "green";
    else if (efficiency >= 50) bar.style.background = "yellow";
    else bar.style.background = "red";

    barContainer.appendChild(bar);
    div.appendChild(barContainer);
    statsContent.appendChild(div);
  });
}

// --- FLASHCARD MANAGEMENT ---
function loadManageCards() {
  const container = document.getElementById("manageCardsContainer");
  container.innerHTML = "";
  const subject = document.getElementById("manageSubjectSelect").value;
  const filtered = (subject === "all") ? cards : cards.filter(c => c.subject === subject);

  filtered.forEach((card, i) => {
    const div = document.createElement("div");
    div.className = "manageCardItem";
    div.innerHTML = `
      <input value="${card.question}" id="q${i}" />
      <input value="${card.answer}" id="a${i}" />
      <button onclick="updateCard(${i})">Update</button>
      <button onclick="deleteCard(${i})">Delete</button>
    `;
    container.appendChild(div);
  });
}

function updateCard(index) {
  const question = document.getElementById(`q${index}`).value;
  const answer = document.getElementById(`a${index}`).value;
  cards[index].question = question;
  cards[index].answer = answer;
  saveCards();
  alert("✅ Card updated!");
}

function deleteCard(index) {
  if (confirm("Delete this card?")) {
    cards.splice(index, 1);
    saveCards();
    loadManageCards();
  }
}

// --- DARK MODE ---
function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

// --- BROWN NOISE ---
let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let brownNoiseNode;
let brownNoisePlaying = false;

function createBrownNoise() {
  let bufferSize = 2 * audioCtx.sampleRate;
  let noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  let output = noiseBuffer.getChannelData(0);
  let lastOut = 0.0;
  for (let i = 0; i < bufferSize; i++) {
    let white = Math.random() * 2 - 1;
    output[i] = (lastOut + (0.02 * white)) / 1.02;
    lastOut = output[i];
    output[i] *= 3.5;
  }
  let noise = audioCtx.createBufferSource();
  noise.buffer = noiseBuffer;
  noise.loop = true;
  let gainNode = audioCtx.createGain();
  gainNode.gain.value = 0.2;
  noise.connect(gainNode).connect(audioCtx.destination);
  return { noise, gainNode };
}

function toggleBrownNoise() {
  if (!brownNoisePlaying) {
    brownNoiseNode = createBrownNoise();
    brownNoiseNode.noise.start();
    brownNoisePlaying = true;
    document.getElementById("toggleNoiseBtn").textContent = "🔇 Brown Noise";
  } else {
    brownNoiseNode.noise.stop();
    brownNoisePlaying = false;
    document.getElementById("toggleNoiseBtn").textContent = "🔊 Brown Noise";
  }
}

window.addEventListener('load', () => {
  try { toggleBrownNoise(); } catch(e) { console.log("AudioContext blocked until user interaction"); }
});
