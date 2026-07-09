
document.addEventListener('DOMContentLoaded', () => {
// load nav
fetch('nav.html')
    .then(res => res.text())
    .then(html => {
        document.getElementById('nav-placeholder').innerHTML = html;
        initNav();
    });

AOS.init();
// name animation 
const phrases = ["Emmanuel Oluwamayowa Nasir", "a Software Engineer", "a Network Enthusiast", "a Cybersecurity Specialist", "a Technical Support Specialist"];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById("typed-name");

function type() {
  const currentPhrase = phrases[phraseIndex];
  if (isDeleting) {
    charIndex--;
} else {
    charIndex++;
}
  typedEl.textContent = currentPhrase.substring(0, charIndex);

let speed = isDeleting ? 60 : 100;
if (!isDeleting && charIndex === currentPhrase.length) {
    speed = 1000; // Pause for 1 seconds at the end of the phrase
}

if (!isDeleting && charIndex === currentPhrase.length) {
    isDeleting = true;
}
if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
}
setTimeout(type, speed);
}
if (typedEl) {
  setTimeout(type, 200);
}

//particle canvas
const canvas = document.createElement('canvas');
canvas.id = 'particle-canvas';
document.body.prepend(canvas);
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
for (let p = 0; p < 100; p++) { 
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2 + 1,
    vx: (Math.random() -0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5
  });
}
function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fill();
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
  });
}
function animate() {
    drawParticles();
    requestAnimationFrame(animate);
}

animate();

function initNav() {
//  NAVIGATION PANEL 
// set active link based on current page
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
// console.log('Current page:', currentPage);
document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
    }
});
// sliding nav indicator
const indicator = document.querySelector('.nav-indicator');
const navAnchors = document.querySelectorAll('.nav-links a');
const activeLink = document.querySelector('.nav-links a.active');


function moveIndicator(el) {
    const rect = el.getBoundingClientRect();
    const parentRect = el.closest('ul').getBoundingClientRect();
    indicator.style.width = rect.width + 'px';
    indicator.style.left = (rect.left - parentRect.left) + 'px';
}

// move to active link on page load
if (activeLink) {
    moveIndicator(activeLink);
    setTimeout(() => {
        indicator.style.opacity = '1';
    }, 300);
}
// move on hover
navAnchors.forEach(link => {
    link.addEventListener('mouseenter', () => moveIndicator(link));
});

// snap back to active on mouse leave
document.querySelector('.nav-links').addEventListener('mouseleave', () => {
    if (activeLink && indicator) moveIndicator(activeLink);
});


 // hamburger menu
// ─── HAMBURGER MENU ────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
    if (isOpen) typeNavLinks();
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}
// mobile typing nav effect
function typeNavLinks() {
    const links = document.querySelectorAll('.nav-links li');
    links.forEach((li, i) => {
        setTimeout(() => {
            li.style.opacity = '1';
            li.style.transition = 'opacity 0.1s';
            const a = li.querySelector('a');
            if (!a) return; 
            const fullText = a.textContent;
            a.textContent = '';
            let charI = 0;
            function typeChar() {
                if (charI < fullText.length) {
                    a.textContent += fullText[charI];
                    charI++;
                    setTimeout(typeChar, 60);
                }
            }
            typeChar();
        }, i * 300);
    });
}

}
});
