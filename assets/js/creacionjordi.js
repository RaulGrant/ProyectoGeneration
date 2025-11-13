document.addEventListener('DOMContentLoaded', () => {
    const carouselTrackInicio = document.querySelector('#carrusel-inicio .carousel-track');
    const carouselItemsInicio = document.querySelectorAll('#carrusel-inicio .carousel-item');
    const carouselDotsContainerInicio = document.querySelector('#carrusel-inicio .carousel-dots');
    
    if (carouselItemsInicio.length === 0) {
        console.warn("No se encontraron ítems para el carrusel de inicio."); //Esto fue puesto para cuando se actualice alguna parte del carrusel y se olvide de poner al momento de guardar sale u warning
        initializeLogoCarousel(); 
        return; 
    }
    let currentIndexInicio = 0;
    const totalItemsInicio = carouselItemsInicio.length; // Esto será 4
    const rotationSpeed = 4000; 
    let autoRotateInterval;
    //Aqui se crean los puntos
    for (let i = 0; i < totalItemsInicio; i++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.addEventListener('click', () => {
            currentIndexInicio = i;
            updateCarouselInicio();
            resetAutoRotateInicio(); 
        });
        carouselDotsContainerInicio.appendChild(dot);
    }
    const dotsInicio = document.querySelectorAll('#carrusel-inicio .dot');
    function updateCarouselInicio() {
        const itemWidth = carouselItemsInicio[0].clientWidth;
        const offset = -currentIndexInicio * itemWidth;
        carouselTrackInicio.style.transform = `translateX(${offset}px)`;
        dotsInicio.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndexInicio);
        });
    }
    function startAutoRotateInicio() {
        autoRotateInterval = setInterval(() => {
            currentIndexInicio = (currentIndexInicio + 1) % totalItemsInicio;
            updateCarouselInicio();
        }, rotationSpeed);
    }
    
    function resetAutoRotateInicio() {
        clearInterval(autoRotateInterval);
        startAutoRotateInicio();
    }
    updateCarouselInicio();
    startAutoRotateInicio();
    window.navigateCarousel = (direction) => {
        currentIndexInicio = (currentIndexInicio + direction + totalItemsInicio) % totalItemsInicio;
        updateCarouselInicio();
        resetAutoRotateInicio();
    };
    window.addEventListener('resize', updateCarouselInicio);
    // 3. Función del Flip Card
    window.flipCard = (cardElement) => {
        cardElement.classList.toggle('flipped');
    }
    
}); 

function initializeLogoCarousel() {
    const trackLogoSimple = document.querySelector('#logo .logo-carousel-track-simple');
    const itemsLogoSimple = document.querySelectorAll('#logo .carousel-item.logo-carousel-item-simple');
    if (!trackLogoSimple || itemsLogoSimple.length === 0) return;

    const totalSlidesLogoSimple = itemsLogoSimple.length; 
    let currentIndexLogoSimple = 0;
    const SLIDE_PERCENTAGE = 100 / totalSlidesLogoSimple; 

    window.navigateLogoSimple = (direction) => {
        let newIndex = currentIndexLogoSimple + direction;
        
        if (newIndex >= totalSlidesLogoSimple) {
            newIndex = 0; 
        } else if (newIndex < 0) {
            newIndex = totalSlidesLogoSimple - 1; 
        }
        
        currentIndexLogoSimple = newIndex;
        const offset = -currentIndexLogoSimple * SLIDE_PERCENTAGE; 
        trackLogoSimple.style.transform = `translateX(${offset}%)`;
    };
    window.navigateLogoSimple(0);
}

//Esto maneja las flechas del carrusel 

const track = document.querySelector('.carousel-track');
const items = document.querySelectorAll('.carousel-item');
const dots = document.querySelectorAll('.dot');
const totalSlides = items.length;
let currentIndex = 0;

function updateDots() {
    dots.forEach((dot, index) => {
        dot.classList.remove('active');
        if (index === currentIndex) {
            dot.classList.add('active');
        }
    });
}

// Función principal para mover el carrusel
function moveToSlide(index) {
    if (index >= totalSlides) {
        index = 0; 
    } else if (index < 0) {
        index = totalSlides - 1; //Aqui reinicias cuando llegas al final
    }
    
    currentIndex = index;
    const offset = -currentIndex * 100;
    track.style.transform = `translateX(${offset}%)`;
    
    updateDots();
}

// Función pública llamada por los botones (HTML onclick="navigateCarousel(1)")
function navigateCarousel(direction) {
    // direction será -1 (prev) o 1 (next)
    moveToSlide(currentIndex + direction);
}

document.addEventListener('DOMContentLoaded', () => {
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            moveToSlide(index);
        });
    });
    // Mostrar el primer slide al cargar la página
    moveToSlide(0); 
});

//Seccion de Curiosidades
function toggleExpand(element) {
    //Quita la clase 'expanded' de cualquier otro elemento que la tenga
    const shelf = element.closest('.curiosity-shelf');
    const currentlyExpanded = shelf.querySelector('.curiosity-item.expanded');
    // Esto cierra otro slide que este abierto para que no choquen
    if (currentlyExpanded && currentlyExpanded !== element) {
        currentlyExpanded.classList.remove('expanded');
    }
    element.classList.toggle('expanded'); //Esto hace que con hacer click se active la expansion
}

//Aqui empieza la zona de logo 
document.addEventListener('DOMContentLoaded', () => {
    const trackLogoSimple = document.querySelector('.logo-carousel-track-simple');
    const itemsLogoSimple = document.querySelectorAll('.logo-carousel-item-simple');
    const totalSlidesLogoSimple = itemsLogoSimple.length; 
    let currentIndexLogoSimple = 0;
    
    const SLIDE_PERCENTAGE = 100 / totalSlidesLogoSimple; 
    window.navigateLogoSimple = (direction) => {
        let newIndex = currentIndexLogoSimple + direction;
        if (newIndex >= totalSlidesLogoSimple) {
            newIndex = 0; 
        } else if (newIndex < 0) {
            newIndex = totalSlidesLogoSimple - 1; 
        }
        currentIndexLogoSimple = newIndex;
        const offset = -currentIndexLogoSimple * SLIDE_PERCENTAGE; 
        trackLogoSimple.style.transform = `translateX(${offset}%)`;
    };
    if (trackLogoSimple) {
        window.navigateLogoSimple(0);
    }
});

//Aqui empieza el footer
document.addEventListener('DOMContentLoaded', () => {
    const currentYearSpan = document.getElementById('current-year'); //Esta parte tambien actualiza el año y el footer cada que pase
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});