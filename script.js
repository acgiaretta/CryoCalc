const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const winScreen = document.getElementById("winScreen");
const calculatorBox = document.getElementById("calculatorBox");
const rankingPanel = document.getElementById("rankingPanel");
const rankingList = document.getElementById("rankingList");

const playerNameInput = document.getElementById("playerNameInput");
const startBtn = document.getElementById("startBtn");
const btnYes = document.getElementById("btnYes");
const btnNo = document.getElementById("btnNo");

const dispName = document.getElementById("dispName");
const dispRecord = document.getElementById("dispRecord");
const dispScore = document.getElementById("dispScore");
const dispTime = document.getElementById("dispTime");

const expressionEl = document.getElementById("expression");
const resultEl = document.getElementById("result");
const blizzardOverlay = document.getElementById("blizzardOverlay");
const snowContainer = document.getElementById("snowContainer");
const endGameTitle = document.getElementById("endGameTitle");
const endGameSub = document.getElementById("endGameSub");

const diffButtons = document.querySelectorAll(".btn-diff");

let playerName = ""; 
let score = 0; 

//sistema de Ranking fica armazenado no localStorage
let ranking = JSON.parse(localStorage.getItem("cryoCalcRanking")) || [];

let record = ranking.length > 0 ? ranking[0].score : 0; 
let selectedDifficulty = "easy"; 
let gameTimeLimit = 20; 
let timeLeft = 20;
let timerInterval = null; 

let currentAnswer = 0; 
let currentValue = "0"; 
let shouldReplace = false;
let snowInterval = null;

dispRecord.textContent = record; 
atualizarPainelRanking();

function atualizarPainelRanking() {
    rankingList.innerHTML = "";
    
    //garante sempre 5 posições no ranking visual (preenchendo com vazios se necessário)
    for (let i = 0; i < 5; i++) {
        const li = document.createElement("li");
        li.classList.add("ranking-item");
        
        let medalha = `${i + 1}º`;
        if (i === 0) medalha = "🥇";
        else if (i === 1) medalha = "🥈";
        else if (i === 2) medalha = "🥉";

        if (ranking[i]) {
            li.innerHTML = `<span>${medalha} ${ranking[i].name}</span> <strong>${ranking[i].score} pts</strong>`;
        } else {
            li.innerHTML = `<span>${medalha} ---</span> <strong>0 pts</strong>`;
        }
        rankingList.appendChild(li);
    }
}

function salvarPontuacaoNoRanking(nome, novaPontuacao) {
    if (novaPontuacao <= 0) return;

    ranking.push({ name: nome, score: novaPontuacao });
    // Ordena do maior para o menor score
    ranking.sort((a, b) => b.score - a.score);
    // Mantém apenas os 5 melhores
    ranking = ranking.slice(0, 5);

    localStorage.setItem("cryoCalcRanking", JSON.stringify(ranking));
    
    // Atualiza o recorde global exibido na HUD
    record = ranking.length > 0 ? ranking[0].score : 0;
    dispRecord.textContent = record;
    
    atualizarPainelRanking();
}

function criarFlocoDeNeve(isAvalanche = false) {
    if (!snowContainer) return;
    const floco = document.createElement("div");
    
    const isChunk = isAvalanche && Math.random() < 0.35;
    floco.classList.add(isChunk ? "snow-chunk-avalanche" : (isAvalanche ? "snowflake-avalanche" : "snowflake"));
    
    floco.style.left = Math.random() * window.innerWidth + "px";
    
    let tamanho, duracao;
    if (isChunk) {
        tamanho = Math.random() * 25 + 15; 
        duracao = Math.random() * 0.4 + 0.3; 
    } else if (isAvalanche) {
        tamanho = Math.random() * 12 + 6;  
        duracao = Math.random() * 0.5 + 0.4; 
    } else {
        tamanho = Math.random() * 6 + 4;   
        duracao = Math.random() * 5 + 5;   
    }

    floco.style.width = tamanho + "px";
    floco.style.height = (isChunk ? (Math.random() * 10 + 10) : tamanho) + "px";
    floco.style.animationDuration = duracao + "s";
    floco.style.opacity = isAvalanche ? (Math.random() * 0.4 + 0.6) : (Math.random() * 0.5 + 0.3); 

    snowContainer.appendChild(floco);

    setTimeout(() => {
        floco.remove();
    }, duracao * 1000);
}

