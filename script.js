//const - busca os elementos no HTML pelo ID
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const winScreen = document.getElementById("winScreen");

const playerNameInput = document.getElementById("playerNameInput");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

const dispName = document.getElementById("dispName");
const dispRecord = document.getElementById("dispRecord");
const dispScore = document.getElementById("dispScore");
const dispTime = document.getElementById("dispTime");

const expressionEl = document.getElementById("expression");
const resultEl = document.getElementById("result");
const blizzardOverlay = document.getElementById("blizzardOverlay");
const winnerName = document.getElementById("winnerName");

//variáveis de estado do jogo
let playerName = ""; //guarda o nome do jogador;
let score = 0; //guarda os pontos 
let record = localStorage.getItem("neveRecord") || 0; //procura na memória do nav se tem um recorde salvo
let timeLeft = 10;
let timerInterval = null; // relógio do tempo q liga e desliga

let currentAnswer = 0; //guarda o resultado da última operação
let currentValue = "0"; //guarda o que tá escrito no display (começa com "0")
let shouldReplace = false;

dispRecord.textContent = record; //mostra o recorde salvo na tela

//1. início do jogo
startBtn.addEventListener("click", () => { //vai esperar o clique pra começar o jogo
    playerName = playerNameInput.value.trim(); //pega o texto do .value e limpa os campos vazios (.trim())
    if (!playerName) { //vê se o nome tá vazio
        alert("Por favor, escreva o seu nome para enfrentar a nevasca!");
        return;
    }
    dispName.textContent = playerName; //se estiver certo, joga o nome no placar
    startScreen.classList.add("hidden"); //esconde a tela de início
    gameScreen.classList.remove("hidden"); // e revela a tela do jogo
    
    score = 0;
    dispScore.textContent = score;
    proximaQuestao(); //começa as perguntas
});

// 2. cria as questões
function proximaQuestao() {
    clearInterval(timerInterval); //limpar cronômetro antigo
    timeLeft = 10;
    dispTime.textContent = timeLeft;
    
    currentValue = "0";
    shouldReplace = false;
    updateDisplay(); //zera o visor de digitar e atualiza a tela

    const num1 = Math.floor(Math.random() * 20) + 1;    //math.random()*20 - escolhe um núm de 0 a 20
    const num2 = Math.floor(Math.random() * 20) + 1;    // math.floor - arredonda p/ baixo      +1 - vai de 1 a 20. 
    const operadores = ["+", "-", "*", "/"];
    const operador = operadores[Math.floor(Math.random() * operadores.length)]; //escolhe algum operador aleatoriamente

    let simboloExibicao = operador === '*' ? '×' : operador === '/' ? '÷' : operador; //transforma o * em "x" e o / em "÷"
    expressionEl.textContent = `QUAL O RESULTADO: ${num1} ${simboloExibicao} ${num2}`; //mostra a pergunta completa

    //cálculo da resposta correta
    if (operador === '+') currentAnswer = num1 + num2; //guarda o resultado nessa currentAnswer
    if (operador === '-') currentAnswer = num1 - num2; 
    if (operador === '*') currentAnswer = num1 * num2;
    if (operador === '/') currentAnswer = parseFloat((num1 / num2).toFixed(2)); //toFixed - arredonda p/ 2 casas e retorna em string "3.33"; parseFloat - converte a string de volta para número 3.33

    iniciarCronometro(); //começa a contagem do tempo
}

// 3. cronômetro
function iniciarCronometro() {
    timerInterval = setInterval(() => { //setInterval - executa a função a cada 1000ms (1seg); timerInterval - guarda o id do intervalo p/ poder cancelar dps
        timeLeft--; //tira o tempo restante em 1
        dispTime.textContent = timeLeft; //atualiza a tela com o novo valor

        if (timeLeft <= 0) { //verifica se o tempo acabou
            clearInterval(timerInterval); //para o intervalo
            perderJogo("O tempo acabou!"); //encerra o jogo
        }
    }, 1000);
}

