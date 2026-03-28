/**
 * entities.js
 * Contains the core cosmic entity classes: Star, Particle, and Ripple.
 */

class Star {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.reset();
    }

    reset() {
        this.x = Math.random() * this.width - this.width / 2;
        this.y = Math.random() * this.height - this.height / 2;
        this.z = Math.random() * 1000;
        this.size = Math.random() * 1.5 + 0.2;
        this.brightness = Math.random();
        this.color = this.getRandomColor();
        this.speed = Math.random() * 0.5 + 0.1;
    }

    getRandomColor() {
        const rand = Math.random();
        if (rand > 0.95) return '#ffccaa'; // Reddish
        if (rand > 0.90) return '#aaccff'; // Bluish
        if (rand > 0.85) return '#ffffcc'; // Yellowish
        return '#ffffff';
    }

    update(targetMouseX, warp = 0) {
        const speedMult = 0.5 + (targetMouseX - this.width / 2) * 0.0005 + warp;
        this.z -= this.speed * speedMult * 10;
        
        if (this.z <= 0) {
            this.reset();
            this.z = 1000;
        }
    }

    draw(ctx) {
        const scale = 1000 / this.z;
        const x = (this.x * scale) + this.width / 2;
        const y = (this.y * scale) + this.height / 2;
        const size = this.size * scale;
        const opacity = Math.min(1, (1000 - this.z) / 500);

        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = opacity * this.brightness;
        ctx.fill();
        
        if (size > 2) {
            ctx.beginPath();
            ctx.arc(x, y, size * 2, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = opacity * this.brightness * 0.15;
            ctx.fill();
        }
        ctx.restore();
    }
}

class Particle {
    constructor(x, y, width, height, explode = false) {
        this.width = width;
        this.height = height;
        this.x = (x !== undefined) ? x : Math.random() * width;
        this.y = (y !== undefined) ? y : Math.random() * height;
        this.vx = explode ? (Math.random() - 0.5) * 20 : (Math.random() - 0.5) * 2;
        this.vy = explode ? (Math.random() - 0.5) * 20 : (Math.random() - 0.5) * 2;
        this.size = Math.random() * 3 + 1;
        this.life = 1;
        this.decay = explode ? 0.02 : 0.005;
        this.hue = Math.random() * 360;
        this.trail = [];
    }

    update(mouseX, mouseY, isTransformed) {
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 8) this.trail.shift();

        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 200 && !isTransformed) {
            const force = (200 - dist) / 200 * 0.02;
            this.vx -= dx * force;
            this.vy -= dy * force;
        }

        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.98;
        this.vy *= 0.98;
        this.life -= this.decay;

        if (isTransformed) {
            this.vy += 0.1;
            this.hue += 2;
        }
    }

    draw(ctx) {
        ctx.save();
        if (this.trail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(this.trail[0].x, this.trail[0].y);
            for (let i = 1; i < this.trail.length; i++) {
                ctx.lineTo(this.trail[i].x, this.trail[i].y);
            }
            ctx.strokeStyle = `hsla(${this.hue}, 100%, 70%, ${this.life * 0.3})`;
            ctx.lineWidth = this.size * 0.5;
            ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(0.1, this.size * this.life), 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${this.life})`;
        ctx.globalAlpha = 1;
        ctx.fill();
        ctx.restore();
    }
}

class Ripple {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.maxRadius = 300;
        this.life = 1;
    }

    update() {
        this.radius += 15;
        this.life = 1 - this.radius / this.maxRadius;
    }

    draw(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 212, 255, ${this.life * 0.5})`;
        ctx.lineWidth = 3 * this.life;
        ctx.globalAlpha = 1;
        ctx.stroke();
        ctx.restore();
    }
}

// Export classes to global scope for other scripts
window.Star = Star;
window.Particle = Particle;
window.Ripple = Ripple;
