
function openLearn(index = 0) {
  const capsule = capsules[index];
  
  if (!capsule) return;

  const learnContainer = document.getElementById("learnView");
  learnContainer.innerHTML = "";
  // === Filter Header ===
const filterContainer = document.createElement("div");
filterContainer.className = "d-flex flex-wrap align-items-center gap-3 mb-4";

const capsuleLabel = document.createElement("label");
capsuleLabel.textContent = "Capsule";
capsuleLabel.className = "fw-bold me-2 text-white";

const capsuleSelect = document.createElement("select");
capsuleSelect.className = "form-select flex-grow-1";
capsuleSelect.style.minWidth = "250px";

capsules.forEach((cap, i) => {
  const opt = document.createElement("option");
  opt.value = i;
  opt.textContent = cap.subject || `Capsule ${i + 1}`;
  capsuleSelect.appendChild(opt);
});
capsuleSelect.value = index.toString();

const searchLabel = document.createElement("label");
searchLabel.textContent = "Search notes";
searchLabel.className = "fw-bold me-2 text-white";

const searchInput = document.createElement("input");
searchInput.type = "text";
searchInput.placeholder = "Type to filter notes";
searchInput.className = "form-control flex-grow-1";
searchInput.style.minWidth = "300px";

filterContainer.appendChild(capsuleLabel);
filterContainer.appendChild(capsuleSelect);
filterContainer.appendChild(searchLabel);
filterContainer.appendChild(searchInput);
learnContainer.appendChild(filterContainer);
capsuleSelect.addEventListener("change", () => {
  const newIndex = parseInt(capsuleSelect.value, 10);
  openLearn(newIndex); 
});

  const tabs = document.createElement("div");
  tabs.className = "btn-group mb-4";
  learnContainer.appendChild(tabs);

  const sections = ["Overview", "Flashcards", "Questions", "Resources"];
  const tabButtons = [];
  const contentDivs = [];

  sections.forEach((section, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-outline-primary";
    btn.textContent = section;

    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      contentDivs.forEach((div, idx) => div.style.display = idx === i ? "block" : "none");
    });

    tabButtons.push(btn);
    tabs.appendChild(btn);
  });

  const overviewDiv = document.createElement("div");
  overviewDiv.innerHTML = `
    <h3 class="text-2xl font-bold mb-3">${capsule.subject || "Untitled"}</h3>
  `;
  if (capsule.notes && capsule.notes.length > 0) {
  const notesList = document.createElement("ul");
  notesList.className = "list-group";
  capsule.notes.forEach(n => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = n;
    notesList.appendChild(li);
  });
  overviewDiv.appendChild(notesList);

  searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();
    notesList.querySelectorAll("li").forEach(li => {
      li.style.display = li.textContent.toLowerCase().includes(term) ? "" : "none";
    });
  });
}

  learnContainer.appendChild(overviewDiv);
  contentDivs.push(overviewDiv);
const flashDiv = document.createElement("div");
flashDiv.style.display = "none";
learnContainer.appendChild(flashDiv);
contentDivs.push(flashDiv);