// adiciona um núm no display
function appendNumber(value) {
    //se o usuário aperta um operador, substitui o display
    if (shouldReplace) {
        currentValue = value; //troca o display
        shouldReplace = false;
        return;
    }
    //impede dois pontos decimais (3.14.5)
    if (value === "." && currentValue.includes(".")) return;
    //se o display está 0, substitui em vez de contatenar (evita 07)
    if (currentValue === "0" && value !== ".") {
        currentValue = value;
    } else {
        currentValue += value;
    }
}

document.querySelectorAll(".btn-number[data-value]").forEach(btn => { //busca todos os botões com a classe btn-number e data-value
    btn.addEventListener("click", () => { //evento de clique - qnd clicar vai executar
        appendNumber(btn.dataset.value); //passa o valor do data-value p/ função appendNumber;  ex: data-value="5", btn.dataset.value é "5"
        updateDisplay();
    });
});

//Botão C
document.getElementById("btnClear").addEventListener("click", () => {
    currentValue = "0"; //volta o valor pra 0
    updateDisplay();
});

//Botão CE
document.getElementById("btnCE").addEventListener("click", () => {
    currentValue = "0";
    updateDisplay();
});

//Botão ⌫ (Apagar último dígito)
document.getElementById("btnDelete").addEventListener("click", () => {
    if (currentValue.length === 1 || (currentValue.length === 2 && currentValue.startsWith("-"))) { //verifica se tem 1 caractere ou 2 caracteres começando com -   ex: 7 --> 0 e -5 --> 0
        currentValue = "0";
    } else {
        currentValue = currentValue.slice(0, -1); //pega do início até o penúltimo caractere: apaga o último;     ex: 345 --> 34
    }
    updateDisplay();
});

//Botão +/- (deixa ter respostas negativas)
function toggleSign() {
    if (currentValue !== "0") {
        if (currentValue.startsWith("-")) {
            currentValue = currentValue.slice(1); //remove o sinal de menos
        } else {
            currentValue = "-" + currentValue; //adiciona o sinal de menos
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

// 5. verifica a resposta
document.getElementById("btnEqual").addEventListener("click", () => {
    clearInterval(timerInterval); //cronômetro para
    const respostaJogador = parseFloat(currentValue); //parseFloat - transforma o texto em núm de verdade

    //confere se a resp. é igual ao do computador(e tem margem pra aceitar arredondamento)
    if (Math.abs(respostaJogador - currentAnswer) < 0.05) {
        //SE ACERTOU
        score += 10;
        dispScore.textContent = score;

        if (score > record) {
            record = score;
            localStorage.setItem("neveRecord", record); //se passou o recorde, pega o valor e guarda na memória
            dispRecord.textContent = record;
        }

        proximaQuestao();
    } else {
        //SE ERROU
        perderJogo("Errou o cálculo!");
    }
});

// 6. NEVASCA DESTRUIDORA!!!
function perderJogo(motivo) {
    clearInterval(timerInterval); //para o cronômetro
    blizzardOverlay.classList.add("blizzard-active"); //ativa a animação da nevasca

    //dps de 2 segundos (2000ms)
    setTimeout(() => {
        blizzardOverlay.classList.remove("blizzard-active"); //esconde a animação
        gameScreen.classList.add("hidden"); //esconde a tela do jogo
        
        winnerName.textContent = playerName; //mostra o nome do jogador
        //se bater o recorde E a pontuação for maior que 0
        if (score >= record && score > 0) {
            winScreen.querySelector("h2").textContent = `PARABÉNS, NOVO RECORDE: ${score} PTS! ⛄`;
        //senão, fim de jogo
        } else {
            winScreen.querySelector("h2").textContent = `Fim de Jogo, ${playerName}!`;
        }
        winScreen.classList.remove("hidden"); //mostra a tela de fim de jogo
    }, 2000);
}

//Reiniciar o jogo
restartBtn.addEventListener("click", () => { //liga o botão de reiniciar
    winScreen.classList.add("hidden"); //esconde tela de fim de jogo
    startScreen.classList.remove("hidden"); //mostra tela inicial
    playerNameInput.value = ""; //limpa o campo de texto
});