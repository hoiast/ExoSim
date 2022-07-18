/**
 * @file this file contains all classes related to simulation rendering, HUD and GUI.
 */
import * as THREE from "three";
import * as Orbit from "three/examples/jsm/controls/OrbitControls";

/**
 * The GraphRender class builds and runs the graph environment.
 * @param {simulationConfiguration} configuration
 */
export default class SimulationGraphEngine {
  constructor(configuration) {
    this.mainCanvas = document.querySelector("#mainCanvas");
    this.bgCanvas = document.querySelector("#backgroundCanvas");
    this.configuration = configuration;
    this.renderers = { main: null, supplementary: [] };
    this.cameras = { main: null, supplementary: [] };
    this.orbitControls;
    this.lights;
    this.simulationBodies;
    this.iniStarScale = configuration.starScale;
    this.forceResize = false;

    //Preserve context on animation loop.
    this.step = this.step.bind(this);

    this.scene = new THREE.Scene();

    // this.renderer.shadowMap.enabled = true;
    // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.createRenderer(this.mainCanvas);
    this.createBGStars();
    this.createCamera(this.configuration.starSystem.cameraSettings);
    this.createOrbitControls();
    this.createLights();
  }

  createRenderer(canvas, supplementary = false) {
    let renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
    });

    // renderer.shadowMap.enabled = true;
    // renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio(window.devicePixelRatio);

    if (supplementary) {
      this.renderers.supplementary.push(renderer);
    } else {
      this.renderers.main = renderer;
    }
  }

  /**
   * Method for dynamic rendering. Call all methods required inside an animation loop.
   */
  step() {
    // . Automatic resize canvas if display Changes.
    this.resizeRenderer();

    // . Move background stars.
    this.oscillatesBGStars();

    if (this.configuration.running) {
      // . Rotate star glow.
      this.oscillateStarGlow();
    }

    // . Update rendered image.
    this.renderers.main.render(this.scene, this.cameras.main);

    // . Render supplementary view without orbit lines
    if (this.renderers.supplementary.length > 0) {
      this.setOrbitVisibility(false);
      for (var s = 0; s < this.renderers.supplementary.length; s++) {
        this.renderers.supplementary[s].render(
          this.scene,
          this.cameras.supplementary[s]
        );
      }
      this.setOrbitVisibility(true);
    }
  }

  /**
   * Resize renderer canvas to match current client width and height.
   */
  resizeRenderer() {
    const mainCanvas = this.renderers.main.domElement;
    const width = mainCanvas.clientWidth;
    const height = mainCanvas.clientHeight;
    const needResize =
      mainCanvas.width !== width ||
      mainCanvas.height !== height ||
      this.forceResize;
    if (needResize) {
      this.bgCanvas.width = width;
      this.bgCanvas.height = height;
      this.renderers.main.setSize(width, height, false);
      this.cameras.main.aspect =
        mainCanvas.clientWidth / mainCanvas.clientHeight;
      this.cameras.main.updateProjectionMatrix();
      this.forceResize = false;
    }
  }

  /**
   * This method creates the main camera.
   * @param {cameraSettings} cameraSettings
   * @param {Boolean} supplementary Additional cameras.
   */
  createCamera(cameraSettings, supplementary = false) {
    let camera;
    camera = new THREE.PerspectiveCamera(
      cameraSettings.fov,
      cameraSettings.aspect,
      cameraSettings.near,
      cameraSettings.far
    );
    camera.position.set(
      cameraSettings.position.x,
      cameraSettings.position.y,
      cameraSettings.position.z
    );
    //Changes default up vector of orbitControls
    camera.up.set(0, 0, 1);

    if (supplementary) {
      this.cameras.supplementary.push(camera);
    } else {
      this.cameras.main = camera;
    }

    return camera;
  }

  /**
   * This method creates the orbit controls associated to the main camera.
   */
  createOrbitControls() {
    this.orbitControls = new Orbit.OrbitControls(
      this.cameras.main,
      this.renderers.main.domElement
    );
    this.orbitControls.target = new THREE.Vector3(0, 0, 0);
    this.orbitControls.enablePan = false;
    // this.orbitControls.update();
  }

  createLights() {
    // . Creates minimum light ambient
    {
      const light = new THREE.AmbientLight(0x404040, 0.35); // soft white light
      this.scene.add(light);
    }

    // . Creates directional sun light. It's possible to use "this.configuration.starSystem.star.color" instead of white (0xffffff), but the visual aesthetics isn't pleasing.
    {
      const light = new THREE.PointLight(0xffffff, 2, 0, 0);
      light.position.set(0, 0, 0);
      this.scene.add(light);
    }
  }
  /**
   *
   * @param {String} colorString The material's color. It will be randomly tunned by the next argument scale.
   * @returns {THREE.Material} Returns a material. The specific type may vary with the bodyType.
   */
  createMaterial(colorString, bodyType) {
    let material = null;
    if (bodyType === "star") {
      material = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 1.0,
      });
    } else {
      material = new THREE.MeshLambertMaterial({
        transparent: true,
        opacity: 1.0,
      });
    }

    const color = new THREE.Color(colorString);
    material.color = color;

    return material;
  }

  createBGStars() {
    // . . Star Background (Decoupled from simulation)
    //2D little stars background
    this.bgStars = [];
    for (var i = 0; i < this.configuration.bgStars; i++) {
      var tw = {
        x: Math.random(),
        y: Math.random(),
      };

      this.bgStars.push(tw);
    }
  }

  oscillatesBGStars() {
    const ctx = this.bgCanvas.getContext("2d");
    const starSize = 1.5;

    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "rgba(255,255,255,0.25)";

    //Move slightly and randomly BG stars (Sparkling effect)
    for (var star of this.bgStars) {
      let oX = star.x * ctx.canvas.width;
      let oY = star.y * ctx.canvas.height;
      let size =
        Math.random() < 0.998
          ? Math.random() * 1 * starSize
          : Math.random() * 3 * starSize;

      ctx.beginPath();
      ctx.moveTo(oX, oY - size);
      ctx.lineTo(oX + size, oY);
      ctx.lineTo(oX, oY + size);
      ctx.lineTo(oX - size, oY);
      ctx.closePath();
      ctx.fill();
    }
  }

  oscillateStarGlow() {
    //prettier-ignore
    let glowList = this.simulationBodies.star.graphicalObject.supObjects.filter((obj) => { return obj.type === 'glow';});
    //prettier-ignore
    let glowScale = this.configuration.glowScale * this.configuration.starScale / this.iniStarScale

    function scaleGlow(axis) {
      return Math.max(
        glowScale - 0.05,
        Math.min(
          glowScale + 0.05,
          glow.scale[axis] + (Math.random() > 0.5 ? 0.005 : -0.005)
        )
      );
    }

    //Contract and expand starGlows
    for (var g in glowList) {
      var glow = glowList[g];
      glow.scale.set(scaleGlow("x"), scaleGlow("y"), scaleGlow("z"));
    }
  }

  countStarPixels() {
    let measurementDetails = this.configuration.measurementDetails;
    let measurementCamera, measurementRenderer;
    if (measurementDetails.camera.tag === "main") {
      measurementCamera = this.cameras.main;
    } else if (measurementDetails.camera.tag === "supplementary") {
      //prettier-ignore
      measurementCamera = this.cameras.supplementary[measurementDetails.camera.index];
    }

    if (measurementDetails.renderer.tag === "main") {
      measurementRenderer = this.renderers.main;
    } else if (measurementDetails.renderer.tag === "supplementary") {
      //prettier-ignore
      measurementRenderer = this.renderers.supplementary[measurementDetails.renderer.index];
    }

    let starGObj = this.simulationBodies.star.graphicalObject;
    // All components of starGObj.scale are equal. We could use scale.y ou scale.z;
    //prettier-ignore
    let TJSUStarSize = starGObj.geometry.parameters.radius * 2 * starGObj.scale.x;
    let starColor = starGObj.material.color;
    starColor = {
      r: Math.floor(starColor.r * 255),
      g: Math.floor(starColor.g * 255),
      b: Math.floor(starColor.b * 255),
    };
    let PixelStarSize = this.estimatePixelSize(
      measurementCamera,
      measurementRenderer,
      TJSUStarSize
    );

    let w = measurementRenderer.domElement.width,
      h = measurementRenderer.domElement.height,
      sizeToAnalyze = Math.floor(PixelStarSize),
      renderTarget = new THREE.WebGLRenderTarget(w, h);

    // . Alter render target to a new temporary object
    measurementRenderer.setRenderTarget(renderTarget);
    // . Avoid rendering parts outside of the starCut unnecessary p (NO STAR PART)
    //prettier-ignore
    measurementRenderer.setScissor( w / 2 - sizeToAnalyze / 2, h / 2 - sizeToAnalyze / 2, sizeToAnalyze, sizeToAnalyze);
    // . Render scene again on this new target.
    measurementRenderer.render(this.scene, measurementCamera);
    // . Prepare a intBuffer to store RGB pixel values.
    let buffer = new Uint8Array(sizeToAnalyze * sizeToAnalyze * 4);
    // . Write pixel data on buffer
    //prettier-ignore
    measurementRenderer.readRenderTargetPixels( renderTarget, w / 2 - sizeToAnalyze / 2, h / 2 - sizeToAnalyze / 2, sizeToAnalyze, sizeToAnalyze, buffer
    );
    // . Analyze data store inside the Buffer array
    // prettier-ignore
    let pixelCount = 0, w_count = 0, h_count = 0;

    for (var i = 0; i < buffer.length; i += 4) {
      // prettier-ignore
      let weightedPixel = this.weightPixelCount(w_count, h_count, sizeToAnalyze, sizeToAnalyze)
      if (weightedPixel > 0.9) {
        //prettier-ignore
        if ( (buffer[0+i] == starColor.r ) && (buffer[1+i] == starColor.g) && (buffer[2+i] == starColor.b) ) {
          //prettier-ignore
          pixelCount += weightedPixel ;
        }
      }
      //prettier-ignore
      if (w_count == sizeToAnalyze) {w_count=0;h_count++}
      w_count++;
    }

    // Random noise
    let noise = Math.random() * (TJSUStarSize * 0.1);
    pixelCount += noise;

    // . Restore regular render target.
    measurementRenderer.setRenderTarget(null);

    return pixelCount;
  }

  // . Estimate how big a square would be rendered in pixels in function of camera relative distance, fov and etc.
  estimatePixelSize(camera, renderer, TJSUObjectSize) {
    let vFOV = (camera.fov * Math.PI) / 180;
    //Assuming star is always at (0,0,0)
    let cameraDistance = camera.position.length();

    let TJSUVisible = 2 * Math.tan(vFOV / 2) * Math.abs(cameraDistance);
    let PixelPerTJSUVisible = renderer.domElement.height / TJSUVisible;
    let PixelSize = PixelPerTJSUVisible * TJSUObjectSize;

    // . Without this factor.
    let correctionFactor = 1.1;

    return PixelSize * correctionFactor;
  }

  // . Increase weight for pixels near the star center. It creates the curved bottom on transit wells
  weightPixelCount(x, y, w, h) {
    let weighted_pixel = Math.pow(
      Math.sqrt(1 - Math.pow(x / w - 1 / 2, 2) - Math.pow(y / h - 1 / 2, 2)),
      1
    );
    return weighted_pixel;
  }

  setOrbitVisibility(value) {
    for (let planet of this.simulationBodies.planets) {
      if (planet.graphicalObject.visible) {
        for (let sup of planet.graphicalObject.supObjects) {
          sup.visible = value;
        }
      }
    }
    for (let satellite of this.simulationBodies.satellites) {
      if (satellite.graphicalObject.visible) {
        for (let sup of satellite.graphicalObject.supObjects) {
          sup.visible = value;
        }
      }
    }
  }
  setForceResize() {
    this.forceResize = true;
  }
}
