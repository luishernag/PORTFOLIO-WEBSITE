// Función para cerrar todos los sidebars
function closeSidebar() {
    const sidebars = document.querySelectorAll('.sidebar');
    sidebars.forEach(sidebar => sidebar.classList.remove('open'));

    const infoElements = document.querySelectorAll('.info');
    infoElements.forEach(info => {
        info.style.color = 'white';
    });
}

// Mostrar/Ocultar contenido específico
function mostrarOcultar(contextId) {
    const context = document.getElementById(contextId);
    if (context) {
        if (context.style.display === 'block') {
            context.style.display = 'none';
        } else {
            context.style.display = 'block';
        }
    }
}

// Función para abrir un sidebar específico
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

// Asignar eventos dinámicos a todos los elementos .info
document.querySelectorAll('.info').forEach(info => {
    const sideBarID = info.getAttribute('data-sidebar');
    if (sideBarID) {
        info.addEventListener('click', () => openSidebar(sideBarID));
    }
});

// Función para manejar sliders individualmente
function initializeSliders() {
    const sliders = document.querySelectorAll('.slider-container');

    sliders.forEach(sliderContainer => {
        const slider = sliderContainer.querySelector('.slider');
        const slides = slider.querySelectorAll('.slide');
        let currentIndex = 0;

        // Clonar el primer y último slide para loop infinito
        const firstClone = slides[0].cloneNode(true);
        const lastClone = slides[slides.length - 1].cloneNode(true);

        slider.appendChild(firstClone);
        slider.insertBefore(lastClone, slides[0]);

        const totalSlides = slides.length + 2; // +2 por los clones
        slider.style.width = `${totalSlides * 100}%`;

        slider.querySelectorAll('.slide').forEach(slide => {
            slide.style.width = `${100 / totalSlides}%`;
        });

        slider.style.transform = `translateX(-${(currentIndex) * (100 / totalSlides)}%)`;

        // Función para mostrar un slide específico
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

        // Funciones específicas para este slider
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

        // Asignar eventos a los botones dentro de este contenedor
        const nextBtn = sliderContainer.querySelector('.right-arrow');
        const prevBtn = sliderContainer.querySelector('.left-arrow');

        if (nextBtn && prevBtn) {
            nextBtn.addEventListener('click', sliderContainer.nextSlide);
            prevBtn.addEventListener('click', sliderContainer.prevSlide);
        }

        // Inicializar el slider
        showSlide(1);
    });
}

// Inicializar los sliders al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    initializeSliders();
});