import * as THREE from "./three.js-master/build/three.module.js";

function main() {
	const canvas = document.querySelector("#c");
	const renderer = new THREE.WebGLRenderer({ canvas });

	const fov = 40;
	const aspect = 2; // the canvas default
	const near = 0.1;
	const far = 1000;
	const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.position.set(0, 50, 0);
	camera.up.set(0, 0, 1);
	camera.lookAt(0, 0, 0);
	const scene = new THREE.Scene();
	{
		const color = 0xffffff;
		const intensity = 3;
		const light = new THREE.PointLight(color, intensity);
		scene.add(light);
	}
	// const light = new THREE.DirectionalLight(0xffffff, 1);
	// light.position.set(-1, 2, 4);
	// scene.add(light);
	renderer.render(scene, camera);
	const objects = [];
	// function makeCube(geometry, color, x) {
	// 	const material = new THREE.MeshPhongMaterial({ color });
	// 	const cube = new THREE.Mesh(geometry, material);
	// 	scene.add(cube);
	// 	cube.position.x = x;
	// 	return cube;
	// }

	// const cubes = [
	// 	makeInstance(geometry, 0x44aa88, 0),
	// 	makeInstance(geometry, 0x8844aa, -2),
	// 	makeInstance(geometry, 0xaa8844, 2),
	// ];
	function loadScene() {
		const solarSystem = new THREE.Object3D();
		const earthOrbit = new THREE.Object3D();
		const moonOrbit = new THREE.Object3D();
		earthOrbit.position.x = 10;
		scene.add(solarSystem);
		objects.push(earthOrbit);
		objects.push(solarSystem);
		objects.push(moonOrbit);
		const sun = makePlanet(1, [5, 5, 5], "#FFFFFF", 0xffff00); //sun
		const earth = makePlanet(1, [1, 1, 1], 0x2233ff, 0x112244); //earth
		const moon = makePlanet(1, [0.5, 0.5, 0.5], 0x888888, 0x222222, 2);
		solarSystem.add(sun);
		solarSystem.add(earthOrbit);
		earthOrbit.add(moonOrbit);
		moonOrbit.add(moon);
		earthOrbit.add(earth);
	}
	function makePlanet(
		radius = 1,
		[x = 1, y = 1, z = 1],
		color = "#FFFFFF",
		emissive = 0xffff00,
		offX = 0,
		offY = 0,
		offZ = 0
	) {
		const widthSegments = 6;
		const heightSegments = 6;
		const sphereGeometry = new THREE.SphereGeometry(
			radius,
			widthSegments,
			heightSegments
		);

		const planetMaterial = new THREE.MeshPhongMaterial({ color, emissive });
		const planetMesh = new THREE.Mesh(sphereGeometry, planetMaterial);
		planetMesh.scale.set(x, y, z); // make the sun large
		planetMesh.position.set(offX, offY, offZ);
		// scene.add(planetMesh);
		objects.push(planetMesh);
		console.log(planetMesh);
		return planetMesh;
	}

	function resizeRendererToDisplaySize(renderer) {
		const canvas = renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if (needResize) {
			renderer.setSize(width, height, false);
		}
		return needResize;
	}

	function render(time) {
		time *= 0.001; // convert time to seconds
		if (resizeRendererToDisplaySize(renderer)) {
			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();
		}
		objects.forEach((obj) => {
			obj.rotation.y = time;
			const axes = new THREE.AxesHelper();
			axes.material.depthTest = false;
			axes.renderOrder = 1;
			obj.add(axes);
		});
		// cubes.forEach((cube, ndx) => {
		// 	const speed = 1 + ndx * 0.1;
		// 	const rot = time * speed;
		// 	cube.rotation.x = rot;
		// 	cube.rotation.y = rot;
		// });
		renderer.render(scene, camera);
		requestAnimationFrame(render);
	}

	loadScene();
	requestAnimationFrame(render);
}
main();
