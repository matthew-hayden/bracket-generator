// Grab DOM elements
const form = document.getElementById("entry-form");
const input = document.getElementById("entry-input");
const list = document.getElementById("entries-list");
const bracketDiv = document.getElementById("bracket");

// Store entries in an array
let entries = [];

// Track current round and round number
let currentRound = [];
let round = 1;

// Helper to show placeholder
function showPlaceholder() {
  bracketDiv.innerHTML = `<p class="text-gray-500 italic">No bracket yet - add some entries!</p>`;
}

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

  if (entries.length === 0) return showPlaceholder();

  // Initialize first round
  if (currentRound.length === 0) {
    currentRound = [...entries].sort(() => Math.random() - 0.5);
  }

  // If only 1 left, show champion
  if (currentRound.length === 1) return showChampion(currentRound[0]);

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
      btnA.textContent = currentRound[i];
      btnA.className =
        "px-4 py-2 border rounded hover:bg-blue-100 transition cursor-pointer";

      // Competitor B
      const btnB = document.createElement("button");
      btnB.textContent = currentRound[i + 1];
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
      bye.textContent = `${currentRound[i]} gets a bye`;
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
  const entry = input.value.trim();
  if (!entry) return;

  entries.push(entry);

  const li = document.createElement("li");
  li.textContent = entry;
  list.appendChild(li);

  input.value = "";

  // Reset bracket state for new entries
  currentRound = [];
  round = 1;

  renderBracket();
});
