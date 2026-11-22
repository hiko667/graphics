import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 2;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const clippingPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0.6);
renderer.clippingPlanes = [clippingPlane];
renderer.localClippingEnabled = true;

const clippingSlider = document.getElementById('clipping-slider');
clippingSlider.addEventListener('input', (event) => {
    clippingPlane.constant = parseFloat(event.target.value);
});

const axisRadios = document.querySelectorAll('input[name="clipping-axis"]');
const normals = {
    x: new THREE.Vector3(1, 0, 0),
    y: new THREE.Vector3(0, 1, 0),
    z: new THREE.Vector3(0, 0, 1)
};

axisRadios.forEach(radio => {
    radio.addEventListener('change', (event) => {
        if (event.target.checked) {
            const selectedAxis = event.target.value;
            clippingPlane.normal.copy(normals[selectedAxis]);
        }
    });
});

const geometry = new THREE.BoxGeometry(1, 1, 1);

const positionAttribute = geometry.getAttribute('position');
const colors = [];

for (let i = 0; i < positionAttribute.count; i++) {
    const x = positionAttribute.getX(i); //red
    const y = positionAttribute.getY(i); // green
    const z = positionAttribute.getZ(i); //blue
    
    colors.push(x + 0.5, y + 0.5, z + 0.5);
}

geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

const material = new THREE.MeshBasicMaterial({
    vertexColors: true,
    side: THREE.DoubleSide
});

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const edges = new THREE.EdgesGeometry(geometry);
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });
const wireframe = new THREE.LineSegments(edges, lineMaterial);
scene.add(wireframe);

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// window.addEventListener('resize', () => {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
// });

animate();