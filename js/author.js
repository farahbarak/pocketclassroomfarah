
function AddCard() {
  const tbody = document.querySelector('#mainTable tbody');
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td class="text-end">
       <div class="input-field input-mini">
      <input type="text" required>
       <label>Front Value</label>
      </div>
    </td>
    <td class="text-end">
       <div class="input-field input-mini">
      <input type="text" required>
       <label>Back Value</label>
      </div>
    </td>
    <td class="text-end">
      <button class="btn btn-outline-danger btn-sm" onclick="DeleteCardRow(this)">Remove</button>
    </td>
  `;
  tbody.appendChild(tr);
  tr.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function DeleteCardRow(btn) {
  btn.closest('tr').remove();
}

function AddQuestion() {
  const tbody = document.querySelector('#QuestionTable tbody');
  const tr = document.createElement('tr');

  tr.innerHTML = `
    <td colspan="3">
      <div class="question-card p-3 border rounded mb-3">

        <!-- Question and Answer -->
        <div class="row mb-3 align-items-center">
          <div class="col-md-8">
            <div class="input-field input-mini w-100">
              <input type="text" required>
              <label>Question</label>
            </div>
          </div>
          <div class="col-md-4">
            <select required class="form-control form-control-lg mini w-100">
              <option value="" disabled selected>Select Answer</option>
              <option value="A">Choice A</option>
              <option value="B">Choice B</option>
              <option value="C">Choice C</option>
              <option value="D">Choice D</option>
            </select>
          </div>
        </div>

        <!-- Choices -->
        <div class="row mb-3">
          <div class="col-md-6 mb-2">
            <div class="input-field input-mini w-100">
              <input type="text" required>
              <label>Choice A</label>
            </div>
          </div>
          <div class="col-md-6 mb-2">
            <div class="input-field input-mini w-100">
              <input type="text" required>
              <label>Choice B</label>
            </div>
          </div>
          <div class="col-md-6 mb-2">
            <div class="input-field input-mini w-100">
              <input type="text" required>
              <label>Choice C</label>
            </div>
          </div>
          <div class="col-md-6 mb-2">
            <div class="input-field input-mini w-100">
              <input type="text" required>
              <label>Choice D</label>
            </div>
          </div>
        </div>

        <!-- Explanation and Remove Button -->
        <div class="row align-items-end">
          <div class="col-md-11">
            <div class="input-field input-mini w-100">
              <input type="text">
              <label>Explanation (Optional)</label>
            </div>
          </div>
          <div class="col-md-1 text-end">
            <button class="btn btn-outline-danger btn-sm w-100" onclick="DeleteQuestionRow(this)">Remove</button>
          </div>
        </div>

      </div>
    </td>
  `;

  tbody.appendChild(tr);
  tr.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function DeleteQuestionRow(btn) {
  btn.closest('tr').remove();
}

function AddResource() {
  const tbody = document.querySelector('#ResourceTable tbody');
  const tr = document.createElement('tr');

  tr.innerHTML = `
    <td colspan="3">
      <div class="resource-card p-3 border rounded mb-3">
        <div class="row align-items-end">
          
          <!-- Label -->
          <div class="col-md-5 mb-2">
            <div class="input-field input-mini w-100">
              <input type="text" required>
              <label>Label</label>
            </div>
          </div>

          <!-- URL -->
          <div class="col-md-6 mb-2">
            <div class="input-field input-mini w-100">
              <input type="text" required>
              <label>https://</label>
            </div>
          </div>

          <!-- Remove Button -->
          <div class="col-md-1 text-end mb-2">
            <button class="btn btn-outline-danger btn-sm w-100" onclick="DeleteResourceRow(this)">Remove</button>
          </div>

        </div>
      </div>
    </td>
  `;

  tbody.appendChild(tr);
  tr.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function DeleteResourceRow(btn) {
   btn.closest('tr').remove();
}

function deleteCapsule(index) {
  if (confirm("❌ Are you sure you want to delete this capsule?")) {
    capsules.splice(index, 1);
    updateLibraryUI();
    saveToLocalStorage();

  }
}

let capsules = [];
let editIndex = null;

function validateInputs() {
  let isValid = true;
  const allInputs = document.querySelectorAll(
    '#authorForm input[required], #authorForm textarea[required], #authorForm select[required]'
  );

  allInputs.forEach(el => {
    el.classList.remove('is-invalid', 'is-valid');
    if (!el.value.trim()) {
      el.classList.add('is-invalid');
      isValid = false;
    } else {
      el.classList.add('is-valid');
    }
  });

  if (!isValid) {
    const firstInvalid = document.querySelector('.is-invalid');
    firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    firstInvalid?.focus();
  }

  return isValid;
}

function collectCapsuleData() {
  const capsuleData = {
    email: document.getElementById("metaTitle").value.trim(),
    subject: document.getElementById("metaSubject").value.trim(),
    level: document.getElementById("level").value.trim(),
    description: document.getElementById("metaDescription").value.trim(),
    notes: document.getElementById("notesArea").value
      .split("\n").map(n => n.trim()).filter(Boolean),
    flashcards: [],
    questions: [],
    resources: []
  };

  document.querySelectorAll("#mainTable tbody tr").forEach(row => {
    const front = row.querySelector("td:nth-child(1) input")?.value.trim();
    const back = row.querySelector("td:nth-child(2) input")?.value.trim();
    if (front || back) capsuleData.flashcards.push({ front, back });
  });

  document.querySelectorAll("#QuestionTable tbody tr .question-card").forEach(qCard => {
    const inputs = qCard.querySelectorAll("input[type=text]");
    const question = inputs[0]?.value.trim() || "";
    const answer = qCard.querySelector("select")?.value || "";
    const choices = { A: inputs[1]?.value.trim() || "",
                      B: inputs[2]?.value.trim() || "",
                      C: inputs[3]?.value.trim() || "",
                      D: inputs[4]?.value.trim() || "" };
    const explanation = inputs[5]?.value.trim() || "";
    if (question) capsuleData.questions.push({ question, answer, choices, explanation });
  });

  document.querySelectorAll("#ResourceTable tbody tr .resource-card").forEach(rCard => {
    const inputs = rCard.querySelectorAll("input[type=text]");
    const label = inputs[0]?.value.trim() || "";
    const url = inputs[1]?.value.trim() || "";
    if (label || url) capsuleData.resources.push({ label, url });
  });

  return capsuleData;
}

document.getElementById("saveCapsule").addEventListener("click", function (e) {
  e.preventDefault();

  if (!validateInputs()) {
    alert("⚠ Please fill all required fields.");
    return;
  }

  const capsuleData = collectCapsuleData();

  if (editIndex !== null) {
    capsules[editIndex] = capsuleData;
    alert(" Capsule successfully updated!");
  } else {
    capsules.push(capsuleData);
    alert(" New capsule added!");
  }

  updateLibraryUI();
  saveToLocalStorage();
  showView("library");
  editIndex = null;
});

function editCapsule(index) {
  const capsule = capsules[index];
  if (!capsule) return;

  editIndex = index;

  document.getElementById("metaTitle").value = capsule.email || "";
  document.getElementById("metaSubject").value = capsule.subject || "";
  document.getElementById("metaDescription").value = capsule.description || "";
  document.getElementById("notesArea").value = (capsule.notes || []).join("\n");
  document.getElementById("level").value = capsule.level || "";

  const flashcardTbody = document.querySelector("#mainTable tbody");
  const questionTbody = document.querySelector("#QuestionTable tbody");
  const resourceTbody = document.querySelector("#ResourceTable tbody");

  flashcardTbody.innerHTML = "";
  questionTbody.innerHTML = "";
  resourceTbody.innerHTML = "";

  (capsule.flashcards || []).forEach(f => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="text-end">
        <div class="input-field input-mini">
          <input type="text" value="${f.front}" required>
          <label>Front Value</label>
        </div>
      </td>
      <td class="text-end">
        <div class="input-field input-mini">
          <input type="text" value="${f.back}" required>
          <label>Back Value</label>
        </div>
      </td>
      <td class="text-end">
        <button class="btn btn-outline-danger btn-sm" onclick="DeleteCardRow(this)">Remove</button>
      </td>
    `;
    flashcardTbody.appendChild(tr);
  });

  // Rebuild questions
  (capsule.questions || []).forEach(q => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td colspan="3">
        <div class="question-card p-3 border rounded mb-3">
          <div class="row mb-3 align-items-center">
            <div class="col-md-8">
              <div class="input-field input-mini w-100">
                <input type="text" value="${q.question}" required>
                <label>Question</label>
              </div>
            </div>
            <div class="col-md-4">
              <select required class="form-control form-control-lg mini w-100">
                <option value="" disabled>Select Answer</option>
                <option value="A" ${q.answer==="A"?"selected":""}>Choice A</option>
                <option value="B" ${q.answer==="B"?"selected":""}>Choice B</option>
                <option value="C" ${q.answer==="C"?"selected":""}>Choice C</option>
                <option value="D" ${q.answer==="D"?"selected":""}>Choice D</option>
              </select>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-6 mb-2">
              <div class="input-field input-mini w-100">
                <input type="text" value="${q.choices.A}" required>
                <label>Choice A</label>
              </div>
            </div>
            <div class="col-md-6 mb-2">
              <div class="input-field input-mini w-100">
                <input type="text" value="${q.choices.B}" required>
                <label>Choice B</label>
              </div>
            </div>
            <div class="col-md-6 mb-2">
              <div class="input-field input-mini w-100">
                <input type="text" value="${q.choices.C}" required>
                <label>Choice C</label>
              </div>
            </div>
            <div class="col-md-6 mb-2">
              <div class="input-field input-mini w-100">
                <input type="text" value="${q.choices.D}" required>
                <label>Choice D</label>
              </div>
            </div>
          </div>
          <div class="row align-items-end">
            <div class="col-md-11">
              <div class="input-field input-mini w-100">
                <input type="text" value="${q.explanation || ""}">
                <label>Explanation (Optional)</label>
              </div>
            </div>
            <div class="col-md-1 text-end">
              <button class="btn btn-outline-danger btn-sm w-100" onclick="DeleteQuestionRow(this)">Remove</button>
            </div>
          </div>
        </div>
      </td>
    `;
    questionTbody.appendChild(tr);
  });

  // Rebuild resources
  (capsule.resources || []).forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td colspan="3">
        <div class="resource-card p-3 border rounded mb-3">
          <div class="row align-items-end">
            <div class="col-md-5 mb-2">
              <div class="input-field input-mini w-100">
                <input type="text" value="${r.label}" required>
                <label>Label</label>
              </div>
            </div>
            <div class="col-md-6 mb-2">
              <div class="input-field input-mini w-100">
                <input type="text" value="${r.url}" required>
                <label>https://</label>
              </div>
            </div>
            <div class="col-md-1 text-end mb-2">
              <button class="btn btn-outline-danger btn-sm w-100" onclick="DeleteResourceRow(this)">Remove</button>
            </div>
          </div>
        </div>
      </td>
    `;
    resourceTbody.appendChild(tr);
  });

  showView("author");
}

