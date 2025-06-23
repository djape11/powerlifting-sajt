const vezbe = ['bench', 'deadlift', 'squat'];

function updateAll() {
  vezbe.forEach(v => {
    const current = Number(document.getElementById(v + '-current').value);
    const goal = Number(document.getElementById(v + '-goal').value);
    const progressCell = document.getElementById(v + '-progress');
    if (goal > 0) {
      let percent = Math.min((current / goal) * 100, 100);
      percent = Math.round(percent);
      progressCell.textContent = percent + '% od cilja';
    } else {
      progressCell.textContent = '-';
    }
  });
}

updateAll();

vezbe.forEach(v => {
  document.getElementById(v + '-current').addEventListener('input', updateAll);
  document.getElementById(v + '-goal').addEventListener('input', updateAll);
});

