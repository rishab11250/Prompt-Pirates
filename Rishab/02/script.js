/* ═══════════════════════════════════════════════════════════
   THE LAST CARTOGRAPHER — script.js
   Covers: Cursor · Starfield · Particles · Scroll Reveal ·
           Chapter Navigation · Web Audio Music Engine ·
           Choice System · Restart
═══════════════════════════════════════════════════════════ */

/* ════════════════════════════════════
   CUSTOM CURSOR
════════════════════════════════════ */
const cur = document.getElementById('cur');
const curRing = document.getElementById('cur-ring');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cur.style.left = mouseX + 'px';
    cur.style.top = mouseY + 'px';
});

(function animateCursorRing() {
    ringX += (mouseX - ringX) * 0.13;
    ringY += (mouseY - ringY) * 0.13;
    curRing.style.left = ringX + 'px';
    curRing.style.top = ringY + 'px';
    requestAnimationFrame(animateCursorRing);
})();

// Enlarge cursor on interactive elements
document.querySelectorAll('button, .choice-btn, .pnav-dot, a').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

/* ════════════════════════════════════
   STARFIELD CANVAS
════════════════════════════════════ */
const sfCanvas = document.getElementById('starfield');
const sfCtx = sfCanvas.getContext('2d');
let stars = [];

function resizeStarfield() {
    sfCanvas.width = window.innerWidth;
    sfCanvas.height = window.innerHeight;
}

function initStars() {
    stars = [];
    const count = Math.floor((sfCanvas.width * sfCanvas.height) / 6000);
    for (let i = 0; i < count; i++) {
        stars.push({
            x: Math.random() * sfCanvas.width,
            y: Math.random() * sfCanvas.height,
            r: Math.random() * 1.4 + 0.3,
            speed: Math.random() * 0.025 + 0.005,
            offset: Math.random() * Math.PI * 2,
            color: Math.random() > 0.72 ? '#4dd9f0'
                : Math.random() > 0.50 ? '#c9a84c'
                    : '#dde4ff'
        });
    }
}

let sfTime = 0;
function drawStarfield() {
    sfCtx.clearRect(0, 0, sfCanvas.width, sfCanvas.height);
    sfTime += 0.012;
    stars.forEach(s => {
        const alpha = 0.25 + 0.6 * Math.sin(sfTime * (s.speed * 60) + s.offset);
        sfCtx.globalAlpha = Math.max(0, alpha);
        // Core dot
        sfCtx.beginPath();
        sfCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        sfCtx.fillStyle = s.color;
        sfCtx.fill();
        // Soft glow halo
        const grd = sfCtx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3);
        grd.addColorStop(0, s.color);
        grd.addColorStop(1, 'transparent');
        sfCtx.globalAlpha = Math.max(0, alpha * 0.28);
        sfCtx.beginPath();
        sfCtx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
        sfCtx.fillStyle = grd;
        sfCtx.fill();
        sfCtx.globalAlpha = 1;
    });
    requestAnimationFrame(drawStarfield);
}

resizeStarfield();
initStars();
drawStarfield();
window.addEventListener('resize', () => { resizeStarfield(); initStars(); });

/* ════════════════════════════════════
   PARTICLES CANVAS
════════════════════════════════════ */
const pCanvas = document.getElementById('particles');
const pCtx = pCanvas.getContext('2d');
let particles = [];

// Chapter colour map — updated by chapter observer
const CHAPTER_COLORS = {
    ch1: [201, 168, 76],
    ch2: [77, 217, 240],
    ch3: [61, 255, 192],
    ch4: [224, 80, 122],
    ch5: [61, 255, 192],
};
let currentRGB = CHAPTER_COLORS.ch1;

function resizeParticles() {
    pCanvas.width = window.innerWidth;
    pCanvas.height = window.innerHeight;
}

function spawnParticle() {
    particles.push({
        x: Math.random() * pCanvas.width,
        y: pCanvas.height + 10,
        vx: (Math.random() - 0.5) * 0.55,
        vy: -(Math.random() * 1.1 + 0.35),
        r: Math.random() * 2.2 + 0.5,
        a: Math.random() * 0.55 + 0.2,
        life: 1,
    });
}

let pFrame = 0;
function drawParticles() {
    pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    pFrame++;
    if (pFrame % 4 === 0 && particles.length < 90) spawnParticle();
    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.0038;
        const [r, g, b] = currentRGB;
        pCtx.beginPath();
        pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        pCtx.fillStyle = `rgba(${r},${g},${b},${p.a * p.life})`;
        pCtx.fill();
    });
    requestAnimationFrame(drawParticles);
}

