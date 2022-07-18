/**
 * @file this file contains all classes related to simulation rendering, HUD and GUI.
 */

import { StarSystem } from "./starSystemHelper.js";
import RandomSeed from "random-seed";
import { AUtoTJSU, HoursToTimeUnit } from "./unitSystemAndConversion.js";

/**
 * The Configuration class contains all relevant information to setup a simulation. Objects of this class are shared ubiquitously and used as information channels between relevant structures.
 * @param {String} mode default, custom, random.
 * @param {String} starSystem Must match one key of starSystemLibrary object. This parameter is used only if mode is "default"
 * @param {Integer} randomSeed If defined, it will seed the random star system generator. It is useful for reproducibility of 'random' systems.
 * @param {String} customDetails JSON containing all necessary information to setup a star system. Scales and camera settings are derived automatically.
 * @param {Integer} starScale scale used on stars and their glows. Larger numbers increase star size.
 * @param {Integer} glowScale scale used on stars glows only. Larger numbers increase glow size. Useful for aesthetics customization.
 * @param {Integer} planetScale scale used on planets and their satellites. Larger numbers increase body size.
 * @param {Integer} planetDistanceScale scale used on planet orbits. Higher numbers put planets further away from their host star.
 * @param {Integer} satelliteDistanceScale scale used on satellite orbits. Higher numbers put satellites further away from their host planet.
 * @param {Integer} simulationSpeed Defines how many simulation cycles run in a single animation frame. May be used to pause a simulation (value = 0) instead of "running"
 * @param {Integer} simulationStep Defines how many simulation cycles run in a single animation frame.
 * @param {Boolean} rotationEnabled Enable and disable rotation of planets and satellites on their on axis. Current rotation implementation assumes obliquity = 0.
 * @param {Boolean} orbitInclination Enable and disable orbit inclination.
 * @param {Boolean} running Enable and disable physics steps. Play and pause variable.
 * @param {String} cameraMode view, measurement. On 'view', camera is free and no brightness data is acquired. On 'measurement', camera is locked and brightness data is acquired.
 * @param {Float} time How long time has passed since last simulation reset.
 */
export default class SimulationConfiguration {
  constructor({
    bgStars = 100,
    mode = "default",
    starSystem = "SolarInner",
    randomSeed = null,
    customDetails = "",
    starScale = null,
    glowScale = 1,
    planetScale = null,
    satelliteScale = null,
    planetDistanceScale = null,
    satelliteDistanceScale = null,
    measurementDetails = null,
    simulationSpeed = 5,
    simulationStep = 0.01,
    rotationEnabled = false,
    orbitInclination = true,
    running = true,
    cameraMode = "view",
    time = 0,
    collectionLimit = 500,
  } = {}) {
    this.bgStars = bgStars;
    this.mode = mode;
    this.randomSeed = randomSeed;
    this.starScale = starScale;
    this.glowScale = glowScale;
    this.planetScale = planetScale;
    this.satelliteScale = satelliteScale;
    this.planetDistanceScale = planetDistanceScale;
    this.satelliteDistanceScale = satelliteDistanceScale;
    //prettier-ignore
    if (measurementDetails === null) this.measurementDetails = { distance: null, renderer: {tag: 'main', index: null}, camera: {tag: 'main', index: null}};
    this.simulationSpeed = simulationSpeed;
    this.simulationStep = simulationStep;
    this.rotationEnabled = rotationEnabled;
    this.orbitInclination = orbitInclination;
    this.running = running;
    this.cameraMode = cameraMode;
    this.time = time;
    this.collectionLimit = collectionLimit;
    this.currentMeasurement = { x: null, y: null };
    this.starSystemLibrary = starSystemLibrary;
    switch (mode) {
      case "default":
        this.starSystem = this.starSystemLibrary[starSystem];
        break;
      case "custom":
        customDetails = JSON.parse(customDetails);
        this.starSystem = new StarSystem();
        this.starSystem = new StarSystem(customDetails.name);
        //prettier-ignore
        this.starSystem.setStar(customDetails.star.name, customDetails.star.mass, customDetails.star.radius, customDetails.star.color);
        for (var planet of customDetails.planets) {
          //prettier-ignore
          this.starSystem.addPlanet( planet.name, planet.radius, planet.semiMajor, planet.eccentricity, planet.longitudePerihelion, planet.orbitInclination, planet.color, planet.texture, planet.rotationSpeed, planet.obliquity, planet.mass, planet.visible, planet.tilted);
        }
        for (var satellite of customDetails.satellites) {
          //prettier-ignore
          this.starSystem.addSatellite( satellite.name, satellite.hostPlanet, satellite.radius, satellite.semiMajor, satellite.eccentricity, satellite.longitudePerihelion, satellite.orbitInclination, satellite.color, satellite.texture, satellite.rotationSpeed, satellite.obliquity, satellite.visible, satellite.tilted);
        }

        this.starSystem.cameraSettings = customDetails.cameraSettings;
        this.starSystem.scales = customDetails.scales;
        break;
      case "random":
        //prettier-ignore
        if (!this.randomSeed) { this.randomSeed = Math.floor(Math.random() * 100000000); }
        this.starSystem = this.randomStarSystem();
        break;
    }
    //prettier-ignore
    if(starScale === null) this.starScale = this.starSystem.scales.starScale;
    //prettier-ignore
    if(planetScale === null) this.planetScale = this.starSystem.scales.planetScale;
    //prettier-ignore
    if(satelliteScale === null) this.satelliteScale = this.starSystem.scales.satelliteScale;
    //prettier-ignore
    if(planetDistanceScale === null) this.planetDistanceScale = this.starSystem.scales.planetDistanceScale;
    //prettier-ignore
    if(satelliteDistanceScale === null) this.satelliteDistanceScale = this.starSystem.scales.satelliteDistanceScale;
    //prettier-ignore
    if(this.measurementDetails.distance === null) this.measurementDetails.distance = this.starSystem.scales.measurementDistance;
    this.cameraSettings = this.starSystem.cameraSettings;
  }

