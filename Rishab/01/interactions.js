/**
 * interactions.js
 * Handles all event listeners and user interactions.
 */

function initInteractions() {
    // Mouse movement
    window.addEventListener('mousemove', (e) => {
        window.targetMouseX = e.clientX;
        window.targetMouseY = e.clientY;
        
        // Update CSS variables for any elements using them
        document.documentElement.style.setProperty('--mouse-x', e.clientX + 'px');
        document.documentElement.style.setProperty('--mouse-y', e.clientY + 'px');
    });

    // Clicks
    document.addEventListener('click', (e) => {
        if (!e.target.closest('button') && !e.target.closest('a')) {
            if (typeof window.createRipple === 'function') {
                window.createRipple(e.clientX, e.clientY);
            }
            if (Math.random() > 0.5 && typeof window.Particle === 'function') {
                window.particles.push(new window.Particle(e.clientX, e.clientY, window.width, window.height, true));
            }
        }
    });

    // Resize
    window.addEventListener('resize', () => {
        if (typeof window.resize === 'function') window.resize();
    });

    // Scroll
    window.addEventListener('scroll', () => {
        window.scrollY = window.pageYOffset;
        window.scrollVelocity = window.scrollY - window.lastScrollY;
        window.lastScrollY = window.scrollY;
    });

    // Subtitles
    cycleSubtitle();

    // Audio
    initAudio();

    // Voice
    initVoice();

    // Transform
    initTransform();

    // Scroll Animations (Intersection Observer)
    initScrollAnimations();

    // Navigation
    initNavDots();

    // Scale Section
    initScaleSection();

    // Breathing
    breathingAnimation();
}

function cycleSubtitle() {
    const subtitle = document.getElementById('subtitle');
    let index = 0;
    const subtitles = [
        "Made of stardust",
        "Infinite energy",
        "Born from cosmic fire",
        "Connected to all things",
        "A momentary expression of the universe",
        "Dreaming itself into existence"
    ];

    if (subtitle) {
        setInterval(() => {
            subtitle.style.opacity = 0;
            subtitle.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                index = (index + 1) % subtitles.length;
                subtitle.textContent = subtitles[index];
                subtitle.style.opacity = 1;
                subtitle.style.transform = 'translateY(0)';
            }, 500);
        }, 4000);
    }
}

function initAudio() {
    const toggle = document.getElementById('audio-toggle');
    if (!toggle) return;
    let modulator, modGain;

    toggle.addEventListener('click', () => {
        if (!window.audioContext) {
            window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            window.oscillator = window.audioContext.createOscillator();
            modulator = window.audioContext.createOscillator();
            window.gainNode = window.audioContext.createGain();
            modGain = window.audioContext.createGain();
            
            window.oscillator.type = 'sine';
            modulator.type = 'sine';
            
            window.oscillator.frequency.setValueAtTime(100, window.audioContext.currentTime);
            modulator.frequency.setValueAtTime(0.5, window.audioContext.currentTime);
            modGain.gain.setValueAtTime(20, window.audioContext.currentTime);
            
            modulator.connect(modGain);
            modGain.connect(window.oscillator.frequency);
            window.oscillator.connect(window.gainNode);
            window.gainNode.connect(window.audioContext.destination);
            
            window.oscillator.start();
            modulator.start();
        }
        
        if (window.isMuted) {
            window.gainNode.gain.linearRampToValueAtTime(0.05, window.audioContext.currentTime + 1);
            toggle.classList.add('playing');
            toggle.classList.remove('muted');
            window.isMuted = false;
        } else {
            window.gainNode.gain.linearRampToValueAtTime(0, window.audioContext.currentTime + 1);
            toggle.classList.remove('playing');
            toggle.classList.add('muted');
            window.isMuted = true;
        }
    });
}

function initVoice() {
    const voiceBtn = document.getElementById('voice-btn');
    const voiceInput = document.getElementById('voice-input');
    const voiceResponse = document.getElementById('voice-response');
    const voiceBtnText = document.getElementById('voice-btn-text');
    
    const cosmicResponses = [
        "The cosmos echoes your words...",
        "Your voice ripples through dimensions...",
        "The universe listens...",
        "Stars align to hear you...",
        "Ancient light carries your message...",
        "The void responds to your presence..."
    ];

    if (!voiceBtn) return;
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        
        recognition.onstart = () => {
            voiceBtn.classList.add('listening');
            voiceBtnText.textContent = 'Listening...';
        };
        
        recognition.onresult = (event) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            if (voiceInput) voiceInput.textContent = `"${transcript}"`;
            
            if (event.results[0].isFinal) {
                const response = cosmicResponses[Math.floor(Math.random() * cosmicResponses.length)];
                if (voiceResponse) voiceResponse.textContent = response;
                voiceBtn.classList.remove('listening');
                voiceBtnText.textContent = 'Speak Your Truth';
                
                if (typeof window.createExplosion === 'function') {
                    window.createExplosion(window.targetMouseX, window.targetMouseY);
                }
                
                const colors = ['#00d4ff', '#ff00ff', '#ffd700'];
                document.body.style.background = colors[Math.floor(Math.random() * colors.length)];
                setTimeout(() => {
                    document.body.style.background = '#0a0a0f';
                }, 2000);
            }
        };
        
        recognition.onerror = () => {
            voiceBtn.classList.remove('listening');
            voiceBtnText.textContent = 'Speak Your Truth';
            if (voiceResponse) voiceResponse.textContent = 'The cosmos could not hear you. Try again.';
        };
        
        voiceBtn.addEventListener('click', () => {
            recognition.start();
        });
    } else {
        voiceBtn.addEventListener('click', () => {
            const quotes = [
                "I am infinite", "I am connected", "I am cosmic", 
                "We are one", "I am love", "I am peace"
            ];
            const quote = quotes[Math.floor(Math.random() * quotes.length)];
            if (voiceInput) voiceInput.textContent = `"${quote}"`;
            if (voiceResponse) voiceResponse.textContent = cosmicResponses[Math.floor(Math.random() * cosmicResponses.length)];
            if (typeof window.createExplosion === 'function') {
                window.createExplosion(window.targetMouseX, window.targetMouseY);
            }
        });
    }
}

