# ExoSim - Exoplanet Transit Simulator

[![en](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/hoiast/ExoSim/blob/main/README.md)
[![pt-br](https://img.shields.io/badge/lang-pt--br-green.svg)](https://github.com/hoiast/ExoSim/blob/main/README.pt-br.md)
[![es](https://img.shields.io/badge/lang-es-yellow.svg)](https://github.com/hoiast/ExoSim/blob/main/README.es.md)
[![fr](https://img.shields.io/badge/lang-fr-blue.svg)](https://github.com/hoiast/ExoSim/blob/main/README.fr.md)

![liveDemo](https://github.com/hoiast/ExoSim/blob/main/liveDemoREADME_1920x1006.jpeg)

## Click here for a _[Live demo](https://hoiast.github.io/ExoSim/)_

ExoSim is an educational web application for exploring an exoplanet detection technique called **Transit Method**. Simply put, this method analyzes periodic decreases on measured star brightness caused by orbiting planets blocking the light.

This app is designed to be easily extensible and intuitive to use. Some available features are:

- **Star system designer tool**. Design custom systems and share them with your friends through a JSON code;
- **Export options for light curves**. Beautiful measurements are meant to be shared. Download your light curve plots as PNG images and send them to everyone;
- **Multi-language support**. I would love to add more language options myself, but you are free to do it by following the simple instructions under the `i18n` folder.

This project is built upon some technologies and libraries:

- [Vue.js](https://vuejs.org/) framework with the [Primevue](https://primefaces.org/primevue/) UI library for a fast and reactive user interface.
- [Three.js](https://threejs.org/) library for building 3D scenes. Its math utility tools were also used for some linear algebra operations required in the simple, but home brewed, physics engine used in this project.
- [Tailwind CSS](https://tailwindcss.com/) for fine CSS adjustments.
- [Vite](https://vitejs.dev/) for fast development environment and building.

# How to Use

#### 1. Project Setup

```sh
npm install
```

#### 2. Compile and Hot-Reload for Development

```sh
npm run dev
```

#### 3. Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

#### 4. Compile and Minify for Production

```sh
npm run build
```

## _Acknowledgements_

I would like to thanks _Claudio Mendes Dias de Souza_ for his insightful comments and suggestions about astrobiology and exoplanets detection.

_Live demo is powered by [Github Pages](https://pages.github.com/) and [Github Actions](https://github.com/features/actions)_

## _Contact_

murilohoias@gmail.com
