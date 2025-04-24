function typeWriter(element, speed = 100) {
    const lines = element.innerHTML.split('<br>'); // Captura as linhas separadas por <br>
    element.innerHTML = '';
    element.style.borderRight = '3px solid #d32f2f';
    
    let currentLine = 0;
    let i = 0;
    
    function typing() {
        if (currentLine < lines.length) {
            if (i < lines[currentLine].length) {
                element.innerHTML += lines[currentLine].charAt(i);
                i++;
                setTimeout(typing, speed);
            } else {
                // Quebra de linha
                if (currentLine < lines.length - 1) {
                    element.innerHTML += '<br>';
                    i = 0;
                    currentLine++;
                    setTimeout(typing, speed*2); // Pausa maior entre linhas
                } else {
                    // Última linha terminada
                    element.style.borderRight = 'none';
                    const arrow = element.closest('.slide').querySelector('.arrow');
                    if (arrow) arrow.classList.add('visible');
                }
            }
        }
    }
    typing();
}

// Controle dos slides
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function showSlide(index) {
    slides.forEach((slide, i) => {
        if (i === index) {
            slide.classList.add('active');
            // Aplica efeito de digitação nos textos
            const typingElements = slide.querySelectorAll('.typing-text');
            if (typingElements.length > 0) {
                typingElements.forEach((el, idx) => {
                    setTimeout(() => typeWriter(el), idx * 1500);
                });
            } else {
                // Mostra seta imediatamente se não houver texto para digitar
                const arrow = slide.querySelector('.arrow');
                if (arrow) {
                    arrow.classList.add('visible');
                }
            }
            
            // Reseta progresso das imagens ao mudar de slide
            if (slide.querySelector('.image-container')) {
                resetImageProgress(slide);
            }
        } else {
            slide.classList.remove('active');
        }
    });
}

// Controle de progresso das imagens
function setupImageProgress() {
    document.querySelectorAll('.heart-button').forEach(button => {
        let progress = 0;
        const progressFill = button.closest('.heart-progress').querySelector('.progress-fill');
        const progressText = button.closest('.heart-progress').querySelector('.progress-text');
        const image = button.closest('.image-container').querySelector('img');
        const arrow = button.closest('.slide').querySelector('.arrow');
        
        button.addEventListener('click', () => {
            if (progress < 100) {
                progress += 10;
                progressFill.style.width = `${progress}%`;
                progressText.textContent = `${progress}%`;
                
                // Reduz o blur conforme o progresso
                image.style.filter = `blur(${10 - (progress/10)}px)`;
                
                // Quando completar 100%
                if (progress === 100) {
                    image.classList.remove('blurred');
                    // Mostra a seta após pequeno delay
                    setTimeout(() => {
                        arrow.classList.add('visible');
                        arrow.style.display = 'block'; // Adiciona esta linha
                    }, 300);
                    
                    // Adiciona efeito de comemoração
                    button.style.animation = 'heartbeat 0.5s 3';
                }
                
                // Efeito no coração
                button.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    button.style.transform = 'scale(1)';
                }, 200);
            }
        });
    });
}

function resetImageProgress(slide) {
    const containers = slide.querySelectorAll('.image-container');
    containers.forEach(container => {
        const progressFill = container.querySelector('.progress-fill');
        const progressText = container.querySelector('.progress-text');
        const image = container.querySelector('img');
        const arrow = slide.querySelector('.arrow');
        
        progressFill.style.width = '0%';
        progressText.textContent = '0%';
        image.classList.add('blurred');
        image.style.filter = 'blur(10px)';
        arrow.classList.remove('visible');
    });
}

// Controle de música
const bgMusic = document.getElementById('bgMusic');
const musicButton = document.getElementById('musicButton');
let isPlaying = false;

document.addEventListener('click', function firstInteraction() {
    if (!isPlaying) {
        bgMusic.play()
            .then(() => {
                isPlaying = true;
                musicButton.textContent = '🔊 Tocando';
            })
            .catch(e => {
                console.log('Reprodução automática bloqueada');
            });
    }
    document.removeEventListener('click', firstInteraction);
}, { once: true });

musicButton.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        musicButton.textContent = '🔇 Ligar Música';
    } else {
        bgMusic.play();
        musicButton.textContent = '🔊 Tocando';
    }
    isPlaying = !isPlaying;
});

// Configura volume
bgMusic.volume = 0.3;

// Inicialização
showSlide(0);
setupImageProgress();

// Navegação entre slides
document.querySelectorAll('.arrow').forEach(arrow => {
    arrow.addEventListener('click', () => {
        if (arrow.classList.contains('visible')) {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }
    });
});


// Adicione esta função para configurar o efeito de raspar
function setupScratchEffect() {
    const scratchContainer = document.querySelector('#slide4 .scratch-container');
    const overlay = document.querySelector('#slide4 .scratch-overlay');
    const message = document.querySelector('#slide4 .scratch-message');
    const arrow = document.querySelector('#slide4 .arrow');
    
    let isScratching = false;
    let revealedPercentage = 0;
    const totalPixels = scratchContainer.offsetWidth * scratchContainer.offsetHeight;
    const revealThreshold = 70; // % necessário para revelar

    // Eventos para mouse
    overlay.addEventListener('mousedown', () => isScratching = true);
    document.addEventListener('mouseup', () => isScratching = false);
    document.addEventListener('mousemove', scratch);

    // Eventos para touch
    overlay.addEventListener('touchstart', () => isScratching = true);
    document.addEventListener('touchend', () => isScratching = false);
    overlay.addEventListener('touchmove', scratch);

    function scratch(e) {
        if (!isScratching) return;
        
        const rect = scratchContainer.getBoundingClientRect();
        let x, y;
        
        if (e.type === 'mousemove') {
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
        } else {
            x = e.touches[0].clientX - rect.left;
            y = e.touches[0].clientY - rect.top;
        }
        
        // Cria um círculo "raspado"
        const scratchSize = 40;
        const scratchArea = document.createElement('div');
        scratchArea.style.position = 'absolute';
        scratchArea.style.left = (x - scratchSize/2) + 'px';
        scratchArea.style.top = (y - scratchSize/2) + 'px';
        scratchArea.style.width = scratchSize + 'px';
        scratchArea.style.height = scratchSize + 'px';
        scratchArea.style.borderRadius = '50%';
        scratchArea.style.backgroundColor = 'transparent';
        scratchArea.style.pointerEvents = 'none';
        scratchArea.style.boxShadow = `0 0 0 ${scratchSize/2}px transparent`;
        
        // Usa máscara para revelar
        scratchArea.style.mixBlendMode = 'destination-out';
        overlay.appendChild(scratchArea);
        
        // Calcula porcentagem revelada
        revealedPercentage = Math.min(revealedPercentage + 0.5, 100);
        
        // Quando atingir o threshold
        if (revealedPercentage >= revealThreshold) {
            overlay.style.display = 'none';
            message.classList.remove('hidden');
            message.classList.add('visible');
            arrow.classList.remove('hidden');
            
            // Remove event listeners
            document.removeEventListener('mousemove', scratch);
            document.removeEventListener('touchmove', scratch);
        }
    }
}

// Chame esta função no final do seu script.js
setupScratchEffect();