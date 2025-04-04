# ExoSim - Simulador de Tránsito de Exoplanetas

[![en](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/hoiast/ExoSim/blob/main/README.md)
[![pt-br](https://img.shields.io/badge/lang-pt--br-green.svg)](https://github.com/hoiast/ExoSim/blob/main/README.pt-br.md)
[![es](https://img.shields.io/badge/lang-es-yellow.svg)](https://github.com/hoiast/ExoSim/blob/main/README.es.md)
[![fr](https://img.shields.io/badge/lang-fr-blue.svg)](https://github.com/hoiast/ExoSim/blob/main/README.fr.md)

![liveDemo](https://github.com/hoiast/ExoSim/blob/main/liveDemoREADME_1920x1006.jpeg)

## Haz clic aquí para una _[Demostración en vivo](https://hoiast.github.io/ExoSim)_

ExoSim es una aplicación web educativa para explorar una técnica de detección de exoplanetas llamada **Método del Tránsito**. En pocas palabras, este método analiza las disminuciones periódicas en el brillo de una estrella medida, causadas por planetas en órbita que bloquean la luz.

Esta aplicación está diseñada para ser fácilmente extensible e intuitiva de usar. Algunas de las características disponibles son:

- **Herramienta de diseño de sistemas estelares**. Diseña sistemas personalizados y compártelos con tus amigos a través de un código JSON;
- **Opciones de exportación para curvas de luz**. Las mediciones hermosas están hechas para compartirse. Descarga tus gráficos de curvas de luz como imágenes PNG y envíalos a todos;
- **Soporte multilingüe**. Me encantaría agregar más opciones de idioma yo mismo, pero eres libre de hacerlo siguiendo las instrucciones simples en la carpeta `i18n`.

Este proyecto está construido sobre algunas tecnologías y bibliotecas:

- [Vue.js](https://vuejs.org) framework con la biblioteca UI [Primevue](https://primevue.org) para una interfaz de usuario rápida y reactiva.
- [Three.js](https://threejs.org) biblioteca para construir escenas 3D. Sus herramientas matemáticas también se utilizaron para algunas operaciones de álgebra lineal requeridas en el motor de física simple, pero casero, utilizado en este proyecto.
- [Tailwind CSS](https://tailwindcss.com) para ajustes finos de CSS.
- [Vite](https://vite.dev) para un entorno de desarrollo rápido y compilación.

# Cómo Usar

#### 1. Configuración del Proyecto

```sh
npm install
```

#### 2. Compilar y Recargar en Caliente para Desarrollo

```sh
npm run dev
```

#### 3. Lint con [ESLint](https://eslint.org)

```sh
npm run lint
```

#### 4. Compilar y Minimizar para Producción

```sh
npm run build
```

## _Agradecimientos_

Me gustaría agradecer a [_Claudio Mendes Dias de Souza_](https://www.linkedin.com/in/claudiomendes23) por sus comentarios y sugerencias perspicaces sobre astrobiología y la detección de exoplanetas.

_La demo en vivo está impulsada por [Github Pages](https://pages.github.com) y [Github Actions](https://github.com/features/actions)_

## _Contacto_

murilohoias@gmail.com
