("strict mode");
import * as THREE from "three";

/**
 * Class to manipulate physical and graphical aspects of a single body.
 */
export default class SimulationBody {
  constructor(
    graphWorld,
    physicsWorld,
    bodyType,
    bodyConfiguration,
    simConfiguration
  ) {
    this.graphWorld = graphWorld;
    this.physicsWorld = physicsWorld;
    this.bodyType = bodyType;
    this.bodyConfiguration = bodyConfiguration;
    this.simConfiguration = simConfiguration;
    this.name = bodyConfiguration.name;

    // . Extract relevant info
    this.updateInnerConf();
    // . Define obliquity vector.
    // this.defineObliquityVector();

    // . Preserve context
    this.createGlowLayers = this.createGlowLayers.bind(this);

    this.graphicalObject = this.createGraphicalObject();
    this.physicalObject = this.createPhysicalObject();
  }

  updateInnerConf() {
    if (this.bodyType === "star") {
      this.sizeScale = this.simConfiguration.starScale;
    } else if (this.bodyType === "planet") {
      this.sizeScale = this.simConfiguration.planetScale;
      this.distanceScale = this.simConfiguration.planetDistanceScale;
    } else if (this.bodyType === "satellite") {
      this.sizeScale = this.simConfiguration.satelliteScale;
      this.distanceScale = this.simConfiguration.satelliteDistanceScale;
      this.hostPlanet = this.simConfiguration.starSystem.planets.filter(
        (obj) => {
          return obj.name === this.bodyConfiguration.hostPlanet;
        }
      )[0];
    }
  }

  createGraphicalObject() {
    // . Initial Setup
    const color = this.bodyConfiguration.color;
    const radius = this.bodyConfiguration.radius * this.sizeScale;
    const geometry = new THREE.SphereGeometry(radius, 20, 20);
    const material = this.graphWorld.createMaterial(color, this.bodyType);

    // . If possible, replace plain colored material by texture.
    if (this.bodyConfiguration.texture) {
      let texture = new THREE.TextureLoader().load(
        this.bodyConfiguration.texture
      );
      material.map = texture;
    }

    // . Create object and define its bounding box.
    const bodyMesh = new THREE.Mesh(geometry, material);
    bodyMesh.boundingBox = new THREE.Box3().setFromObject(bodyMesh);

    // . Set body properties and initial position
    this.bodyType === "star"
      ? (bodyMesh.castShadow = false)
      : (bodyMesh.castShadow = true);
    bodyMesh.receiveShadow = true;
    bodyMesh.position.set(
      this.bodyConfiguration.initialPosition.x,
      this.bodyConfiguration.initialPosition.y,
      this.bodyConfiguration.initialPosition.z
    );

    bodyMesh.visible = this.bodyConfiguration.visible;
    if (this.bodyConfiguration.texture) bodyMesh.rotateX(Math.PI / 2);
    // . If necessary, create supplementary graphical objects. Aesthetics only.
    bodyMesh.supObjects = [];
    this.createSupplementaryGraphicalObjects(bodyMesh);

    // . Include it into the scene
    // this.graphWorld.renderingDetails[this.bodyType].objects.push(bodyMesh);
    this.graphWorld.scene.add(bodyMesh);

    return bodyMesh;
  }

  createPhysicalObject() {
    return {
      position: new THREE.Vector3(
        this.bodyConfiguration.initialPosition.x,
        this.bodyConfiguration.initialPosition.y,
        this.bodyConfiguration.initialPosition.z
      ),
      velocity: new THREE.Vector3(
        this.bodyConfiguration.initialVelocity.x,
        this.bodyConfiguration.initialVelocity.y,
        this.bodyConfiguration.initialVelocity.z
      ),
      mass: this.bodyConfiguration.mass,
    };
  }

  createSupplementaryGraphicalObjects(mainGraphObject) {
    if (this.bodyType === "star" && this.bodyConfiguration.glowLayers > 0) {
      this.createGlowLayers(mainGraphObject);
    }
    if (this.bodyType === "planet" || this.bodyType === "satellite") {
      this.createOrbits(mainGraphObject);
    }
  }

