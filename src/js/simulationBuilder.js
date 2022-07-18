("strict mode");

import SimulationConfigHelper from "./simulationConfigHelper.js";
import SimulationGraphEngine from "./simulationGraphEngine.js";
import SimulationPhysicsEngine from "./simulationPhysicsEngine.js";
import SimulationBody from "./simulationBody.js";
import * as THREE from "three";
import { GravitationalConstant } from "./unitSystemAndConversion.js";

/**
 * Main simulation class.
 */
export default class Simulation {
  constructor(stats) {
    this.mounted = true;
    // . Backup configuration
    this.initConfiguration = new SimulationConfigHelper({ bgStars: 200 });
    // . Current configuration
    this.configuration = Object.assign({}, this.initConfiguration);
    window.simConfiguration = this.configuration;

    // . Worlds and list of bodies which will contains a reference in both words.
    this.graphEngine = new SimulationGraphEngine(this.configuration);
    this.physicsEngine = new SimulationPhysicsEngine(this.configuration);
    this.stats = stats;
    this.stepCallback = function () {};

    //Preserve context
    this.simulationStep = this.simulationStep.bind(this);
    this.setOrbitInclination = this.setOrbitInclination.bind(this);
    this.setStarScale = this.setStarScale.bind(this);
  }

  start() {
    //Setup simulation
    this.setupWorld(this.configuration);

    //Init simulation process
    this.simulationStep();
  }

  // . Using current configuration
  resetSimulation() {
    // delete this.configuration;
    Object.assign(this.configuration, this.initConfiguration);

    // . Re-update physical objects and graphical orbits
    this.setPlanetDistanceScale(this.configuration.planetDistanceScale);
    this.setSatelliteDistanceScale(this.configuration.satelliteDistanceScale);
  }

  newConfig(config) {
    this.initConfiguration = new SimulationConfigHelper(config);
    this.configuration = Object.assign({}, this.initConfiguration);

    this.graphEngine = new SimulationGraphEngine(this.configuration);
    this.physicsEngine = new SimulationPhysicsEngine(this.configuration);
    this.setupWorld(this.configuration);
    this.graphEngine.setForceResize();
  }

  /**
   * Update physics and its graphical representation
   */
  simulationStep() {
    // . Init performance cycle analysis
    this.stats.begin();

    if (this.configuration.running) {
      // . Increase total time
      this.configuration.time +=
        this.configuration.simulationStep * this.configuration.simulationSpeed;

      // . Update Physics World
      this.physicsEngine.step();
    }
    // . Propagate physics information to graphical objects
    this.physicsToGraphical();

    // . Update Graphical World by rendering scenes again.
    this.graphEngine.step();

    // . Callback after physics and graphics
    this.stepCallback();

    // . Finish performance cycle analysis
    this.stats.end();

    // . Recursive cycle
    requestAnimationFrame(this.simulationStep);
  }

  setupWorld() {
    this.setInitialPhysicsInfo();
    this.simulationBodies = {
      star: null,
      planets: [],
      satellites: [],
    };

    // . Generate Static Objects
    // . . Star
    let starConfig = this.configuration.starSystem.star;
    // starConfig.visible = false;
    let star = new SimulationBody(
      this.graphEngine,
      this.physicsEngine,
      "star",
      starConfig,
      this.configuration
    );
    this.simulationBodies.star = star;

    // . Generate Dynamic Objects
    // . . Planet
    for (var planetConfig of this.configuration.starSystem.planets) {
      let planet = new SimulationBody(
        this.graphEngine,
        this.physicsEngine,
        "planet",
        planetConfig,
        this.configuration
      );
      this.simulationBodies.planets.push(planet);
    }

    // . . Satellites
    for (var satelliteConfig of this.configuration.starSystem.satellites) {
      let satellite = new SimulationBody(
        this.graphEngine,
        this.physicsEngine,
        "satellite",
        satelliteConfig,
        this.configuration
      );
      this.simulationBodies.satellites.push(satellite);
    }

    // . Inject bodies into Engines. Communication pathway.
    this.physicsEngine.simulationBodies = this.simulationBodies;
    this.graphEngine.simulationBodies = this.simulationBodies;

    this.bodyMap = this.mapSimulationBodies();
  }

