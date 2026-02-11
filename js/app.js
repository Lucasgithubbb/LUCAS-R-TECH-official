document.addEventListener('DOMContentLoaded', () => {
    initBackground(); // Inicia a animação laser aprimorada
    initMobileMenu();
    initSidebarLogic();
    initFormSubmission(); // Inicializa o envio do formulário
});

function toggleCard(header) {
    const card = header.parentElement;
    const content = card.querySelector('.expand-content');
    const isOpen = card.classList.contains('open');
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
        link.addEventListener('click', () => {
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            const targetId = link.getAttribute('href').substring(1);
            const targetCard = document.getElementById(targetId);
            
            if(targetCard && !targetCard.classList.contains('open')) {
                toggleCard(targetCard.querySelector('.expand-header'));
            }

            if(window.innerWidth <= 1024) {
                document.getElementById('sidebar').classList.remove('active');
            }
        });
    });
}

function initMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');
    if(btn) btn.addEventListener('click', () => sidebar.classList.toggle('active'));
}

// NOVA FUNÇÃO PARA ENVIAR O FORMULÁRIO E MOSTRAR O AVISO
function initFormSubmission() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    form.addEventListener("submit", async function(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        
        fetch(event.target.action, {
            method: form.method,
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                alert("Mensagem enviada com sucesso!"); // A caixinha de aviso
                form.reset();
            } else {
                alert("Ocorreu um erro ao enviar. Verifique se o código do Formspree está correto.");
            }
        }).catch(error => {
            alert("Ocorreu um erro de conexão.");
        });
    });
}

/* Alteração 6: Animação Laser/Geométrica mais visível */
function initBackground() {
    const canvas = document.getElementById('bg-canvas');
    if(!canvas) return;
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
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > canvas.width) this.x = 0; else if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0; else if (this.y < 0) this.y = canvas.height;
        }
        draw() {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            // Partículas mais visíveis
            ctx.beginPath();
            ctx.arc(this.x, this.y, 1.2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < 90; i++) {
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
                // Alteração: Aumentada a distância e opacidade das linhas laser
                if (distance < 150) { 
                    ctx.beginPath();
                    // Cor da linha laser ajustada para aparecer melhor
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 - distance/1000})`;
                    ctx.lineWidth = 0.6;
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