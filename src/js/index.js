// Main JavaScript para Alpha Automation - Bootstrap

// Função para obter tradução baseada no idioma atual
function getTranslation(key) {
    try {
        const currentLang = localStorage.getItem('site-lang') || 'pt';
        
        // Verificar se as traduções estão disponíveis
        if (typeof translations !== 'undefined' && translations[currentLang] && translations[currentLang][key]) {
            return translations[currentLang][key];
        }
        
        // Fallback para português se a tradução não for encontrada
        if (typeof translations !== 'undefined' && translations['pt'] && translations['pt'][key]) {
            return translations['pt'][key];
        }
        
        // Fallback para window.translations (caso esteja disponível)
        if (window.translations && window.translations[currentLang] && window.translations[currentLang][key]) {
            return window.translations[currentLang][key];
        }
        
        if (window.translations && window.translations['pt'] && window.translations['pt'][key]) {
            return window.translations['pt'][key];
        }
        
        // Se ainda não encontrou, retornar texto padrão em português
        const defaultMessages = {
            // Mensagens removidas - não há mais notificações
        };
        
        if (defaultMessages[key]) {
            return defaultMessages[key];
        }
        
        console.warn(`Tradução não encontrada para a chave: ${key}`);
        return key; // Retorna a chave se nenhuma tradução for encontrada
    } catch (error) {
        console.error('Erro ao obter tradução:', error);
        return key;
    }
}

// Função global para lidar com o envio do formulário
function handleFormSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) {
        console.error('Formulário não encontrado!');
        return false;
    }
    
    const inputs = contactForm.querySelectorAll('input, textarea');
    
    // Validar todos os campos
    let isValid = true;
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        return false;
    }
    
    // Coletar dados do formulário
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();

    // Mostrar loading
    const submitButton = event.target;
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Enviando...';
    submitButton.disabled = true;

    // Simular delay para melhor UX
    setTimeout(() => {
        try {
            // Criar mensagem para WhatsApp
            const whatsappMessage = `*Contato pelo site - Alpha Automation*%0A%0A` +
                `*Nome:* ${name}%0A` +
                `*E-mail:* ${email}%0A` +
                `*Telefone:* ${phone}%0A` +
                `*Mensagem:* ${message}%0A%0A` +
                `_Mensagem enviada através do site oficial_`;
            
            // Número do WhatsApp do Douglas (com código do país)
            const whatsappNumber = '5551995495614';
            
            // URL do WhatsApp
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
            
            // Tentar abrir WhatsApp
            const whatsappWindow = window.open(whatsappUrl, '_blank');
            
            // Se o WhatsApp não abrir, mostrar modal alternativo
            setTimeout(() => {
                if (!whatsappWindow || whatsappWindow.closed) {
                    // WhatsApp não abriu
                } else {
                    // Limpar formulário após sucesso
                    contactForm.reset();
                }
                
                // Restaurar botão
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }, 1000);
            
        } catch (error) {
            console.error('Erro ao abrir WhatsApp:', error);
            
            // Restaurar botão
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    }, 1000);
    
    return false; // Previne o envio padrão do formulário
}

// Aguardar DOM estar carregado antes de inicializar
document.addEventListener('DOMContentLoaded', function() {
    // Inicialização silenciosa das traduções
    if (typeof translations === 'undefined' && typeof window.translations === 'undefined') {
        console.warn('Traduções não encontradas, usando idioma padrão (pt)');
    }
});

// Inicializa AOS (Animate On Scroll)
AOS.init({
    duration: 300,
    easing: 'ease-in-out',
    once: false,
    mirror: true
});

// Detecção de dispositivo iOS
function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

// Ajustes específicos para iOS
function applyIOSAdjustments() {
    if (isIOS()) {
        const navbar = document.getElementById('main-navbar');
        if (navbar) {
            // Adicionar classe específica para iOS
            navbar.classList.add('ios-device');
            
            // Ajustar padding para safe area
            const safeAreaTop = getComputedStyle(document.documentElement).getPropertyValue('--sat') || '0px';
            if (safeAreaTop !== '0px') {
                navbar.style.paddingTop = `calc(0.75rem + ${safeAreaTop})`;
            }
        }
        
        // Ajustar viewport para dispositivos iOS
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no');
        }
    }
}

