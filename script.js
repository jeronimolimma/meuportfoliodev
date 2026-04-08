document.addEventListener('DOMContentLoaded', () => {
    // --- Efeito Typewriter Adaptável ---
    const typingElement = document.getElementById('typing');
    if (typingElement) {
        let phrases = ["Front-end", "Web Designer", "UI/UX"]; // Padrão
        
        // Detecta qual página estamos para mudar as frases
        if (window.location.pathname.includes('frontend') || window.location.pathname.endsWith('/')) {
            phrases = ["Front-end", "Web Designer", "UI/UX"];
        } else if (window.location.pathname.includes('logistica')) {
            phrases = ["Gerência Sênior", "Estrategista de P&L", "Expert em Cadeia Fria"];
        }

        let phraseIndex = 0;
        let charIndex = 0;
        function type() {
            if (charIndex < phrases[phraseIndex].length) {
                typingElement.textContent += phrases[phraseIndex].charAt(charIndex++);
                setTimeout(type, 150);
            } else {
                setTimeout(() => { typingElement.textContent = ""; charIndex = 0; phraseIndex = (phraseIndex + 1) % phrases.length; type(); }, 2000);
            }
        }
        type();
    }

    // --- Lógica do Menu Hambúrguer ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li');
    const icon = menuToggle.querySelector('i');

    // Verificação de segurança para evitar erros se os elementos não existirem
    if (!menuToggle || !navLinks || !icon) return;

    // Função para alternar o menu
    menuToggle.addEventListener('click', () => {
        // Toggle da classe 'active' na lista de links
        navLinks.classList.toggle('active');

        // Alternar ícone entre 'Barras' e 'X'
        if (navLinks.classList.contains('active')) {
            // Define a altura baseada no conteúdo real para animação suave
            navLinks.style.height = navLinks.scrollHeight + 40 + "px"; // +40 compensa o padding

            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
            
            // Animação sequencial dos itens (efeito cascata)
            navItems.forEach((link, index) => {
                link.style.transitionDelay = `${index * 0.1}s`;
            });
            
        } else {
            navLinks.style.height = '0px'; // Reseta a altura ao fechar
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            
            // Remove o delay ao fechar
            navItems.forEach(link => {
                link.style.transitionDelay = '0s';
            });
        }
    });

    // Fechar o menu ao clicar em um link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            navLinks.style.height = '0px'; // Garante o fechamento suave
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // --- Validação do Formulário ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const reasonInput = document.getElementById('reason');
        const submitBtn = document.getElementById('submitBtn');

        // Função Regex para validar formato de e-mail
        const validateEmail = (email) => {
            return String(email)
                .toLowerCase()
                .match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                );
        };

        // Função unificada para validar todo o formulário
        const validateForm = () => {
            const isEmailValid = validateEmail(emailInput.value);
            const isNameValid = nameInput.value.trim().length > 0;
            const isReasonValid = reasonInput.value !== "";

            // Estilização específica do Email (feedback visual)
            if (isEmailValid) {
                emailInput.style.borderColor = 'var(--accent-color)';
            } else {
                emailInput.style.borderColor = emailInput.value !== "" ? '#ff4d4d' : '#334155';
            }

            // Habilita botão se os campos básicos estiverem preenchidos.
            // O reCAPTCHA será validado no evento de 'submit'.
            if (isEmailValid && isNameValid && isReasonValid) {
                submitBtn.removeAttribute('disabled');
            } else {
                submitBtn.setAttribute('disabled', 'true');
            }
        };

        // Escutar eventos em todos os campos obrigatórios
        emailInput.addEventListener('input', validateForm);
        nameInput.addEventListener('input', validateForm);
        reasonInput.addEventListener('change', validateForm);

        // Envio Profissional via AJAX (Sem redirecionar a página)
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Impede o recarregamento da página
            
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Enviando...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            const formData = new FormData(this);

            fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json' // Solicita resposta JSON do FormSubmit
                }
            })
            .then(response => {
                if (response.ok) {
                    // Substitui o formulário pela mensagem de sucesso
                    contactForm.innerHTML = `
                        <div class="form-success">
                            <i class="fas fa-check-circle" style="color: #2ecc71; font-size: 4rem; margin-bottom: 20px;"></i>
                            <h3 style="font-family: var(--font-heading); margin-bottom: 10px;">Mensagem Enviada!</h3>
                            <p style="color: var(--text-secondary);">Obrigado pelo contato. Retornarei o mais breve possível.</p>
                        </div>
                    `;
                } else {
                    alert("Ocorreu um erro ao enviar. Tente novamente.");
                    submitBtn.innerText = originalBtnText;
                    submitBtn.disabled = false;
                }
            })
            .catch(error => {
                console.error(error);
                alert("Erro de conexão. Verifique sua internet.");
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    }

    // --- Navbar Inteligente (Esconde/Mostra no Scroll) ---
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Rolar para baixo e passou de 100px -> Esconde
            navbar.classList.add('navbar-hidden');
        } else {
            // Rolar para cima -> Mostra
            navbar.classList.remove('navbar-hidden');
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Evita números negativos
    });

    // --- Efeito de Fade-in para Imagens (Lazy Loading Visual) ---
    const lazyImages = document.querySelectorAll('.lazy-img');
    lazyImages.forEach(img => {
        // Se a imagem já estiver no cache e carregada
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            // Quando a imagem terminar de carregar, adiciona a classe
            img.addEventListener('load', () => img.classList.add('loaded'));
        }
    });

    // --- Atualização Automática do Ano ---
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
        // Pequeno atraso para garantir que o navegador perceba a mudança e aplique a transição
        setTimeout(() => {
            yearElement.classList.add('visible');
        }, 200);
    }
});
