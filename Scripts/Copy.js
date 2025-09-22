function copyKnop(e) {
  e.preventDefault();
  const email = "info@strakplanmuziek.nl";
  navigator.clipboard.writeText(email).then(() => {
    const link = document.getElementById("copy");
    link.innerHTML = "E-mailadres gekopieerd!";
    setTimeout(() => {
      link.innerHTML = "Kopieer ons e-mailadres";
    }, 3000);
  });
}