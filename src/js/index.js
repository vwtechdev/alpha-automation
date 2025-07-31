// Main JavaScript

// Inicializa AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: false,
    mirror: true
});

// Navbar scroll detection
function handleNavbarScroll() {
    const navbar = document.getElementById('main-navbar');
    const scrollPosition = window.scrollY;
    
    if (navbar) {
        if (scrollPosition > 0) {
            navbar.classList.add('navbar-scrolled');
            navbar.classList.remove('navbar-transparent');
        } else {
            navbar.classList.remove('navbar-scrolled');
            navbar.classList.add('navbar-transparent');
        }
    }
}

// Executar uma vez no carregamento para garantir estado inicial
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.getElementById('main-navbar');
    if (navbar) {
        navbar.classList.add('navbar-transparent');
        navbar.classList.remove('navbar-scrolled');
    }
});

// Adicionar event listener para scroll
window.addEventListener('scroll', handleNavbarScroll);

// Lazy Loading Implementation
class LazyLoader {
    constructor() {
        this.images = document.querySelectorAll('.lazy-image');
        this.imageObserver = null;
        this.init();
    }

    init() {
        // Verificar se o Intersection Observer é suportado
        if ('IntersectionObserver' in window) {
            this.setupIntersectionObserver();
        } else {
            // Fallback para navegadores mais antigos
            this.loadAllImages();
        }
    }

    setupIntersectionObserver() {
        this.imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px 0px', // Carrega imagens 50px antes de entrar na viewport
            threshold: 0.01
        });

        this.images.forEach(img => {
            this.imageObserver.observe(img);
        });
    }

    loadImage(img) {
        const src = img.getAttribute('data-src');
        if (!src) return;

        // Criar uma nova imagem para pré-carregar
        const tempImage = new Image();
        
        tempImage.onload = () => {
            img.src = src;
            img.classList.add('loaded');
            img.removeAttribute('data-src');
        };

        tempImage.onerror = () => {
            // Em caso de erro, remover a classe lazy-image para mostrar placeholder
            img.classList.remove('lazy-image');
            console.warn('Erro ao carregar imagem:', src);
        };

        tempImage.src = src;
    }

    loadAllImages() {
        this.images.forEach(img => {
            this.loadImage(img);
        });
    }
}

// Inicializar lazy loading quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    new LazyLoader();
});

// Mobile Menu Dialog Functionality
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenuDialog = document.getElementById('mobile-menu-dialog');
    const mobileMenuContent = document.getElementById('mobile-menu-content');
    const closeMobileMenu = document.getElementById('close-mobile-menu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
    const whatsappButton = document.getElementById('whatsapp-button');
    const backToTopButton = document.getElementById('back-to-top');

    // Abrir menu mobile
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            mobileMenuDialog.style.display = 'flex';
            mobileMenuDialog.classList.remove('hidden');
            
            // Animar entrada
            setTimeout(() => {
                mobileMenuContent.classList.remove('scale-95', 'opacity-0');
                mobileMenuContent.classList.add('scale-100', 'opacity-100');
            }, 100);
            
            document.body.style.overflow = 'hidden';
            // Oculta o botão do WhatsApp
            if (whatsappButton) whatsappButton.style.display = 'none';
            // Oculta o botão de voltar ao topo
            if (backToTopButton) backToTopButton.style.display = 'none';
        });
    }

    // Fechar menu mobile
    function closeMobileMenuDialog() {
        mobileMenuContent.classList.add('scale-95', 'opacity-0');
        mobileMenuContent.classList.remove('scale-100', 'opacity-100');
        
        setTimeout(() => {
            mobileMenuDialog.style.display = 'none';
            mobileMenuDialog.classList.add('hidden');
            document.body.style.overflow = '';
            // Exibe o botão do WhatsApp novamente
            if (whatsappButton) whatsappButton.style.display = '';
            // Exibe o botão de voltar ao topo novamente
            if (backToTopButton) backToTopButton.style.display = '';
        }, 300);
    }

    // Fechar com botão X
    if (closeMobileMenu) {
        closeMobileMenu.addEventListener('click', closeMobileMenuDialog);
    }

    // Fechar clicando fora do modal
    mobileMenuDialog.addEventListener('click', function(e) {
        if (e.target === mobileMenuDialog) {
            closeMobileMenuDialog();
        }
    });

    // Fechar com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenuDialog.style.display === 'flex') {
            closeMobileMenuDialog();
        }
    });

    // Fechar ao clicar em um link do menu
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenuDialog();
        });
    });

    // Fechar ao trocar idioma no seletor mobile
    const languageSelectMobile = document.getElementById('language-select-mobile');
    if (languageSelectMobile) {
        languageSelectMobile.addEventListener('change', function() {
            closeMobileMenuDialog();
        });
    }
});

