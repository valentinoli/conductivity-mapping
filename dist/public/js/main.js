'use strict';

// Atburðarhandfang virkjað þegar skráarhluttréð er hlaðið
document.addEventListener('DOMContentLoaded', function () {
  // Atburðarhandfang fyrir hamborgaravalmynd
  document.querySelector('.menu-toggle').addEventListener('click', function () {
    document.querySelector('.menu-toggle').classList.toggle('open');
    document.querySelector('.nav-container').classList.toggle('open');
  });
});