// Função para ajustar dinamicamente a navbar
function adjustNavbarForDevice() {
    const navbar = document.getElementById('main-navbar');
    if (!navbar) return;
    
    const isMobile = window.innerWidth <= 768;
    const isIOSDevice = isIOS();
    
    if (isMobile) {
        // Ajustes para dispositivos móveis
        navbar.style.overflow = 'visible';
        
        if (isIOSDevice) {
            // Ajustes específicos para iOS
            const safeAreaTop = window.safeAreaInsets?.top || 0;
            const safeAreaLeft = window.safeAreaInsets?.left || 0;
            const safeAreaRight = window.safeAreaInsets?.right || 0;
            
            navbar.style.paddingTop = `calc(0.75rem + ${safeAreaTop}px)`;
            navbar.style.paddingLeft = `calc(1rem + ${safeAreaLeft}px)`;
            navbar.style.paddingRight = `calc(1rem + ${safeAreaRight}px)`;
        }
        
        // Ajustar tamanho do logo para mobile
        const logoContainer = navbar.querySelector('.logo-container');
        if (logoContainer) {
            if (window.innerWidth <= 375) {
                logoContainer.style.width = '4.5rem';
                logoContainer.style.height = '4.5rem';
            } else {
                logoContainer.style.width = '5rem';
                logoContainer.style.height = '5rem';
            }
        }
    } else {
        // Reset para desktop
        navbar.style.overflow = '';
        navbar.style.paddingTop = '';
        navbar.style.paddingLeft = '';
        navbar.style.paddingRight = '';
        
        const logoContainer = navbar.querySelector('.logo-container');
        if (logoContainer) {
            logoContainer.style.width = '';
            logoContainer.style.height = '';
        }
    }
}

// Função para detectar e aplicar safe area insets
function detectSafeAreaInsets() {
    if (isIOS()) {
        // Tentar obter safe area insets de diferentes maneiras
        let safeAreaTop = 0;
        let safeAreaLeft = 0;
        let safeAreaRight = 0;
        
        // Método 1: CSS custom properties
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);
        
        if (computedStyle.getPropertyValue('--sat')) {
            safeAreaTop = parseInt(computedStyle.getPropertyValue('--sat')) || 0;
        }
        
        // Método 2: CSS env() function (se disponível)
        if (CSS.supports('padding-top: env(safe-area-inset-top)')) {
            // Usar CSS env() function
            const navbar = document.getElementById('main-navbar');
            if (navbar) {
                navbar.style.setProperty('--safe-area-top', 'env(safe-area-inset-top)');
                navbar.style.setProperty('--safe-area-left', 'env(safe-area-inset-left)');
                navbar.style.setProperty('--safe-area-right', 'env(safe-area-inset-right)');
            }
        }
        
        // Método 3: Detecção manual baseada no tamanho da tela
        if (window.innerHeight >= 812 && window.innerWidth <= 428) {
            // iPhone X e posteriores
            safeAreaTop = Math.max(safeAreaTop, 44);
        } else if (window.innerHeight >= 667 && window.innerWidth <= 375) {
            // iPhone SE e similares
            safeAreaTop = Math.max(safeAreaTop, 20);
        }
        
        // Aplicar safe area insets
        if (safeAreaTop > 0 || safeAreaLeft > 0 || safeAreaRight > 0) {
            const navbar = document.getElementById('main-navbar');
            if (navbar) {
                navbar.style.setProperty('--safe-area-top', `${safeAreaTop}px`);
                navbar.style.setProperty('--safe-area-left', `${safeAreaLeft}px`);
                navbar.style.setProperty('--safe-area-right', `${safeAreaRight}px`);
            }
        }
    }
}

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
    
    // Aplicar ajustes específicos para iOS
    applyIOSAdjustments();
    
    // Detectar safe area insets
    detectSafeAreaInsets();
    
    // Ajustar navbar para o dispositivo atual
    adjustNavbarForDevice();
    
    // Ajustar navbar após carregamento completo
    setTimeout(() => {
        if (isIOS()) {
            const navbar = document.getElementById('main-navbar');
            if (navbar) {
                // Forçar reflow para garantir que os estilos sejam aplicados
                navbar.offsetHeight;
            }
        }
        
        // Detectar safe area insets novamente
        detectSafeAreaInsets();
        
        // Ajustar novamente após carregamento completo
        adjustNavbarForDevice();
    }, 100);
});