  setInitialPhysicsInfo() {
    // . Star is not moving and at the center
    //prettier-ignore
    this.configuration.starSystem.star.initialPosition = new THREE.Vector3(0,0,0);
    //prettier-ignore
    this.configuration.starSystem.star.initialVelocity = new THREE.Vector3(0,0,0);

    // . Planets are moving and they are orbiting the star.
    // . . All of them must star at aphelion(0) or perihelion(Math.PI)
    let bodyOrbitInit = Math.PI,
      hostPlanet,
      orbitIncl,
      scaledHostMass,
      bodySpeed,
      eulerRotation;

    for (var planet of this.configuration.starSystem.planets) {
      // . INITIAL POSITION before applying rotations
      planet.initialPosition = new THREE.Vector3(0, 0, 0);
      //prettier-ignore
      planet.initialPosition.setX((Math.cos(bodyOrbitInit) * planet.semiMajor + planet.eccentricity * planet.semiMajor) * this.configuration.planetDistanceScale);
      //prettier-ignore
      planet.initialPosition.setY(Math.sin(bodyOrbitInit) * planet.semiMinor * this.configuration.planetDistanceScale);
      //prettier-ignore
      planet.initialPosition.setZ(0 * this.configuration.planetDistanceScale);

      // . INITIAL VELOCITY before applying rotations
      // . . Artificially increase host planet mass to increase pull force and compensate scaled satellite distances.
      planet.initialVelocity = new THREE.Vector3(0, 0, 0);
      //prettier-ignore
      scaledHostMass = this.configuration.starSystem.star.mass * Math.pow(this.configuration.planetDistanceScale, 3);
      //prettier-ignore
      bodySpeed = Math.sqrt(GravitationalConstant * scaledHostMass * (2 / planet.initialPosition.length() - 1 / ( planet.semiMajor * this.configuration.planetDistanceScale))) ////Vis-viva Equation. Planet starts at perihelion (closest point from Star)

      planet.initialVelocity.setX(Math.sin(bodyOrbitInit) * bodySpeed);
      planet.initialVelocity.setY(-1 * Math.cos(bodyOrbitInit) * bodySpeed);
      planet.initialVelocity.setZ(0);

      // . Tilting due perihelion longitude (rotate on Z axis) longitude and orbit inclination (rotate on Y axis)
      planet.tilted && this.configuration.orbitInclination
        ? (orbitIncl = THREE.MathUtils.degToRad(planet.orbitInclination))
        : (orbitIncl = 0);
      eulerRotation = new THREE.Euler(
        0,
        orbitIncl,
        THREE.MathUtils.degToRad(planet.longitudePerihelion),
        "ZYX"
      );

      planet.initialPositionBeforeRotation = Object.assign(
        {},
        planet.initialPosition
      );
      planet.initialPosition.applyEuler(eulerRotation);
      planet.initialVelocity.applyEuler(eulerRotation);
    }

    for (var satellite of this.configuration.starSystem.satellites) {
      // . INITIAL POSITION before applying rotations
      satellite.initialPosition = new THREE.Vector3(0, 0, 0);
      //prettier-ignore
      satellite.initialPosition.setX((Math.cos(bodyOrbitInit) * satellite.semiMajor + satellite.eccentricity * satellite.semiMajor) * this.configuration.satelliteDistanceScale);
      //prettier-ignore
      satellite.initialPosition.setY((Math.sin(bodyOrbitInit) * satellite.semiMinor) * this.configuration.satelliteDistanceScale);
      //prettier-ignore
      satellite.initialPosition.setZ(0 * this.configuration.satelliteDistanceScale);

      // . INITIAL VELOCITY before applying rotations
      satellite.initialVelocity = new THREE.Vector3(0, 0, 0);
      // . . Artificially increase host planet mass to increase pull force and compensate scaled satellite distances.
      //prettier-ignore
      hostPlanet = this.configuration.starSystem.planets.filter((obj) => {return obj.name === satellite.hostPlanet})[0];
      //prettier-ignore
      scaledHostMass = hostPlanet.mass * Math.pow(this.configuration.satelliteDistanceScale, 3);
      //prettier-ignore
      bodySpeed = Math.sqrt(GravitationalConstant * scaledHostMass * (2 / satellite.initialPosition.length() - 1 / (satellite.semiMajor * this.configuration.satelliteDistanceScale))); ////Vis-viva Equation. Planet starts at perihelion (closest point from Star)

      satellite.initialVelocity.setX(-1 * Math.sin(bodyOrbitInit) * bodySpeed);
      satellite.initialVelocity.setY(Math.cos(bodyOrbitInit) * bodySpeed);
      satellite.initialVelocity.setZ(0);

      // . Tilting due perihelion longitude (rotate on Z axis) longitude and orbit inclination (rotate on Y axis)
      hostPlanet.tilted && this.configuration.orbitInclination
        ? (orbitIncl = THREE.MathUtils.degToRad(hostPlanet.orbitInclination))
        : (orbitIncl = 0);
      satellite.tilted && this.configuration.orbitInclination
        ? (orbitIncl += THREE.MathUtils.degToRad(satellite.orbitInclination))
        : (orbitIncl += 0);
      let longPeri =
        hostPlanet.longitudePerihelion + satellite.longitudePerihelion;
      eulerRotation = new THREE.Euler(
        0,
        orbitIncl,
        THREE.MathUtils.degToRad(longPeri),
        "ZYX"
      );
      satellite.initialPosition.applyEuler(eulerRotation);
      satellite.initialVelocity.applyEuler(eulerRotation);

      //Translate satellite orbit center to planet position.
      // satellite.initialPosition.add(hostPlanet.initialPositionBeforeRotation);
      satellite.initialPosition.add(hostPlanet.initialPosition);
    }
  }

