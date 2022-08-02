### How to update docs

- Run `npm run build`
- Copy contents from `/dist` folder to `/docs`
- Update path assets on the following files:
  - `index.html` :
    - **/ExoSim**/favicon.ico
    - **/ExoSim**/assets/index.XXX.js
    - **/ExoSim**/assets/index.XXX.css
  - `assets/index.XXX.css`
    - **/ExoSim**/assets/color.XXX.png
    - **/ExoSim**/assets/primeicons.c9eaf535.eot
    - **/ExoSim**/assets/primeicons.c9eaf535.eot?#iefix
    - **/ExoSim**/assets/primeicons.788dba0a.ttf
    - **/ExoSim**/assets/primeicons.feb68bf6.woff
    - **/ExoSim**/assets/primeicons.2ab98f70.svg?#primeicons

Adding "/ExoSim" on such paths fixes issues on Github.io. There is probably some configuration mistake being performed by me when deploying these static files.
