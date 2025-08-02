// MindLoop Futuristic Particle System
class ParticleSystem {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.mousePos = { x: 0, y: 0 };
        this.isActive = true;
        this.animationId = null;
        
        // Futuristic configuration
        this.config = {
            particleCount: 80,
            particleSize: { min: 1, max: 3 },
            particleSpeed: { min: 0.2, max: 0.8 },
            connectionDistance: 120,
            mouseInfluence: 100,
            colors: [
                'rgba(99, 102, 241, 0.8)',   // Primary blue
                'rgba(139, 92, 246, 0.8)',   // Purple
                'rgba(236, 72, 153, 0.8)',   // Pink
                'rgba(16, 185, 129, 0.8)',   // Green
                'rgba(245, 158, 11, 0.8)',   // Orange
                'rgba(99, 102, 241, 0.6)',
                'rgba(139, 92, 246, 0.6)',
            ],
            glowIntensity: 15,
            pulseEffect: true,
            neuralConnections: true
        };
    }

    init() {
        this.createCanvas();
        this.setupParticles();
        this.setupEventListeners();
        this.animate();
        console.log('✨ MindLoop Particle System Initialized');
    }

    createCanvas() {
        // Find existing particle container or create one
        let container = document.getElementById('particle-canvas');
        if (!container) {
            container = document.createElement('div');
            container.id = 'particle-canvas';
            container.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: -1;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }

        this.canvas = document.createElement('canvas');
        this.canvas.id = 'mindloop-particles';
        this.canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0.7;
        `;
        
        container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.resize();
    }

    setupParticles() {
        this.particles = [];
        
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.config.particleSpeed.max,
                vy: (Math.random() - 0.5) * this.config.particleSpeed.max,
                size: Math.random() * (this.config.particleSize.max - this.config.particleSize.min) + this.config.particleSize.min,
                opacity: Math.random() * 0.5 + 0.3,
                color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
                hue: Math.random() * 360,
                pulsePhase: Math.random() * Math.PI * 2,
                originalSize: 0,
                glowRadius: Math.random() * this.config.glowIntensity + 5
            });
            this.particles[i].originalSize = this.particles[i].size;
        }
    }

    setupEventListeners() {
        // Resize handler
        window.addEventListener('resize', () => this.resize());
        
        // Mouse tracking for interaction
        document.addEventListener('mousemove', (e) => {
            this.mousePos.x = e.clientX;
            this.mousePos.y = e.clientY;
        });

        // Pause when page is hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });

        // Theme change detection
        const observer = new MutationObserver(() => {
            this.adjustToTheme();
        });
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    }

    adjustToTheme() {
        // Adjust particle colors based on current theme
        if (document.body.classList.contains('masters-theme')) {
            this.config.colors = [
                'rgba(218, 165, 32, 0.8)',
                'rgba(255, 215, 0, 0.8)',
                'rgba(218, 165, 32, 0.6)',
                'rgba(255, 215, 0, 0.6)'
            ];
        } else if (document.body.classList.contains('challenger-theme')) {
            this.config.colors = [
                'rgba(245, 158, 11, 0.8)',
                'rgba(251, 191, 36, 0.8)',
                'rgba(245, 158, 11, 0.6)'
            ];
        } else if (document.body.classList.contains('gaming-theme')) {
            this.config.colors = [
                'rgba(236, 72, 153, 0.8)',
                'rgba(139, 92, 246, 0.8)',
                'rgba(16, 185, 129, 0.8)',
                'rgba(245, 158, 11, 0.8)'
            ];
        }
        
        // Update existing particles with new colors
        this.particles.forEach(particle => {
            particle.color = this.config.colors[Math.floor(Math.random() * this.config.colors.length)];
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Redistribute particles on resize
        this.particles.forEach(particle => {
            if (particle.x > this.canvas.width) particle.x = this.canvas.width;
            if (particle.y > this.canvas.height) particle.y = this.canvas.height;
        });
    }

    update() {
        if (!this.isActive) return;
        
        this.particles.forEach(particle => {
            // Update particle position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Boundary wrapping with smooth transition
            if (particle.x < -particle.size) particle.x = this.canvas.width + particle.size;
            if (particle.x > this.canvas.width + particle.size) particle.x = -particle.size;
            if (particle.y < -particle.size) particle.y = this.canvas.height + particle.size;
            if (particle.y > this.canvas.height + particle.size) particle.y = -particle.size;
            
            // Mouse interaction - magnetic effect
            const dx = this.mousePos.x - particle.x;
            const dy = this.mousePos.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.config.mouseInfluence) {
                const force = (this.config.mouseInfluence - distance) / this.config.mouseInfluence;
                const angle = Math.atan2(dy, dx);
                particle.vx += Math.cos(angle) * force * 0.02;
                particle.vy += Math.sin(angle) * force * 0.02;
                
                // Enhance particle when near mouse
                particle.opacity = Math.min(1, particle.opacity + force * 0.5);
                particle.size = particle.originalSize * (1 + force * 0.5);
            } else {
                // Return to normal state
                particle.opacity = Math.max(0.3, particle.opacity - 0.01);
                particle.size += (particle.originalSize - particle.size) * 0.1;
            }
            
            // Velocity damping
            particle.vx *= 0.99;
            particle.vy *= 0.99;
            
            // Add subtle random movement
            particle.vx += (Math.random() - 0.5) * 0.005;
            particle.vy += (Math.random() - 0.5) * 0.005;
            
            // Pulse effect for futuristic feel
            if (this.config.pulseEffect) {
                particle.pulsePhase += 0.02;
                const pulseIntensity = Math.sin(particle.pulsePhase) * 0.3 + 1;
                particle.glowRadius = (particle.originalSize * 3 + 5) * pulseIntensity;
            }
            
            // Color shifting for dynamic effect
            particle.hue += 0.5;
            if (particle.hue > 360) particle.hue = 0;
        });
    }

    draw() {
        if (!this.isActive) return;
        
        // Clear canvas with subtle fade effect
        this.ctx.fillStyle = 'rgba(10, 10, 11, 0.03)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw neural connections first (behind particles)
        if (this.config.neuralConnections) {
            this.drawConnections();
        }
        
        // Draw particles with glow effects
        this.particles.forEach(particle => {
            this.drawParticle(particle);
        });
    }

    drawParticle(particle) {
        const ctx = this.ctx;
        
        // Save context
        ctx.save();
        
        // Create glow effect
        const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.glowRadius
        );
        
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(0.4, particle.color.replace(/0\.\d+\)/, '0.3)'));
        gradient.addColorStop(1, 'transparent');
        
        // Draw glow
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.glowRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw core particle
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add sparkle effect for special particles
        if (Math.random() > 0.98) {
            this.drawSparkle(particle);
        }
        
        ctx.restore();
    }

    drawSparkle(particle) {
        const ctx = this.ctx;
        const sparkleSize = particle.size * 0.5;
        
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.translate(particle.x, particle.y);
        
        // Draw cross sparkle
        ctx.fillRect(-sparkleSize, -1, sparkleSize * 2, 2);
        ctx.fillRect(-1, -sparkleSize, 2, sparkleSize * 2);
        
        ctx.restore();
    }

    drawConnections() {
        const ctx = this.ctx;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.connectionDistance) {
                    const opacity = (this.config.connectionDistance - distance) / this.config.connectionDistance * 0.4;
                    
                    // Create gradient line for neural effect
                    const gradient = ctx.createLinearGradient(
                        this.particles[i].x, this.particles[i].y,
                        this.particles[j].x, this.particles[j].y
                    );
                    
                    gradient.addColorStop(0, this.particles[i].color.replace(/0\.\d+\)/, `${opacity})`));
                    gradient.addColorStop(0.5, `rgba(99, 102, 241, ${opacity * 0.5})`);
                    gradient.addColorStop(1, this.particles[j].color.replace(/0\.\d+\)/, `${opacity})`));
                    
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    ctx.stroke();
                    
                    // Add data flow effect occasionally
                    if (Math.random() > 0.995) {
                        this.drawDataFlow(this.particles[i], this.particles[j], distance);
                    }
                }
            }
        }
    }

    drawDataFlow(p1, p2, distance) {
        const ctx = this.ctx;
        const progress = (Date.now() % 2000) / 2000;
        const x = p1.x + (p2.x - p1.x) * progress;
        const y = p1.y + (p2.y - p1.y) * progress;
        
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(99, 102, 241, 0.8)';
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    animate() {
        this.update();
        this.draw();
        
        if (this.isActive) {
            this.animationId = requestAnimationFrame(() => this.animate());
        }
    }

    // Public control methods
    pause() {
        this.isActive = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    resume() {
        if (!this.isActive) {
            this.isActive = true;
            this.animate();
        }
    }

    destroy() {
        this.pause();
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }

    // Customization methods
    setParticleCount(count) {
        this.config.particleCount = count;
        this.setupParticles();
    }

    setMouseInfluence(influence) {
        this.config.mouseInfluence = influence;
    }

    addBurst(x, y, count = 10) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = Math.random() * 3 + 2;
            
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 3 + 1,
                opacity: 1,
                color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
                hue: Math.random() * 360,
                pulsePhase: Math.random() * Math.PI * 2,
                originalSize: 0,
                glowRadius: Math.random() * 15 + 10,
                life: 1,
                decay: 0.02
            });
        }
        
        // Remove excess particles
        if (this.particles.length > this.config.particleCount * 2) {
            this.particles.splice(0, count);
        }
    }

    createWave(startX, startY, endX, endY) {
        const steps = 20;
        for (let i = 0; i <= steps; i++) {
            setTimeout(() => {
                const progress = i / steps;
                const x = startX + (endX - startX) * progress;
                const y = startY + (endY - startY) * progress;
                this.addBurst(x, y, 3);
            }, i * 50);
        }
    }
}

// Auto-initialize particle system
document.addEventListener('DOMContentLoaded', () => {
    // Initialize particle system
    window.particleSystem = new ParticleSystem();
    window.particleSystem.init();
    
    // Add click burst effects
    document.addEventListener('click', (e) => {
        if (window.particleSystem) {
            window.particleSystem.addBurst(e.clientX, e.clientY, 8);
        }
    });
});

// Export for global access
window.ParticleSystem = ParticleSystem;

console.log('🌟 MindLoop Particle System Loaded');