function initTransform() {
    const btn = document.getElementById('transform-btn');
    const message = document.getElementById('transform-message');
    const overlay = document.getElementById('warp-overlay');
    
    const transformMessages = [
        "You Are Infinite",
        "Beyond Space and Time",
        "One With Everything",
        "Eternal Consciousness",
        "The Universe Experiencing Itself",
        "Boundless Existence"
    ];

    if (!btn) return;
    
    btn.addEventListener('click', () => {
        if (window.isTransformed) {
            window.isTransformed = false;
            document.body.classList.remove('color-invert');
            if (message) {
                message.classList.remove('active');
            }
            btn.textContent = 'Transcend';
        } else {
            window.isTransformed = true;
            if (overlay) overlay.classList.add('active');
            setTimeout(() => {
                document.body.classList.add('color-invert');
                if (message) {
                    message.textContent = transformMessages[Math.floor(Math.random() * transformMessages.length)];
                    message.classList.add('active');
                }
                if (overlay) overlay.classList.remove('active');
                if (typeof window.createExplosion === 'function') {
                    window.createExplosion(window.width / 2, window.height / 2);
                }
            }, 500);
            btn.textContent = 'Return';
        }
    });
}

function animateCounters() {
    const counters = {
        atoms: { target: 70000000000000000000000000, duration: 3000 },
        stars: { target: 4000000000, duration: 3000 },
        years: { target: 13800000000, duration: 3000 }
    };

    Object.keys(counters).forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const { target, duration } = counters[id];
        const start = Date.now();
        
        const animateCounter = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(target * eased);
            
            if (id === 'atoms') {
                el.textContent = current.toExponential(2);
            } else if (id === 'stars') {
                el.textContent = (current / 1000000000).toFixed(1) + 'B';
            } else {
                el.textContent = (current / 1000000000).toFixed(0) + 'B';
            }
            
            if (progress < 1) {
                requestAnimationFrame(animateCounter);
            }
        };
        
        setTimeout(animateCounter, 1000);
    });

    const items = document.querySelectorAll('.breakdown-item');
    items.forEach((item, i) => {
        const fill = item.querySelector('.breakdown-fill');
        const target = item.dataset.value;
        setTimeout(() => {
            fill.style.width = target + '%';
        }, 1500 + (i * 200));
    });
}

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.closest('#section-1')) {
                    animateCounters();
                }
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

function initNavDots() {
    const dots = document.querySelectorAll('.nav-dot');
    const sections = document.querySelectorAll('section');
    
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const sectionIndex = dot.dataset.section;
            if (sections[sectionIndex]) sections[sectionIndex].scrollIntoView({ behavior: 'smooth' });
        });
    });

    window.addEventListener('scroll', () => {
        let current = 0;
        sections.forEach((section, i) => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight / 2) {
                current = i;
            }
        });
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === current);
        });
    });
}

function initScaleSection() {
    const items = document.querySelectorAll('.scale-item');
    const title = document.getElementById('scale-title');
    const desc = document.getElementById('scale-desc');
    const data = {
        atom: { title: "The Infinitesimal", desc: "The fundamental building blocks of all matter." },
        human: { title: "The Observer", desc: "A brief flash of consciousness." },
        earth: { title: "Our Home", desc: "A pale blue dot." },
        sun: { title: "The Life Giver", desc: "A massive fusion reactor." },
        galaxy: { title: "The Cosmic Island", desc: "A collection of 200 billion stars." }
    };

    items.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const scale = item.dataset.scale;
            if (title && data[scale]) {
                title.textContent = data[scale].title;
                title.style.color = 'var(--secondary)';
            }
            if (desc && data[scale]) desc.textContent = data[scale].desc;
        });

        item.addEventListener('mouseleave', () => {
            if (title) {
                title.textContent = "Perspective";
                title.style.color = 'var(--primary)';
            }
            if (desc) desc.textContent = "Everything in the universe has its place.";
        });
    });
}

function breathingAnimation() {
    const breathingText = document.getElementById('breathing-text');
    if (!breathingText) return;
    const phrases = ['Breathe in...', 'Hold...', 'Breathe out...', 'Hold...'];
    let phraseIndex = 0;
    
    setInterval(() => {
        breathingText.style.opacity = 0;
        breathingText.style.transform = 'scale(0.8)';
        setTimeout(() => {
            phraseIndex = (phraseIndex + 1) % phrases.length;
            breathingText.textContent = phrases[phraseIndex];
            breathingText.style.opacity = 1;
            breathingText.style.transform = 'scale(1)';
        }, 500);
    }, 4000);
}

// Export initialization function
window.initInteractions = initInteractions;
