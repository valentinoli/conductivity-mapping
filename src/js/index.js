const BACKGROUNDS = 4; // Fjöldi bakgrunnsmynda, hlutfall 8:5
const BACKGROUND = document.querySelector('.front-page-background');
const HEADING = document.querySelector('.front-page-background > h1');

// Setur nýjan bakgrunn á forsíðu ef gluggi er nógu stór
function backgroundImage() {
  const index = Math.floor(Math.random() * BACKGROUNDS) + 1;
  if (index === 4) {
    HEADING.style.color = 'rgb(70, 70, 70)';
  }
  BACKGROUND.style.backgroundImage = `url(./img/background${index}.jpg)`;
}

// Atburðarhandfang virkjað þegar skráarhluttréð er hlaðið
document.addEventListener('DOMContentLoaded', () => {
  backgroundImage();
});
