# ExoSim - Simulateur de Transit d'Exoplanètes

[![en](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/hoiast/ExoSim/blob/main/README.md)
[![pt-br](https://img.shields.io/badge/lang-pt--br-green.svg)](https://github.com/hoiast/ExoSim/blob/main/README.pt-br.md)
[![es](https://img.shields.io/badge/lang-es-yellow.svg)](https://github.com/hoiast/ExoSim/blob/main/README.es.md)
[![fr](https://img.shields.io/badge/lang-fr-blue.svg)](https://github.com/hoiast/ExoSim/blob/main/README.fr.md)

![liveDemo](https://github.com/hoiast/ExoSim/blob/main/liveDemoREADME_1920x1006.jpeg)

## Cliquez ici pour une _[Démo en direct](https://hoiast.github.io/ExoSim/)_

ExoSim est une application web éducative pour explorer une technique de détection d'exoplanètes appelée **Méthode du Transit**. En résumé, cette méthode analyse les baisses périodiques de la luminosité mesurée d'une étoile causées par des planètes en orbite bloquant la lumière.

Cette application est conçue pour être facilement extensible et intuitive à utiliser. Parmi les fonctionnalités disponibles :

- **Outil de conception de systèmes stellaires**. Concevez des systèmes personnalisés et partagez-les avec vos amis via un code JSON ;
- **Options d'exportation pour les courbes de lumière**. Les belles mesures sont faites pour être partagées. Téléchargez vos graphiques de courbes de lumière sous forme d'images PNG et envoyez-les à tout le monde ;
- **Support multilingue**. J'aimerais ajouter moi-même plus d'options de langue, mais vous êtes libre de le faire en suivant les instructions simples dans le dossier `i18n`.

Ce projet est construit sur plusieurs technologies et bibliothèques :

- [Vue.js](https://vuejs.org/) framework avec la bibliothèque UI [Primevue](https://primefaces.org/primevue/) pour une interface utilisateur rapide et réactive.
- [Three.js](https://threejs.org/) bibliothèque pour construire des scènes 3D. Ses outils mathématiques ont également été utilisés pour certaines opérations d'algèbre linéaire nécessaires dans le moteur physique simple, mais maison, utilisé dans ce projet.
- [Tailwind CSS](https://tailwindcss.com/) pour des ajustements CSS fins.
- [Vite](https://vitejs.dev/) pour un environnement de développement rapide et des compilations.

# Comment Utiliser

#### 1. Installation du Projet

```sh
npm install
```

#### 2. Compiler et Recharger à Chaud pour le Développement

```sh
npm run dev
```

#### 3. Linter avec [ESLint](https://eslint.org/)

```sh
npm run lint
```

#### 4. Compiler et Minimiser pour la Production

```sh
npm run build
```

## _Remerciements_

Je tiens à remercier _Claudio Mendes Dias de Souza_ pour ses commentaires et suggestions perspicaces sur l'astrobiologie et la détection des exoplanètes.

_La démo en direct est alimentée par [Github Pages](https://pages.github.com/) et [Github Actions](https://github.com/features/actions)_

## _Contact_

murilohoias@gmail.com
