// Configuration object for easy customization
const CONFIG = {
    cursorImages: [
        { src: '../images/homepageimages/normandyCliffside.jpeg'},
        { src: '../images/homepageimages/normandyPassage.jpeg'},
        { src: '../images/homepageimages/stairBackground.jpeg'},
        { src: '../images/homepageimages/taiwanRide.jpeg'},
    ],
    backgroundImages: [
        { src: '../images/homepageimages/taiwanFoodStall.jpeg'},
        { src: '../images/homepageimages/taiwanTrain.jpeg'},
        { src: '../images/homepageimages/taiwanCat.jpeg'},
        { src: '../images/homepageimages/balance.jpeg'},
        { src: '../images/homepageimages/aquarium.jpg'},
    ],
    cursorSize: 150,
    transitionSpeed: 0.01,
    clickDelay: 300
};

class InteractiveHomepage {
    constructor() {
        this.mainContent = document.querySelector(".main-content");
        this.cursorFollower = document.querySelector(".cursor-follower");
        this.currentCursorImageIndex = 0;
        this.isTransitioning = false;
        this.currentBackgroundImage = null;
        this.isMobile = this.checkIfMobile();
        this.isIOS = this.checkIfIOS();

        this.init();
    }

    checkIfMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    }

    checkIfIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    init() {
        this.setRandomBackground();
        this.setupCursorImages();
        this.setupEventListeners();
        this.fixIOSClipPath();
    }

    fixIOSClipPath() {
        // Apply iOS-specific fixes for clip-path
        if (this.isIOS && this.cursorFollower) {
            // Force hardware acceleration
            this.cursorFollower.style.webkitTransform = 'translateZ(0)';
            this.cursorFollower.style.transform = 'translateZ(0)';
            this.cursorFollower.style.willChange = 'transform';
            
            // Apply webkit prefix for clip-path
            const clipPath = 'polygon(100% 50%,71.21% 71.21%,50% 100%,28.79% 71.21%,0% 50%,28.79% 28.79%,50% 0%,71.21% 28.79%)';
            this.cursorFollower.style.webkitClipPath = clipPath;
            this.cursorFollower.style.clipPath = clipPath;
            
            // Additional iOS fixes
            this.cursorFollower.style.webkitBackfaceVisibility = 'hidden';
            this.cursorFollower.style.webkitPerspective = '1000px';
        }
    }

    setRandomBackground() {
        const randomIndex = Math.floor(Math.random() * CONFIG.backgroundImages.length);
        this.currentBackgroundImage = CONFIG.backgroundImages[randomIndex];
        this.mainContent.style.backgroundImage = `url(${this.currentBackgroundImage.src})`;
    }

    setupCursorImages() {
        if (!this.cursorFollower) return;
        
        this.cursorFollower.innerHTML = ''; // Clear existing images
        // Filter out the background image from cursor images if it's present in cursorImages array
        const availableCursorImages = CONFIG.cursorImages.filter(img => img.src !== this.currentBackgroundImage.src);
        
        // If all cursor images are the same as the background, or no other images are available, use all cursor images
        const imagesToUse = availableCursorImages.length > 0 ? availableCursorImages : CONFIG.cursorImages;

        imagesToUse.forEach(imgData => {
            const img = document.createElement("img");
            img.src = imgData.src;
            img.alt = imgData.type;
            img.classList.add("cursor-image");
            this.cursorFollower.appendChild(img);
        });
        this.cursorFollowerImages = this.cursorFollower.querySelectorAll(".cursor-image");
        this.showCurrentCursorImage();
    }

    setupEventListeners() {
        // Mouse events for desktop
        if (!this.isMobile) {
            this.mainContent.addEventListener("mousemove", (e) => {
                this.updateCursorPosition(e);
            });

            this.mainContent.addEventListener("mouseenter", () => {
                if (this.cursorFollower) this.cursorFollower.style.opacity = "1";
            });

            this.mainContent.addEventListener("mouseleave", () => {
                if (this.cursorFollower) this.cursorFollower.style.opacity = "0";
            });
        }

        // Click/tap events for both desktop and mobile
        this.mainContent.addEventListener("click", (e) => {
            // Don't prevent default if clicking on a link
            if (!e.target.closest('a')) {
                this.changeCursorImage();
            }
        });

        // Touch support for mobile - FIXED: Don't interfere with scrolling
        if (this.isMobile) {
            if (this.cursorFollower) this.cursorFollower.style.opacity = "1"; // Always show on mobile
            
            // Track if user is scrolling vs tapping
            let isScrolling = false;
            let startY = 0;
            let startTime = 0;
            
            this.mainContent.addEventListener("touchstart", (e) => {
                // Only handle single touch
                if (e.touches.length !== 1) return;
                
                const touch = e.touches[0];
                startY = touch.clientY;
                startTime = Date.now();
                isScrolling = false;
                
                // Update cursor position on touch start (only if not touching nav)
                if (!e.target.closest('.nav-item') && this.cursorFollower) {
                    this.updateCursorPosition(touch);
                }
            });

            this.mainContent.addEventListener("touchmove", (e) => {
                // Only handle single touch
                if (e.touches.length !== 1) return;
                
                const touch = e.touches[0];
                const deltaY = Math.abs(touch.clientY - startY);
                const deltaTime = Date.now() - startTime;
                
                // Detect if user is scrolling (moved vertically more than 10px)
                if (deltaY > 10 || deltaTime > 150) {
                    isScrolling = true;
                }
                
                // Only update cursor position if not scrolling and not touching nav
                if (!isScrolling && !e.target.closest('.nav-item') && this.cursorFollower) {
                    this.updateCursorPosition(touch);
                }
                
                // CRITICAL: Don't preventDefault - let scrolling work naturally
            });

            this.mainContent.addEventListener("touchend", (e) => {
                // Only change cursor image if it was a tap (not scroll) and not on nav
                if (!isScrolling && !e.target.closest('.nav-item')) {
                    this.changeCursorImage();
                }
            });
        }

        // Keyboard events (only for desktop)
        if (!this.isMobile) {
            document.addEventListener("keydown", (e) => {
                switch (e.key) {
                    case " ": // Spacebar to change image
                        e.preventDefault();
                        this.changeCursorImage();
                        break;
                    case "r": // R to reset to first image
                        this.currentCursorImageIndex = 0;
                        this.showCurrentCursorImage();
                        break;
                }
            });
        }
    }

    updateCursorPosition(event) {
        if (!this.cursorFollower) return;
        
        const rect = this.mainContent.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        this.cursorFollower.style.left = `${x}px`;
        this.cursorFollower.style.top = `${y}px`;
    }

    changeCursorImage() {
        if (this.isTransitioning || !this.cursorFollowerImages || this.cursorFollowerImages.length === 0) return;

        this.isTransitioning = true;

        this.cursorFollowerImages[this.currentCursorImageIndex].classList.remove("active");

        this.currentCursorImageIndex = (this.currentCursorImageIndex + 1) % this.cursorFollowerImages.length;

        setTimeout(() => {
            this.cursorFollowerImages[this.currentCursorImageIndex].classList.add("active");
            this.isTransitioning = false;
        }, CONFIG.clickDelay);

        if (this.cursorFollower) {
            this.cursorFollower.style.transform = "translate(-50%, -50%) scale(0.9)";
            setTimeout(() => {
                this.cursorFollower.style.transform = "translate(-50%, -50%) scale(1)";
            }, 150);
        }
    }

    showCurrentCursorImage() {
        if (!this.cursorFollowerImages) return;
        
        this.cursorFollowerImages.forEach((img, index) => {
            img.classList.toggle("active", index === this.currentCursorImageIndex);
        });
    }
}

