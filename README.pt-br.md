# ExoSim - Simulador de Trânsito de Exoplanetas

[![en](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/hoiast/ExoSim/blob/main/README.md)
[![pt-br](https://img.shields.io/badge/lang-pt--br-green.svg)](https://github.com/hoiast/ExoSim/blob/main/README.pt-br.md)

![liveDemo](https://github.com/hoiast/ExoSim/blob/main/liveDemoREADME_1920x1006.jpeg)

# [Demo Online](https://hoiast.github.io/ExoSim/)

ExoSim é uma aplicação web educacional para explorar a técnica de detecção de exoplanetas chamada **Método de Trânsito**. Simplificando, este método analisa diminuições periódicas nas medidas de brilho estrelar causadas por planetas bloqueando a luz durante os seus movimentos orbitais.

Esta aplicação é desenhada para ser facilmente extensível e intuitiva para usar. Algumas ferramentas disponíveis são:

- **Construtor de Sistemas Estelares**. Desenhe sistemas personalizados e compartilhe-os com os seus amigos através de um código JSON;
- **Opções para exportar curvas de brilho**. Lindos resultados e medidas são feitos para serem divididos. Baixe seus gráficos das curvas de brilho como imagens PNG e envie-as para quem você quiser;
- **Suporte Multilíngue**. Eu adoraria adicionar eu mesmo mais opções de línguas, mas você é livre para fazê-lo através das simples instruções no diretório `i18n`.

Este projeto é construído em cima de algumas tecnologias e bibliotecas:

- _Framework_ [Vue.js](https://vuejs.org/) com a biblioteca de elementos UI [Primevue](https://primefaces.org/primevue/) para uma interface de usuário rápida e reativa.
- Biblioteca [Three.js](https://threejs.org/) para a construção de cenas 3D. Seu conjunto de ferramentas matemáticas também foram usadas para algumas operações de algebra linear necessárias para o simples, mais caseiro, motor de física utilizado neste projeto.
- [Tailwind CSS](https://tailwindcss.com/) para ajustes CSS finos.
- [Vite](https://vitejs.dev/) para um ambiente de desenvolvimento e compilação rápidos.

#Como usar

#### 1. Instalação do Projeto

```sh
npm install
```

#### 2. Compilação e _Hot-Reload_ para Desenvolvimento

```sh
npm run dev
```

#### 3. Lint com [ESLint](https://eslint.org/)

```sh
npm run lint
```

#### 4. Compilação e Minificação para Produção

```sh
npm run build
```

## _Agradecimentos_

Eu gostaria de agradecer _Claudio Mendes Dias de Souza_ pelo seus ricos comentários e sugestões sobre astrobiologia e detecção de exoplanetas.
_O demo online é provido pelo [Github Pages](https://pages.github.com/) e [Github Actions](https://github.com/features/actions)_

## _Contato_

murilohoias@gmail.com