function updateLibraryUI() {
  const grid = document.getElementById("capsulesGrid");
  const emptyState = document.getElementById("emptyState");
  grid.innerHTML = "";

  if (capsules.length === 0) {
    emptyState.classList.remove("d-none"); 
  } else {
    emptyState.classList.add("d-none");
  }

  capsules.forEach((data, index) => {
    const card = document.createElement("div");
    card.className = "col-md-4";
    const updated = new Date().toLocaleTimeString();

    card.innerHTML = `
      <div class="card capsule-card shadow-sm">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h5 class="card-title mb-0">${data.subject || "Untitled"}</h5>
            <span class="badge bg-primary">${data.level || "Unknown"}</span>
          </div>
          <p class="text-muted mb-2">${data.description || "No description"}</p>
          <p class="small text-secondary mb-3">Updated ${updated}</p>
          <div class="d-flex flex-wrap gap-2">
            <button class="btn btn-primary btn-sm" onclick="openLearn(${index})">Learn</button>
            <button class="btn btn-secondary btn-sm" onclick="editCapsule(${index})">Edit</button>
            <button class="btn btn-success btn-sm" onclick="exportCapsule(${index})">Export</button>
            <button class="btn btn-danger btn-sm" onclick="deleteCapsule(${index})">Delete</button>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}