setInterval(() => criarFlocoDeNeve(false), 200);

diffButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        diffButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectedDifficulty = btn.dataset.diff;

        if (selectedDifficulty === "easy") gameTimeLimit = 20;
        if (selectedDifficulty === "medium") gameTimeLimit = 15;
        if (selectedDifficulty === "hard") gameTimeLimit = 10;
    });
});

startBtn.addEventListener("click", () => { 
    playerName = playerNameInput.value.trim(); 
    if (!playerName) { 
        alert("Por favor, escreva o seu nome para enfrentar a nevasca!");
        playerNameInput.focus();
        return;
    }
    iniciarPartidaDoJogo();
});

playerNameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        startBtn.click();
    }
});

function iniciarPartidaDoJogo() {
    dispName.textContent = playerName; 
    startScreen.classList.add("hidden"); 
    gameScreen.classList.remove("hidden"); 
    rankingPanel.classList.add("ranking-hidden"); // Esconde o painel durante a partida
    
    score = 0;
    dispScore.textContent = score;
    proximaQuestao(); 
}

function proximaQuestao() {
    clearInterval(timerInterval); 
    timeLeft = gameTimeLimit;
    dispTime.textContent = timeLeft;
    
    currentValue = "0";
    shouldReplace = false;
    updateDisplay(); 

    let num1, num2, operador;

    if (selectedDifficulty === "easy") {
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
        const operadores = ["+", "-"];
        operador = operadores[Math.floor(Math.random() * operadores.length)];
    } else if (selectedDifficulty === "medium") {
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
        operador = "*";
    } else if (selectedDifficulty === "hard") {
        num2 = Math.floor(Math.random() * 10) + 1; 
        let multiplicador = Math.floor(Math.random() * 10) + 1; 
        num1 = num2 * multiplicador; 
        operador = "/";
    }

    let simboloExibicao = operador === '*' ? '×' : operador === '/' ? '÷' : operador; 
    expressionEl.textContent = `QUAL O RESULTADO: ${num1} ${simboloExibicao} ${num2}`; 

    if (operador === '+') currentAnswer = num1 + num2; 
    if (operador === '-') currentAnswer = num1 - num2; 
    if (operador === '*') currentAnswer = num1 * num2;
    if (operador === '/') currentAnswer = parseFloat((num1 / num2).toFixed(2));

    iniciarCronometro(); 
}

function iniciarCronometro() {
    timerInterval = setInterval(() => { 
        timeLeft--; 
        dispTime.textContent = timeLeft; 

        if (timeLeft <= 0) { 
            clearInterval(timerInterval); 
            perderJogo("O tempo acabou!"); 
        }
    }, 1000);
}

function appendNumber(value) {
    if (shouldReplace) {
        currentValue = value; 
        shouldReplace = false;
        return;
    }
    if (value === "." && currentValue.includes(".")) return;
    if (currentValue === "0" && value !== ".") {
        currentValue = value;
    } else {
        currentValue += value;
    }
}

document.querySelectorAll(".btn-number[data-value]").forEach(btn => { 
    btn.addEventListener("click", () => { 
        appendNumber(btn.dataset.value); 
        updateDisplay();
    });
});

document.getElementById("btnClear").addEventListener("click", () => {
    currentValue = "0"; 
    updateDisplay();
});

document.getElementById("btnCE").addEventListener("click", () => {
    currentValue = "0";
    updateDisplay();
});

document.getElementById("btnDelete").addEventListener("click", () => {
    apagarUltimoDigito();
});

