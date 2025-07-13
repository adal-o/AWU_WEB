// Configuration object for easy customization
const CONFIG = {
    cursorImages: [
        { src: '../static/images/homepageimages/normandyCliffside.jpeg'},
        { src: '../static/images/homepageimages/normandyPassage.jpeg'},
        { src: '../static/images/homepageimages/stairBackground.jpeg'},
        { src: '../static/images/homepageimages/taiwanRide.jpeg'},
    ],
    backgroundImages: [
        { src: '../static/images/homepageimages/taiwanFoodStall.jpeg'},
        { src: '../static/images/homepageimages/taiwanTrain.jpeg'},
        { src: '../static/images/homepageimages/taiwanCat.jpeg'},
        { src: '../static/images/homepageimages/balance.jpeg'},
        { src: '../static/images/homepageimages/aquarium.jpg'},
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

        this.init();
    }

    checkIfMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    }

    init() {
        this.setRandomBackground();
        this.setupCursorImages();
        this.setupEventListeners();
    }

    setRandomBackground() {
        const randomIndex = Math.floor(Math.random() * CONFIG.backgroundImages.length);
        this.currentBackgroundImage = CONFIG.backgroundImages[randomIndex];
        this.mainContent.style.backgroundImage = `url(${this.currentBackgroundImage.src})`;
    }

    setupCursorImages() {
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
                this.cursorFollower.style.opacity = "1";
            });

            this.mainContent.addEventListener("mouseleave", () => {
                this.cursorFollower.style.opacity = "0";
            });
        }

        // Click/tap events for both desktop and mobile
        this.mainContent.addEventListener("click", (e) => {
            // Don't prevent default if clicking on a link
            if (!e.target.closest('a')) {
                this.changeCursorImage();
            }
        });

        // Touch support for mobile - show cursor follower but don't interfere with nav
        if (this.isMobile) {
            this.cursorFollower.style.opacity = "1"; // Always show on mobile
            
            this.mainContent.addEventListener("touchmove", (e) => {
                // Only prevent default if not touching a nav link
                if (!e.target.closest('.nav-item')) {
                    e.preventDefault();
                    const touch = e.touches[0];
                    this.updateCursorPosition(touch);
                }
            });

            this.mainContent.addEventListener("touchstart", (e) => {
                // Update cursor position on touch start
                if (!e.target.closest('.nav-item')) {
                    const touch = e.touches[0];
                    this.updateCursorPosition(touch);
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
        const rect = this.mainContent.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        this.cursorFollower.style.left = `${x}px`;
        this.cursorFollower.style.top = `${y}px`;
    }

    changeCursorImage() {
        if (this.isTransitioning || this.cursorFollowerImages.length === 0) return;

        this.isTransitioning = true;

        this.cursorFollowerImages[this.currentCursorImageIndex].classList.remove("active");

        this.currentCursorImageIndex = (this.currentCursorImageIndex + 1) % this.cursorFollowerImages.length;

        setTimeout(() => {
            this.cursorFollowerImages[this.currentCursorImageIndex].classList.add("active");
            this.isTransitioning = false;
        }, CONFIG.clickDelay);

        this.cursorFollower.style.transform = "translate(-50%, -50%) scale(0.9)";
        setTimeout(() => {
            this.cursorFollower.style.transform = "translate(-50%, -50%) scale(1)";
        }, 150);
    }

    showCurrentCursorImage() {
        this.cursorFollowerImages.forEach((img, index) => {
            img.classList.toggle("active", index === this.currentCursorImageIndex);
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
    const interactiveHomepage = new InteractiveHomepage();

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