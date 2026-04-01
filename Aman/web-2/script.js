const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
const nav = document.getElementById('mainNav');
const container = document.querySelector('.snap-container');
const music = document.getElementById('bg-music');
const musicBtn = document.querySelector('.music-btn');

let isStarted = false;

// 1. Smooth Custom Cursor
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    follower.animate({
        left: e.clientX - 20 + 'px',
        top: e.clientY - 20 + 'px'
    }, { duration: 500, fill: "forwards" });
});

// 2. Cursor Hover Effects
document.querySelectorAll('h1, .menu-btn, .logo, .music-btn').forEach(link => {
    link.addEventListener('mouseenter', () => document.body.classList.add('cursor-active'));
    link.addEventListener('mouseleave', () => document.body.classList.remove('cursor-active'));
});

// 3. Navbar Scroll Effect & Counter Update
container.addEventListener('scroll', () => {
    if (container.scrollTop > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }

    const index = Math.round(container.scrollTop / window.innerHeight) + 1;
    const counterDisplay = document.querySelector('.current-car');
    if(index <= 9) {
        counterDisplay.innerText = `0${index} / 09`;
    }
});

// 4. Intersection Observer for Animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        } else {
            entry.target.classList.remove('active');
        }
    });
}, { threshold: 0.6 });

document.querySelectorAll('.car-section').forEach(section => observer.observe(section));

// 5. Music Control Logic (Fixed Redundancy)
const playMusic = () => {
    music.play().then(() => {
        isStarted = true;
        musicBtn.textContent = "🔊";
        musicBtn.style.color = "var(--accent)";
        musicBtn.style.borderColor = "var(--accent)";
    }).catch(err => console.log("Interaction required to start audio."));
};

// Start music on first click anywhere
document.addEventListener('click', () => {
    if (!isStarted) playMusic();
}, { once: true });

// Toggle button
musicBtn.addEventListener('click', (e) => {
    e.stopPropagation(); 
    if (music.paused) {
        playMusic();
    } else {
        music.pause();
        musicBtn.textContent = "🔇";
        musicBtn.style.color = "white";
        musicBtn.style.borderColor = "rgba(255,255,255,0.2)";
    }
});