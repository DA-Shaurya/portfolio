/* ═══════════════════════════════════════════════
   SHAURYA SINGH — main.js
═══════════════════════════════════════════════ */

/* ── CUSTOM CURSOR ── */
const dot = document.getElementById('cur-dot');
const ring = document.getElementById('cur-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top  = my + 'px';
});

(function loopRing() {
  rx += (mx - rx) * 0.11;
  ry += (my - ry) * 0.11;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(loopRing);
})();

document.querySelectorAll('a, button, .acard, .proj-card, .nav-brand').forEach(el => {
  el.addEventListener('mouseenter', () => { dot.classList.add('h'); ring.classList.add('h'); });
  el.addEventListener('mouseleave', () => { dot.classList.remove('h'); ring.classList.remove('h'); });
});

/* ── NAVBAR SCROLL ── */
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 60);
});

/* ── ANIMATED CANVAS BACKGROUND ──
   Creates a flowing particle / grid mesh effect
   in brand colors: orange + green
── */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['rgba(255,107,43,', 'rgba(57,255,143,', 'rgba(255,45,120,'];
  const N = 55;

  for (let i = 0; i < N; i++) {
    particles.push({
      x: Math.random() * 1920,
      y: Math.random() * 1080,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 0.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.5 + 0.1
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw connection lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i], p2 = particles[j];
        const dx = p1.x - p2.x, dy = p1.y - p2.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 180) {
          const alpha = (1 - dist / 180) * 0.12;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(255,107,43,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // Draw dots
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();
      // Move
      p.x += p.vx;
      p.y += p.vy;
      // Wrap
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── TYPING EFFECT ── */
const roles = [
  'Software Developer',
  'MCA Student',
  'Video Editor',
  'Creative Technologist',
  'Full-Stack Builder'
];
let roleIdx = 0, charIdx = 0, deleting = false;
const roleEl = document.getElementById('role-text');

function typeRole() {
  const word = roles[roleIdx];
  if (!deleting) {
    roleEl.textContent = word.slice(0, ++charIdx);
    if (charIdx === word.length) {
      deleting = true;
      setTimeout(typeRole, 2000);
      return;
    }
  } else {
    roleEl.textContent = word.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
    }
  }
  setTimeout(typeRole, deleting ? 48 : 85);
}
setTimeout(typeRole, 1000);

/* ── SCROLL REVEAL ── */
const rvObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      rvObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.rv').forEach(el => rvObs.observe(el));

/* ── CONTACT FORM ── */
function cfSend() {
  const name  = document.getElementById('cf-name').value.trim();
  const email = document.getElementById('cf-email').value.trim();
  const msg   = document.getElementById('cf-msg').value.trim();
  const btn   = document.querySelector('.cf-btn');

  if (!name || !email || !msg) {
    btn.style.background = '#ff2d78';
    btn.querySelector('span').textContent = 'Fill required fields!';
    setTimeout(() => {
      btn.style.background = '';
      btn.querySelector('span').textContent = 'Send Message';
    }, 2500);
    return;
  }

  btn.style.background = '#39ff8f';
  btn.style.color = '#080808';
  btn.querySelector('span').textContent = 'Message Sent ✓';
  setTimeout(() => {
    btn.style.background = '';
    btn.style.color = '';
    btn.querySelector('span').textContent = 'Send Message';
  }, 3500);
}

/* expose to HTML onclick */
window.cfSend = cfSend;

/* ── ACTIVE NAV LINK on scroll ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current
      ? 'var(--white)'
      : '';
  });
});