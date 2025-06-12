// Network Background Animation
class NetworkBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.lines = [];
        this.mouse = { x: 0, y: 0 };
        
        this.init();
        this.createParticles();
        this.animate();
        this.bindEvents();
    }
    
    init() {
        const networkBg = document.getElementById('network-bg');
        networkBg.appendChild(this.canvas);
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.zIndex = '-1';
        this.resize();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 10000);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(100, 255, 218, ${particle.opacity})`;
            this.ctx.fill();
        });
    }
    
    drawLines() {
        this.particles.forEach((particle, i) => {
            this.particles.slice(i + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.strokeStyle = `rgba(100, 255, 218, ${0.1 * (1 - distance / 100)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            });
        });
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.updateParticles();
        this.drawLines();
        this.drawParticles();
        
        requestAnimationFrame(() => this.animate());
    }
    
    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.particles = [];
            this.createParticles();
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }
}

// Navigation Toggle
class Navigation {
    constructor() {
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.navbar = document.querySelector('.navbar');
        
        this.bindEvents();
        this.handleScroll();
    }
    
    bindEvents() {
        this.navToggle.addEventListener('click', () => {
            this.navMenu.classList.toggle('active');
            this.navToggle.classList.toggle('active');
        });
        
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.navMenu.classList.remove('active');
                this.navToggle.classList.remove('active');
            });
        });
        
        window.addEventListener('scroll', () => this.handleScroll());
    }
    
    handleScroll() {
        const scrolled = window.scrollY > 50;
        this.navbar.style.background = scrolled 
            ? 'rgba(0, 0, 0, 0.95)' 
            : 'rgba(0, 0, 0, 0.9)';
    }
}

// Smooth Scrolling
class SmoothScroll {
    constructor() {
        this.bindEvents();
    }
    
    bindEvents() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Animation on Scroll
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('.skill-progress, .stat-number');
        this.bindEvents();
    }
    
    bindEvents() {
        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('load', () => this.handleScroll());
    }
    
    handleScroll() {
        this.elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                if (element.classList.contains('skill-progress')) {
                    const width = element.getAttribute('data-width');
                    element.style.width = width + '%';
                }
                
                if (element.classList.contains('stat-number')) {
                    this.animateCounter(element);
                }
            }
        });
    }
    
    animateCounter(element) {
        if (element.classList.contains('animated')) return;
        element.classList.add('animated');
        
        const target = parseInt(element.getAttribute('data-target'));
        const increment = target / 50;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            element.textContent = Math.floor(current);
            
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 40);
    }
}

// Typing Effect
class TypingEffect {
    constructor() {
        this.textElement = document.querySelector('.hero-subtitle');
        this.texts = [
            'Network Engineer & Developer',
            'Cloud Infrastructure Specialist',
            'Network Security Expert',
            'Automation Engineer'
        ];
        this.currentIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.delay = 150;
        
        this.init();
    }
    
    init() {
        if (this.textElement) {
            this.type();
        }
    }
    
    type() {
        const currentText = this.texts[this.currentIndex];
        
        if (this.isDeleting) {
            this.textElement.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.textElement.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }
        
        let typeSpeed = this.isDeleting ? 50 : 150;
        
        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = 2000;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.currentIndex = (this.currentIndex + 1) % this.texts.length;
            typeSpeed = 500;
        }
        
        setTimeout(() => this.type(), typeSpeed);
    }
}

// Project Card Animations
class ProjectAnimations {
    constructor() {
        this.projectCards = document.querySelectorAll('.project-card');
        this.bindEvents();
    }
    
    bindEvents() {
        this.projectCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
}

// Form Handling
class ContactForm {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.bindEvents();
    }
    
    bindEvents() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });
        }
    }
    
    handleSubmit() {
        const formData = new FormData(this.form);
        const button = this.form.querySelector('button[type="submit"]');
        const originalText = button.textContent;
        
        button.textContent = 'Mengirim...';
        button.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            button.textContent = 'Terkirim! ✓';
            button.style.background = '#28a745';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
                button.style.background = '';
                this.form.reset();
            }, 2000);
        }, 1500);
    }
}