function apagarUltimoDigito() {
    if (currentValue.length === 1 || (currentValue.length === 2 && currentValue.startsWith("-"))) { 
        currentValue = "0";
    } else {
        currentValue = currentValue.slice(0, -1); 
    }
    updateDisplay();
}

function toggleSign() {
    if (currentValue !== "0") {
        if (currentValue.startsWith("-")) {
            currentValue = currentValue.slice(1); 
        } else {
            currentValue = "-" + currentValue; 
        }
        updateDisplay();
    }
}

document.getElementById("btnToggle").addEventListener("click", () => {
    toggleSign();
});

function updateDisplay() {
    resultEl.textContent = currentValue;
}

document.getElementById("btnEqual").addEventListener("click", () => {
    enviarResposta();
});

function enviarResposta() {
    // Só processa se a tela de jogo estiver ativa
    if (gameScreen.classList.contains("hidden")) return;

    clearInterval(timerInterval); 
    const respostaJogador = parseFloat(currentValue); 

    if (Math.abs(respostaJogador - currentAnswer) < 0.05) {
        score += 10;
        dispScore.textContent = score;

        if (score > record) {
            record = score;
            dispRecord.textContent = record;
        }

        proximaQuestao();
    } else {
        perderJogo("Errou o cálculo!");
    }
}

//SUPORTE AO TECLADO FÍSICO
window.addEventListener("keydown", (e) => {
    // Evita conflito se o usuário estiver digitando no input de nome
    if (document.activeElement === playerNameInput) return;

    if (!gameScreen.classList.contains("hidden")) {
        if ((e.key >= "0" && e.key <= "9") || e.key === "." || e.key === ",") {
            let valorTecla = e.key === "," ? "." : e.key;
            appendNumber(valorTecla);
            updateDisplay();
        }
        //Tecla Backspace para apagar o último dígito
        else if (e.key === "Backspace") {
            apagarUltimoDigito();
        }
        //Tecla Enter ou = para enviar a resposta
        else if (e.key === "Enter" || e.key === "=") {
            enviarResposta();
        }
    } 
    // Se estiver na tela de vitória/derrota (winScreen)
    else if (!winScreen.classList.contains("hidden")) {
        if (e.key === "Enter" || e.key.toLowerCase() === "s") {
            btnYes.click(); //Sim prra continuar jogando
        } else if (e.key.toLowerCase() === "n") {
            btnNo.click(); //Não pra voltar ao menu inicial
        }
    }
});

function perderJogo(motivo) {
    clearInterval(timerInterval); 
    blizzardOverlay.classList.add("blizzard-active"); 
    calculatorBox.classList.add("screen-shake");      

    snowInterval = setInterval(() => {
        for(let i = 0; i < 8; i++) {
            criarFlocoDeNeve(true);
        }
    }, 20);

    //salva a pontuação da partida atual no ranking
    salvarPontuacaoNoRanking(playerName, score);

    setTimeout(() => {
        clearInterval(snowInterval);                      
        blizzardOverlay.classList.remove("blizzard-active"); 
        calculatorBox.classList.remove("screen-shake");   
        gameScreen.classList.add("hidden"); 
        
        let isNewRecord = false;
        if (score >= record && score > 0) {
            isNewRecord = true;
        }

        if (isNewRecord) {
            endGameTitle.textContent = `Parabéns, ${playerName}!`;
            endGameSub.textContent = `Você bateu o recorde com ${score} pontos! Incrível!`;
        } else {
            endGameTitle.textContent = `Fim de Jogo, ${playerName}!`;
            endGameSub.textContent = `O jogo acabou! Sua pontuação foi ${score} pts.`;
        }

        winScreen.classList.remove("hidden"); 
    }, 2400);
}

btnYes.addEventListener("click", () => {
    winScreen.classList.add("hidden");
    iniciarPartidaDoJogo(); 
});

btnNo.addEventListener("click", () => {
    winScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");
    rankingPanel.classList.remove("ranking-hidden"); // Restaura a exibição do ranking na tela inicial
    playerNameInput.value = ""; 
    playerNameInput.focus();    
});