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
let dueCards = cards.filter(c => c.due <= Date.now());
let currentCardIndex = 0;

loadCard();

function loadCard() {
  if (dueCards.length === 0) {
    document.getElementById("question").textContent = "🎉 No cards due today!";
    return;
  }

  const card = dueCards[currentCardIndex];
  document.getElementById("subject").textContent = "📘 " + card.subject;
  document.getElementById("question").textContent = card.question;
  document.getElementById("answer").textContent = card.answer;
  document.getElementById("answer").classList.add("hidden");
  document.getElementById("buttons").classList.add("hidden");
}

function showAnswer() {
  document.getElementById("answer").classList.remove("hidden");
  document.getElementById("buttons").classList.remove("hidden");
}

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