// Adicionar event listeners para ajustes dinâmicos
window.addEventListener('resize', adjustNavbarForDevice);
window.addEventListener('orientationchange', () => {
    // Aguardar a mudança de orientação completar
    setTimeout(adjustNavbarForDevice, 100);
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
    const closeMobileMenu = document.getElementById('close-mobile-menu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
    const whatsappButton = document.getElementById('whatsapp-button');
    const backToTopButton = document.getElementById('back-to-top');

    // Abrir menu mobile
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            const modal = new bootstrap.Modal(mobileMenuDialog, {
                backdrop: 'static',
                keyboard: true
            });
            modal.show();
            
            // Oculta o botão do WhatsApp
            if (whatsappButton) whatsappButton.style.display = 'none';
            // Oculta o botão de voltar ao topo
            if (backToTopButton) backToTopButton.style.display = 'none';
        });
    }

    // Listeners para eventos do modal
    if (mobileMenuDialog) {
        // Quando o modal é mostrado
        mobileMenuDialog.addEventListener('shown.bs.modal', function() {
            // Remover aria-hidden se existir
            this.removeAttribute('aria-hidden');
            // Atualizar seção ativa no menu
            updateActiveSectionInMobileMenu();
            // Focar no primeiro link do menu para melhor acessibilidade
            const firstLink = this.querySelector('.mobile-menu-link');
            if (firstLink) firstLink.focus();
        });

        // Quando o modal é escondido
        mobileMenuDialog.addEventListener('hidden.bs.modal', function() {
            // Remover aria-hidden e voltar o foco para o botão do menu
            this.removeAttribute('aria-hidden');
            if (menuToggle) menuToggle.focus();
        });

        // Quando o modal está sendo escondido
        mobileMenuDialog.addEventListener('hide.bs.modal', function() {
            // Remover aria-hidden antes de esconder
            this.removeAttribute('aria-hidden');
        });
    }

    // Função para atualizar seção ativa no menu mobile
    function updateActiveSectionInMobileMenu() {
        const sections = ['home', 'about', 'services', 'projects', 'world-map', 'customers', 'contact'];
        const currentScroll = window.pageYOffset;
        
        // Encontrar a seção atual baseada no scroll
        let activeSection = 'home';
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const sectionTop = section.offsetTop - 100; // Ajuste para navbar
                const sectionBottom = sectionTop + section.offsetHeight;
                
                if (currentScroll >= sectionTop && currentScroll < sectionBottom) {
                    activeSection = sectionId;
                }
            }
        });
        
        // Atualizar classes ativas no menu mobile
        mobileMenuLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${activeSection}`) {
                link.classList.add('active');
            }
        });
    }

    // Fechar menu mobile
    function closeMobileMenuDialog() {
        // Remover aria-hidden antes de fechar
        if (mobileMenuDialog) {
            mobileMenuDialog.removeAttribute('aria-hidden');
        }
        
        const modal = bootstrap.Modal.getInstance(mobileMenuDialog);
        if (modal) {
            modal.hide();
        }
        
        // Exibe o botão do WhatsApp novamente
        if (whatsappButton) whatsappButton.style.display = '';
        // Exibe o botão de voltar ao topo novamente
        if (backToTopButton) backToTopButton.style.display = '';
        
        // Voltar o foco para o botão do menu
        if (menuToggle) {
            setTimeout(() => menuToggle.focus(), 100);
        }
    }

    // Fechar com botão X
    if (closeMobileMenu) {
        closeMobileMenu.addEventListener('click', closeMobileMenuDialog);
    }

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
        if (mobileMenuDialog) {
            const modal = bootstrap.Modal.getInstance(mobileMenuDialog);
            if (modal) {
                modal.hide();
            }
        }
    });
});

// Formulário de contato usando WhatsApp
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        // Adicionar validação em tempo real
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Validar todos os campos
            let isValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                return;
            }
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const message = document.getElementById('message').value.trim();

            // Mostrar loading
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Enviando...';
            submitButton.disabled = true;

            // Simular delay para melhor UX
            setTimeout(() => {
                try {
                    // Criar mensagem para WhatsApp
                    const whatsappMessage = `*Contato pelo site - Alpha Automation*%0A%0A` +
                        `*Nome:* ${name}%0A` +
                        `*E-mail:* ${email}%0A` +
                        `*Telefone:* ${phone}%0A` +
                        `*Mensagem:* ${message}%0A%0A` +
                        `_Mensagem enviada através do site oficial_`;
                    
                    // Número do WhatsApp do Douglas (com código do país)
                    const whatsappNumber = '5551995495614';
                    
                    // URL do WhatsApp
                    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
                    
                    // Tentar abrir WhatsApp
                    const whatsappWindow = window.open(whatsappUrl, '_blank');
                    
                    // Se o WhatsApp não abrir, mostrar modal alternativo
                    setTimeout(() => {
                        if (!whatsappWindow || whatsappWindow.closed) {
                            // WhatsApp não abriu
                        } else {
                            // Limpar formulário após sucesso
                            contactForm.reset();
                        }
                        
                        // Restaurar botão
                        submitButton.innerHTML = originalText;
                        submitButton.disabled = false;
                    }, 1000);
                    
                } catch (error) {
                    console.error('Erro ao abrir WhatsApp:', error);
                    
                    // Restaurar botão
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                }
            }, 1000);
        });
        
    } else {
        console.error('Formulário de contato não encontrado!');
    }
});

// Função para validar campo individual
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name');
    
    clearFieldError(field);
    
    let isValid = true;
    let errorMessage = '';
    
    switch (fieldName) {
        case 'user_name':
            if (!value) {
                errorMessage = 'Nome é obrigatório';
                isValid = false;
            } else if (value.length < 2) {
                errorMessage = 'Nome deve ter pelo menos 2 caracteres';
                isValid = false;
            }
            break;
            
        case 'user_email':
            if (!value) {
                errorMessage = 'E-mail é obrigatório';
                isValid = false;
            } else if (!isValidEmail(value)) {
                errorMessage = 'E-mail inválido';
                isValid = false;
            }
            break;
            
        case 'user_phone':
            if (!value) {
                errorMessage = 'Telefone é obrigatório';
                isValid = false;
            } else if (value.length < 10) {
                errorMessage = 'Telefone deve ter pelo menos 10 dígitos';
                isValid = false;
            }
            break;
            
        case 'message':
            if (!value) {
                errorMessage = 'Mensagem é obrigatória';
                isValid = false;
            } else if (value.length < 10) {
                errorMessage = 'Mensagem deve ter pelo menos 10 caracteres';
                isValid = false;
            }
            break;
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

// Função para mostrar erro no campo
function showFieldError(field, message) {
    field.classList.add('border-danger');
    
    // Criar ou atualizar mensagem de erro
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error text-danger small mt-1';
        field.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

// Função para limpar erro do campo
function clearFieldError(field) {
    field.classList.remove('border-danger');
    
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// Notification function


// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// WhatsApp Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const whatsappButton = document.getElementById('whatsapp-button');
    const modal = document.getElementById('whatsapp-modal');
    const closeButton = document.getElementById('close-modal');
    const contactOptions = document.querySelectorAll('.contact-option');

    // Abrir modal
    if (whatsappButton) {
        whatsappButton.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const modalInstance = new bootstrap.Modal(modal, {
                backdrop: 'static',
                keyboard: true
            });
            modalInstance.show();
        };
    }

    // Listeners para eventos do modal do WhatsApp
    if (modal) {
        // Quando o modal é mostrado
        modal.addEventListener('shown.bs.modal', function() {
            // Remover aria-hidden se existir
            this.removeAttribute('aria-hidden');
            // Focar no primeiro botão de contato para melhor acessibilidade
            const firstContact = this.querySelector('.contact-option');
            if (firstContact) firstContact.focus();
        });

        // Quando o modal é escondido
        modal.addEventListener('hidden.bs.modal', function() {
            // Remover aria-hidden e voltar o foco para o botão do WhatsApp
            this.removeAttribute('aria-hidden');
            if (whatsappButton) whatsappButton.focus();
        });

        // Quando o modal está sendo escondido
        modal.addEventListener('hide.bs.modal', function() {
            // Remover aria-hidden antes de esconder
            this.removeAttribute('aria-hidden');
        });
    }

    // Fechar modal
    function closeModal() {
        // Remover aria-hidden antes de fechar
        if (modal) {
            modal.removeAttribute('aria-hidden');
        }
        
        const modalInstance = bootstrap.Modal.getInstance(modal);
        if (modalInstance) {
            modalInstance.hide();
        }
        
        // Voltar o foco para o botão do WhatsApp
        if (whatsappButton) {
            setTimeout(() => whatsappButton.focus(), 100);
        }
    }

    // Fechar com botão X
    if (closeButton) {
        closeButton.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeModal();
        };
    }

    // Escolher contato
    contactOptions.forEach(option => {
        option.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const phone = this.getAttribute('data-phone');
            const name = this.getAttribute('data-name');
            const message = encodeURIComponent(`Olá, Alpha Automation and Robotics! Gostaria de mais informações sobre seus produtos ou serviços. Podem me ajudar?`);
            const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
            
            // Fechar modal primeiro
            closeModal();
            
            // Abrir WhatsApp após um pequeno delay
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
            }, 100);
        };
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
let isAutoPlaying = true;
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;
let isSwiping = false;

function updateProjectCarousel() {
    const track = document.getElementById('projects-carousel-track');
    
    if (track) {
        // Calcular a transformação correta
        const translateX = -(currentProjectIndex * 100);
        track.style.transform = `translateX(${translateX}%)`;
        
        // Debug: verificar se a transformação está correta
        console.log('Carrossel movido para:', currentProjectIndex, 'Transformação:', translateX + '%');
    }
}

function nextProject() {
    currentProjectIndex = (currentProjectIndex + 1) % totalProjects;
    console.log('Próximo projeto:', currentProjectIndex + 1, 'de', totalProjects);
    updateProjectCarousel();
}

function previousProject() {
    currentProjectIndex = (currentProjectIndex - 1 + totalProjects) % totalProjects;
    console.log('Projeto anterior:', currentProjectIndex + 1, 'de', totalProjects);
    updateProjectCarousel();
}

function goToProject(index) {
    if (index >= 0 && index < totalProjects) {
        currentProjectIndex = index;
        updateProjectCarousel();
    }
}

// Função para detectar swipe
function handleSwipe() {
    const swipeThreshold = 50;
    const diffX = touchStartX - touchEndX;
    const diffY = Math.abs(touchStartY - touchEndY);
    
    // Verificar se o movimento horizontal é maior que o vertical (swipe horizontal)
    if (Math.abs(diffX) > diffY && Math.abs(diffX) > swipeThreshold) {
        if (diffX > 0) {
            // Swipe para a esquerda - próximo projeto
            nextProject();
        } else {
            // Swipe para a direita - projeto anterior
            previousProject();
        }
    }
}

// Event listeners para touch
function setupTouchEvents() {
    const carouselContainer = document.querySelector('.carousel-container');
    
    if (carouselContainer) {
        carouselContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
            isSwiping = false;
            
            // Pausar auto-play durante o touch
            stopCarouselAutoPlay();
        }, { passive: true });
        
        carouselContainer.addEventListener('touchmove', (e) => {
            // Marcar como swiping se houver movimento
            if (Math.abs(e.changedTouches[0].screenX - touchStartX) > 10) {
                isSwiping = true;
            }
        }, { passive: true });
        
        carouselContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            
            // Só processar swipe se não foi um scroll
            if (isSwiping) {
                handleSwipe();
            }
            
            // Retomar auto-play após o touch
            if (isAutoPlaying) {
                startCarouselAutoPlay();
            }
        }, { passive: true });
        
        carouselContainer.addEventListener('touchcancel', () => {
            // Retomar auto-play se o touch for cancelado
            if (isAutoPlaying) {
                startCarouselAutoPlay();
            }
        });
        
        // Prevenir scroll durante swipe
        carouselContainer.addEventListener('touchmove', (e) => {
            if (isSwiping) {
                e.preventDefault();
            }
        }, { passive: false });
    }
}

// Função para detectar se é um dispositivo móvel
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (navigator.maxTouchPoints && navigator.maxTouchPoints > 2) ||
           window.innerWidth <= 768;
}

// Auto-play do carrossel
let carouselInterval;

function startCarouselAutoPlay() {
    if (isAutoPlaying && !isMobileDevice()) {
        carouselInterval = setInterval(() => {
            nextProject();
        }, 3000); // Mudou para 3 segundos para melhor experiência mobile
    }
}

function stopCarouselAutoPlay() {
    if (carouselInterval) {
        clearInterval(carouselInterval);
        carouselInterval = null;
    }
}

function toggleAutoPlay() {
    isAutoPlaying = !isAutoPlaying;
    if (isAutoPlaying) {
        startCarouselAutoPlay();
    } else {
        stopCarouselAutoPlay();
    }
}

// Inicializar carrossel quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    const carouselContainer = document.querySelector('.carousel-container');
    
    if (carouselContainer) {
        // Verificar se todas as imagens estão carregadas
        verifyCarouselImages();
        
        // Configurar eventos de touch
        setupTouchEvents();
        
        // Iniciar auto-play apenas em desktop
        if (!isMobileDevice()) {
            startCarouselAutoPlay();
        }
        
        // Pausar auto-play quando o mouse estiver sobre o carrossel (apenas em desktop)
        if (!isMobileDevice()) {
            carouselContainer.addEventListener('mouseenter', stopCarouselAutoPlay);
            carouselContainer.addEventListener('mouseleave', () => {
                if (isAutoPlaying) {
                    startCarouselAutoPlay();
                }
            });
        }
        
        // Inicializar o carrossel
        updateProjectCarousel();
        
        // Pausar auto-play quando a página não estiver visível
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopCarouselAutoPlay();
            } else if (isAutoPlaying && !isMobileDevice()) {
                startCarouselAutoPlay();
            }
        });
        
        // Ajustar carrossel quando a orientação mudar
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                updateProjectCarousel();
            }, 100);
        });
        
        // Ajustar carrossel quando a tela for redimensionada
        window.addEventListener('resize', () => {
            setTimeout(() => {
                updateProjectCarousel();
            }, 100);
        });
    }
});

// Função para verificar se todas as imagens do carrossel estão carregadas
function verifyCarouselImages() {
    const images = document.querySelectorAll('#projects-carousel-track img');
    console.log('Total de imagens encontradas:', images.length);
    
    images.forEach((img, index) => {
        if (img.complete) {
            console.log(`Imagem ${index + 1} carregada:`, img.src);
        } else {
            console.log(`Imagem ${index + 1} carregando:`, img.src);
            img.addEventListener('load', () => {
                console.log(`Imagem ${index + 1} carregada com sucesso:`, img.src);
            });
            img.addEventListener('error', () => {
                console.error(`Erro ao carregar imagem ${index + 1}:`, img.src);
            });
        }
    });
}

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