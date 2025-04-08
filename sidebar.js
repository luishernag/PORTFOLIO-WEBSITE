// Function to close all sidebars
function closeSidebar() {
    const sidebars = document.querySelectorAll('.sidebar');
    sidebars.forEach(sidebar => sidebar.classList.remove('open'));

    const infoElements = document.querySelectorAll('.info');
    infoElements.forEach(info => {
        info.style.color = 'white';
    });
}

// Show/Hide specific content
function showHideContent(contextId) {
    const context = document.getElementById(contextId);
    if (context) {
        if (context.style.display === 'block') {
            context.style.display = 'none';
        } else {
            context.style.display = 'block';
        }
    }
}

// Function to open a specific sidebar
function openSidebar(sideBarID) {
    closeSidebar();
    const sidebar = document.getElementById(sideBarID);
    if (sidebar) {
        sidebar.classList.add('open');
        const infoElement = document.querySelector(`.info[data-sidebar="${sideBarID}"]`);
        if (infoElement) {
            infoElement.style.color = 'black';
        }
    }
}

// Assign dynamic events to all .info elements
document.querySelectorAll('.info').forEach(info => {
    const sideBarID = info.getAttribute('data-sidebar');
    if (sideBarID) {
        info.addEventListener('click', () => openSidebar(sideBarID));
    }
});

// Function to handle sliders individually
function initializeSliders() {
    const sliders = document.querySelectorAll('.slider-container');

    sliders.forEach(sliderContainer => {
        const slider = sliderContainer.querySelector('.slider');
        const slides = slider.querySelectorAll('.slide');
        let currentIndex = 0;

        // Clone first and last slide for infinite loop
        const firstClone = slides[0].cloneNode(true);
        const lastClone = slides[slides.length - 1].cloneNode(true);

        slider.appendChild(firstClone);
        slider.insertBefore(lastClone, slides[0]);

        const totalSlides = slides.length + 2; // +2 for clones
        slider.style.width = `${totalSlides * 100}%`;

        slider.querySelectorAll('.slide').forEach(slide => {
            slide.style.width = `${100 / totalSlides}%`;
        });

        slider.style.transform = `translateX(-${(currentIndex) * (100 / totalSlides)}%)`;

        // Function to show a specific slide
        function showSlide(index) {
            slider.style.transition = 'transform 0.5s ease';
            currentIndex = index;
            slider.style.transform = `translateX(-${(currentIndex) * (100 / totalSlides)}%)`;

            setTimeout(() => {
                if (currentIndex === 0) {
                    slider.style.transition = 'none';
                    currentIndex = totalSlides - 2;
                    slider.style.transform = `translateX(-${(currentIndex) * (100 / totalSlides)}%)`;
                }
                if (currentIndex === totalSlides - 1) {
                    slider.style.transition = 'none';
                    currentIndex = 1;
                    slider.style.transform = `translateX(-${(currentIndex) * (100 / totalSlides)}%)`;
                }
            }, 500);
        }

        // Specific functions for this slider
        sliderContainer.nextSlide = () => {
            if (currentIndex < totalSlides - 1) {
                showSlide(currentIndex + 1);
            }
        };

        sliderContainer.prevSlide = () => {
            if (currentIndex > 0) {
                showSlide(currentIndex - 1);
            }
        };

        // Assign events to buttons within this container
        const nextBtn = sliderContainer.querySelector('.right-arrow');
        const prevBtn = sliderContainer.querySelector('.left-arrow');

        if (nextBtn && prevBtn) {
            nextBtn.addEventListener('click', sliderContainer.nextSlide);
            prevBtn.addEventListener('click', sliderContainer.prevSlide);
        }

        // Initialize the slider
        showSlide(1);
    });
}

// Initialize sliders when page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeSliders();
    initializeLightbox();
    protectImages();
});

// Function to initialize the lightbox
function initializeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const zoomResetBtn = document.getElementById('zoom-reset');
    let scale = 1;
    let isDragging = false;
    let startX, startY, translateX = 0, translateY = 0;

    // Add click event to all images
    document.querySelectorAll('.slide img').forEach(img => {
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('active');
            scale = 1;
            translateX = 0;
            translateY = 0;
            updateTransform();
        });
    });

    // Close lightbox
    closeBtn.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    // Zoom functions
    zoomInBtn.addEventListener('click', () => {
        scale = Math.min(scale * 1.2, 5);
        updateTransform();
    });

    zoomOutBtn.addEventListener('click', () => {
        scale = Math.max(scale / 1.2, 0.5);
        updateTransform();
    });

    zoomResetBtn.addEventListener('click', () => {
        scale = 1;
        translateX = 0;
        translateY = 0;
        updateTransform();
    });

    // Drag functionality
    lightboxImg.addEventListener('mousedown', (e) => {
        if (e.button === 0) { // Only left button
            isDragging = true;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            lightboxImg.style.cursor = 'grabbing';
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        updateTransform();
    });

    document.addEventListener('mouseup', (e) => {
        if (e.button === 0) { // Only left button
            isDragging = false;
            lightboxImg.style.cursor = 'grab';
        }
    });

    // Touch support
    lightboxImg.addEventListener('touchstart', (e) => {
        isDragging = true;
        const touch = e.touches[0];
        startX = touch.clientX - translateX;
        startY = touch.clientY - translateY;
    });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const touch = e.touches[0];
        translateX = touch.clientX - startX;
        translateY = touch.clientY - startY;
        updateTransform();
    }, { passive: false });

    document.addEventListener('touchend', () => {
        isDragging = false;
    });

    document.addEventListener('touchcancel', () => {
        isDragging = false;
    });

    function updateTransform() {
        lightboxImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }

    // Zoom with mouse wheel
    lightbox.addEventListener('wheel', e => {
        e.preventDefault();
        const delta = e.deltaY * -0.01;
        scale = Math.min(Math.max(0.5, scale + delta), 5);
        updateTransform();
    });

    // Close with Escape key
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
        }
    });
}

// Function to protect images
function protectImages() {
    const images = document.querySelectorAll('.slide img, #lightbox-img');
    
    // Disable right-click on images
    images.forEach(img => {
        img.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Prevent dragging the image
        img.addEventListener('dragstart', (e) => e.preventDefault());
        
        // Disable keyboard shortcuts while image is focused
        img.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
            }
        });
    });

    // Disable global keyboard shortcuts related to save/copy
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && 
            (e.key === 's' || e.key === 'S' || e.key === 'c' || e.key === 'C')) {
            e.preventDefault();
        }
    });
}