// Back to Top Button
const backToTopButton = document.getElementById('back-to-top');

window.addEventListener('scroll', function() {
    // Em mobile, mostrar o botão apenas após scroll maior
    const isMobile = window.innerWidth <= 768;
    const threshold = isMobile ? 500 : 300;
    
    // Verificar se estamos na seção home (primeira seção)
    const homeSection = document.getElementById('home');
    const isInHomeSection = homeSection && window.pageYOffset < homeSection.offsetHeight;
    
    // Em mobile, não mostrar o botão na seção home
    if (isMobile && isInHomeSection) {
        backToTopButton.classList.remove('opacity-100', 'visible');
        backToTopButton.classList.add('opacity-0', 'invisible');
        return;
    }
    
    if (window.pageYOffset > threshold) {
        backToTopButton.classList.remove('opacity-0', 'invisible');
        backToTopButton.classList.add('opacity-100', 'visible');
    } else {
        backToTopButton.classList.remove('opacity-100', 'visible');
        backToTopButton.classList.add('opacity-0', 'invisible');
    }
});

backToTopButton.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        
        // Special handling for home link - go to top
        if (targetId === '#home') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        }
        
        // Close mobile menu dialog if open
        const mobileMenuDialog = document.getElementById('mobile-menu-dialog');
        if (mobileMenuDialog && mobileMenuDialog.style.display === 'flex') {
            const mobileMenuContent = document.getElementById('mobile-menu-content');
            mobileMenuContent.classList.add('scale-95', 'opacity-0');
            mobileMenuContent.classList.remove('scale-100', 'opacity-100');
            
            setTimeout(() => {
                mobileMenuDialog.style.display = 'none';
                mobileMenuDialog.classList.add('hidden');
                document.body.style.overflow = '';
            }, 300);
        }
    });
});

// Formulário de contato usando mailto

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
                return;
            }
            if (!isValidEmail(email)) {
                showNotification('Por favor, insira um e-mail válido.', 'error');
                return;
            }

            const to = 'douglasheitinger@alphaautomationbr.com';
            const cc = 'natanel@alphaautomationbr.com, otavio.gomes@alphaautomationbr.com';    
            const subject = encodeURIComponent('Contato pelo site - Alpha Automation');
            const body = encodeURIComponent(
                'Nome: ' + name + '\n' +
                'E-mail: ' + email + '\n' +
                'Telefone: ' + phone + '\n' +
                'Mensagem: ' + message
            );
            const mailto_link = 'mailto:'+to+'?subject='+subject+'&cc='+cc+'&body='+body;
            window.location.href = mailto_link;
        });
    }
});

