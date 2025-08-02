// MindLoop Application Controller
class MindLoopApp {
    constructor() {
        this.isInitialized = false;
        this.userData = this.loadUserData();
        this.particles = null;
        this.init();
    }

    async init() {
        console.log('🚀 Initializing MindLoop Platform...');
        
        try {
            // Show loading screen
            this.showLoadingScreen();
            
            // Initialize core systems
            await this.initializeCore();
            
            // Wait for AI to be ready
            await this.waitForAI();
            
            // Initialize UI components
            this.initializeUI();
            
            // Initialize effects
            this.initializeEffects();
            
            // Hide loading screen
            this.hideLoadingScreen();
            
            this.isInitialized = true;
            console.log('✅ MindLoop Platform Ready!');
            
        } catch (error) {
            console.error('❌ Failed to initialize:', error);
            this.showError('Failed to initialize platform');
        }
    }

    showLoadingScreen() {
        const loading = document.getElementById('loading-screen');
        if (loading) {
            loading.style.display = 'flex';
            this.animateLoadingText();
        }
    }

    animateLoadingText() {
        const aiText = document.querySelector('.ai-text');
        if (!aiText) return;
        
        const messages = [
            'Initializing AI Engine...',
            'Loading Neural Networks...',
            'Preparing Learning Models...',
            'Calibrating Intelligence...',
            'Almost Ready...'
        ];
        
        let index = 0;
        const interval = setInterval(() => {
            aiText.textContent = messages[index];
            index = (index + 1) % messages.length;
        }, 800);
        
        setTimeout(() => clearInterval(interval), 4000);
    }

    hideLoadingScreen() {
        const loading = document.getElementById('loading-screen');
        if (loading) {
            setTimeout(() => {
                loading.classList.add('hidden');
                setTimeout(() => loading.style.display = 'none', 500);
            }, 1000);
        }
    }

    async initializeCore() {
        // Setup local storage
        this.initializeStorage();
        
        // Setup event listeners
        this.setupGlobalEvents();
        
        console.log('✅ Core systems initialized');
    }

    async waitForAI() {
        if (window.clientAI) {
            let attempts = 0;
            while (!window.clientAI.isInitialized && attempts < 50) {
                await this.delay(100);
                attempts++;
            }
            
            if (window.clientAI.isInitialized) {
                console.log('✅ AI Engine ready');
            } else {
                console.warn('⚠️ AI Engine initialization timeout');
            }
        }
    }

    initializeUI() {
        // Initialize all UI components
        this.initializeNavigation();
        this.initializeMobileMenu();
        this.initializeCounters();
        this.initializeFileUpload();
        this.initializeTiltEffects();
        this.initializeActivityFilters();
        
        console.log('✅ UI initialized');
    }

    initializeStorage() {
        if (!localStorage.getItem('mindloop_data')) {
            const defaultData = {
                user: {
                    id: this.generateUserId(),
                    name: 'Student',
                    level: 'Explorer',
                    joinDate: new Date().toISOString()
                },
                stats: {
                    currentStreak: 7,
                    longestStreak: 15,
                    totalPoints: 2450,
                    completedLevels: 12,
                    processedDocs: 5,
                    aiQuestions: 127,
                    lastActivity: new Date().toDateString()
                },
                documents: [],
                levels: [],
                achievements: ['first_steps', 'week_warrior']
            };
            
            localStorage.setItem('mindloop_data', JSON.stringify(defaultData));
        }
    }

    loadUserData() {
        const data = JSON.parse(localStorage.getItem('mindloop_data') || '{}');
        return data;
    }

    saveUserData() {
        localStorage.setItem('mindloop_data', JSON.stringify(this.userData));
    }

    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    setupGlobalEvents() {
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
                e.preventDefault();
                this.triggerFileUpload();
            }
            
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        // Click outside handler
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                const sidebar = document.getElementById('sidebar');
                const toggle = document.getElementById('mobile-toggle');
                