  randomStarSystem() {
    // . Seed RNG for consistence
    const rand = RandomSeed.create(this.randomSeed);

    let starSystem = new StarSystem("Aleatório - " + this.randomSeed);
    //prettier-ignore
    let starMass = rand.floatBetween(randomSystemsRange.starMass.min,randomSystemsRange.starMass.max) * Math.pow(10, 30);
    //prettier-ignore
    let starRadius = randomSystemsRange.starRadius.min + rand(randomSystemsRange.starRadius.range);
    //prettier-ignore
    let starColor = randomSystemsRange.starColors[rand(randomSystemsRange.starColors.length)];
    //prettier-ignore
    starSystem.setStar('Rand-'+this.randomSeed, starMass, starRadius, starColor);

    //prettier-ignore
    let planetNumber = randomSystemsRange.planetNumber.min + rand(randomSystemsRange.planetNumber.range);
    let planetRadius,
      planetSemiMajor = 0,
      planetEccentricity,
      planetLongitudePerihelion,
      planetOrbitInclination,
      planetColor,
      planetName = "a";
    for (var j = 0; j < planetNumber; j++) {
      //prettier-ignore
      planetRadius = rand.floatBetween(randomSystemsRange.planetRadius.min, randomSystemsRange.planetRadius.max); //Add previous semiMajor
      //prettier-ignore
      planetSemiMajor = planetSemiMajor + randomSystemsRange.planetSemiMajor.spacer + rand(randomSystemsRange.planetSemiMajor.range);
      //prettier-ignore
      planetEccentricity = randomSystemsRange.planetEccentricity.min + rand(randomSystemsRange.planetEccentricity.range);
      //prettier-ignore
      planetLongitudePerihelion = randomSystemsRange.planetLongitudePerihelion.min + rand(randomSystemsRange.planetLongitudePerihelion.range);
      //prettier-ignore
      planetOrbitInclination = randomSystemsRange.planetOrbitInclination.min + rand(randomSystemsRange.planetOrbitInclination.range);
      //prettier-ignore
      planetColor = randomSystemsRange.planetColors[rand(randomSystemsRange.planetColors.length)];
      //prettier-ignore
      planetName = String.fromCharCode(planetName.charCodeAt(planetName.length - 1) + 1);

      //prettier-ignore
      starSystem.addPlanet(planetName, planetRadius, planetSemiMajor, planetEccentricity, planetLongitudePerihelion, planetOrbitInclination, planetColor);
    }
    starSystem.calculateCameraSettings();
    starSystem.calculateScales();
    return starSystem;
  }
}

//////////////////////////////////
// Range fo random star systems //
//////////////////////////////////

