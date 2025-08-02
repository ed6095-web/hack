// Physics Engine for MindLoop
class PhysicsEngine {
    constructor() {
        this.gravity = 0.5;
        this.friction = 0.98;
        this.bounce = 0.8;
        this.objects = [];
        this.forces = [];
        this.isRunning = false;
    }

    init() {
        this.setupPhysicsObjects();
        this.start();
        console.log('⚗️ Physics engine initialized');
    }

    setupPhysicsObjects() {
        // Find elements that need physics
        const floatingElements = document.querySelectorAll('.hover-float');
        const magneticElements = document.querySelectorAll('.magnetic-hover');
        
        floatingElements.forEach(element => {
            this.addFloatingObject(element);
        });
        
        magneticElements.forEach(element => {
            this.addMagneticObject(element);
        });
    }

    addFloatingObject(element) {
        const rect = element.getBoundingClientRect();
        
        const obj = {
            element: element,
            type: 'floating',
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
            vx: 0,
            vy: 0,
            baseY: rect.top + rect.height / 2,
            amplitude: 10,
            frequency: 0.02,
            phase: Math.random() * Math.PI * 2
        };
        
        this.objects.push(obj);
    }

    addMagneticObject(element) {
        const rect = element.getBoundingClientRect();
        
        const obj = {
            element: element,
            type: 'magnetic',
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
            vx: 0,
            vy: 0,
            baseX: rect.left + rect.width / 2,
            baseY: rect.top + rect.height / 2,
            magnetStrength: 0.1,
            returnForce: 0.05
        };
        
        this.objects.push(obj);
        
        // Add mouse interaction
        element.addEventListener('mouseenter', (e) => {
            obj.isHovered = true;
        });
        
        element.addEventListener('mouseleave', () => {
            obj.isHovered = false;
        });
        
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            obj.mouseX = e.clientX;
            obj.mouseY = e.clientY;
        });
    }

    update() {
        if (!this.isRunning) return;
        
        this.objects.forEach(obj => {
            switch (obj.type) {
                case 'floating':
                    this.updateFloating(obj);
                    break;
                case 'magnetic':
                    this.updateMagnetic(obj);
                    break;
            }
            
            this.applyTransform(obj);
        });
    }

    updateFloating(obj) {
        const time = Date.now() * obj.frequency;
        const targetY = obj.baseY + Math.sin(time + obj.phase) * obj.amplitude;
        
        // Smooth interpolation
        obj.y += (targetY - obj.y) * 0.1;
    }

    updateMagnetic(obj) {
        if (obj.isHovered && obj.mouseX !== undefined) {
            // Calculate attraction to mouse
            const dx = obj.mouseX - obj.x;
            const dy = obj.mouseY - obj.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0) {
                obj.vx += (dx / distance) * obj.magnetStrength;
                obj.vy += (dy / distance) * obj.magnetStrength;
            }
        } else {
            // Return to base position
            const dx = obj.baseX - obj.x;
            const dy = obj.baseY - obj.y;
            
            obj.vx += dx * obj.returnForce;
            obj.vy += dy * obj.returnForce;
        }
        
        // Apply velocity
        obj.x += obj.vx;
        obj.y += obj.vy;
        
        // Apply friction
        obj.vx *= this.friction;
        obj.vy *= this.friction;
        
        // Limit movement
        const maxDistance = 20;
        const dx = obj.x - obj.baseX;
        const dy = obj.y - obj.baseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > maxDistance) {
            obj.x = obj.baseX + (dx / distance) * maxDistance;
            obj.y = obj.baseY + (dy / distance) * maxDistance;
        }
    }

    applyTransform(obj) {
        if (!obj.element) return;
        
        const deltaX = obj.x - (obj.baseX || obj.x);
        const deltaY = obj.y - (obj.baseY || obj.y);
        
        // Calculate rotation based on movement
        const rotation = deltaX * 0.1;
        
        obj.element.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${rotation}deg)`;
    }

    addForce(x, y, strength, radius) {
        this.forces.push({
            x: x,
            y: y,
            strength: strength,
            radius: radius,
            decay: 0.95
        });
    }

    createRipple(x, y) {
        // Create a ripple effect at the given coordinates
        const ripple = document.createElement('div');
        ripple.className = 'physics-ripple';
        ripple.style.cssText = `
            position: fixed;
            left: ${x - 25}px;
            top: ${y - 25}px;
            width: 50px;
            height: 50px;
            border: 2px solid rgba(99, 102, 241, 0.5);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            animation: ripple-expand 0.6s ease-out forwards;
        `;
        
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
        
        // Add force to nearby objects
        this.addForce(x, y, 5, 100);
    }

    handleClick(e) {
        this.createRipple(e.clientX, e.clientY);
    }

    start() {
        this.isRunning = true;
        this.animate();
        
        // Add global click handler for ripples
        document.addEventListener('click', (e) => this.handleClick(e));
    }

    stop() {
        this.isRunning = false;
    }

    animate() {
        this.update();
        
        if (this.isRunning) {
            requestAnimationFrame(() => this.animate());
        }
    }

    resize() {
        // Recalculate base positions on resize
        this.objects.forEach(obj => {
            if (obj.element) {
                const rect = obj.element.getBoundingClientRect();
                obj.baseX = rect.left + rect.width / 2;
                obj.baseY = rect.top + rect.height / 2;
            }
        });
    }

    destroy() {
        this.isRunning = false;
        this.objects = [];
        this.forces = [];
    }
}

// Tilt Effect System
class TiltEffect {
    constructor() {
        this.elements = [];
        this.init();
    }

    init() {
        this.setupTiltElements();
        console.log('🎭 Tilt effects initialized');
    }

    setupTiltElements() {
        const tiltElements = document.querySelectorAll('[data-tilt]');
        
        tiltElements.forEach(element => {
            this.addTiltElement(element);
        });
    }

    addTiltElement(element) {
        const tiltData = {
            element: element,
            maxTilt: 15,
            perspective: 1000,
            scale: 1.05,
            speed: 300,
            glare: true
        };
        
        this.elements.push(tiltData);
        
        element.addEventListener('mouseenter', () => this.onMouseEnter(tiltData));
        element.addEventListener('mousemove', (e) => this.onMouseMove(e, tiltData));
        element.addEventListener('mouseleave', () => this.onMouseLeave(tiltData));
    }

    onMouseEnter(tiltData) {
        tiltData.element.style.willChange = 'transform';
        tiltData.element.style.transition = '';
    }

    onMouseMove(e, tiltData) {
        const rect = tiltData.element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / centerY * tiltData.maxTilt;
        const rotateY = (centerX - x) / centerX * tiltData.maxTilt;
        
        const transform = `
            perspective(${tiltData.perspective}px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg) 
            scale3d(${tiltData.scale}, ${tiltData.scale}, ${tiltData.scale})
        `;
        
        tiltData.element.style.transform = transform;
        
        if (tiltData.glare) {
            this.updateGlare(tiltData, x, y, rect);
        }
    }

    onMouseLeave(tiltData) {
        tiltData.element.style.transition = `transform ${tiltData.speed}ms ease-out`;
        tiltData.element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        tiltData.element.style.willChange = 'auto';
        
        if (tiltData.glareElement) {
            tiltData.glareElement.style.opacity = '0';
        }
    }

    updateGlare(tiltData, x, y, rect) {
        if (!tiltData.glareElement) {
            this.createGlareElement(tiltData);
        }
        
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        
        tiltData.glareElement.style.background = `
            linear-gradient(${Math.atan2(y - rect.height / 2, x - rect.width / 2) * 180 / Math.PI + 90}deg, 
            rgba(255,255,255,0) 0%, 
            rgba(255,255,255,0.1) 50%, 
            rgba(255,255,255,0) 100%)
        `;
        
        tiltData.glareElement.style.left = `${glareX - 50}%`;
        tiltData.glareElement.style.top = `${glareY - 50}%`;
        tiltData.glareElement.style.opacity = '1';
    }

    createGlareElement(tiltData) {
        const glare = document.createElement('div');
        glare.className = 'tilt-glare';
        glare.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: inherit;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
            mix-blend-mode: overlay;
        `;
        
        tiltData.element.style.position = 'relative';
        tiltData.element.style.overflow = 'hidden';
        tiltData.element.appendChild(glare);
        tiltData.glareElement = glare;
    }
}

// Add ripple animation CSS
const physicsStyle = document.createElement('style');
physicsStyle.textContent = `
    @keyframes ripple-expand {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(physicsStyle);

// Initialize physics systems
window.PhysicsEngine = PhysicsEngine;
window.TiltEffect = TiltEffect;

document.addEventListener('DOMContentLoaded', () => {
    window.physicsEngine = new PhysicsEngine();
    window.tiltEffect = new TiltEffect();
});
