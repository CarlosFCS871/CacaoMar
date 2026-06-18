// ========================================
// LOADER
// ========================================
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.classList.add('hidden');
            // Remover del DOM después de la animación
            setTimeout(() => {
                loader.remove();
            }, 600);
        }
    }, 1200);
});

// ========================================
// MENÚ MÓVIL
// ========================================
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        const isActive = menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', isActive);

        // Prevenir scroll cuando el menú está abierto
        if (isActive) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Cerrar menú al hacer click en un link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // Cerrar menú al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!e.target.closest('nav') && navLinks.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
}

// ========================================
// OPTIMIZACIÓN DE SCROLL - UN SOLO LISTENER
// ========================================
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-links a');
const scrollTopBtn = document.getElementById('scrollTop');

let ticking = false;

function updateOnScroll() {
    const scrollY = window.pageYOffset;

    // Navbar effect
    if (navbar) {
        if (scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Scroll to top button
    if (scrollTopBtn) {
        if (scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
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
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateOnScroll();
        });
        ticking = true;
    }
}, { passive: true });

// Scroll to top button click
if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

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

    if (img && modal && modalImg) {
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
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
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = {
            nombre: document.getElementById('nombre').value.trim(),
            email: document.getElementById('email').value.trim(),
            telefono: document.getElementById('telefono').value.trim(),
            asunto: document.getElementById('asunto').value,
            mensaje: document.getElementById('mensaje').value.trim()
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
}

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
        padding: 1.2rem 1.8rem;
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 1rem;
        animation: slideIn 0.3s ease;
        max-width: 400px;
        font-weight: 500;
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
// SMOOTH SCROLL PARA NAVEGACIÓN
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');

        if (targetId === '#' || !targetId) return;

        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
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
            this.style.transform = 'scale(1.15)';
        }, 100);
        setTimeout(() => {
            this.style.transform = '';
        }, 300);

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
// MENSAJE DE BIENVENIDA EN CONSOLA
// ========================================
console.log('%c🍫 Cacao Mar - Chocolatería Boutique', 'color: #442F2A; font-size: 20px; font-weight: bold;');
console.log('%cHecho con ❤️ en Chimbote, Ancash - Perú', 'color: #D4AF37; font-size: 12px;');
console.log('%c© 2026 Proyecto Académico - Taller de Negocios', 'color: #422513; font-size: 10px;');