let randomSystemsRange = {
  starMass: {
    min: 1,
    max: 2,
  },
  starRadius: {
    min: 2,
    range: 5,
  },
  starColors: [
    0xffffff, //White
    0xffff00, //Yellow
    0x559999, //Half Baked (blue pastel)
    0xff6339, //Outrageous Orange
    0xff0000, //Red
  ],
  planetNumber: {
    min: 1,
    range: 4,
  },
  planetRadius: {
    min: 0.02, //not scaled
    max: 0.04, //not scaled
  },
  planetSemiMajor: {
    range: 200, //TJSU
    spacer: 500, //TJSU
  },
  planetEccentricity: {
    min: 0.4,
    range: 0.1,
  },
  planetLongitudePerihelion: {
    min: 0, //deg
    range: 22.5, //deg
  },
  planetOrbitInclination: {
    min: 0, //deg
    range: 1, //deg
  },
  planetColors: [
    0x333333, //grey
    0x993333, //ruddy
    0xaa8239, //tan
    0x2d4671, //blue
    0x599532, //green
    0x267257, //blue green
  ],
};

/////////////////////////////////
// DEFAULT star system library //
/////////////////////////////////

// . Planets and satellites in a same star system must have unique names. They are used as primary keys.
let starSystemLibrary = {};
// . Period (full cycle) in hours to angular speed in Rad/TimeUnit. 1cycle/h = 24 cycles(= 2*PI * 24) / timeUnit.
// . AngularSpeed = 2*PI / Period
let periodToAngularSpeedConverted = (Math.PI * 2) / HoursToTimeUnit;

////////////////////////
// Inner Solar System //
////////////////////////
starSystemLibrary.SolarInner = new StarSystem("Inner Solar");
//prettier-ignore
starSystemLibrary.SolarInner.setStar('Sol', 1.989 * Math.pow(10, 30), 6.957, 'yellow')
//prettier-ignore
starSystemLibrary.SolarInner.addPlanet('Mercury',          0.02439,  579.1,  0.205,  77.45, 7.00487, 0xbbb7ab, 'imgs/planet-textures/solar/mercury.jpg', periodToAngularSpeedConverted/( 1407.6), 0.034);
//prettier-ignore
starSystemLibrary.SolarInner.addPlanet(   'Venus',          0.06051, 1082.1,  0.007, 131.53, 3.39471, 0xddd8d4, 'imgs/planet-textures/solar/venus.jpg',   periodToAngularSpeedConverted/(-5832.5), 177.4);
//prettier-ignore
starSystemLibrary.SolarInner.addPlanet(   'Earth',          0.06378, 1496.0,  0.017, 102.95, 0.00005, 0x6b93d6, 'imgs/planet-textures/solar/earth.jpg',  periodToAngularSpeedConverted/(   23.9),   23.4, 5.9724 * Math.pow(10,24)); //Mass parameter is required for planets if there is a satellite associated.
//prettier-ignore
starSystemLibrary.SolarInner.addPlanet(   'Mars',          0.03396, 2279.2,  0.094, 336.04, 1.85061, 0xc1440e, 'imgs/planet-textures/solar/mars.jpg',    periodToAngularSpeedConverted/(   24.6),  25.2);
//prettier-ignore
starSystemLibrary.SolarInner.addSatellite(   'Moon', 'Earth', 0.01738,  3.844, 0.0549,   180.0,   5.145, 0xbbb7ab, 'imgs/planet-textures/solar/moon.jpg',    periodToAngularSpeedConverted/(  655.7),   6.7);
starSystemLibrary.SolarInner.calculateCameraSettings();
// starSystemLibrary.SolarInner.calculateScales();
starSystemLibrary.SolarInner.setScales(40, 1000, 1000, 1, 50, 12000);

// Our solar system is used as a standard.
let sunMass = starSystemLibrary.SolarInner.star.mass;
let sunRadius = starSystemLibrary.SolarInner.star.radius;
let earthRadius = starSystemLibrary.SolarInner.planets[2].radius;
let jupiterRadius = 11.2 * earthRadius;

