// Grab DOM elements
const form = document.getElementById("entry-form");
const input = document.getElementById("entry-input");
const list = document.getElementById("entries-list");
const bracketDiv = document.getElementById("bracket");
const startBtn = document.getElementById("start-btn");

// Global counter for unique IDs
let entryId = 0;

// Store entries in an array
let entries = [];

// Track current round and round number
let currentRound = [];
let round = 1;
let tournamentStarted = false;

// Helper to show champion
function showChampion(name) {
  bracketDiv.innerHTML = `
    <h2 class="text-2xl font-bold text-center text-green-600">
      Champion: ${name} 🏆
    </h2>
  `;
}

// Render a single round
function renderBracket() {
  bracketDiv.innerHTML = "";

  if (!tournamentStarted) {
    bracketDiv.innerHTML = `<p class="text-gray-500 italic">Add entries and click Start Tournament to begin.</p>`;
    return;
  }

  if (entries.length === 0) {
    bracketDiv.innerHTML = `<p class="text-gray-500 italic">No entries found!</p>`
  }

  if (currentRound.length === 1 && round > 1) {
    bracketDiv.innerHTML = `<h2 class="text-2xl font-bold text-center text-green-600">Champion: ${currentRound[0]}</h2>`
  }

  if (round === 1 && currentRound.length === 0) {
    currentRound = [...entries].sort(() => Math.random() - 0.5);
  }

  // Initialize first round
  if (currentRound.length === 0) {
    currentRound = [...entries].sort(() => Math.random() - 0.5);
  }

  // If only 1 left, show champion
  if (currentRound.length === 1) return showChampion(currentRound[0].text);

  // Container for this round
  const roundDiv = document.createElement("div");
  roundDiv.className = "mb-6 p-4 bg-gray-50 rounded shadow";

  // Round title
  const roundTitle = document.createElement("h3");
  roundTitle.className = "text-xl font-bold mb-3 text-center text-blue-600";
  roundTitle.textContent = `Round ${round}`;
  roundDiv.appendChild(roundTitle);

  const ul = document.createElement("ul");
  ul.className = "space-y-2";

  const winners = [];

  function checkRoundComplete() {
    if (winners.length === Math.ceil(currentRound.length / 2)) {
      // Move to next round
      currentRound = winners;
      round++;
      renderBracket();
    }
  }

  // Loop through matchups
  for (let i = 0; i < currentRound.length; i += 2) {
    const matchupDiv = document.createElement("div");
    matchupDiv.className = "flex justify-around gap-4 items-center";

    if (i + 1 < currentRound.length) {
      // Competitor A
      const btnA = document.createElement("button");
      btnA.textContent = currentRound[i].text;
      btnA.className =
        "px-4 py-2 border rounded hover:bg-blue-100 transition cursor-pointer";

      // Competitor B
      const btnB = document.createElement("button");
      btnB.textContent = currentRound[i + 1].text;
      btnB.className =
        "px-4 py-2 border rounded hover:bg-blue-100 transition cursor-pointer";

      // Click handlers
      btnA.addEventListener("click", () => {
        winners.push(currentRound[i]);
        btnA.classList.add("bg-green-200");
        btnB.classList.add("opacity-50");
        btnA.disabled = true;
        btnB.disabled = true;
        checkRoundComplete();
      });

      btnB.addEventListener("click", () => {
        winners.push(currentRound[i + 1]);
        btnB.classList.add("bg-green-200");
        btnA.classList.add("opacity-50");
        btnB.disabled = true;
        btnA.disabled = true;
        checkRoundComplete();
      });

      matchupDiv.appendChild(btnA);
      matchupDiv.appendChild(document.createTextNode("vs"));
      matchupDiv.appendChild(btnB);
    } else {
      // Bye round
      const bye = document.createElement("p");
      bye.textContent = `${currentRound[i].text} gets a bye`;
      winners.push(currentRound[i]);
      matchupDiv.appendChild(bye);
    }

    ul.appendChild(matchupDiv);
  }

  roundDiv.appendChild(ul);
  bracketDiv.appendChild(roundDiv);
}

// Add new entry
form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (tournamentStarted) return;

  const entryText = input.value.trim();
  if (!entryText) return;

  const newEntry = { id: entryId++, text: entryText };
  entries.push(newEntry);

  // Create container <li>
  const li = document.createElement("li");
  li.className = "flex justify-between items-center p-2 bg-gray-100 rounded";

  // Entry name
  const span = document.createElement("span");
  span.textContent = newEntry.text;

  // Remove button
  const removeBtn = document.createElement("button");
  removeBtn.textContent = "❌";
  removeBtn.className = "ml-4 text-red-500 hover:text-red-700";

  // Remove logic
  removeBtn.addEventListener("click", () => {
    // Block mid-tournament removal
    if (tournamentStarted) return;
    // Remove from array using ID
    entries = entries.filter(e => e.id !== newEntry.id);
    // Remove from DOM
    li.remove();
  });
  
  li.appendChild(span);
  li.appendChild(removeBtn);
  list.appendChild(li);

  input.value = "";
});

// Start button logic
startBtn.addEventListener("click", () => {
  if (entries.length < 2) {
    alert("Add at least 2 entries to start the tournament!");
    return;
  }
  tournamentStarted = true;
  // Disable entry form
  form.querySelector("button[type=submit]").disabled = true;
  // Disable start button
  startBtn.disabled = true;
  renderBracket();
});