// Particle Cursor Effect
class ParticleCursor {
    constructor() {
        this.particles = [];
        this.cursor = { x: 0, y: 0 };
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.init();
        this.bindEvents();
        this.animate();
    }
    
    init() {
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '9999';
        this.canvas.style.mixBlendMode = 'screen';
        
        document.body.appendChild(this.canvas);
        this.resize();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        
        document.addEventListener('mousemove', (e) => {
            this.cursor.x = e.clientX;
            this.cursor.y = e.clientY;
            
            this.addParticle();
        });
    }
    
    addParticle() {
        this.particles.push({
            x: this.cursor.x,
            y: this.cursor.y,
            size: Math.random() * 3 + 1,
            life: 1,
            decay: Math.random() * 0.02 + 0.01,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2
        });
        
        if (this.particles.length > 50) {
            this.particles.shift();
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((particle, index) => {
            particle.life -= particle.decay;
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.life <= 0) {
                this.particles.splice(index, 1);
                return;
            }
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(100, 255, 218, ${particle.life})`;
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Intersection Observer for Animations
class IntersectionAnimations {
    constructor() {
        this.setupObserver();
    }
    
    setupObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    
                    if (entry.target.classList.contains('project-card')) {
                        const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, delay);
                    }
                }
            });
        }, options);
        
        // Observe elements
        document.querySelectorAll('.project-card, .skill-category, .about-content, .contact-content').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            this.observer.observe(el);
        });
    }
}

// Theme Switcher (Optional)
class ThemeSwitcher {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.applyTheme();
        this.createToggle();
    }
    
    createToggle() {
        const toggle = document.createElement('button');
        toggle.innerHTML = '<i class="fas fa-moon"></i>';
        toggle.className = 'theme-toggle';
        toggle.style.cssText = `
            position: fixed;
            top: 50%;
            right: 30px;
            transform: translateY(-50%);
            width: 50px;
            height: 50px;
            border: none;
            border-radius: 50%;
            background: #667eea;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
            z-index: 1000;
        `;
        
        toggle.addEventListener('click', () => this.toggleTheme());
        document.body.appendChild(toggle);
        
        this.toggle = toggle;
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme();
        localStorage.setItem('theme', this.currentTheme);
    }
    
    applyTheme() {
        document.body.setAttribute('data-theme', this.currentTheme);
        
        if (this.toggle) {
            this.toggle.innerHTML = this.currentTheme === 'dark' 
                ? '<i class="fas fa-sun"></i>' 
                : '<i class="fas fa-moon"></i>';
        }
    }
}

// Loading Animation
class LoadingAnimation {
    constructor() {
        this.createLoader();
        this.hideLoader();
    }
    
    createLoader() {
        const loader = document.createElement('div');
        loader.id = 'loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="network-loader">
                    <div class="node"></div>
                    <div class="node"></div>
                    <div class="node"></div>
                </div>
                <p>Menghubungkan...</p>
            </div>
        `;
        
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            transition: opacity 0.5s ease;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .loader-content {
                text-align: center;
                color: white;
            }
            .network-loader {
                display: flex;
                gap: 20px;
                margin-bottom: 20px;
                justify-content: center;
            }
            .node {
                width: 20px;
                height: 20px;
                background: #64ffda;
                border-radius: 50%;
                animation: pulse 1.5s infinite;
            }
            .node:nth-child(2) { animation-delay: 0.5s; }
            .node:nth-child(3) { animation-delay: 1s; }
            @keyframes pulse {
                0%, 80%, 100% { transform: scale(0.8); }
                40% { transform: scale(1.2); }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(loader);
        this.loader = loader;
    }
    
    hideLoader() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.loader.style.opacity = '0';
                setTimeout(() => {
                    this.loader.remove();
                }, 500);
            }, 1000);
        });
    }
}

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Core functionality
    new LoadingAnimation();
    new NetworkBackground();
    new Navigation();
    new SmoothScroll();
    new ScrollAnimations();
    
    // Enhanced features
    new TypingEffect();
    new ProjectAnimations();
    new ContactForm();
    new IntersectionAnimations();
    
    // Optional features (comment out if not needed)
    new ParticleCursor();
    new ThemeSwitcher();
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when tab is not visible
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations when tab becomes visible
        document.body.style.animationPlayState = 'running';
    }
});