///////////////////////
// Trappist-1 System //
///////////////////////
starSystemLibrary.Trappist1 = new StarSystem("Trappist-1");
//prettier-ignore
starSystemLibrary.Trappist1.setStar('Trappist-1', 0.0898 * sunMass, 0.1192 * sunRadius, 'red')
//prettier-ignore
starSystemLibrary.Trappist1.addPlanet('b', 1.116 * earthRadius, 0.01154 * AUtoTJSU, 0.006, 0, 0.00, 0xBBB7AB, 'imgs/planet-textures/trappist-1/1b.jpg' )
//prettier-ignore
starSystemLibrary.Trappist1.addPlanet('c', 1.097 * earthRadius, 0.01580 * AUtoTJSU, 0.007, 0, 0.14, 0xBBB7AB, 'imgs/planet-textures/trappist-1/1c.jpg' )
//prettier-ignore
starSystemLibrary.Trappist1.addPlanet('d', 0.778 * earthRadius, 0.02227 * AUtoTJSU, 0.008, 0, 0.33, 0xBBB7AB, 'imgs/planet-textures/trappist-1/1d.jpg')
//prettier-ignore
starSystemLibrary.Trappist1.addPlanet('e', 0.920 * earthRadius, 0.02925 * AUtoTJSU, 0.005, 0, 0.18, 0xBBB7AB, 'imgs/planet-textures/trappist-1/1e.jpg')
//prettier-ignore
starSystemLibrary.Trappist1.addPlanet('f', 1.045 * earthRadius, 0.03849 * AUtoTJSU, 0.010, 0, 0.12, 0xBBB7AB, 'imgs/planet-textures/trappist-1/1f.jpg')
//prettier-ignore
starSystemLibrary.Trappist1.addPlanet('g', 1.129 * earthRadius, 0.04683 * AUtoTJSU, 0.002, 0, 0.12, 0xBBB7AB, 'imgs/planet-textures/trappist-1/1g.jpg')
//prettier-ignore
starSystemLibrary.Trappist1.addPlanet('h', 0.775 * earthRadius, 0.06189 * AUtoTJSU, 0.006, 0, 0.24, 0xBBB7AB, 'imgs/planet-textures/trappist-1/1h.jpg')
starSystemLibrary.Trappist1.calculateCameraSettings();
starSystemLibrary.Trappist1.setScales(10, 20, 20, 1, 50, 400);
// starSystemLibrary.Trappist1.calculateScales();

///////////////////////
// Kepler-442 System //
///////////////////////
starSystemLibrary.Kepler442 = new StarSystem("Kepler-442");
//prettier-ignore
starSystemLibrary.Kepler442.setStar('Kepler-442', 0.609 * sunMass, 0.598 * sunRadius, 0xFF6339)
//prettier-ignore
starSystemLibrary.Kepler442.addPlanet('b', 1.34 * earthRadius, 0.409 * AUtoTJSU, 0.04, 0 , 0, 0xA0522D ) //Missing texture
starSystemLibrary.Kepler442.calculateCameraSettings();
starSystemLibrary.Kepler442.setScales(30, 300, 300, 1, 50, 3500);
// starSystemLibrary.Kepler442.calculateScales();

/////////////////////////////
// Proxima Centauri System //
/////////////////////////////
starSystemLibrary.ProximaCentauri = new StarSystem("Proxima Centauri");
//prettier-ignore
starSystemLibrary.ProximaCentauri.setStar('Proxima Centauri', 0.12 * sunMass, 0.154 * sunRadius, 0xF26524)
//prettier-ignore
starSystemLibrary.ProximaCentauri.addPlanet('Proxima Centauri b', 1.1 * earthRadius, 0.048 * AUtoTJSU, 0.124, 0, 0, 0xB9875B) //Missing texture
starSystemLibrary.ProximaCentauri.calculateCameraSettings();
starSystemLibrary.ProximaCentauri.setScales(15, 60, 60, 1, 50, 1000);
// starSystemLibrary.ProximaCentauri.calculateScales();

//////////////////////
// Kepler-11 System //
//////////////////////
starSystemLibrary.Kepler11 = new StarSystem("Kepler-11");
//prettier-ignore
starSystemLibrary.Kepler11.setStar('Kepler-11', 0.961 * sunMass, 1.020 * sunRadius, 0xF4F74C)
//prettier-ignore
starSystemLibrary.Kepler11.addPlanet('b', 1.83 * earthRadius, 0.091 * AUtoTJSU, 0.05, 0, 0, 0xDA0356) //Missing texture
//prettier-ignore
starSystemLibrary.Kepler11.addPlanet('c', 3.15 * earthRadius, 0.107 * AUtoTJSU, 0.03, 0, 0, 0x059BD9) //Missing texture
//prettier-ignore
starSystemLibrary.Kepler11.addPlanet('d', 3.43 * earthRadius, 0.155 * AUtoTJSU,  0.0, 0, 0, 0xAA8135) //Missing texture
//prettier-ignore
starSystemLibrary.Kepler11.addPlanet('e', 4.52 * earthRadius, 0.195 * AUtoTJSU, 0.01, 0, 0, 0x825094) //Missing texture
//prettier-ignore
starSystemLibrary.Kepler11.addPlanet('f', 2.61 * earthRadius,  0.24 * AUtoTJSU, 0.01, 0, 0, 0x591B70) //Missing texture
//prettier-ignore
starSystemLibrary.Kepler11.addPlanet('g', 3.66 * earthRadius, 0.466 * AUtoTJSU, 0.15, 0, 0, 0x24701B) //Missing texture. Eccentricity poor defined <0.15.
starSystemLibrary.Kepler11.calculateCameraSettings();
starSystemLibrary.Kepler11.setScales(10, 45, 45, 1, 50, 1000);
// starSystemLibrary.Kepler11.calculateScales();

