/**
 * LUCAS R TECH - CORE ENGINE 2026
 * Sistema de Navegação, Animações e Integração
 */

document.addEventListener('DOMContentLoaded', () => {
    initBackground(); 
    initMobileMenu();
    initNavigation();
    initFormSubmission();
});

/**
 * TOGGLE CARD EXPANSÍVEL
 */
function toggleCard(header) {
    const card = header.parentElement;
    const content = card.querySelector('.expand-content');
    const isOpen = card.classList.contains('open');

    // Fecha outros cards abertos
    if (!isOpen) {
        document.querySelectorAll('.expand-card.open').forEach(openCard => {
            openCard.classList.remove('open');
            openCard.querySelector('.expand-content').style.maxHeight = null;
        });

        card.classList.add('open');
        content.style.maxHeight = content.scrollHeight + "px";
        
        // Scroll suave para o card aberto
        setTimeout(() => {
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    } else {
        card.classList.remove('open');
        content.style.maxHeight = null;
    }
}

/**
 * NAVEGAÇÃO INTELIGENTE
 */
function initNavigation() {
    const links = document.querySelectorAll('.nav-link');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            // Atualiza estado ativo
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Se for um card expansível, abre automaticamente
            if (targetSection && targetSection.classList.contains('expand-card')) {
                const header = targetSection.querySelector('.expand-header');
                if (!targetSection.classList.contains('open')) {
                    toggleCard(header);
                }
            }

            // Fecha menu mobile ao clicar
            if (window.innerWidth <= 1024) {
                document.getElementById('sidebar').classList.remove('active');
                document.getElementById('mobileMenuBtn').classList.remove('active');
            }
        });
    });
}

/**
 * MENU MOBILE INTELIGENTE
 */
function initMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');
    
    if (btn) {
        btn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            btn.classList.toggle('active');
        });
        
        // Fecha menu ao clicar em um link (apenas mobile)
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 1024) {
                    sidebar.classList.remove('active');
                    btn.classList.remove('active');
                }
            });
        });
        
        // Fecha menu ao clicar fora (apenas mobile)
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024 && 
                !sidebar.contains(e.target) && 
                !btn.contains(e.target) &&
                sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                btn.classList.remove('active');
            }
        });
    }
}

/**
 * FORMULÁRIO COM FORMSPREE
 */
function initFormSubmission() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    form.addEventListener("submit", async function(event) {
        event.preventDefault();
        const btn = form.querySelector('button');
        const originalText = btn.innerText;
        
        btn.innerText = "ENVIANDO...";
        btn.style.opacity = "0.6";
        btn.disabled = true;

        const data = new FormData(event.target);
        
        try {
            const response = await fetch(event.target.action, {
                method: form.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                showNotification("✅ Mensagem enviada! Respondo em breve.", "success");
                form.reset();
            } else {
                showNotification("⚠️ Algo deu errado. Tenta de novo.", "error");
            }
        } catch (error) {
            showNotification("🔌 Erro de conexão. Verifique sua internet.", "error");
        } finally {
            btn.innerText = originalText;
            btn.style.opacity = "1";
            btn.disabled = false;
        }
    });
}

/**
 * NOTIFICAÇÕES VISUAIS
 */
function showNotification(message, type = "info") {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#2ecc71' : '#e74c3c'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 9999;
        animation: slideIn 0.3s ease;
        display: flex;
        align-items: center;
               gap: 15px;
        font-family: var(--font-primary);
        font-size: 0.9rem;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Remove automaticamente após 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

/**
 * BACKGROUND DE PARTÍCULAS LASER (MAIS NÍTIDO)
 */
function initBackground() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    }

    function initParticles() {
        particles = [];
        const particleCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 10000));
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 1.5 + 0.5,
                speedX: (Math.random() - 0.5) * 0.8,
                speedY: (Math.random() - 0.5) * 0.8,
                color: `rgba(230, 57, 70, ${0.3 + Math.random() * 0.4})`
            });
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Desenha partículas
        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            
            // Rebate nas bordas
            if (p.x > canvas.width) p.x = 0;
            else if (p.x < 0) p.x = canvas.width;
            if (p.y > canvas.height) p.y = 0;
            else if (p.y < 0) p.y = canvas.height;
            
            // Desenha partícula
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Conexões laser entre partículas próximas
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const opacity = 0.15 - (distance / 1000);
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    ctx.lineWidth = 0.6;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        
        animationId = requestAnimationFrame(animate);
    }

    // Inicializa
    window.addEventListener('resize', resize);
    resize();
    animate();
}

/**
 * INICIALIZAÇÃO COMPLETA
 */
console.log('🚀 Lucas R Tech - Site carregado com sucesso!');

