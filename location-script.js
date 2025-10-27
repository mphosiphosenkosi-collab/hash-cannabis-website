// Single Location Interactions
function initSingleLocation() {
    const locationCard = document.querySelector('.single-location-card');
    if (locationCard) {
        locationCard.addEventListener('mousemove', (e) => {
            const rect = locationCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = (x - centerX) / 50;
            const rotateX = (centerY - y) / 50;
            
            locationCard.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg)
                translateZ(10px)
            `;
        });
        
        locationCard.addEventListener('mouseleave', () => {
            locationCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    }

    // Action buttons
    const actionButtons = document.querySelectorAll('.location-actions button');
    actionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const buttonText = button.querySelector('.btn-text').textContent;
            
            if (buttonText === 'GET DIRECTIONS') {
                // Open Google Maps with the location
                const address = encodeURIComponent('123 Tech Avenue, San Francisco, CA 94102');
                window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
                
            } else if (buttonText === 'VIEW DELIVERY ZONE') {
                alert('Opening delivery zone map... Delivery available within 20 miles of our location.');
                
            } else if (buttonText === 'CALL NOW') {
                // Initiate phone call
                window.open('tel:14155554367', '_self');
            }
        });
    });

    // Feature tags interaction
    const featureTags = document.querySelectorAll('.feature-tag');
    featureTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const feature = tag.textContent;
            alert(`Learn more about our ${feature} service at HASH Digital HQ`);
        });
    });

    // Info items hover enhancement
    const infoItems = document.querySelectorAll('.info-item');
    infoItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const icon = item.querySelector('.info-icon');
            if (icon) {
                icon.style.transform = 'scale(1.2)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            const icon = item.querySelector('.info-icon');
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
        });
    });
}

// Background image loader with fallback
function initLocationBackground() {
    const bgImage = document.querySelector('.bg-image');
    if (bgImage) {
        // Fallback if image doesn't load
        bgImage.onerror = function() {
            this.style.display = 'none';
            document.querySelector('.location-background').style.background = 
                'linear-gradient(135deg, #1a1a1a, #2a2a2a, #1a1a1a)';
        };
        
        // Simulate loading for demo purposes
        setTimeout(() => {
            if (bgImage.complete && bgImage.naturalHeight === 0) {
                bgImage.style.display = 'none';
                document.querySelector('.location-background').style.background = 
                    'linear-gradient(135deg, #1a1a1a, #2a2a2a, #1a1a1a)';
            }
        }, 1000);
    }
}

// Update DOMContentLoaded to include new functions
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initLeafParticles();
    initLeafInteractions();
    initEnhanced3DHover();
    initScrollAnimations();
    initButtonInteractions();
    initSmoothScroll();
    initHeaderScroll();
    initSingleLocation(); // Updated function
    initLocationBackground(); // Add this
    // Remove initLocationsContact() since we simplified to single location
});
