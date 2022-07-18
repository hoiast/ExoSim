import { GravitationalConstant } from "./unitSystemAndConversion";
import * as THREE from "three";

export default class PhysicsEngine {
  constructor(configuration) {
    this.configuration = configuration;
    this.simulationStep = configuration.simulationStep;
    this.simulationSpeed = configuration.simulationSpeed;
    this.simulationBodies;
  }

  /**
   * Method for dynamic rendering. Call all methods required inside an animation loop.
   */
  step() {
    // . Simulation speed increase inner loops
    for (
      var loopCycle = 0;
      loopCycle < this.configuration.simulationSpeed;
      loopCycle++
    ) {
      // . Skip stars. The are static in our simulations and doesn't respond to forces.

      // . Planets
      // . . Translation and Rotation
      this.stepPlanets();

      // . Satellites
      // . . Translation and Rotation
      this.stepSatellites();
    }
  }

  stepPlanets() {
    let host = this.simulationBodies.star;
    let acceleration;
    for (var planet of this.simulationBodies.planets) {
      // . Translation
      acceleration = this.getAcceleration(
        host.physicalObject,
        planet.physicalObject,
        this.configuration.planetDistanceScale
      );

      planet.physicalObject.velocity.addScaledVector(
        acceleration,
        this.configuration.simulationStep
      );
      planet.physicalObject.position.addScaledVector(
        planet.physicalObject.velocity,
        this.configuration.simulationStep
      );

      // . Rotation. It's assumed that obliquity is 0 (i.e. rotation axis is NOT tilted).
      if (this.configuration.rotationEnabled) {
        planet.graphicalObject.rotation.y +=
          this.configuration.simulationStep *
          planet.bodyConfiguration.rotationSpeed;
      }
    }
  }
  stepSatellites() {
    let acceleration;
    for (var satellite of this.simulationBodies.satellites) {
      let host = this.simulationBodies.planets.filter((obj) => {
        return obj.name === satellite.hostPlanet.name;
      })[0];

      // . Before force calculation, preserve motion frame on host.
      // . . Move satellite to host
      satellite.physicalObject.position.addScaledVector(
        host.physicalObject.velocity,
        this.configuration.simulationStep
      );
      // . . Update satellite orbit
      satellite.graphicalObject.supObjects[0].position.copy(
        host.physicalObject.position
      );
      acceleration = this.getAcceleration(
        host.physicalObject,
        satellite.physicalObject,
        this.configuration.satelliteDistanceScale
      );

      satellite.physicalObject.velocity.addScaledVector(
        acceleration,
        this.configuration.simulationStep
      );
      satellite.physicalObject.position.addScaledVector(
        satellite.physicalObject.velocity,
        this.configuration.simulationStep
      );
      // . Rotation. It's assumed that obliquity is 0 (i.e. rotation is NOT tilted).
      satellite.graphicalObject.rotation.y +=
        this.configuration.simulationStep *
        satellite.bodyConfiguration.rotationSpeed;
    }
    // if (bodyName == 'earth') {
    //   orbits[4].position.set(earthX, earthY, earthZ);
    //   bodies[4].position.x += body.velocity.x * deltaT;
    //   bodies[4].position.y += body.velocity.y * deltaT;
    //   bodies[4].position.z += body.velocity.z * deltaT;
    // }
  }
  getAcceleration(host, orbitingBody, distanceScale) {
    // . Get host mass. Approximation: Orbiting mass is negligible when compared to its host.
    let scaledHostMass = host.mass * Math.pow(distanceScale, 3);

    // .Get distance vector
    let distanceHostBody = orbitingBody.position.clone();
    distanceHostBody.sub(host.position);

    // . Calculate total acceleration
    let totalAcceleration =
      (-1 * GravitationalConstant * scaledHostMass) /
      distanceHostBody.lengthSq();

    // . Get acceleration components from distance normalized components
    distanceHostBody.normalize();
    return new THREE.Vector3(
      totalAcceleration * distanceHostBody.x,
      totalAcceleration * distanceHostBody.y,
      totalAcceleration * distanceHostBody.z
    );
  }
}
