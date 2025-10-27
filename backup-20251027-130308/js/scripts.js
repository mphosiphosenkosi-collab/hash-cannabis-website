// Initialize particles
function initParticles() {
    const container = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const delay = Math.random() * 6;
        const duration = 3 + Math.random() * 3;
        
        particle.style.left = `${left}%`;
        particle.style.top = `${top}%`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;
        
        container.appendChild(particle);
    }
}

// Fixed Carousel with Working Navigation
function initCarousel() {
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const images = document.querySelectorAll('.carousel-img');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const autoplayToggle = document.getElementById('autoplay');
    
    let currentSlide = 0;
    let autoplayInterval;
    let isAnimating = false;

    console.log('🚀 Carousel initialized with', slides.length, 'slides');

    // Initialize carousel
    initializeCarousel();

    function initializeCarousel() {
        // Load images for the first slide immediately
        loadImageForSlide(0);
        
        // Preload other images
        preloadAllImages();
        
        // Start autoplay
        startAutoplay();
        
        // Add click listeners to controls
        setupEventListeners();
    }

    function setupEventListeners() {
        // Previous button
        prevBtn.addEventListener('click', () => {
            console.log('⬅️ Previous button clicked');
            prevSlide();
            resetAutoplay();
        });

        // Next button
        nextBtn.addEventListener('click', () => {
            console.log('➡️ Next button clicked');
            nextSlide();
            resetAutoplay();
        });

        // Indicators
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                console.log(`🔘 Indicator ${index} clicked`);
                goToSlide(index);
                resetAutoplay();
            });
        });

        // Auto-play toggle
        autoplayToggle.addEventListener('change', () => {
            console.log('🔁 Auto-play:', autoplayToggle.checked ? 'ON' : 'OFF');
            if (autoplayToggle.checked) {
                startAutoplay();
            } else {
                stopAutoplay();
            }
        });

        // Pause autoplay on hover
        const carousel = document.querySelector('.carousel-container');
        carousel.addEventListener('mouseenter', () => {
            console.log('🖱️ Mouse entered - pausing autoplay');
            stopAutoplay();
        });
        
        carousel.addEventListener('mouseleave', () => {
            if (autoplayToggle.checked) {
                console.log('🖱️ Mouse left - resuming autoplay');
                startAutoplay();
            }
        });

        // Touch/swipe support
        let startX = 0;
        let endX = 0;

        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            stopAutoplay();
        });

        carousel.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
            if (autoplayToggle.checked) {
                startAutoplay();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                console.log('⌨️ Left arrow pressed');
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                console.log('⌨️ Right arrow pressed');
                nextSlide();
            }
        });
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                console.log('👆 Swiped left -> next slide');
                nextSlide();
            } else {
                console.log('👇 Swiped right -> previous slide');
                prevSlide();
            }
        }
    }

    function loadImageForSlide(slideIndex) {
        const img = slides[slideIndex].querySelector('.carousel-img');
        if (img && !img.classList.contains('loaded')) {
            const image = new Image();
            image.src = img.src;
            image.onload = () => {
                img.classList.add('loaded');
                img.classList.remove('error');
                console.log(`✅ Image loaded: ${img.src}`);
            };
            image.onerror = () => {
                img.classList.add('error');
                img.classList.remove('loaded');
                console.warn(`❌ Failed to load image: ${img.src}`);
            };
        }
    }

    function preloadAllImages() {
        images.forEach((img, index) => {
            if (index !== 0) {
                const image = new Image();
                image.src = img.src;
                image.onload = () => {
                    img.classList.add('loaded');
                    console.log(`✅ Preloaded: ${img.src}`);
                };
                image.onerror = () => {
                    img.classList.add('error');
                    console.warn(`❌ Failed to preload: ${img.src}`);
                };
            }
        });
    }

    // Auto-play functionality
    function startAutoplay() {
        if (autoplayInterval) clearInterval(autoplayInterval);
        autoplayInterval = setInterval(() => {
            if (!isAnimating && autoplayToggle.checked) {
                console.log('🔁 Auto-play advancing to next slide');
                nextSlide();
            }
        }, 5000);
    }

    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    }

    function goToSlide(index) {
        if (isAnimating || index === currentSlide) {
            console.log('⏸️ Slide change blocked - already animating or same slide');
            return;
        }
        
        console.log(`🔄 Changing slide from ${currentSlide} to ${index}`);
        isAnimating = true;
        
        // Hide current slide
        slides[currentSlide].classList.remove('active');
        indicators[currentSlide].classList.remove('active');
        
        // Update current slide
        currentSlide = index;
        
        // Show new slide
        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');
        
        // Ensure image for current slide is loaded
        loadImageForSlide(currentSlide);
        
        // Preload adjacent images
        preloadAdjacentImages();
        
        // Reset animation flag
        setTimeout(() => {
            isAnimating = false;
            console.log('✅ Slide change complete');
        }, 600);
    }

    function preloadAdjacentImages() {
        const nextIndex = (currentSlide + 1) % slides.length;
        const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        
        [nextIndex, prevIndex].forEach(index => {
            const img = slides[index].querySelector('.carousel-img');
            if (img && !img.classList.contains('loaded') && !img.classList.contains('error')) {
                const image = new Image();
                image.src = img.src;
                image.onload = () => img.classList.add('loaded');
                image.onerror = () => img.classList.add('error');
            }
        });
    }

    function nextSlide() {
        const nextIndex = (currentSlide + 1) % slides.length;
        goToSlide(nextIndex);
    }

    function prevSlide() {
        const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(prevIndex);
    }

    function resetAutoplay() {
        if (autoplayToggle.checked) {
            stopAutoplay();
            startAutoplay();
        }
    }

    // Debug info
    console.log('🎠 Carousel ready!');
    console.log('Controls:', {
        prevBtn: !!prevBtn,
        nextBtn: !!nextBtn,
        indicators: indicators.length,
        autoplay: !!autoplayToggle
    });
}

