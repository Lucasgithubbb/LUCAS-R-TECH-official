document.addEventListener('DOMContentLoaded', () => {
    initBackground(); 
    initMobileMenu();
    initSidebarLogic();
    initFormSubmission();
});

function toggleCard(header) {
    const card = header.parentElement;
    const content = card.querySelector('.expand-content');
    const isOpen = card.classList.contains('open');

    // Comportamento do Accordion (opcional: fecha os outros abertos para manter a tela limpa)
    document.querySelectorAll('.expand-card.open').forEach(openCard => {
        if (openCard !== card) {
            openCard.classList.remove('open');
            openCard.querySelector('.expand-content').style.maxHeight = null;
        }
    });

    if (!isOpen) {
        card.classList.add('open');
        content.style.maxHeight = content.scrollHeight + "px";
    } else {
        card.classList.remove('open');
        content.style.maxHeight = null;
    }
}

function initSidebarLogic() {
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            // Evita a remoção da classe ativa em telas muito pequenas se não for âncora
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            const targetId = link.getAttribute('href').substring(1);
            const targetCard = document.getElementById(targetId);
            
            // Se o alvo for um card e não estiver aberto, abra-o
            if (targetCard && targetCard.classList.contains('expand-card') && !targetCard.classList.contains('open')) {
                toggleCard(targetCard.querySelector('.expand-header'));
            }

            // Esconde menu no mobile após o clique
            if (window.innerWidth <= 1024) {
                document.getElementById('sidebar').classList.remove('active');
            }
        });
    });
}

function initMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');
    if (btn && sidebar) {
        btn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
}

function initFormSubmission() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    form.addEventListener("submit", async function(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        
        // Altera o texto do botão para indicar carregamento
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = "Transmitindo...";
        submitBtn.disabled = true;

        fetch(event.target.action, {
            method: form.method,
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                alert("Mensagem recebida nos servidores com sucesso. Retornaremos em breve."); 
                form.reset();
            } else {
                alert("Falha na transmissão. Verifique a configuração do endpoint.");
            }
        }).catch(error => {
            alert("Erro de conexão de rede.");
        }).finally(() => {
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        });
    });
}

function initBackground() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > canvas.width) this.x = 0; else if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0; else if (this.y < 0) this.y = canvas.height;
        }
        draw() {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'; 
            ctx.beginPath();
            ctx.arc(this.x, this.y, 1.2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Adaptabilidade: Menos partículas em telas menores para melhor performance
    const particleCount = window.innerWidth < 768 ? 50 : 100;

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Distância otimizada para conexões fluídas
                if (distance < 130) { 
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.12 - distance / 1000})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}