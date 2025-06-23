document.addEventListener('DOMContentLoaded', function () {
  const dugme = document.getElementById('bazaKorisnikaBtn');
  const podmeni = document.getElementById('podmeni');

  dugme.addEventListener('click', function (e) {
    e.preventDefault(); // Sprečava default ponašanje linka
    if (podmeni.style.display === 'none') {
      podmeni.style.display = 'block';  // Prikazuje podmeni
    } else {
      podmeni.style.display = 'none';   // Sakriva podmeni
    }
  });
});
