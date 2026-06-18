// ========================================
// LOADER
// ========================================
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
    }, 1500);
});

// ========================================
// MENÚ MÓVIL
// ========================================
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Cerrar menú al hacer click en un link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ========================================
// OPTIMIZACIÓN DE SCROLL - UN SOLO LISTENER
// ========================================
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-links a');

// Variable para controlar el scroll con requestAnimationFrame
let ticking = false;
let lastScrollY = 0;

function updateOnScroll() {
    const scrollY = window.pageYOffset;

    // Navbar effect
    if (scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Active nav link
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinksAll.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });

    ticking = false;
}

// Un solo listener optimizado con requestAnimationFrame
window.addEventListener('scroll', () => {
    lastScrollY = window.pageYOffset;
    
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateOnScroll();
        });
        ticking = true;
    }
}, { passive: true }); // ← passive: true mejora el rendimiento

// ========================================
// ANIMACIÓN SCROLL - INTERSECTION OBSERVER
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Desobservar después de animar (mejora rendimiento)
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// ========================================
// MODAL DE IMÁGENES
// ========================================
function openModal(element) {
    const img = element.querySelector('img');
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');

    modalImg.src = img.src;
    modalImg.alt = img.alt;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Cerrar modal con tecla ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// ========================================
// FORMULARIO DE CONTACTO
// ========================================
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        asunto: document.getElementById('asunto').value,
        mensaje: document.getElementById('mensaje').value
    };

    if (!formData.nombre || !formData.email || !formData.mensaje) {
        showAlert('Por favor complete todos los campos obligatorios', 'error');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showAlert('Por favor ingrese un email válido', 'error');
        return;
    }

    console.log('Datos del formulario:', formData);
    showAlert('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.', 'success');
    this.reset();
});

// ========================================
// ALERTA PERSONALIZADA
// ========================================
function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;

    alert.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1.5rem 2rem;
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 1rem;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;

    document.body.appendChild(alert);

    setTimeout(() => {
        alert.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            alert.remove();
        }, 300);
    }, 5000);
}

// Agregar animaciones de alerta al CSS dinámicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ========================================
// SMOOTH SCROLL PARA NAVEGACIÓN - CORREGIDO
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            const offsetTop = target.offsetTop - 80;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// BOTONES DE AGREGAR AL CARRITO
// ========================================
document.querySelectorAll('.btn-add-cart').forEach(button => {
    button.addEventListener('click', function (e) {
        e.stopPropagation();

        this.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.style.transform = 'scale(1.1)';
        }, 100);

        showAlert('Producto agregado al carrito. Contáctanos por WhatsApp para completar tu pedido.', 'success');
    });
});

// ========================================
// VISTA RÁPIDA DE PRODUCTOS
// ========================================
document.querySelectorAll('.btn-quick-view').forEach(button => {
    button.addEventListener('click', function (e) {
        e.stopPropagation();
        showAlert('Vista rápida: Contáctanos para más información sobre este producto.', 'info');
    });
});

// ========================================
// ❌ PARALLAX ELIMINADO (causaba el scroll pegado)
// ========================================
// Este código fue eliminado porque causaba que el hero se moviera
// mientras el usuario hacía scroll, creando la sensación de "pegado"

// ========================================
// CONTADOR ANIMADO PARA STATS
// ========================================
const animateValue = (element, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value + (element.dataset.suffix || '');
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            const h3 = entry.target.querySelector('h3');
            if (h3) {
                const text = h3.textContent;
                const number = parseInt(text);
                if (!isNaN(number)) {
                    h3.textContent = '0';
                    h3.dataset.suffix = text.replace(number, '');
                    animateValue(h3, 0, number, 2000);
                    entry.target.classList.add('counted');
                }
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach(stat => {
    statsObserver.observe(stat);
});

// ========================================
// MENSAJE DE BIENVENIDA EN CONSOLA
// ========================================
console.log('%c🍫 Cacao Mar - Chocolatería Boutique', 'color: #442F2A; font-size: 20px; font-weight: bold;');
console.log('%cHecho con ❤️ en Chimbote, Ancash - Perú', 'color: #D4AF37; font-size: 12px;');