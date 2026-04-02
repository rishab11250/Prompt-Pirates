// 1. Setup the Intersection Observer for Scrolling Animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.planet-row').forEach(row => {
    observer.observe(row);
});

// 2. Automated Music Logic (Bypassing Browser Autoplay Restrictions)
const music = document.getElementById('bg-music');

const startAmbientMusic = () => {
    music.play().catch(error => {
        // This catch handles cases where the browser still blocks it
        console.log("Music play was prevented, waiting for interaction.");
    });
    // Remove the listener once music starts so it doesn't trigger again
    document.removeEventListener('click', startAmbientMusic);
    document.removeEventListener('touchstart', startAmbientMusic);
    document.removeEventListener('scroll', startAmbientMusic);
};

// Listen for any interaction to trigger the music start
document.addEventListener('click', startAmbientMusic);
document.addEventListener('touchstart', startAmbientMusic);
document.addEventListener('scroll', startAmbientMusic);

// 3. Stars Parallax Effect
window.addEventListener('scroll', () => {
    const scroll = window.pageYOffset;
    document.querySelector('.stars').style.transform = `translateY(${scroll * 0.15}px)`;
});