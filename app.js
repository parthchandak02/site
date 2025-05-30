// DOM Elements
const cursor = document.querySelector('.custom-cursor');
const cursorGlow = document.querySelector('.cursor-glow');
const loadingScreen = document.querySelector('.loading-screen');
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-link');
const skillCards = document.querySelectorAll('.skill-card');
const timelineItems = document.querySelectorAll('.timeline-item');
const projectCards = document.querySelectorAll('.project-card');
const metricNumbers = document.querySelectorAll('.metric-number');

// Loading Screen Animation - FIXED
document.addEventListener('DOMContentLoaded', () => {
    // Show main content immediately
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.display = 'none';
        document.body.style.cursor = 'default'; // Changed to default to ensure cursor is visible
        initAnimations();
    }, 1000); // Reduced timeout to 1 second
    
    // Backup to ensure loading screen disappears
    setTimeout(() => {
        if (loadingScreen.style.display !== 'none') {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.display = 'none';
            initAnimations();
        }
    }, 2000);
});

// Custom Cursor
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let glowX = 0, glowY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Make custom cursor visible only after site is loaded
    if (loadingScreen.style.display === 'none') {
        cursor.style.opacity = '1';
        cursorGlow.style.opacity = '1';
        document.body.style.cursor = 'none';
    }
});

function animateCursor() {
    // Smooth cursor following
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;
    
    glowX += (mouseX - glowX) * 0.05;
    glowY += (mouseY - glowY) * 0.05;
    
    cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px)`;
    cursorGlow.style.transform = `translate(${glowX - 20}px, ${glowY - 20}px)`;
    
    requestAnimationFrame(animateCursor);
}

animateCursor();

// Cursor hover effects
document.querySelectorAll('a, button, .skill-card, .project-card, .award-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform += ' scale(1.5)';
        cursor.style.background = '#7ED321';
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = cursor.style.transform.replace(' scale(1.5)', '');
        cursor.style.background = '#FF6B35';
    });
});

// Smooth Scrolling Navigation
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        
        // Update active nav link
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        navbar.style.borderBottom = '1px solid rgba(255, 107, 53, 0.3)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.8)';
        navbar.style.borderBottom = '1px solid rgba(255, 107, 53, 0.1)';
    }
});

// Animated Counter for Metrics
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    }
    
    updateCounter();
}

// Initialize Animations
function initAnimations() {
    // Animate metrics when visible
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const metricsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                metricsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    metricNumbers.forEach(metric => {
        metricsObserver.observe(metric);
    });
    
    // Animate elements on scroll
    const elementsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    // Observe skill cards, timeline items, project cards
    [...skillCards, ...timelineItems, ...projectCards].forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        elementsObserver.observe(element);
    });
}

// Skill Cards Interactive Effects
skillCards.forEach(card => {
    const color = card.getAttribute('data-color');
    
    card.addEventListener('mouseenter', () => {
        card.style.setProperty('--skill-color', color);
        card.style.transform = 'translateY(-10px) scale(1.02)';
        card.style.boxShadow = `0 20px 40px ${color}20`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
        card.style.boxShadow = 'none';
    });
});

// Project Cards 3D Hover Effect
projectCards.forEach(card => {
    card.addEventListener('mouseenter', (e) => {
        card.style.transformStyle = 'preserve-3d';
        card.style.transition = 'transform 0.3s ease';
    });
    
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
    });
});

// Timeline Progressive Animation
function animateTimeline() {
    timelineItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.animationDelay = `${index * 0.2}s`;
            item.classList.add('animate');
        }, index * 100);
    });
}

// Award Cards Stagger Animation
const awardCards = document.querySelectorAll('.award-card');
const awardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 150);
            awardObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

awardCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    awardObserver.observe(card);
});

// Service Timeline Animation
const serviceItems = document.querySelectorAll('.service-item');
serviceItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-30px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

const serviceObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }, index * 200);
            serviceObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

serviceItems.forEach(item => {
    serviceObserver.observe(item);
});

// Parallax Effect for Background Shapes
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelectorAll('.geometric-shape');
    
    parallax.forEach((shape, index) => {
        const speed = 0.1 + (index * 0.05);
        shape.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
    });
});

// Contact Form Interactions (if form is added later)
const contactItems = document.querySelectorAll('.contact-item');
contactItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-5px) scale(1.02)';
        item.style.boxShadow = '0 10px 30px rgba(255, 107, 53, 0.2)';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateY(0) scale(1)';
        item.style.boxShadow = 'none';
    });
});

// Smooth reveal animations for footer
const footerElements = document.querySelectorAll('.footer-section, .footer-brand');
const footerObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            footerObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

footerElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    footerObserver.observe(element);
});

// Active section highlighting in navigation
const sections = document.querySelectorAll('section[id]');
const navLinksArray = Array.from(navLinks);

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinksArray.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Enhanced button hover effects
const buttons = document.querySelectorAll('.btn');
buttons.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-3px) scale(1.05)';
        
        if (btn.classList.contains('btn--primary')) {
            btn.style.boxShadow = '0 15px 35px rgba(255, 107, 53, 0.4)';
        } else {
            btn.style.boxShadow = '0 15px 35px rgba(255, 107, 53, 0.2)';
        }
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translateY(0) scale(1)';
        btn.style.boxShadow = 'none';
    });
});

// Profile card floating animation enhancement
const profileCard = document.querySelector('.profile-card');
if (profileCard) {
    let floatDirection = 1;
    
    setInterval(() => {
        const currentTransform = profileCard.style.transform || 'translateY(0px)';
        const currentY = parseFloat(currentTransform.match(/translateY\(([^)]+)\)/)?.[1] || 0);
        
        if (currentY >= 10) floatDirection = -1;
        if (currentY <= -10) floatDirection = 1;
        
        const newY = currentY + (floatDirection * 0.5);
        profileCard.style.transform = `translateY(${newY}px)`;
    }, 50);
}

// Add subtle animations to tech tags
const techTags = document.querySelectorAll('.tech-tag');
techTags.forEach(tag => {
    tag.addEventListener('mouseenter', () => {
        tag.style.transform = 'scale(1.1)';
        tag.style.background = 'rgba(255, 107, 53, 0.2)';
    });
    
    tag.addEventListener('mouseleave', () => {
        tag.style.transform = 'scale(1)';
        tag.style.background = 'rgba(255, 107, 53, 0.1)';
    });
});

// Typing effect for hero subtitle (optional enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Initialize typing effect after loading
setTimeout(() => {
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const originalText = heroSubtitle.textContent;
        typeWriter(heroSubtitle, originalText, 80);
    }
}, 1500);

// Smooth page transitions
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in effect to all main sections
    const mainSections = document.querySelectorAll('section');
    mainSections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
    
    // Reveal sections on scroll
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    mainSections.forEach(section => {
        sectionObserver.observe(section);
    });
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
const throttledScrollHandler = throttle(() => {
    // Scroll-based animations here
}, 16); // ~60fps

window.addEventListener('scroll', throttledScrollHandler);

// Hide cursor initially
cursor.style.opacity = '0';
cursorGlow.style.opacity = '0';