// Enhanced 3D hover effects for 6 cards
function initEnhanced3DHover() {
    const cards = document.querySelectorAll('.product-card-3d');
    
    cards.forEach((card, index) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = (x - centerX) / 20;
            const rotateX = (centerY - y) / 20;
            
            // Staggered animation based on card position
            const delay = index * 0.1;
            
            card.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                translateZ(20px)
                scale(1.02)
            `;
            
            // Enhanced glow effect based on mouse position
            const glow = card.querySelector('.product-hover-effect');
            if (glow) {
                const glowX = (x / rect.width) * 100;
                const glowY = (y / rect.height) * 100;
                glow.style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, var(--primary-glow), transparent)`;
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0) scale(1)';
            
            const glow = card.querySelector('.product-hover-effect');
            if (glow) {
                glow.style.background = 'var(--primary-glow)';
            }
        });
    });
}

// Update the DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initEnhanced3DHover(); // Replace init3DHover with this
    initScrollAnimations();
    initButtonInteractions();
    initSmoothScroll();
    initHeaderScroll();
    
    // Add enhanced styles
    const enhancedStyle = document.createElement('style');
    enhancedStyle.textContent = `
        .product-card-3d {
            opacity: 0;
            transform: translateY(50px) scale(0.9);
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .product-card-3d.visible {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(enhancedStyle);
});

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.product-card-3d, .feature-3d, .stat').forEach(el => {
        observer.observe(el);
    });
}

// Button interactions
function initButtonInteractions() {
    const buttons = document.querySelectorAll('.btn-primary-3d, .btn-secondary-3d, .product-btn-3d');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Navigation scroll
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link');
    
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
        });
    });
}

// Header scroll effect
function initHeaderScroll() {
    const header = document.querySelector('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.background = 'rgba(10, 10, 10, 0.95)';
            header.style.backdropFilter = 'blur(30px)';
        } else {
            header.style.background = 'rgba(10, 10, 10, 0.8)';
            header.style.backdropFilter = 'blur(20px)';
        }
        
        lastScroll = currentScroll;
    });
}

// Initialize everything when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    init3DHover();
    initScrollAnimations();
    initButtonInteractions();
    initSmoothScroll();
    initHeaderScroll();
    
    // Add CSS for ripple effect
    const style = document.createElement('style');
    style.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});

// Parallax effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-cube, .floating-pyramid');
    
    parallaxElements.forEach(el => {
        const speed = 0.5;
        const yPos = -(scrolled * speed);
        el.style.transform = `translateY(${yPos}px) ${el.style.transform.split(' ').slice(1).join(' ')}`;
    });
});


// Locations and Contact Interactions
function initLocationsContact() {
    // FAQ Toggle
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isVisible = answer.style.display === 'block';
            
            // Close all answers
            document.querySelectorAll('.faq-answer').forEach(ans => {
                ans.style.display = 'none';
            });
            
            // Toggle current answer
            answer.style.display = isVisible ? 'none' : 'block';
        });
    });

    // Form submission
    const contactForm = document.querySelector('.digital-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            
            // Show success message
            alert(`Thank you ${name}! Your digital message has been transmitted. We'll respond within 24 hours.`);
            
            // Reset form
            contactForm.reset();
        });
    }

    // Location buttons interaction
    const locationButtons = document.querySelectorAll('.location-btn');
    locationButtons.forEach(button => {
        button.addEventListener('click', () => {
            const buttonText = button.textContent.trim();
            if (buttonText === 'GET DIRECTIONS') {
                alert('Opening maps with directions to our premium location...');
            } else if (buttonText === 'VIRTUAL TOUR') {
                alert('Launching immersive 3D virtual tour...');
            } else if (buttonText === 'GET UPDATES') {
                alert('You are now subscribed to location updates!');
            } else if (buttonText === 'PRE-REGISTER') {
                alert('Opening pre-registration form...');
            }
        });
    });

    // Contact info buttons
    const infoButtons = document.querySelectorAll('.info-btn');
    infoButtons.forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.info-card');
            const title = card.querySelector('h4').textContent;
            
            if (title === 'LIVE CHAT') {
                alert('Opening live chat with our digital specialists...');
            } else if (title === 'DIGITAL HOTLINE') {
                alert('Calling 1-800-HASH-DIGITAL...');
            } else if (title === 'QUANTUM MAIL') {
                alert('Opening email client to hello@hashdigital.com...');
            }
        });
    });

    // Social buttons
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', () => {
            const platform = button.textContent;
            alert(`Connecting to our ${platform} social grid...`);
        });
    });
}

// Update the DOMContentLoaded to include new functions
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initEnhanced3DHover();
    initScrollAnimations();
    initButtonInteractions();
    initSmoothScroll();
    initHeaderScroll();
    initLocationsContact(); // Add this line
    
    // ... rest of your existing code
});