  physicsToGraphical() {
    // . Skip star
    // . Planets
    for (var planet of this.simulationBodies.planets) {
      planet.physicsToGraphical();
    }
    // . Planets
    for (var satellite of this.simulationBodies.satellites) {
      satellite.physicsToGraphical();
    }
  }

  // . Reset physical bodies to their initial positions and momentum
  initToCurrentPhysics() {
    // . Reset time
    this.configuration.time = 0;

    for (var planet of this.simulationBodies.planets) {
      let conf = this.configuration.starSystem.planets.filter((obj) => {
        return obj.name === planet.name;
      })[0];
      planet.physicalObject.position.copy(conf.initialPosition);
      planet.physicalObject.velocity.copy(conf.initialVelocity);
    }
    // . Planets
    for (var satellite of this.simulationBodies.satellites) {
      let conf = this.configuration.starSystem.satellites.filter((obj) => {
        return obj.name === satellite.name;
      })[0];
      satellite.physicalObject.position.copy(conf.initialPosition);
      satellite.physicalObject.velocity.copy(conf.initialVelocity);
    }
  }

  mapSimulationBodies() {
    let obj = {};
    obj[this.simulationBodies.star.name] = this.simulationBodies.star;
    for (var planet of this.simulationBodies.planets) obj[planet.name] = planet;
    for (var satellite of this.simulationBodies.satellites)
      obj[satellite.name] = satellite;

    return obj;
  }

  /**
   * Alter simulation speed. Accept values higher than 0. There is no theoretical maximum value, but high values may compromise visualization for humans (Wagon-Wheel Effect). Higher values increase computation load.
   * @param {Integer} value
   */
  setSimulationSpeed(value) {
    value > 0
      ? (this.configuration.simulationSpeed = value)
      : (this.configuration.simulationSpeed = 0);
  }

  /**
   * Alter simulation step. Indirectly rises simulation speed. Stability is compromised with values higher than 0.1 Time Units. Doesn't change computation load.
   * @param {Float} value
   */
  setSimulationStep(value) {
    this.configuration.simulationStep = value;
  }

  /**
   * Callback after physics and graphical steps. It's useful for moving objects arbitrarily.
   * @param {Function} callback
   */
  setStepCallback(callback) {
    this.stepCallback = callback;
  }

  /**
   * Alter Star size scale. Only Graph world changes. Glow meshes radius are also rescaled.
   * @param {Float} value
   */
  setStarScale(value) {
    let newScaling = value / this.configuration.starScale;
    // . Alter star and starGlow meshes. Glow meshes use configuration.starScale on animation loop.
    this.simulationBodies.star.graphicalObject.scale.multiplyScalar(newScaling);

    // . Update configuration
    this.configuration.starScale = value;
  }

  /**
   * Alter Planet size scale. Only Graph world changes. Glow meshes are rebuilt
   * @param {Float} value
   */
  setGlowScale(value) {
    this.configuration.glowScale = value;
  }