resizeParticles();
drawParticles();
window.addEventListener('resize', resizeParticles);

/* ════════════════════════════════════
   SCROLL PROGRESS BAR
════════════════════════════════════ */
const scrollbar = document.getElementById('scrollbar');
window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    scrollbar.style.width = (pct * 100) + '%';
}, { passive: true });

/* ════════════════════════════════════
   SCROLL HINT FADE-OUT
════════════════════════════════════ */
const scrollHint = document.getElementById('scroll-hint');
window.addEventListener('scroll', () => {
    if (scrollHint) scrollHint.style.opacity = window.scrollY > 80 ? '0' : '1';
}, { passive: true });

/* ════════════════════════════════════
   INTERSECTION OBSERVERS
   — Reveal animations
   — Active chapter detection
════════════════════════════════════ */
const CHAPTERS = ['ch1', 'ch2', 'ch3', 'ch4', 'ch5'];
const REVEAL_SELECTORS = '.ch-label, .ch-title, .ch-text, .deco-line, .ch-art, .choice-wrap';
let currentChapter = 'ch1';

// Reveal elements when section comes into view
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll(REVEAL_SELECTORS).forEach(el => el.classList.add('vis'));
        }
    });
}, { threshold: 0.2 });

// Detect which chapter is dominant on screen
const chapterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.45) {
            const id = entry.target.id;
            currentChapter = id;
            updateNav(id);
            currentRGB = CHAPTER_COLORS[id] || CHAPTER_COLORS.ch1;
            if (musicOn) playChapterMusic(id);
        }
    });
}, { threshold: 0.45 });

document.querySelectorAll('section').forEach(sec => {
    revealObserver.observe(sec);
    chapterObserver.observe(sec);
});

// Trigger ch1 immediately (already in view)
setTimeout(() => {
    document.querySelectorAll('#ch1 ' + REVEAL_SELECTORS).forEach(el => el.classList.add('vis'));
}, 250);

/* ════════════════════════════════════
   CHAPTER NAV DOTS
════════════════════════════════════ */
function updateNav(chId) {
    document.querySelectorAll('.pnav-dot').forEach(dot => {
        dot.classList.toggle('active', dot.dataset.ch === chId);
    });
}

