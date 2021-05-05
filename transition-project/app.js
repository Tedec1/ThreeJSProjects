import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js";
import { OrbitControls } from "https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js";

function main() {
	let pos = 0;
	let scroll = document.body.scrollTop;
	const scenes = [
		{
			position: {
				x: 0,
				y: 15,
				z: 45,
			},
			rotation: {
				x: 0,
				y: 0,
				z: 0,
			},
			lookAtV: {
				x: 1.0,
				y: 1.0,
				z: 1.0,
			},
			far: 100,
			near: 0.1,
			fov: 45,
		},
		{
			position: {
				x: 20,
				y: -15,
				z: 70,
			},
			rotation: {
				x: 0,
				y: 0,
				z: 0,
			},
			lookAtV: {
				x: 1.0,
				y: 1.0,
				z: 1.0,
			},
			far: 100,
			near: 0.1,
			fov: 45,
		},
		{
			position: {
				x: 0,
				y: 50,
				z: 0,
			},
			rotation: {
				x: 0,
				y: 0,
				z: 0,
			},
			lookAtV: {
				x: 1.0,
				y: 1.0,
				z: 1.0,
			},
			far: 100,
			near: 0.1,
			fov: 45,
		},
		{
			position: {
				x: -10,
				y: 10,
				z: -45,
			},
			rotation: {
				x: 0,
				y: 0,
				z: 0,
			},
			lookAtV: {
				x: 1.0,
				y: 1.0,
				z: 1.0,
			},
			far: 100,
			near: 0.1,
			fov: 45,
		},
	];
	const canvas = document.querySelector("#c");
	const renderer = new THREE.WebGLRenderer({ canvas });

	const fov = 45;
	const aspect = 2; // the canvas default
	const near = 0.1;
	const far = 100;
	const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	{
		const { x, y, z } = scenes[0].position;
		camera.position.set(x, y, z);
	}
	// const controls = new OrbitControls(camera, canvas);
	// controls.target.set(0, 5, 0);
	// controls.update();
	{
		const { x, y, z } = scenes[0].lookAtV;
		camera.lookAt(x, y, z);
	}
	const scene = new THREE.Scene();
	scene.background = new THREE.Color("lightblue");

	{
		const color = 0xffffff;
		const intensity = 1;
		const light = new THREE.AmbientLight(color, intensity);
		scene.add(light);
	}

	{
		const planeSize = 40;

		const loader = new THREE.TextureLoader();
		const texture = loader.load(
			"https://threejsfundamentals.org/threejs/resources/images/checker.png"
		);
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.magFilter = THREE.NearestFilter;
		const repeats = planeSize / 2;
		texture.repeat.set(repeats, repeats);

		const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
		const planeMat = new THREE.MeshPhongMaterial({
			map: texture,
			side: THREE.DoubleSide,
		});
		const mesh = new THREE.Mesh(planeGeo, planeMat);
		mesh.rotation.x = Math.PI * -0.5;
		scene.add(mesh);
	}
	const objects = [
		makeBall(6, 20, 20, "blue", 5, 7, 10),
		makeBox(5, 5, 5, "green", 0, 5, -10),
		makeOctahedron(7, "gray", 15, 10, 5),
	];
	objects.forEach((obj) => {
		scene.add(obj);
	});
	function makeBall(rad, width, height, color, x, y, z) {
		const ballGeo = new THREE.SphereGeometry(rad, width, height);
		const ballMaterial = new THREE.MeshPhongMaterial({ color });
		const mesh = new THREE.Mesh(ballGeo, ballMaterial);
		mesh.position.set(x, y, z);
		return mesh;
	}
	function makeBox(width, height, depth, color, x, y, z) {
		const ballGeo = new THREE.BoxGeometry(width, height, depth);
		const ballMaterial = new THREE.MeshPhongMaterial({ color });
		const mesh = new THREE.Mesh(ballGeo, ballMaterial);
		mesh.position.set(x, y, z);
		return mesh;
	}
	function makeOctahedron(rad, color, x, y, z) {
		const ballGeo = new THREE.OctahedronGeometry(rad);
		const ballMaterial = new THREE.MeshPhongMaterial({ color });
		const mesh = new THREE.Mesh(ballGeo, ballMaterial);
		mesh.position.set(x, y, z);
		return mesh;
	}
	console.log(scene);
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

	function render() {
		if (resizeRendererToDisplaySize(renderer)) {
			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();
		}

		renderer.render(scene, camera);

		requestAnimationFrame(render);
	}

	const handleTransition = (currScene, nextScene) => {};

	document.addEventListener("wheel", (event) => {
		console.log(event.deltaY);
		if (event.deltaY > 0) {
			//scroll down
			pos++;
		} else {
			//scroll up
			pos--;
		}
		if (pos >= scenes.length) {
			pos = 0;
		}
		if (pos < 0) {
			pos = scenes.length - 1;
		}
		const { rotation, position, fov, far, near, lookAtV } = scenes[pos];
		{
			const { x, y, z } = position;
			camera.position.set(x, y, z);
		}

		// {
		//   const {x,y,z} = rotation;
		//   camera.rotation.set(x,y,z);
		// }
		{
			const { x, y, z } = lookAtV;
			camera.lookAt(x, y, z);
		}
		// handleTransition(scenes[pos - 1],scenes[pos])

		console.log(camera);
	});
	document.addEventListener("contextmenu", (event) => {
		event.preventDefault();
	});
	requestAnimationFrame(render);
}
main();