//////////////////////
// HD 189733 System //
//////////////////////
starSystemLibrary.HD189733 = new StarSystem("HD 189733");
//prettier-ignore
starSystemLibrary.HD189733.setStar('HD 189733', 0.9 * sunMass, 0.781 * sunRadius, 0xF97B07)
//prettier-ignore
starSystemLibrary.HD189733.addPlanet('b', 1.138 * jupiterRadius, 0.03126 * AUtoTJSU, 0.0, 0, 0, 0x07A3F9)
starSystemLibrary.HD189733.calculateCameraSettings();
starSystemLibrary.HD189733.setScales(5, 10, 10, 1, 50, 1000);
// starSystemLibrary.HD189733.calculateScales();

//////////////////////
// TrEs-2 System //
//////////////////////
starSystemLibrary.TrEs2 = new StarSystem("TrEs-2");
//prettier-ignore
starSystemLibrary.TrEs2.setStar('TrEs-2', 0.98 * sunMass, 0.131 * sunRadius, 0xEFC403);
//prettier-ignore
starSystemLibrary.TrEs2.addPlanet('b', 1.272 * jupiterRadius, 0.03563 * AUtoTJSU, 0.0, 0, 0, 0x900C3F);
starSystemLibrary.TrEs2.calculateCameraSettings();
starSystemLibrary.TrEs2.setScales(20, 10, 10, 1, 50, 1500);
// starSystemLibrary.TrEs2.calculateScales();

//////////////////////
// Kepler-90 System //
//////////////////////
starSystemLibrary.Kepler90 = new StarSystem("Kepler-90");
//prettier-ignore
starSystemLibrary.Kepler90.setStar('Kepler-90', 1.2 * sunMass, 1.2 * sunRadius,'yellow')
//prettier-ignore
starSystemLibrary.Kepler90.addPlanet('b', 1.31 * earthRadius, 0.074 * AUtoTJSU,  0.00, 0, 0, 0x9E6645) //Missing texture
//prettier-ignore
starSystemLibrary.Kepler90.addPlanet('c', 1.18 * earthRadius, 0.089 * AUtoTJSU,  0.00, 0, 0, 0x904D2A) //Missing texture
//prettier-ignore
starSystemLibrary.Kepler90.addPlanet('i', 1.32 * earthRadius, 0.107 * AUtoTJSU,  0.00, 0, 0, 0xAC986E) //Unusual order. Discovered later by revisiting transit data.
//prettier-ignore
starSystemLibrary.Kepler90.addPlanet('d', 2.88 * earthRadius, 0.32 * AUtoTJSU,   0.00, 0, 0, 0x959293) //Missing texture
//prettier-ignore
starSystemLibrary.Kepler90.addPlanet('e', 2.67 * earthRadius, 0.42 * AUtoTJSU,   0.00, 0, 0, 0x9EB3B8) //Missing texture
//prettier-ignore
starSystemLibrary.Kepler90.addPlanet('f', 2.89 * earthRadius,  0.48 * AUtoTJSU,  0.01, 0, 0, 0xC4A86A) //Missing texture
//prettier-ignore
starSystemLibrary.Kepler90.addPlanet('g', 8.13 * earthRadius, 0.71 * AUtoTJSU,  0.049, 0, 0, 0xB99068) //Missing texture.
//prettier-ignore
starSystemLibrary.Kepler90.addPlanet('h', 11.32 * earthRadius, 1.01 * AUtoTJSU, 0.011, 0, 0, 0xA6A031) //Missing texture.

starSystemLibrary.Kepler90.calculateCameraSettings();
starSystemLibrary.Kepler90.setScales(10, 45, 45, 1, 50, 1000);
// starSystemLibrary.Kepler90.calculateScales();

//////////////////////
// HD 76920 System //
//////////////////////
starSystemLibrary.HD76920 = new StarSystem("HD 76920");
//prettier-ignore
starSystemLibrary.HD76920.setStar('HD 76920', 1.17 * sunMass, 7.47 * sunRadius, 0xF26524);
//prettier-ignore
starSystemLibrary.HD76920.addPlanet('b', 1.16 * jupiterRadius, 1.149 * AUtoTJSU, 0.856, 0, 0, 0xffffff);
starSystemLibrary.HD76920.calculateCameraSettings();
starSystemLibrary.HD76920.setScales(1, 10, 10, 1, 50, 1500);
// starSystemLibrary.HD76920.calculateScales();
