const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
const nav = document.getElementById('mainNav');
const container = document.querySelector('.snap-container');

// 1. Smooth Custom Cursor
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    // Follower has a slight delay for "magnetic" feel
    follower.animate({
        left: e.clientX - 20 + 'px',
        top: e.clientY - 20 + 'px'
    }, { duration: 500, fill: "forwards" });
});

// 2. Cursor Hover Effects
document.querySelectorAll('h1, .menu-btn, .logo').forEach(link => {
    link.addEventListener('mouseenter', () => document.body.classList.add('cursor-active'));
    link.addEventListener('mouseleave', () => document.body.classList.remove('cursor-active'));
});

// 3. Navbar Scroll Effect & Counter Update
container.addEventListener('scroll', () => {
    // Shrink Nav
    if (container.scrollTop > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }

    // Update "01 / 10" Counter based on scroll position
    const index = Math.round(container.scrollTop / window.innerHeight) + 1;
    const counterDisplay = document.querySelector('.current-car');
    if(index <= 10) {
        counterDisplay.innerText = `${index < 10 ? '0' + index : index} / 10`;
    }
});

// 4. Car Reveal Observer (Existing logic)
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