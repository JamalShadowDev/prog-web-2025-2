// ========================
// POTATO CITY JAVASCRIPT
// ========================

// Variáveis globais
let mobileMenuOpen = false;

// ========================
// INICIALIZAÇÃO
// ========================
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initContactForm();
    initSmoothScroll();
    initCardAnimations();
    initImageModal();
    showWelcomeMessage();
});

// ========================
// MENU MOBILE RESPONSIVO
// ========================
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const mobileNav = document.querySelector('.mobile-nav');
    const navLinks = document.querySelectorAll('.mobile-nav a');

    if (!mobileMenuBtn || !mobileNav) return;

    // Toggle menu ao clicar no hambúrguer
    mobileMenuBtn.addEventListener('click', function() {
        toggleMobileMenu();
    });

    // Fechar menu ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu();
        });
    });

    // Fechar menu ao clicar fora
    document.addEventListener('click', function(e) {
        if (mobileMenuOpen && 
            !mobileMenuBtn.contains(e.target) && 
            !mobileNav.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Fechar menu ao redimensionar para desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1023 && mobileMenuOpen) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const mobileNav = document.querySelector('.mobile-nav');

    mobileMenuOpen = !mobileMenuOpen;
    
    mobileMenuBtn.classList.toggle('active');
    mobileNav.classList.toggle('active');

    // Animação das barras do hambúrguer
    if (mobileMenuOpen) {
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
        mobileNav.setAttribute('aria-hidden', 'false');
    } else {
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
    }
}

function closeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const mobileNav = document.querySelector('.mobile-nav');

    mobileMenuOpen = false;
    
    mobileMenuBtn.classList.remove('active');
    mobileNav.classList.remove('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
}

// ========================
// FORMULÁRIO DE CONTATO
// ========================
function initContactForm() {
    const form = document.querySelector('form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission(this);
    });

    // Validação em tempo real
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function handleFormSubmission(form) {
    const formData = new FormData(form);
    const errors = validateForm(form);

    if (errors.length > 0) {
        showAlert('Por favor, corrija os erros no formulário:', 'error', errors);
        return;
    }

    // Simular envio
    showAlert('Enviando mensagem...', 'loading');
    
    setTimeout(() => {
        showAlert('Mensagem enviada com sucesso! Entraremos em contato em até 2 dias úteis.', 'success');
        form.reset();
        clearAllErrors();
    }, 2000);
}

function validateForm(form) {
    const errors = [];
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            errors.push(`${getFieldLabel(field)} é obrigatório`);
            markFieldError(field);
        } else if (field.type === 'email' && !isValidEmail(field.value)) {
            errors.push(`${getFieldLabel(field)} deve ter formato válido`);
            markFieldError(field);
        }
    });

    return errors;
}

function validateField(field) {
    const label = getFieldLabel(field);
    
    if (field.hasAttribute('required') && !field.value.trim()) {
        markFieldError(field, `${label} é obrigatório`);
        return false;
    }
    
    if (field.type === 'email' && field.value && !isValidEmail(field.value)) {
        markFieldError(field, 'E-mail deve ter formato válido');
        return false;
    }
    
    clearFieldError(field);
    return true;
}

