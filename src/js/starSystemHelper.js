class StarSystem {
  constructor(name) {
    this.name = name;
    this.star;
    this.planets = [];
    this.satellites = [];
    this.cameraSettings;
    this.scales;
  }

  //prettier-ignore
  setStar(...args){ this.star = new Star(...args)}
  //prettier-ignore
  addPlanet(...args){ this.planets.push( new Planet(...args))}
  //prettier-ignore
  addSatellite(...args){ this.satellites.push( new Satellite(...args))}
  //prettier-ignore
  setCameraSettings(...args){ this.cameraSettings = new CameraSettings(...args)}
  //prettier-ignore
  setScales(...args){ this.scales = new Scales(...args)}

  // . Uses current star system to estimate optimum camera settings.
  calculateCameraSettings() {
    // . Typical camera setup
    let fov = 20;
    let aspect = 2;
    let near = 0.1;
    let far = 50000;

    // . Get largest planet semiMajor to define camera position on view mode and distance on measurement mode. All values assume that the star system is at (0,0,0).
    let largestSemiMajor = 0;
    for (var planet of this.planets) {
      largestSemiMajor = Math.max(largestSemiMajor, planet.semiMajor);
    }
    let x = 0; //
    let y = 0; //
    let z = largestSemiMajor * 7; //

    let position = { x: x, y: y, z: z };
    let measurementDistance = largestSemiMajor * 6; //

    this.setCameraSettings(
      position,
      measurementDistance,
      fov,
      aspect,
      near,
      far
    );
  }

  // . Uses current star system to estimate optimum scales (distances and size). NEED IMPROVEMENT! VALUES ARE NOT CONSISTENT.
  calculateScales() {
    let largestSemiMajor = 0;
    for (var planet of this.planets) {
      largestSemiMajor = Math.max(largestSemiMajor, planet.semiMajor);
    }

    let starScale = largestSemiMajor / 50;
    let planetScale = largestSemiMajor / 2;
    let satelliteScale = planetScale;
    let measurementDistance = largestSemiMajor * 6;
    this.setScales(
      starScale,
      planetScale,
      satelliteScale,
      1,
      50,
      measurementDistance
    );
  }
}

class Star {
  //prettier-ignore
  constructor(name, mass, radius, color, glowLayers=2, visible=true) {
      this.name = name;
      this.mass = mass;
      this.radius = radius;
      this.color = color;
      this.glowLayers = glowLayers;
      this.visible = visible
    }
}

class Planet {
  //prettier-ignore
  constructor( name, radius, semiMajor, eccentricity, longitudePerihelion, orbitInclination, color, texture=null, rotationSpeed=0, obliquity=0, mass=null,  visible=true, tilted=true, ) {
      this.name = name;
      this.mass = mass;
      this.radius = radius;
      this.semiMajor = semiMajor;
      this.semiMinor = semiMajor * Math.sqrt(1 - Math.pow(eccentricity, 2));
      this.eccentricity = eccentricity;
      this.longitudePerihelion = longitudePerihelion;
      this.orbitInclination = orbitInclination;
      this.color = color;
      this.texture = texture;
      this.visible = visible;
      this.tilted = tilted;
      this.rotationSpeed = rotationSpeed;
      this.obliquity = obliquity; //Not implemented
    }
}
class Satellite {
  //prettier-ignore
  constructor( name, hostPlanet, radius, semiMajor, eccentricity, longitudePerihelion, orbitInclination, color, texture=null, rotationSpeed=0, obliquity=0, visible=false, tilted=true) {
      this.name = name;
      this.hostPlanet = hostPlanet;
      this.radius = radius;
      this.semiMajor = semiMajor;
      this.semiMinor = semiMajor * Math.sqrt(1 - Math.pow(eccentricity, 2));
      this.eccentricity = eccentricity;
      this.longitudePerihelion = longitudePerihelion;
      this.orbitInclination = orbitInclination;
      this.color = color;
      this.texture = texture;
      this.visible = visible
      this.tilted = tilted
      this.rotationSpeed = rotationSpeed;
      this.obliquity = obliquity; //Not implemented
    }
}

class CameraSettings {
  constructor(position, measurementDistance, fov, aspect, near, far) {
    this.position = position;
    this.measurementDistance = measurementDistance;
    this.fov = fov;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
  }
}

class Scales {
  constructor(
    starScale,
    planetScale,
    satelliteScale,
    planetDistanceScale,
    satelliteDistanceScale,
    measurementDistance
  ) {
    this.starScale = starScale;
    this.planetScale = planetScale;
    this.satelliteScale = satelliteScale;
    this.planetDistanceScale = planetDistanceScale;
    this.satelliteDistanceScale = satelliteDistanceScale;
    this.measurementDistance = measurementDistance;
  }
}

export { StarSystem, CameraSettings, Scales, Star, Planet, Satellite };
