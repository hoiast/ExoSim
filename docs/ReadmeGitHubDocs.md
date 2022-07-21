### How to update docs

- Run `npm run build`
- Copy contents from `/dist` folder to `/docs`
- Update path assets on the following files:
  - `index.html` :
    - **/ExoplanetTransitSimulator**/favicon.ico
    - **/ExoplanetTransitSimulator**/assets/index.XXX.js
    - **/ExoplanetTransitSimulator**/assets/index.XXX.css
  - `assets/index.XXX.css`
    - **/ExoplanetTransitSimulator**/assets/color.XXX.png
    - **/ExoplanetTransitSimulator**/assets/primeicons.c9eaf535.eot
    - **/ExoplanetTransitSimulator**/assets/primeicons.c9eaf535.eot?#iefix
    - **/ExoplanetTransitSimulator**/assets/primeicons.788dba0a.ttf
    - **/ExoplanetTransitSimulator**/assets/primeicons.feb68bf6.woff
    - **/ExoplanetTransitSimulator**/assets/primeicons.2ab98f70.svg?#primeicons

Adding "/ExoplanetTransitSimulator" on such paths fixes issues on Github.io. There is probably some configuration mistake being performed by me when deploying these static files.
