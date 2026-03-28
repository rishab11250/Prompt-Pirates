document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer to handle scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const sphere = entry.target.querySelector('.sphere');
            const info = entry.target.querySelector('.planet-info');

            if (entry.isIntersecting) {
                // When section comes into view
                sphere.style.transform = "scale(1.1) rotate(3deg)";
                info.style.opacity = "1";
                info.style.transform = "translateY(0)";
            } else {
                // When section leaves view
                sphere.style.transform = "scale(0.85) rotate(0deg)";
                info.style.opacity = "0";
                info.style.transform = "translateY(40px)";
            }
        });
    }, { threshold: 0.5 }); // Triggers when 50% of the section is visible

    // Initialize all sections
    document.querySelectorAll('.planet-section').forEach(section => {
        const info = section.querySelector('.planet-info');
        // Pre-set transition via JS to ensure it's applied correctly
        info.style.transition = "all 1s cubic-bezier(0.2, 1, 0.3, 1)";
        observer.observe(section);
    });
});