function calculateSmolov() {
    const oneRM = parseFloat(document.getElementById("smolov1rm").value);
    if (!oneRM) return;
    let output = "";

    const weeks = [
        ["Понедељак 6x6", 0.70],
        ["Среда 7x5", 0.75],
        ["Петак 8x4", 0.80],
        ["Субота 10x3", 0.85]
    ];

    weeks.forEach(([label, percent]) => {
        const weight = Math.round(oneRM * percent);
        output += `${label} @ ${weight} кг\n`;
    });

    document.getElementById("smolovOutput").innerText = output;
}

function calculateWendler() {
    const oneRM = parseFloat(document.getElementById("wendler1rm").value);
    if (!oneRM) return;
    const tm = oneRM * 0.9;
    let output = "";

    output += "Недеља 1 (5/5/5+):\n";
    output += `65%: ${Math.round(tm * 0.65)} кг\n`;
    output += `75%: ${Math.round(tm * 0.75)} кг\n`;
    output += `85%+: ${Math.round(tm * 0.85)} кг\n\n`;

    output += "Недеља 2 (3/3/3+):\n";
    output += `70%: ${Math.round(tm * 0.70)} кг\n`;
    output += `80%: ${Math.round(tm * 0.80)} кг\n`;
    output += `90%+: ${Math.round(tm * 0.90)} кг\n\n`;

    output += "Недеља 3 (5/3/1+):\n";
    output += `75%: ${Math.round(tm * 0.75)} кг\n`;
    output += `85%: ${Math.round(tm * 0.85)} кг\n`;
    output += `95%+: ${Math.round(tm * 0.95)} кг\n\n`;

    output += "Недеља 4 (Deload):\n";
    output += `40%: ${Math.round(tm * 0.40)} кг\n`;
    output += `50%: ${Math.round(tm * 0.50)} кг\n`;
    output += `60%: ${Math.round(tm * 0.60)} кг\n`;

    document.getElementById("wendlerOutput").innerText = output;
}
