// --- LÓGICA DA TELA INICIAL ---
const startOverlay = document.getElementById('start-overlay');
let gameStarted = false; // Bloqueia o movimento do boneco até o jogo começar
let movementTimeout; // Variável global para controlar animações e evitar bugs

function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        startOverlay.classList.add('fade-out');
        
        setTimeout(() => {
            startOverlay.style.display = 'none';
        }, 1000);
    }
}

// Inicia ao clicar na tela ou apertar qualquer tecla
startOverlay.addEventListener('click', startGame);
document.addEventListener('keydown', (event) => {
    if (!gameStarted) {
        startGame();
    }
});

const character = document.getElementById('character');
const modalContainer = document.getElementById('modal-container');
const modalBody = document.getElementById('modal-body'); // Agora usamos apenas o container do corpo

// --- SISTEMA DE MOVIMENTAÇÃO (MOUSE E TECLADO) ---
const pathOrder = ['start', 'sobre', 'skills', 'projetos', 'porto'];
let currentLevelIndex = 0; 

const coordinates = {
    'start': { left: 30, top: 100 },
    'sobre': { left: 100, top: 90 },    
    'skills': { left: 340, top: 120 },   
    'projetos': { left: 350, top: 320 }, 
    'porto': { left: 600, top: 300 }     
};

function moveArrow(direction) {
    if (direction === 'right' && currentLevelIndex < pathOrder.length - 1) {
        currentLevelIndex++;
        character.style.transform = "scaleX(1)";
        executeMovement();
    } else if (direction === 'left' && currentLevelIndex > 0) {
        currentLevelIndex--;
        character.style.transform = "scaleX(-1)";
        executeMovement();
    }
}

document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();

    // Fecha janela com ESC ou Enter
    if (!modalContainer.classList.contains('hidden')) {
        if (key === 'escape' || key === 'enter') {
            closeModal();
        }
        return; 
    }

    // Avançar (D ou Seta Direita)
    if (key === 'd' || key === 'arrowright') {
        if (currentLevelIndex < pathOrder.length - 1) {
            currentLevelIndex++;
            character.style.transform = "scaleX(1)"; 
            executeMovement();
        }
    }
    // Voltar (A ou Seta Esquerda)
    else if (key === 'a' || key === 'arrowleft') {
        if (currentLevelIndex > 0) {
            currentLevelIndex--;
            character.style.transform = "scaleX(-1)"; 
            executeMovement();
        }
    }
});

function executeMovement() {
    const nextSection = pathOrder[currentLevelIndex];
    moveTo(nextSection); 
}

function moveTo(sectionId) {
    closeModal();
    clearTimeout(movementTimeout); 

    currentLevelIndex = pathOrder.indexOf(sectionId);
    const targetCoords = coordinates[sectionId];

    character.style.left = targetCoords.left + 'px';
    character.style.top = targetCoords.top + 'px';

    // Lógica do HUD (Bolinhas e Abas)
    document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active-tab'));
    
    if (sectionId !== 'start') {
        const activeDot = document.getElementById('dot-' + sectionId);
        if (activeDot) activeDot.classList.add('active');

        const activeLink = document.getElementById('link-' + sectionId);
        if (activeLink) activeLink.classList.add('active-tab');
    }

    // Final do jogo (Zarpar) ou abrir modal
    if (sectionId === 'porto') {
        movementTimeout = setTimeout(() => {
            character.style.opacity = '0';
            document.getElementById('ship').classList.add('zarpar');

            setTimeout(() => {
                document.getElementById('contact-screen').classList.remove('hidden');
            }, 4000);

        }, 1200); 
    } else {
        movementTimeout = setTimeout(() => {
            openModal(sectionId);
        }, 600); 
    }
}

// --- LÓGICA ATUALIZADA DO MODAL COM TEMPLATES ---
function openModal(sectionId) {
    if (sectionId === 'start') return;

    // Busca o HTML preparado na nossa div escondida no index.html
    const templateContent = document.getElementById('template-' + sectionId);
    
    if (templateContent) {
        // Injeta o conteúdo no corpo do modal
        modalBody.innerHTML = templateContent.innerHTML;
        modalContainer.classList.remove('hidden');
    }
}

function closeModal() {
    modalContainer.classList.add('hidden');
}

window.onload = () => {
    window.scrollTo(0, 0); 
    character.style.left = coordinates['start'].left + 'px';
    character.style.top = coordinates['start'].top + 'px';
};

// --- FUNÇÕES DA TELA FINAL DE CONTATO ---
function copiarEmail() {
    const email = "gleider.tallyson0@gmail.com";
    const inputTemporario = document.createElement("input");
    inputTemporario.value = email;
    document.body.appendChild(inputTemporario);
    inputTemporario.select();
    inputTemporario.setSelectionRange(0, 99999); 
    
    try {
        document.execCommand("copy");
        const botaoCopiar = document.querySelector('.posicao-email .btn-azul');
        if (botaoCopiar) {
            const textoOriginal = botaoCopiar.innerText;
            botaoCopiar.innerText = "COPIADO! ✔️";
            setTimeout(() => {
                botaoCopiar.innerText = textoOriginal;
            }, 2000);
        }
    } catch (err) {
        console.error("Erro ao copiar o e-mail: ", err);
    }
    document.body.removeChild(inputTemporario);
}

function reiniciarJogo() {
    window.location.reload(); 
}