  /**
   * Alter Planet size scale. Only Graph world changes.
   * @param {Float} value
   */
  setPlanetScale(value) {
    let newScaling = value / this.configuration.planetScale;
    //Alter planet meshes
    for (var planet of this.simulationBodies.planets) {
      planet.graphicalObject.scale.multiplyScalar(newScaling);
    }

    // . Update configuration
    this.configuration.planetScale = value;
  }
  /**
   * Alter satellite size scale. Only Graph world changes.
   * @param {Float} value
   */
  setSatelliteScale(value) {
    let newScaling = value / this.configuration.satelliteScale;
    //Alter satellite meshes
    for (var satellite of this.simulationBodies.satellites) {
      satellite.graphicalObject.scale.multiplyScalar(newScaling);
    }

    // . Update configuration
    this.configuration.satelliteScale = value;
  }

  /**
   * Alter Planet distance scale. To avoid crashes, this method pauses the simulation and reboot the system.
   * @param {Float} value
   */
  setPlanetDistanceScale(value) {
    this.configuration.planetDistanceScale = value;
    this.setInitialPhysicsInfo();
    this.initToCurrentPhysics();

    // . Re-draw planet orbits
    for (var planet of this.simulationBodies.planets) {
      let oldOrbit = planet.graphicalObject.supObjects.pop();
      this.graphEngine.scene.remove(oldOrbit);

      planet.updateInnerConf();
      planet.createOrbits(planet.graphicalObject);
    }

    // . Re-draw satellite orbits
    for (var satellite of this.simulationBodies.satellites) {
      let oldOrbit = satellite.graphicalObject.supObjects.pop();
      this.graphEngine.scene.remove(oldOrbit);

      satellite.updateInnerConf();
      satellite.createOrbits(satellite.graphicalObject);
    }
  }

  /**
   * Alter Satellite distance scale. To avoid crashes, this method pauses the simulation and reboot the system.
   * @param {Float} value
   */
  setSatelliteDistanceScale(value) {
    this.configuration.satelliteDistanceScale = value;
    this.setInitialPhysicsInfo();
    this.initToCurrentPhysics();

    // . Re-draw satellite orbits
    for (var satellite of this.simulationBodies.satellites) {
      let oldOrbit = satellite.graphicalObject.supObjects.pop();
      this.graphEngine.scene.remove(oldOrbit);

      satellite.updateInnerConf();
      satellite.createOrbits(satellite.graphicalObject);
    }
  }
  /**
   * Alter the tilt of all bodies. Momentum are also rotated.
   * @param {Boolean} value
   */
  setOrbitInclination(value) {
    let bodyConfiguration,
      periLong,
      orbitIncl,
      tiltFactor,
      satellitesAssociated,
      orbit;

    if (value !== this.configuration.orbitInclination) {
      this.configuration.orbitInclination
        ? (tiltFactor = -1)
        : (tiltFactor = 1);
    } else {
      tiltFactor = 0;
    }

    // . Apply changes on physical bodies and let them propagate to graphical worlds naturally.
    for (var planet of this.simulationBodies.planets) {
      // . Get original configuration
      //prettier-ignore
      bodyConfiguration = this.configuration.starSystem.planets.filter((obj) => {return obj.name === planet.name;})[0];
      //prettier-ignore
      satellitesAssociated = this.simulationBodies.satellites.filter((obj) => {return obj.hostPlanet.name === planet.name});

      periLong = THREE.MathUtils.degToRad(
        bodyConfiguration.longitudePerihelion
      );
      orbitIncl = THREE.MathUtils.degToRad(
        tiltFactor * bodyConfiguration.orbitInclination
        // bodyConfiguration.orbitInclination
      );

      //rotate orbit lines
      orbit = planet.graphicalObject.supObjects[0];
      orbit.rotation.y += orbitIncl;

      // . Rotate planet. Remove perihelion longitude, un-tilt/tilt orbits, reinsert perihelion longitude.
      // . Planets
      planet.rotateBody(0, 0, -periLong);
      planet.rotateBody(0, orbitIncl, 0);
      planet.rotateBody(0, 0, periLong);
      // . Effect that planets have on their satellites
      for (let satellite of satellitesAssociated) {
        satellite.rotateBody(0, 0, -periLong);
        satellite.rotateBody(0, orbitIncl, 0);
        satellite.rotateBody(0, 0, periLong);
        satellite.graphicalObject.supObjects[0].rotation.y += orbitIncl;
        satellite.graphicalObject.supObjects[0].position.copy(
          planet.physicalObject.position
        );
      }
    }
    for (let satellite of this.simulationBodies.satellites) {
      //prettier-ignore
      bodyConfiguration = this.configuration.starSystem.satellites.filter((obj) => {return obj.name === satellite.name;})[0];
      let host = this.bodyMap[satellite.hostPlanet.name];

      // Satellites perihelion longitudes include their hosts' perihelion longitudes.
      periLong = THREE.MathUtils.degToRad(
        bodyConfiguration.longitudePerihelion +
          host.bodyConfiguration.longitudePerihelion
      );
      orbitIncl = THREE.MathUtils.degToRad(
        tiltFactor * bodyConfiguration.orbitInclination
      );
      //rotate orbit lines
      orbit = satellite.graphicalObject.supObjects[0];
      orbit.rotation.y += orbitIncl;

      //Translate to origin, rotate, translate back to host
      //To origin
      satellite.physicalObject.position.sub(host.physicalObject.position);
      //Rotation
      satellite.rotateBody(0, 0, -periLong);
      satellite.rotateBody(0, orbitIncl, 0);
      satellite.rotateBody(0, 0, periLong);
      //To host
      satellite.physicalObject.position.add(host.physicalObject.position);
    }
    //rotate bodies and their momentum. Rotations should use the hosts as references. Satellites should be rotates twice (using their orbit inclination and the host as well)
    this.configuration.orbitInclination = value;
  }
  /**
   * Activate or deactivate body rotation.
   * @param {Boolean} value
   */
  setRotation(value) {
    this.configuration.rotationEnabled = value;
  }
  /**
   * Alter the visibility of all orbits (supplementary objects of planets and satellites)
   * @param {Boolean} value
   */
  setOrbitVisibility(value) {
    //Alter visibility of all orbits
    var supplementaryObject;
    for (var planet of this.simulationBodies.planets) {
      if (planet.graphicalObject.visible) {
        for (supplementaryObject of planet.graphicalObject.supObjects) {
          supplementaryObject.visible = value;
        }
      }
    }
    for (var satellite of this.simulationBodies.satellites) {
      if (satellite.graphicalObject.visible) {
        for (supplementaryObject of satellite.graphicalObject.supObjects) {
          supplementaryObject.visible = value;
        }
      }
    }
  }

