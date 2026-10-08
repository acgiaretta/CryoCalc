# Calculadora das Neves ⛄❄️

Projeto prático desenvolvido com uma temática de inverno, integrando lógica de programação, manipulação avançada do DOM, persistência local e elementos gamificados.

## 📋 Sobre o Projeto
O usuário entra com o seu nome para iniciar o desafio no **CryoCalc**. O jogo conta com diferentes níveis de dificuldade (**Fácil**, **Médio** e **Difícil**) que ajustam o tipo de operação matemática e o tempo limite de resposta.

A cada rodada, a calculadora gera dinamicamente uma expressão de acordo com a dificuldade escolhida. O jogador dispõe de um cronômetro regressivo para inserir a resposta correta (utilizando a interface de botões ou o teclado físico) e somar 10 pontos por acerto. 

Se o tempo acabar ou houver um erro, uma nevasca destrói a calculadora e o jogo é encerrado com efeitos visuais de tremor na tela. O projeto conta com um **Sistema de Ranking Top 5** persistido via `localStorage` e salvamento de recordes.

## 🚀 Funcionalidades Atuais
* **Níveis de Dificuldade**: Seleção entre Fácil (+ e - com temporizador maior), Médio (multiplicações) e Difícil (divisões exatas com tempo reduzido de 10 segundos).
* **Painel de Ranking Top 5**: Exibição em tempo real dos melhores pontuadores salvos localmente (`localStorage`) com destaques para o pódio (🥇, 🥈, 🥉).
* **Suporte a Teclado Físico**: Capacidade de digitar números, apagar (`Backspace`), enviar respostas (`Enter` ou `=`) e navegar pelas telas de fim de jogo.
* **Efeitos Visuais Temáticos**: Animações contínuas de flocos de neve, avalanches em caso de derrota, efeitos de tremor de tela (*screen shake*) e redimensionamento responsivo.

## 📚 Referências e Material de Apoio
* Baseado no tutorial prático de calculadora com HTML, CSS e JavaScript.
* Desenvolvido para a disciplina **ISW-008 - Programação de Sítios Internet**.
* Ministrado pelo **Prof. Dr. Adriano Bezerra**.
* [Repositório / Perfil do Professor no GitHub](https://github.com/adrianobezerra1)

## 🛠️ Tecnologias Utilizadas
* **HTML5**: Estrutura das telas, painel de ranking, inputs e botões interativos.
* **CSS3**: Estilização temática em gradiente, layouts em grid, animações complexas de nevasca/avalanche e efeitos visuais responsivos.
* **JavaScript (ES6+)**: Lógica completa do jogo, gerenciamento de temporizadores (`setInterval`), manipulação de eventos de teclado e mouse, geração algorítmica de expressões matemáticas e persistência local (`localStorage`).
