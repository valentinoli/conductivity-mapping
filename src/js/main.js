
// Atburðarhandfang virkjað þegar skráarhluttréð er hlaðið
document.addEventListener('DOMContentLoaded', () => {
  // Atburðarhandfang fyrir hamborgaravalmynd
  document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('.menu-toggle').classList.toggle('open');
    document.querySelector('.nav-container').classList.toggle('open');
  });
});