// Mobile Photography Hover Effects Handler
class MobilePhotographyEffects {
    constructor() {
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
        this.init();
    }

    init() {
        if (!this.isMobile) return;
        
        this.setupMobileHoverEffects();
    }

    setupMobileHoverEffects() {
        const imageItems = document.querySelectorAll('.image-item');
        
        imageItems.forEach(item => {
            let touchStartTime = 0;
            let touchActive = false;
            
            // Handle touch start
            item.addEventListener('touchstart', (e) => {
                touchStartTime = Date.now();
                touchActive = true;
                
                // Add visual feedback immediately
                item.classList.add('touch-active');
                
                // Store original rotation for animation
                const currentTransform = window.getComputedStyle(item).transform;
                item.style.setProperty('--original-transform', currentTransform);
            }, { passive: true });
            
            // Handle touch move (check if user is scrolling)
            item.addEventListener('touchmove', (e) => {
                // If user moves finger significantly, it's likely scrolling
                touchActive = false;
                item.classList.remove('touch-active');
            }, { passive: true });
            
            // Handle touch end
            item.addEventListener('touchend', (e) => {
                const touchDuration = Date.now() - touchStartTime;
                
                // If it was a quick tap (not a scroll), maintain effect briefly
                if (touchActive && touchDuration < 500) {
                    // Keep effect for a moment to show feedback
                    setTimeout(() => {
                        item.classList.remove('touch-active');
                    }, 300);
                } else {
                    // Remove immediately if it was a scroll
                    item.classList.remove('touch-active');
                }
            }, { passive: true });
            
            // Handle touch cancel
            item.addEventListener('touchcancel', (e) => {
                item.classList.remove('touch-active');
            }, { passive: true });
        });
    }
}

// Utility functions for customization
const CustomizationUtils = {
    setCursorSize: (size) => {
        document.documentElement.style.setProperty("--cursor-size", `${size}px`);
    },

    setColorScheme: (colors) => {
        Object.entries(colors).forEach(([property, value]) => {
            document.documentElement.style.setProperty(`--${property}`, value);
        });
    },

    addImages: (imagePaths) => {
        console.warn("addImages function is deprecated. Please update CONFIG.backgroundImages and CONFIG.cursorImages directly in script.js");
    }
};

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    // Initialize homepage effects (only if cursor follower exists)
    if (document.querySelector(".cursor-follower")) {
        const interactiveHomepage = new InteractiveHomepage();
    }
    
    // Initialize mobile photography effects (for photography pages)
    if (document.querySelector(".gallery")) {
        const mobilePhotographyEffects = new MobilePhotographyEffects();
    }

    // Make customization utils available globally
    window.CustomizationUtils = CustomizationUtils;
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});