document.querySelectorAll('.pnav-dot').forEach(dot => {
    dot.addEventListener('click', () => {
        document.getElementById(dot.dataset.ch)?.scrollIntoView({ behavior: 'smooth' });
    });
    dot.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            document.getElementById(dot.dataset.ch)?.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

/* ════════════════════════════════════
   WEB AUDIO — AMBIENT MUSIC ENGINE
════════════════════════════════════ */
let audioCtx = null;
let musicOn = false;
let activeNodes = [];  // { osc, gain } or { stop } for rhythms
let playingChapter = '';

function getCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
}

/** Fade out & stop all running nodes */
function stopAllNodes() {
    const ctx = getCtx();
    const now = ctx.currentTime;
    activeNodes.forEach(n => {
        try { n.gain && n.gain.linearRampToValueAtTime(0, now + 0.55); } catch (_) { }
        try { if (n.stop) n.stop(); } catch (_) { }  // rhythm timers
    });
    const doomed = activeNodes.slice();
    activeNodes = [];
    setTimeout(() => {
        doomed.forEach(n => { try { n.osc && n.osc.stop(); } catch (_) { } });
    }, 700);
}

/** Create a sustained oscillator */
function makeOsc(freq, type, targetGain, detune = 0) {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    osc.detune.value = detune;
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(targetGain, ctx.currentTime + 1.6);
    osc.start();
    return { osc, gain };
}

/** Create several oscillators as a chord pad */
function makePad(freqs, totalGain) {
    const gainEach = totalGain / freqs.length;
    return freqs.map(f => makeOsc(f, 'sine', gainEach, (Math.random() * 5) - 2.5));
}

/** Create a repeating rhythmic hit */
function makeRhythm(freq, intervalMs, hitGain) {
    const fire = () => {
        if (!musicOn) return;
        const ctx = getCtx();
        const osc = ctx.createOscillator();
        const env = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        osc.connect(env);
        env.connect(ctx.destination);
        const t = ctx.currentTime;
        env.gain.setValueAtTime(hitGain, t);
        env.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
        osc.start(t);
        osc.stop(t + 0.3);
    };
    const id = setInterval(fire, intervalMs);
    return { stop: () => clearInterval(id) };
}

/* — Chapter soundscapes — */
const CHAPTER_MUSIC = {
    ch1() {
        // Mystical wind-chime drones — C major pentatonic pads, high shimmer
        activeNodes.push(
            ...makePad([130.81, 196.00, 261.63, 329.63, 392.00], 0.038),
            ...makePad([523.25, 659.25, 783.99], 0.016)
        );
    },
    ch2() {
        // Journey pulse — slow rhythms, mid drones, slight tension
        activeNodes.push(
            ...makePad([87.31, 130.81, 174.61, 220.00], 0.032),
            makeRhythm(110, 620, 0.032),
            makeRhythm(220, 930, 0.022)
        );
    },
    ch3() {
        // Ethereal choir swells — open fifths, sustained highs
        activeNodes.push(
            ...makePad([130.81, 196.00, 261.63, 392.00, 523.25], 0.034),
            ...makePad([65.41, 98.00, 130.81], 0.024)
        );
    },
    ch4() {
        // Dark dissonance + low war-drum pulse
        activeNodes.push(
            ...makePad([110.00, 116.54, 123.47, 130.81], 0.030),
            ...makePad([40.00, 58.27], 0.020),
            makeRhythm(55, 420, 0.042),
            makeRhythm(82, 840, 0.022)
        );
    },
    ch5() {
        // Warm resolution bells — bright overtones, golden harmonics
        activeNodes.push(
            ...makePad([261.63, 329.63, 392.00, 523.25, 659.25], 0.026),
            ...makePad([1046.50, 1318.51, 1567.98], 0.012),
            ...makePad([130.81, 196.00], 0.018)
        );
    },
};

function playChapterMusic(id) {
    if (!musicOn || playingChapter === id) return;
    playingChapter = id;
    stopAllNodes();
    setTimeout(() => {
        if (musicOn && CHAPTER_MUSIC[id]) CHAPTER_MUSIC[id]();
    }, 650);
}

/* Music toggle button */
const musicBtn = document.getElementById('music-ctrl');
const musicIcon = document.getElementById('music-icon');

const ICON_ON = `<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>`;
const ICON_OFF = `<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                  <line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`;

musicBtn.addEventListener('click', () => {
    musicOn = !musicOn;
    musicIcon.innerHTML = musicOn ? ICON_ON : ICON_OFF;
    musicBtn.classList.toggle('muted', !musicOn);
    if (musicOn) {
        playingChapter = '';
        playChapterMusic(currentChapter);
    } else {
        stopAllNodes();
        playingChapter = '';
    }
});

/* ════════════════════════════════════
   CHOICE SYSTEM — Chapter 3
════════════════════════════════════ */
const CHOICE_RESPONSES = {
    touch: `Her fingers brushed the flame. It did not burn — instead,
          every map she had ever drawn flowed out of her hands and into the light,
          each road a river of memory. The city gasped, and held.`,
    map: `She unfurled her parchment and began to draw — not what was, but what could be.
          New roads. New names. New reasons to exist.
          The flame read every line and blazed brighter.`,
    call: `"I remember you," she whispered. Just three words.
          The flame shuddered, then swelled, flooding the city in warmth.
          It had only ever needed to be remembered.`,
};

function makeChoice(choice) {
    const result = document.getElementById('choice-result');
    const buttons = document.querySelectorAll('.choice-btn');
    result.style.opacity = '0';
    setTimeout(() => {
        result.textContent = CHOICE_RESPONSES[choice] || '';
        result.style.opacity = '1';
    }, 320);
    buttons.forEach(b => b.disabled = true);
}

// Expose for inline onclick
window.makeChoice = makeChoice;

/* ════════════════════════════════════
   RESTART
════════════════════════════════════ */
function restartStory() {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Remove all .vis classes
    document.querySelectorAll(REVEAL_SELECTORS).forEach(el => el.classList.remove('vis'));
    // Reset choices
    const result = document.getElementById('choice-result');
    if (result) result.textContent = '';
    document.querySelectorAll('.choice-btn').forEach(b => b.disabled = false);
    // Re-reveal ch1 after scroll settles
    setTimeout(() => {
        document.querySelectorAll('#ch1 ' + REVEAL_SELECTORS).forEach(el => el.classList.add('vis'));
    }, 600);
}

// Expose for inline onclick
window.restartStory = restartStory;