// Notification function
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full ${
        type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`;
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// WhatsApp Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const whatsappButton = document.getElementById('whatsapp-button');
    const modal = document.getElementById('whatsapp-modal');
    const modalContent = document.getElementById('modal-content');
    const closeButton = document.getElementById('close-modal');
    const contactOptions = document.querySelectorAll('.contact-option');

    console.log('Modal elements:', { whatsappButton, modal, modalContent, closeButton, contactOptions });

    // Teste simples para verificar se o botão existe
    if (whatsappButton) {
        console.log('WhatsApp button found');
        whatsappButton.style.cursor = 'pointer';
        
        // Teste de debug - adicionar ao window para teste manual
        window.testModal = function() {
            console.log('Testing modal manually');
            modal.style.display = 'flex';
            modal.classList.remove('hidden');
            modal.classList.add('show');
        };
        
        window.closeModalTest = function() {
            console.log('Testing close modal manually');
            closeModal();
        };
    } else {
        console.error('WhatsApp button not found');
    }

    // Abrir modal
    if (whatsappButton) {
        whatsappButton.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('WhatsApp button clicked');
            
            modal.style.display = 'flex';
            modal.classList.remove('hidden');
            modal.classList.add('show');
            
            setTimeout(() => {
                modalContent.classList.add('show');
            }, 100);
            document.body.style.overflow = 'hidden';
        };
    }

    // Fechar modal
    function closeModal() {
        console.log('Closing modal');
        modalContent.classList.remove('show');
        modal.classList.remove('show');
        modal.style.display = 'none';
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    // Fechar com botão X
    if (closeButton) {
        closeButton.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeModal();
        };
    }

    // Fechar clicando fora do modal
    modal.onclick = function(e) {
        if (e.target === modal) {
            closeModal();
        }
    };

    // Escolher contato
    contactOptions.forEach(option => {
        option.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const phone = this.getAttribute('data-phone');
            const name = this.getAttribute('data-name');
            const message = encodeURIComponent(`Olá, Alpha Automation and Robotics! Gostaria de mais informações sobre seus produtos ou serviços. Podem me ajudar?`);
            const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
            
            console.log('Contact selected:', name, phone);
            
            // Fechar modal primeiro
            closeModal();
            
            // Abrir WhatsApp após um pequeno delay
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
            }, 100);
        };
    });

    // Fechar com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeModal();
        }
    });
});

// WhatsApp button functionality
document.addEventListener('DOMContentLoaded', function() {
    const whatsappButton = document.querySelector('.whatsapp-button');
    
    if (whatsappButton) {
        // Add hover effect to pause animation
        whatsappButton.addEventListener('mouseenter', function() {
            this.style.animationPlayState = 'paused';
        });
        
        whatsappButton.addEventListener('mouseleave', function() {
            this.style.animationPlayState = 'running';
        });
    }
});

// Animações de entrada CSS puro
function handleScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .fade-up, .fade-right, .fade-left');
    const fadeInCards = document.querySelectorAll('.fade-in-card');
    const windowHeight = window.innerHeight;
    
    animatedElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < windowHeight - 60) {
            el.classList.add('visible');
        }
    });
    
    // Animações para cards com fade in
    fadeInCards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        if (rect.top < windowHeight - 60) {
            // Delay escalonado para criar efeito cascata
            setTimeout(() => {
                card.classList.add('visible');
            }, index * 100);
        }
    });
}

document.addEventListener('DOMContentLoaded', handleScrollAnimations);
window.addEventListener('scroll', handleScrollAnimations);

// Projects Carousel Functionality
let currentProjectIndex = 0;
const totalProjects = 6;

function updateProjectCarousel() {
    const track = document.getElementById('projects-carousel-track');
    
    if (track) {
        // Mover o carrossel
        track.style.transform = `translateX(-${currentProjectIndex * 100}%)`;
    }
}

function nextProject() {
    currentProjectIndex = (currentProjectIndex + 1) % totalProjects;
    updateProjectCarousel();
}

// Auto-play do carrossel
let carouselInterval;

function startCarouselAutoPlay() {
    carouselInterval = setInterval(() => {
        nextProject();
    }, 4000); // Muda a cada 4 segundos
}

function stopCarouselAutoPlay() {
    if (carouselInterval) {
        clearInterval(carouselInterval);
    }
}

// Inicializar carrossel quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    const carouselContainer = document.querySelector('.carousel-container');
    
    if (carouselContainer) {
        // Iniciar auto-play
        startCarouselAutoPlay();
        
        // Pausar auto-play quando o mouse estiver sobre o carrossel
        carouselContainer.addEventListener('mouseenter', stopCarouselAutoPlay);
        carouselContainer.addEventListener('mouseleave', startCarouselAutoPlay);
        
        // Inicializar o carrossel
        updateProjectCarousel();
    }
});

// Projects Section Functionality
document.addEventListener('DOMContentLoaded', function() {
    const projectCard = document.querySelector('.projects-layout');
    
    if (projectCard) {
        // Adicionar efeito de hover suave
        projectCard.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        projectCard.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        // Adicionar animação de entrada
        projectCard.style.opacity = '0';
        projectCard.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            projectCard.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            projectCard.style.opacity = '1';
            projectCard.style.transform = 'translateY(0)';
        }, 100);
    }
});