                if (sidebar && !sidebar.contains(e.target) && !toggle?.contains(e.target)) {
                    sidebar.classList.remove('active');
                }
            }
        });

        // Resize handler
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimations();
            } else {
                this.resumeAnimations();
            }
        });
    }

    initializeNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                this.createHoverEffect(link);
            });
        });
    }

    initializeMobileMenu() {
        const toggle = document.getElementById('mobile-toggle');
        const sidebar = document.getElementById('sidebar');
        
        if (toggle && sidebar) {
            toggle.addEventListener('click', () => {
                sidebar.classList.toggle('active');
                this.animateToggle(toggle);
            });
        }
    }

    animateToggle(toggle) {
        toggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            toggle.style.transform = 'scale(1)';
        }, 150);
    }

    initializeCounters() {
        const counters = document.querySelectorAll('.counter');
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.dataset.target);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.floor(current).toLocaleString();
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            };
            
            updateCounter();
        };
        
        // Intersection Observer for performance
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        counters.forEach(counter => observer.observe(counter));
    }

    initializeFileUpload() {
        const uploadForm = document.getElementById('ai-upload-form');
        const fileInput = document.getElementById('file-input');
        const uploadZone = document.getElementById('upload-zone');
        
        if (!uploadForm || !fileInput || !uploadZone) return;
        
        // Form submission
        uploadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFileUpload();
        });
        
        // File input change
        fileInput.addEventListener('change', () => {
            this.handleFileUpload();
        });
        
        // Upload zone click
        uploadZone.addEventListener('click', () => {
            fileInput.click();
        });
        
        // Drag and drop
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });
        
        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('dragover');
        });
        
        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            
            const files = Array.from(e.dataTransfer.files);
            this.processFiles(files);
        });
    }

    async handleFileUpload() {
        const fileInput = document.getElementById('file-input');
        const files = Array.from(fileInput.files);
        
        if (files.length === 0) {
            this.showNotification('Please select a file to upload', 'warning');
            return;
        }
        
        await this.processFiles(files);
    }

    async processFiles(files) {
        if (!window.clientAI || !window.clientAI.isInitialized) {
            this.showNotification('AI Engine not ready. Please wait...', 'error');
            return;
        }
        
        for (const file of files) {
            try {
                // Show processing modal
                this.showProcessingModal(file.name);
                
                // Process with AI
                const result = await window.clientAI.processDocument(
                    file,
                    (status, progress) => this.updateProcessingProgress(status, progress)
                );
                
                if (result.success) {
                    // Update user data
                    this.userData.stats.processedDocs += 1;
                    this.userData.stats.aiQuestions += result.totalQuestions;
                    this.userData.documents.push({
                        name: file.name,
                        size: file.size,
                        processedAt: new Date().toISOString(),
                        questionsGenerated: result.totalQuestions
                    });
                    this.userData.levels.push(...result.levels);
                    this.saveUserData();
                    
                    // Hide processing modal
                    this.hideProcessingModal();
                    
                    // Show success modal
                    this.showSuccessModal(result);
                    
                    // Update UI
                    this.updateStatsDisplay();
                    
                } else {
                    throw new Error(result.error || 'Processing failed');
                }
                
            } catch (error) {
                console.error('File processing error:', error);
                this.hideProcessingModal();
                this.showNotification(`Error processing ${file.name}: ${error.message}`, 'error');
            }
        }
        
        // Reset file input
        const fileInput = document.getElementById('file-input');
        if (fileInput) fileInput.value = '';
    }

    showProcessingModal(fileName) {
        const modal = document.getElementById('ai-modal');
        if (modal) {
            modal.classList.add('active');
            
            const statusElement = document.getElementById('processing-status');
            if (statusElement) {
                statusElement.textContent = `Analyzing ${fileName}...`;
            }
        }
    }

    updateProcessingProgress(status, progress) {
        const statusElement = document.getElementById('processing-status');
        const progressElement = document.getElementById('processing-progress');
        
        if (statusElement) statusElement.textContent = status;
        if (progressElement) progressElement.textContent = `${progress}%`;
        
        if (progress > 50) {
            const confidenceElement = document.getElementById('ai-confidence');
            if (confidenceElement) {
                const confidence = (Math.random() * 0.15 + 0.85).toFixed(2);
                confidenceElement.textContent = `${(confidence * 100).toFixed(0)}%`;
            }
        }
    }

    hideProcessingModal() {
        const modal = document.getElementById('ai-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    showSuccessModal(result) {
        const modal = document.getElementById('success-modal');
        if (modal) {
            modal.classList.add('active');
            
            const questionsCount = document.getElementById('questions-count');
            const levelsCount = document.getElementById('levels-count');
            
            if (questionsCount) questionsCount.textContent = result.totalQuestions;
            if (levelsCount) levelsCount.textContent = result.levels.length;
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                modal.classList.remove('active');
            }, 5000);
        }
    }

    updateStatsDisplay() {
        // Update stats in UI
        this.animateNumber('processed-docs', this.userData.stats.processedDocs);
        this.animateNumber('ai-questions', this.userData.stats.aiQuestions);
    }

    animateNumber(elementId, newValue) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const currentValue = parseInt(element.textContent) || 0;
        const increment = (newValue - currentValue) / 30;
        let current = currentValue;
        
        const update = () => {
            if (Math.abs(current - newValue) > 1) {
                current += increment;
                element.textContent = Math.floor(current);
                requestAnimationFrame(update);
            } else {
                element.textContent = newValue;
            }
        };
        
        update();
    }

    initializeTiltEffects() {
        const tiltElements = document.querySelectorAll('[data-tilt]');
        
        tiltElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            });
        });
    }

    initializeActivityFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const activityItems = document.querySelectorAll('.activity-item');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter activities
                const filter = btn.textContent.toLowerCase();
                
                activityItems.forEach(item => {
                    if (filter === 'all' || item.dataset.type === filter) {
                        item.style.display = 'flex';
                        item.style.animation = 'fadeIn 0.3s ease';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    initializeEffects() {
        // Initialize particle system if available
        if (window.ParticleSystem) {
            this.particles = new window.ParticleSystem();
            this.particles.init();
        }
        
        // Initialize canvas animations
        this.initializeCanvasAnimations();
        
        console.log('✅ Effects initialized');
    }

    initializeCanvasAnimations() {
        // Neural background animation
        const neuralBg = document.getElementById('neural-bg');
        if (neuralBg) {
            this.startNeuralBackground(neuralBg);
        }
        
        // Flame animations
        const flameCanvases = document.querySelectorAll('.flame-animation');
        flameCanvases.forEach(canvas => {
            this.startFlameAnimation(canvas);
        });
    }

    startNeuralBackground(canvas) {
        const ctx = canvas.getContext('2d');
        
        const animate = () => {
            const width = canvas.width = window.innerWidth;
            const height = canvas.height = window.innerHeight;
            
            ctx.clearRect(0, 0, width, height);
            ctx.strokeStyle = 'rgba(99, 102, 241, 0.1)';
            ctx.lineWidth = 1;
            
            const time = Date.now() * 0.001;
            
            for (let i = 0; i < 20; i++) {
                const x1 = (Math.sin(time + i) * 200) + width / 2;
                const y1 = (Math.cos(time + i) * 100) + height / 2;
                const x2 = (Math.sin(time + i + 1) * 200) + width / 2;
                const y2 = (Math.cos(time + i + 1) * 100) + height / 2;
                
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }
            
            if (!document.hidden) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }

    startFlameAnimation(canvas) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        const particles = [];
        
        for (let i = 0; i < 20; i++) {
            particles.push({
                x: Math.random() * width,
                y: height,
                vx: (Math.random() - 0.5) * 2,
                vy: -Math.random() * 3 - 2,
                life: 1.0,
                decay: Math.random() * 0.02 + 0.01
            });
        }
        
        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            
            particles.forEach((particle, index) => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.life -= particle.decay;
                
                if (particle.life <= 0) {
                    particles[index] = {
                        x: Math.random() * width,
                        y: height,
                        vx: (Math.random() - 0.5) * 2,
                        vy: -Math.random() * 3 - 2,
                        life: 1.0,
                        decay: Math.random() * 0.02 + 0.01
                    };
                }
                
                const alpha = particle.life;
                const red = Math.floor(255 * alpha);
                const green = Math.floor(100 * alpha);
                const blue = 0;
                
                ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
                ctx.fill();
            });
            
            if (!document.hidden) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }

    createHoverEffect(element) {
        // Create particle burst effect
        const rect = element.getBoundingClientRect();
        
        for (let i = 0; i < 3; i++) {
            const particle = document.createElement('div');
            particle.className = 'hover-particle';
            particle.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: var(--primary);
                border-radius: 50%;
                pointer-events: none;
                z-index: 10000;
                left: ${rect.left + Math.random() * rect.width}px;
                top: ${rect.top + Math.random() * rect.height}px;
                animation: particle-burst 0.6s ease-out forwards;
            `;
            
            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 600);
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">
                    ${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}
                </div>
                <div class="notification-message">${message}</div>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: var(--radius-lg);
            padding: 1rem;
            z-index: 10000;
            animation: notification-slide-in 0.3s ease;
            max-width: 400px;
            box-shadow: var(--shadow-lg);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'notification-slide-out 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    triggerFileUpload() {
        const fileInput = document.getElementById('file-input');
        if (fileInput) {
            fileInput.click();
        }
    }

    closeAllModals() {
        const modals = document.querySelectorAll('.ai-modal, .success-modal');
        modals.forEach(modal => {
            modal.classList.remove('active');
        });
    }

    handleResize() {
        if (this.particles) {
            this.particles.resize();
        }
    }

    pauseAnimations() {
        document.body.style.animationPlayState = 'paused';
    }

    resumeAnimations() {
        document.body.style.animationPlayState = 'running';
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.mindLoopApp = new MindLoopApp();
});

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes notification-slide-in {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes notification-slide-out {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes particle-burst {
        0% { transform: scale(0) translate(0, 0); opacity: 1; }
        100% { transform: scale(1) translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px); opacity: 0; }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .notification-icon {
        font-size: 1.2rem;
    }
    
    .notification-message {
        flex: 1;
        font-size: 0.9rem;
        font-weight: 500;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        font-size: 1.2rem;
        font-weight: bold;
        transition: color 0.2s ease;
    }
    
    .notification-close:hover {
        color: var(--text-primary);
    }
`;
document.head.appendChild(style);

console.log('🎉 MindLoop Platform Ready!');
