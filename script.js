// --- SAVE & LOAD CARDS ---
function saveCards() {
  localStorage.setItem("cards", JSON.stringify(cards));
}

function loadCards() {
  const saved = localStorage.getItem("cards");
  if (saved) return JSON.parse(saved);

  return [
    {
      question: "What is a metaphor?",
      answer: "A comparison without using like or as",
      subject: "English Literature",
      interval: 1,
      due: Date.now()
    },
    {
      question: "What is the quadratic formula?",
      answer: "x = (-b ± √(b²-4ac)) / 2a",
      subject: "Algebra 2 / Trig",
      interval: 1,
      due: Date.now()
    },
    {
      question: "What does a for-loop do in Java?",
      answer: "Repeats a block of code a set number of times",
      subject: "AP CSA",
      interval: 1,
      due: Date.now()
    },
    {
      question: "What is a list in Python?",
      answer: "An ordered, mutable collection",
      subject: "Python Programming",
      interval: 1,
      due: Date.now()
    }
  ];
}

let cards = loadCards();
let dueCards = [];
let currentCardIndex = 0;

// --- START STUDY SESSION ---
function startStudy() {
  const selected = document.getElementById("subjectSelect").value;

  if (selected === "all") {
    dueCards = cards.filter(c => c.due <= Date.now());
  } else {
    dueCards = cards.filter(c => c.due <= Date.now() && c.subject === selected);
  }

  if (dueCards.length === 0) {
    alert("🎉 No cards due for this subject!");
    return;
  }

  currentCardIndex = 0;

  // Hide menu, show card and buttons
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("card").classList.remove("hidden");
  document.getElementById("showBtn").classList.remove("hidden");

  loadCard();
}

// --- LOAD A CARD ---
function loadCard() {
  if (dueCards.length === 0) {
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

  // Hide answer and rating buttons until "Show Answer" is clicked
  document.getElementById("answer").classList.add("hidden");
  document.getElementById("buttons").classList.add("hidden");
  document.getElementById("showBtn").classList.remove("hidden");
}

// --- SHOW ANSWER ---
function showAnswer() {
  document.getElementById("answer").classList.remove("hidden");
  document.getElementById("buttons").classList.remove("hidden");
  document.getElementById("showBtn").classList.add("hidden");
}

// --- RATE CARD ---
function rateCard(rating) {
  let card = dueCards[currentCardIndex];

  if (rating === "again") card.interval = 1;
  if (rating === "good") card.interval *= 2;
  if (rating === "easy") card.interval *= 2.5;

  card.due = Date.now() + card.interval * 86400000;
  saveCards();

  currentCardIndex++;
  if (currentCardIndex >= dueCards.length) currentCardIndex = 0;

  loadCard();
}

// --- ADD NEW CARD ---
function addCard() {
  const subject = document.getElementById("newSubject").value;
  const question = document.getElementById("newQuestion").value.trim();
  const answer = document.getElementById("newAnswer").value.trim();

  if (!question || !answer) {
    alert("Please enter both question and answer.");
    return;
  }

  const newCard = {
    subject: subject,
    question: question,
    answer: answer,
    interval: 1,
    due: Date.now()
  };

  cards.push(newCard);
  saveCards();

  // Clear inputs and show confirmation
  document.getElementById("newQuestion").value = "";
  document.getElementById("newAnswer").value = "";
  document.getElementById("creatorMessage").textContent = "✅ Card added!";
  
  // Refresh dueCards for current session if studying same subject
  const selected = document.getElementById("subjectSelect").value;
  if (selected === "all") {
    dueCards = cards.filter(c => c.due <= Date.now());
  } else {
    dueCards = cards.filter(c => c.due <= Date.now() && c.subject === selected);
  }
}