if (capsule.flashcards && capsule.flashcards.length > 0) {
  let currentCard = 0;
  let knownCount = 0;
  let flipped = false;

  const topBar = document.createElement("div");
  topBar.className = "d-flex justify-content-between align-items-center mb-3";

  const cardInfo = document.createElement("span");
  cardInfo.className = "fw-bold text-white";
  cardInfo.textContent = `1 / ${capsule.flashcards.length} • Known: ${knownCount}`;
  topBar.appendChild(cardInfo);

  flashDiv.appendChild(topBar);

  const cardBox = document.createElement("div");
  cardBox.className =
    "flashcard-box text-center text-white border rounded shadow-lg";
  cardBox.style.minHeight = "280px";
  cardBox.style.display = "flex";
  cardBox.style.alignItems = "center";
  cardBox.style.justifyContent = "center";
  cardBox.style.fontSize = "1.4rem";
  cardBox.style.cursor = "pointer";
  cardBox.style.userSelect = "none";
  cardBox.style.background =
    "linear-gradient(145deg, #1b1b1b, #2a2a2a)";
  cardBox.style.transition = "all 0.3s ease";
  cardBox.textContent = capsule.flashcards[0].front;

  flashDiv.appendChild(cardBox);

  // === نوار دکمه‌ها ===
  const controls = document.createElement("div");
  controls.className =
    "btn-group-modern mt-4 d-flex flex-wrap justify-content-center gap-2";

  const btnKnown = createControlButton(
    '<i class="bi bi-check-circle"></i> Known',
    "btn-success",
    () => {
      knownCount++;
      nextCard();
    }
  );

  const btnUnknown = createControlButton(
    '<i class="bi bi-x-circle"></i> Unknown',
    "btn-danger",
    () => nextCard()
  );

  const btnFlip = createControlButton(
    '<i class="bi bi-arrow-repeat"></i> Flip (Space)',
    "btn-warning",
    () => flipCard()
  );

  const btnPrev = createControlButton(
    '<i class="bi bi-arrow-left-circle"></i> Prev',
    "btn-outline-light",
    () => {
      if (currentCard > 0) {
        currentCard--;
        flipped = false;
        updateCard();
      }
    }
  );

  const btnNext = createControlButton(
    'Next <i class="bi bi-arrow-right-circle"></i>',
    "btn-outline-light",
    () => {
      if (currentCard < capsule.flashcards.length - 1) {
        currentCard++;
        flipped = false;
        updateCard();
      }
    }
  );

  const btnBack = createControlButton(
    '<i class="bi bi-arrow-90deg-left"></i> Back',
    "btn-secondary",
    () => {
      tabButtons[0].click(); 
    }
  );

  controls.append(btnKnown, btnUnknown, btnFlip, btnPrev, btnNext, btnBack);
  flashDiv.appendChild(controls);

  function createControlButton(iconHTML, classes, onClick) {
    const btn = document.createElement("button");
    btn.className = `btn ${classes}`;
    btn.innerHTML = iconHTML;
    btn.onclick = onClick;
    btn.style.minWidth = "120px";
    return btn;
  }

  function updateCard() {
    const current = capsule.flashcards[currentCard];
    cardBox.textContent = flipped ? current.back : current.front;
    cardInfo.textContent = `${currentCard + 1} / ${capsule.flashcards.length} • Known: ${knownCount}`;
  }

  function flipCard() {
    flipped = !flipped;
    const current = capsule.flashcards[currentCard];
    cardBox.textContent = flipped ? current.back : current.front;
    cardBox.style.transform = flipped ? "rotateY(180deg)" : "rotateY(0deg)";
  }

  function nextCard() {
    if (currentCard < capsule.flashcards.length - 1) {
      currentCard++;
      flipped = false;
      updateCard();
    } else {
      cardBox.textContent = "You reached the end!";
    }
  }

  cardBox.addEventListener("click", flipCard);
  document.addEventListener("keydown", (e) => {
    if (contentDivs[1].style.display === "block") {
      if (e.code === "Space") {
        e.preventDefault();
        flipCard();
      }
      if (e.code === "ArrowLeft") btnPrev.click();
      if (e.code === "ArrowRight") btnNext.click();
    }
  });

  updateCard();
} else {
  flashDiv.innerHTML = "<p class='text-gray-500'>No flashcards available.</p>";
}


  const questionDiv = document.createElement("div");
  let score = 0;
  let answered = 0;

  if (capsule.questions && capsule.questions.length > 0) {
    const scoreDiv = document.createElement("div");
    scoreDiv.className = "mb-3 p-2 font-bold text-lg";
    scoreDiv.textContent = `Score: 0 / ${capsule.questions.length}`;
    questionDiv.appendChild(scoreDiv);

    capsule.questions.forEach((q, i) => {
      const qCard = document.createElement("div");
      qCard.className = "mb-4 p-4 rounded-xl bg-white shadow-lg q-card";

      const questionTitle = document.createElement("p");
      questionTitle.className = "font-bold mb-2";
      questionTitle.textContent = `Q${i + 1}: ${q.question}`;
      qCard.appendChild(questionTitle);

      const choicesDiv = document.createElement("div");

      Object.entries(q.choices).forEach(([key, value]) => {
        const btn = document.createElement("button");
        btn.className = "btn btn-outline-secondary m-1";
        btn.textContent = `${key}: ${value}`;

        btn.addEventListener("click", () => {
          if (qCard.dataset.answered) return;
          qCard.dataset.answered = "true";
          answered++;

          if (key === q.answer) {
            btn.classList.replace("btn-outline-secondary", "btn-success");
            score++;
          } else {
            btn.classList.replace("btn-outline-secondary", "btn-danger");
            Array.from(choicesDiv.children).forEach(b => {
              if (b.textContent.startsWith(q.answer + ":")) {
                b.classList.replace("btn-outline-secondary", "btn-success");
              }
            });
          }

          scoreDiv.textContent = `Score: ${score} / ${capsule.questions.length}`;

          if (answered === capsule.questions.length) {
            const percent = Math.round((score / capsule.questions.length) * 100);

            questionDiv.querySelectorAll(".q-card").forEach(el => el.style.display = "none");
 

            const resultDiv = document.createElement("div");
            resultDiv.className = "mt-4 p-3  rounded";
            resultDiv.innerHTML = `
              <h4 class="fw-bold">✅ Quiz Finished!</h4>
              <p>Your Score: ${score} / ${capsule.questions.length}</p>
              <p>Percentage: ${percent}%</p>
            `;

            const retryBtn = document.createElement("button");
            retryBtn.className = "btn btn-primary mt-2";
            retryBtn.textContent = "🔁 Retry";

            retryBtn.onclick = () => {
  openLearn(index);

  setTimeout(() => {
    document.querySelectorAll(".btn-group .btn")[2].click();
  }, 50);
};

            resultDiv.appendChild(retryBtn);
            questionDiv.appendChild(resultDiv);
          }
        });

        choicesDiv.appendChild(btn);
      });

      qCard.appendChild(choicesDiv);
      questionDiv.appendChild(qCard);
    });
  } else {
    questionDiv.innerHTML = "<p class='text-gray-500'>No questions available.</p>";
  }

  questionDiv.style.display = "none";
  learnContainer.appendChild(questionDiv);
  contentDivs.push(questionDiv);

  // Resources
  const resourceDiv = document.createElement("div");
  if (capsule.resources && capsule.resources.length > 0) {
    capsule.resources.forEach(r => {
      resourceDiv.innerHTML += `<div><a href="${r.url}" target="_blank" class="text-blue-500 hover:underline">${r.label}</a></div>`;
    });
  } else resourceDiv.innerHTML = "<p class='text-gray-500'>No resources available.</p>";
  resourceDiv.style.display = "none";
  learnContainer.appendChild(resourceDiv);
  contentDivs.push(resourceDiv);

  tabButtons[0].click();
  showView("learn");
}