  /**
   * Alter the visibility of a specific body and all its supplementary objects
   * @param {String} name used as primary key to identify a body
   * @param {Boolean} value
   */
  setBodyVisibility(name, value) {
    // . Get body
    let body = this.bodyMap[name];
    // . Alter visibilities.
    body.graphicalObject.visible = value;
    for (var sup of body.graphicalObject.supObjects) {
      sup.visible = value;
    }
  }

  /**
   * Play or pause simulation
   * @param {Boolean} value
   */
  setRunning(value) {
    this.configuration.running = value;
  }
  /**
   * Set camera mode. On "view", no data is acquired, but the user has full orbit controls. On "measurement", "brightness" data is acquired, but the camera is fixed at details.distance on the XY plane.
   * @param {String} value measurement, view
   */
  setCameraMode(value) {
    let details = this.configuration.measurementDetails;
    let orbitControls = this.graphEngine.orbitControls;
    if (value === "view") {
      orbitControls.update();
      orbitControls.enabled = true;
      this.setOrbitVisibility(true);
      this.configuration.cameraMode = value;
    } else if (value === "measurement") {
      //prettier-ignore
      this.setCameraPosition( 0, details.distance, 0, details.camera.tag, details.camera.index);
      orbitControls.update();
      orbitControls.enabled = false;
      this.setOrbitVisibility(false);
      this.configuration.cameraMode = value;
    } else {
      console.warn(
        `WARNING: There are only two available modes: "view" or "measurement". Please enter a valid mode. Mode used: ${value}`
      );
    }
  }
  /**
   * Set distance between camera and star system for Measurement mode. This variable shouldn't be changed during a single measurement.
   * @param {Float} value
   */
  setMeasurementDistance(value) {
    this.configuration.measurementDetails.distance = value;
    this.setCameraPosition(0, value, 0);
  }
  /**
   * Set distance between camera and star system.
   * @param {Float} x
   * @param {Float} y
   * @param {Float} z
   */
  setCameraPosition(x, y, z, type = "main", supIndex = 0) {
    if (type === "main") {
      this.graphEngine.cameras.main.position.set(x, y, z);
    } else if (type === "supplementary") {
      this.graphEngine.cameras.supplementary[supIndex].position.set(x, y, z);
    }
    this.graphEngine.orbitControls.update();
  }
}
