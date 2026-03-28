/**
 * script.js
 * Main entry point. Coordinates the animation loop and state.
 */

const canvas = document.getElementById('universe-canvas');
const ctx = canvas.getContext('2d', { alpha: false });
const offscreenCanvas = document.createElement('canvas');
const offscreenCtx = offscreenCanvas.getContext('2d');

// Global State
window.width = window.innerWidth;
window.height = window.innerHeight;
window.stars = [];
window.particles = [];
window.ripples = [];
window.mouseX = 0;
window.mouseY = 0;
window.targetMouseX = 0;
window.targetMouseY = 0;
window.isTransformed = false;
window.isMuted = true;
window.scrollY = 0;
window.lastScrollY = 0;
window.scrollVelocity = 0;
window.nebulaAngle = 0;

function resize() {
    window.width = canvas.width = offscreenCanvas.width = window.innerWidth;
    window.height = canvas.height = offscreenCanvas.height = window.innerHeight;
    drawNebulaStatic();
}

function drawNebulaStatic() {
    offscreenCtx.fillStyle = '#0a0a0f';
    offscreenCtx.fillRect(0, 0, window.width, window.height);
    for (let i = 0; i < 3; i++) {
        const x = Math.random() * window.width;
        const y = Math.random() * window.height;
        const radius = Math.random() * 600 + 400;
        const gradient = offscreenCtx.createRadialGradient(x, y, 0, x, y, radius);
        const hues = [200, 280, 320];
        gradient.addColorStop(0, `hsla(${hues[i]}, 100%, 50%, 0.1)`);
        gradient.addColorStop(1, 'transparent');
        offscreenCtx.fillStyle = gradient;
        offscreenCtx.fillRect(0, 0, window.width, window.height);
    }
}

function drawNebula() {
    window.nebulaAngle += 0.0001;
    ctx.save();
    ctx.translate(window.width / 2, window.height / 2);
    ctx.rotate(window.nebulaAngle);
    ctx.translate(-window.width / 2, -window.height / 2);
    ctx.drawImage(offscreenCanvas, -window.width * 0.5, -window.height * 0.5, window.width * 2, window.height * 2);
    ctx.restore();
}

function init() {
    resize();
    window.mouseX = window.targetMouseX = -100;
    window.mouseY = window.targetMouseY = -100;
    
    if (window.Star) {
        window.stars = Array.from({ length: 400 }, () => new window.Star(window.width, window.height));
    }
    if (window.Particle) {
        window.particles = Array.from({ length: 80 }, () => new window.Particle(undefined, undefined, window.width, window.height));
    }

    // Initialize all event listeners from interactions.js
    if (window.initInteractions) {
        window.initInteractions();
    }
}

function animate() {
    window.mouseX += (window.targetMouseX - window.mouseX) * 0.15;
    window.mouseY += (window.targetMouseY - window.mouseY) * 0.15;
    
    const skew = Math.max(-15, Math.min(15, window.scrollVelocity * 0.1));
    const wrapper = document.querySelector('.content-wrapper');
    if (wrapper) wrapper.style.transform = `skewY(${skew}deg)`;

    drawNebula();

    const scrollWarp = Math.abs(window.scrollVelocity) * 0.2;
    window.stars.forEach(star => {
        star.update(window.targetMouseX, scrollWarp);
        star.draw(ctx);
    });

    window.scrollVelocity *= 0.9;

    window.particles = window.particles.filter(p => p.life > 0);
    window.particles.forEach(p => {
        p.update(window.mouseX, window.mouseY, window.isTransformed);
        p.draw(ctx);
    });

    if (Math.random() > 0.95 && window.particles.length < 120) {
        window.particles.push(new window.Particle(window.targetMouseX, window.targetMouseY, window.width, window.height));
    }

    while (window.particles.length < 80) {
        window.particles.push(new window.Particle(undefined, undefined, window.width, window.height));
    }

    window.ripples = window.ripples.filter(r => r.life > 0);
    window.ripples.forEach(r => {
        r.update();
        r.draw(ctx);
    });

    requestAnimationFrame(animate);
}

// Helper functions that need to be in global scope
window.createRipple = function(x, y) {
    const rippleDiv = document.createElement('div');
    rippleDiv.className = 'ripple';
    rippleDiv.style.left = x + 'px';
    rippleDiv.style.top = y + 'px';
    rippleDiv.style.width = '50px';
    rippleDiv.style.height = '50px';
    const container = document.getElementById('ripple-container');
    if (container) container.appendChild(rippleDiv);
    
    setTimeout(() => rippleDiv.remove(), 1200);
    window.ripples.push(new window.Ripple(x, y));
};

window.createExplosion = function(x, y) {
    if (window.particles.length > 500) return;
    for (let i = 0; i < 40; i++) {
        window.particles.push(new window.Particle(x, y, window.width, window.height, true));
    }
    const flash = document.createElement('div');
    flash.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: white; opacity: 0.15; pointer-events: none;
        z-index: 1000; transition: opacity 0.4s ease-out;
    `;
    document.body.appendChild(flash);
    requestAnimationFrame(() => {
        flash.style.opacity = '0';
        setTimeout(() => flash.remove(), 400);
    });
};

window.resize = resize;

// Kick off
init();
animate();
