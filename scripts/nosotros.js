      AOS.init({
            // Configuración global
            duration: 800,
            easing: 'ease-out-cubic',
            once: false, // Las animaciones se ejecutan cada vez que el elemento entra en vista
            mirror: true, // Las animaciones se ejecutan también al hacer scroll hacia arriba
            anchorPlacement: 'top-bottom',
            
            // Configuraciones de comportamiento
            offset: 120,
            delay: 0,
            
            // Configuraciones de viewport
            startEvent: 'DOMContentLoaded',
            animatedClassName: 'aos-animate',
            initClassName: 'aos-init',
            
            // Deshabilitar en ciertos casos
            disable: false,
            
            // Configuración responsive
            useClassNames: false,
            disableMutationObserver: false,
            debounceDelay: 50,
            throttleDelay: 99
        });
        
        // Inicialización adicional después de que la página cargue completamente
        window.addEventListener('load', function() {
            AOS.refresh();
        });