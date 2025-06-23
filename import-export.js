let id = 0;
const timers = {};

function addExercise() {
  const name = document.getElementById('exerciseName').value.trim();
  const sets = parseInt(document.getElementById('sets').value);
  if (!name || !sets || sets < 1) {
    alert("Попуните исправно сва поља.");
    return;
  }

  const tbody = document.querySelector('#exerciseTable tbody');

  for (let i = 1; i <= sets; i++) {
    const row = document.createElement('tr');
    const timerId = `timer-${id}`;

    row.innerHTML = `
      <td>${name}</td>
      <td>${i}/${sets}</td>
      <td><input type="number" placeholder="нпр. 8" min="0"></td>
      <td><input type="number" placeholder="нпр. 7.5" step="0.5" min="0"></td>
      <td><input type="text" placeholder="Коментар"></td>
      <td>
        <span class="timer" id="${timerId}">00:00</span>
        <button onclick="startTimer(${id})">▶️</button>
        <button onclick="stopTimer(${id})">⏸️</button>
        <button onclick="resetTimer(${id})">🔁</button>
      </td>
    `;
    tbody.appendChild(row);
    createTimer(id);
    id++;
  }

  // Очисти поља за унос
  document.getElementById('exerciseName').value = "";
  document.getElementById('sets').value = "";

  saveToLocal();
}

function createTimer(id) {
  if (!timers[id]) {
    timers[id] = { time: 0, interval: null };
  }
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function startTimer(id) {
  if (!timers[id]) createTimer(id);
  if (timers[id].interval) return; // већ ради

  timers[id].interval = setInterval(() => {
    timers[id].time++;
    const timerSpan = document.getElementById(`timer-${id}`);
    if (timerSpan) {
      timerSpan.innerText = formatTime(timers[id].time);
    }
  }, 1000);
}

function stopTimer(id) {
  if (timers[id]?.interval) {
    clearInterval(timers[id].interval);
    timers[id].interval = null;
  }
}

function resetTimer(id) {
  stopTimer(id);
  if (timers[id]) {
    timers[id].time = 0;
    const timerSpan = document.getElementById(`timer-${id}`);
    if (timerSpan) {
      timerSpan.innerText = "00:00";
    }
  }
}

function exportToExcel() {
  const rows = [];
  const table = document.getElementById("exerciseTable");
  const trs = table.querySelectorAll("tbody tr");

  rows.push(["Vežba", "Serija", "Ponavljanja", "RPE", "Komentar"]);

  trs.forEach(tr => {
    const tds = tr.querySelectorAll("td");
    const row = [
      tds[0].innerText,
      tds[1].innerText,
      tds[2].querySelector('input')?.value || '',
      tds[3].querySelector('input')?.value || '',
      tds[4].querySelector('input')?.value || ''
    ];
    rows.push(row);
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, "Trening");
  XLSX.writeFile(wb, "trening.xlsx");
}

function importFromExcel(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();

  reader.onload = function(e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const tbody = document.querySelector("#exerciseTable tbody");
    tbody.innerHTML = "";

    rows.slice(1).forEach(([name, serija, ponavljanja, rpe, komentar]) => {
      if (!name || !serija) return; // прескочи празне редове

      const tr = document.createElement("tr");
      const timerId = `timer-${id}`;

      tr.innerHTML = `
        <td>${name}</td>
        <td>${serija}</td>
        <td><input type="number" value="${ponavljanja || ''}" min="0"></td>
        <td><input type="number" value="${rpe || ''}" step="0.5" min="0"></td>
        <td><input type="text" value="${komentar || ''}"></td>
        <td>
          <span class="timer" id="${timerId}">00:00</span>
          <button onclick="startTimer(${id})">▶️</button>
          <button onclick="stopTimer(${id})">⏸️</button>
          <button onclick="resetTimer(${id})">🔁</button>
        </td>
      `;
      tbody.appendChild(tr);
      createTimer(id);
      id++;
    });
    saveToLocal();
  };

  reader.readAsArrayBuffer(file);
}

function saveToLocal() {
  const rows = [];
  const trs = document.querySelectorAll("#exerciseTable tbody tr");

  trs.forEach(tr => {
    const tds = tr.querySelectorAll("td");
    rows.push({
      name: tds[0].innerText,
      serija: tds[1].innerText,
      ponavljanja: tds[2].querySelector('input')?.value || '',
      rpe: tds[3].querySelector('input')?.value || '',
      komentar: tds[4].querySelector('input')?.value || ''
    });
  });

  localStorage.setItem("savedWorkout", JSON.stringify(rows));
}

function loadFromLocal() {
  const data = localStorage.getItem("savedWorkout");
  if (!data) return;
  const rows = JSON.parse(data);
  const tbody = document.querySelector("#exerciseTable tbody");
  tbody.innerHTML = "";

  rows.forEach(row => {
    const tr = document.createElement("tr");
    const timerId = `timer-${id}`;
    tr.innerHTML = `
      <td>${row.name}</td>
      <td>${row.serija}</td>
      <td><input type="number" value="${row.ponavljanja}" min="0"></td>
      <td><input type="number" value="${row.rpe}" step="0.5" min="0"></td>
      <td><input type="text" value="${row.komentar}"></td>
      <td>
        <span class="timer" id="${timerId}">00:00</span>
        <button onclick="startTimer(${id})">▶️</button>
        <button onclick="stopTimer(${id})">⏸️</button>
        <button onclick="resetTimer(${id})">🔁</button>
      </td>
    `;
    tbody.appendChild(tr);
    createTimer(id);
    id++;
  });
}

window.addEventListener("load", loadFromLocal);
window.addEventListener("beforeunload", saveToLocal);