  createGlowLayers(mainGraphObject) {
    ////Build StarGlow objects
    const color = this.bodyConfiguration.color;
    const radius = this.bodyConfiguration.radius;
    const glowLayers = this.bodyConfiguration.glowLayers;
    let glowScale = 1.1;

    for (var i = 0; i < glowLayers; i++) {
      var starGlow = new THREE.Mesh(
        new THREE.IcosahedronGeometry(radius * glowScale * this.sizeScale, 2),
        new THREE.MeshBasicMaterial({
          color: color,
          transparent: true,
          opacity: 0.1,
        })
      );
      starGlow.castShadow = false;
      starGlow.type = "glow";
      glowScale += 0.1;

      starGlow.visible = this.bodyConfiguration.visible;

      mainGraphObject.supObjects.push(starGlow);
      // this.graphWorld.renderingDetails['glow'].objects.push(starGlow);
      this.graphWorld.scene.add(starGlow);
    }
  }

  createOrbits(mainGraphObject) {
    ////Body Orbit Line
    let curve = new THREE.EllipseCurve(
      this.bodyConfiguration.eccentricity *
        this.bodyConfiguration.semiMajor *
        this.distanceScale, //ax
      0, // aY
      this.bodyConfiguration.semiMajor * this.distanceScale, // xRadius
      this.bodyConfiguration.semiMinor * this.distanceScale, // yRadius
      0, // aStartAngle
      2 * Math.PI, // aEndAngle
      false, // aClockwise
      0 // aRotation
    );
    let points = curve.getPoints(150);
    let geometry = new THREE.BufferGeometry().setFromPoints(points);
    let material = new THREE.LineBasicMaterial({
      color: this.simConfiguration.starSystem.star.color,
      transparent: true,
      opacity: 0.2,
    });

    let orbit = new THREE.Line(geometry, material);
    orbit.visible = this.bodyConfiguration.visible;

    orbit.rotation.order = "ZYX";

    let hostIncl = 0;
    let hostLongPeri = 0;
    if (this.bodyType === "satellite") {
      hostLongPeri = this.hostPlanet.longitudePerihelion;
      this.hostPlanet.tilted && this.simConfiguration.orbitInclination
        ? (hostIncl = this.hostPlanet.orbitInclination)
        : (hostIncl = 0);
    }
    let orbitIncl = hostIncl + this.bodyConfiguration.orbitInclination;
    let longPeri = hostLongPeri + this.bodyConfiguration.longitudePerihelion;

    if (
      this.bodyConfiguration.tilted &&
      this.simConfiguration.orbitInclination
    ) {
      //prettier-ignore
      orbit.rotation.y = THREE.MathUtils.degToRad(orbitIncl); //Add deviations from XZ plane
    }
    //prettier-ignore
    orbit.rotation.z = THREE.MathUtils.degToRad(longPeri);

    if (this.bodyType === "satellite") {
      orbit.position.add(this.hostPlanet.initialPosition);
    } else if (this.bodyType === "planet") {
      //
    }

    mainGraphObject.supObjects.push(orbit);
    this.graphWorld.scene.add(orbit);
  }
  physicsToGraphical() {
    this.graphicalObject.position.set(
      this.physicalObject.position.x,
      this.physicalObject.position.y,
      this.physicalObject.position.z
    );
  }
  // . Translational rotation around host.
  rotateBody(x, y, z) {
    let eulerRotation = new THREE.Euler(x, y, z);
    this.physicalObject.position.applyEuler(eulerRotation);
    this.physicalObject.velocity.applyEuler(eulerRotation);
  }
  // // . Inner rotation around itself. (Day/Night rotation)
  // rotateWithObliquity(angle) {
  //   this.graphicalObject.rotateOnAxis(this.obliquityVector, angle);
  // }

  // defineObliquityVector(tilted) {
  //   let obliquityAngle = this.bodyConfiguration.obliquity;
  //   // if (tilted) obliquityAngle += this.bodyConfiguration.orbitInclination;
  //   this.obliquityVector = new THREE.Vector3(
  //     Math.sin(THREE.MathUtils.degToRad(obliquityAngle)),
  //     Math.cos(THREE.MathUtils.degToRad(obliquityAngle)),
  //     0
  //   );
  // }
}
