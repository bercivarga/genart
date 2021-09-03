// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");
const eases = require("eases");
const BezierEasing = require("bezier-easing");

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl",
  attributes: { antialias: true },
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  // WebGL background color
  renderer.setClearColor("hsl(0, 0%, 95%)", 1);

  // Setup a camera
  const camera = new THREE.OrthographicCamera();

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup Object3D
  const cubes = new THREE.Object3D();
  scene.add(cubes);

  // Create new palette
  const palette = random.pick(palettes);

  // Setup a geometry
  const geometry = new THREE.BoxGeometry(1, 1, 1);

  // Setup the cubes array
  const cubesArr = [];

  // Setup a mesh with geometry + material
  for (let i = 0; i < 200; i++) {
    // Setup a material
    const material = new THREE.MeshStandardMaterial({
      color: random.pick(palette),
      wireframe: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1)
    );
    mesh.scale.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1)
    );
    mesh.scale.multiplyScalar(0.5);

    mesh.originalPosition = mesh.position.clone();

    cubes.add(mesh);
    cubesArr.push(mesh);
  }

  scene.add(new THREE.AmbientLight("hsl(0, 0%, 90%)"));

  const light = new THREE.DirectionalLight("white", 1);
  light.position.set(0, 2, 4);
  scene.add(light);

  const ease = BezierEasing(0.67, 0.03, 0.29, 0.99);

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;

      const aspect = viewportWidth / viewportHeight;

      // Ortho zoom
      const zoom = 2.0;

      // Bounds
      camera.left = -zoom * aspect;
      camera.right = zoom * aspect;
      camera.top = zoom;
      camera.bottom = -zoom;

      // Near/Far
      camera.near = -100;
      camera.far = 100;

      // Set position & look at world center
      camera.position.set(zoom, zoom, zoom);
      camera.lookAt(new THREE.Vector3());

      // Update the camera
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ time }) {
      cubesArr.forEach((c) => {
        const f = 0.5;
        c.position.x =
          c.originalPosition.x +
          0.25 *
            random.noise3D(
              c.originalPosition.x * f,
              c.originalPosition.y * f,
              c.originalPosition.z * f,
              time * 0.25
            );
      });
      cubes.rotation.x = ease(3);
      cubes.rotation.y = ease(3);
      cubes.rotation.z = ease(3);
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      renderer.dispose();
    },
  };
};

canvasSketch(sketch, settings);