function markFieldError(field, message = '') {
    field.classList.add('error');
    
    // Remove mensagem de erro anterior
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Adiciona nova mensagem se fornecida
    if (message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function clearAllErrors() {
    const errorFields = document.querySelectorAll('.error');
    const errorMessages = document.querySelectorAll('.error-message');
    
    errorFields.forEach(field => field.classList.remove('error'));
    errorMessages.forEach(message => message.remove());
}

function getFieldLabel(field) {
    const label = field.parentNode.querySelector('label');
    return label ? label.textContent.replace(':', '').replace(/[📝📧📱🏘️📋💬]/g, '').trim() : field.name;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ========================
// SISTEMA DE ALERTAS
// ========================
function showAlert(message, type = 'info', details = []) {
    // Remove alerta anterior se existir
    const existingAlert = document.querySelector('.alert-overlay');
    if (existingAlert) {
        existingAlert.remove();
    }

    // Cria overlay do alerta
    const overlay = document.createElement('div');
    overlay.className = `alert-overlay ${type}`;
    
    // Cria conteúdo do alerta
    const alertBox = document.createElement('div');
    alertBox.className = 'alert-box';
    
    // Ícone baseado no tipo
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️',
        loading: '⏳'
    };
    
    alertBox.innerHTML = `
        <div class="alert-icon">${icons[type] || icons.info}</div>
        <div class="alert-content">
            <div class="alert-message">${message}</div>
            ${details.length > 0 ? `
                <ul class="alert-details">
                    ${details.map(detail => `<li>${detail}</li>`).join('')}
                </ul>
            ` : ''}
        </div>
        ${type !== 'loading' ? '<button class="alert-close">×</button>' : ''}
    `;
    
    overlay.appendChild(alertBox);
    document.body.appendChild(overlay);
    
    // Animação de entrada
    setTimeout(() => overlay.classList.add('show'), 10);
    
    // Fechar alerta
    if (type !== 'loading') {
        const closeBtn = alertBox.querySelector('.alert-close');
        closeBtn.addEventListener('click', () => closeAlert(overlay));
        
        // Auto-fechar após 5 segundos (exceto erros)
        if (type !== 'error') {
            setTimeout(() => closeAlert(overlay), 5000);
        }
    }
    
    // Fechar ao clicar no overlay
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeAlert(overlay);
        }
    });
}

function closeAlert(overlay) {
    overlay.classList.add('hide');
    setTimeout(() => {
        if (overlay.parentNode) {
            overlay.remove();
        }
    }, 300);
}

// ========================
// SMOOTH SCROLL MELHORADO
// ========================
function initSmoothScroll() {
    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ========================
// ANIMAÇÕES DOS CARDS
// ========================
function initCardAnimations() {
    const cards = document.querySelectorAll('.card');
    
    // Intersection Observer para animações de scroll
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        cards.forEach(card => {
            observer.observe(card);
        });
    }
    
    // Efeito de hover melhorado
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// ========================
// MODAL DE IMAGENS
// ========================
function initImageModal() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('click', function() {
            if (this.naturalWidth > 400) { // Apenas imagens grandes
                openImageModal(this.src, this.alt);
            }
        });
        
        // Adiciona cursor pointer para imagens clicáveis
        if (img.naturalWidth > 400) {
            img.style.cursor = 'pointer';
        }
    });
}

function openImageModal(src, alt) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <img src="${src}" alt="${alt}">
                <button class="modal-close">×</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
    
    // Fechar modal
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    
    closeBtn.addEventListener('click', () => closeImageModal(modal));
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeImageModal(modal);
        }
    });
    
    // Fechar com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeImageModal(modal);
        }
    });
}

function closeImageModal(modal) {
    modal.classList.add('hide');
    setTimeout(() => {
        if (modal.parentNode) {
            modal.remove();
        }
    }, 300);
}

// ========================
// MENSAGEM DE BOAS-VINDAS
// ========================
function showWelcomeMessage() {
    // Mostrar apenas na primeira visita
    if (!localStorage.getItem('potatoCityVisited')) {
        setTimeout(() => {
            showAlert('Bem-vindo à Potato City! 🥔 Explore nossa cidade subterrânea!', 'info');
            localStorage.setItem('potatoCityVisited', 'true');
        }, 1000);
    }
}

// ========================
// UTILITÁRIOS
// ========================

// Debounce function para performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Detectar dispositivo móvel
function isMobileDevice() {
    return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Logging para debug (apenas em desenvolvimento)
function logDebug(message, data = null) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log(`[Potato City] ${message}`, data || '');
    }
}

// ========================
// EXTRAS OPCIONAIS
// ========================

// Função para adicionar funcionalidade de busca simples
function initSimpleSearch() {
    const searchInput = document.querySelector('#search');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', debounce(function() {
        const query = this.value.toLowerCase();
        const cards = document.querySelectorAll('.card');
        
        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            if (text.includes(query) || query === '') {
                card.style.display = 'block';
                card.classList.add('search-match');
            } else {
                card.style.display = 'none';
                card.classList.remove('search-match');
            }
        });
    }, 300));
}

// Função para modo escuro (opcional)
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
}

// Exportar funções principais para uso global
window.PotatoCity = {
    toggleMobileMenu,
    showAlert,
    toggleDarkMode,
    logDebug
};