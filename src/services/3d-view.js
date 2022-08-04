import * as THREE from 'three';
import { OrbitControls } from './../../node_modules/three/examples/jsm/controls/OrbitControls.js';


const view3D  = {
    init: (opts = {}) => {
        const dimensions = {
          width: 36,
          height: 256,
          depth: 36
        }

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            powerPreference: "low-power",
            antialias: true
        });
        const scene             = new THREE.Scene();

        renderer.setSize( window.innerWidth*.8, window.innerHeight*.8 );
        // renderer.physicallyCorrectLights = true;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        scene.background = new THREE.Color('#222'); // optional

        const camera            = new THREE.PerspectiveCamera( 35, 1, 0.1, 1000 );
        camera.position.set( 0, 20, 0)
        camera.lookAt( 0, 0, 0)

        const cameraHelper = new THREE.CameraHelper(camera);
        // scene.add(cameraHelper)
        // Lights
        const ambientLight      = new THREE.AmbientLight( "#fffaea", .2);
        const spotLight         = new THREE.SpotLight("#fff", .64, 0 ,Math.PI/360*100 ,0,2);

        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 1024; // default
        spotLight.shadow.mapSize.height = 1024;

        spotLight.position.x = dimensions.width
        spotLight.position.y = dimensions.height
        spotLight.position.z = dimensions.depth/2
        spotLight.lookAt(0,0,0)
        var spotLight2 = spotLight.clone()
        spotLight.position.x -= dimensions.width*2
        // spotLight.position.z -= dimensions.depth
        spotLight2.lookAt(0,0,0)

        const spotLightHelper = new THREE.SpotLightHelper( spotLight, "#f09" );

        // scene.add( spotLight);
        scene.add(ambientLight, spotLight,spotLight2);
        // scene.add( spotLightHelper );

        function animate() {
          requestAnimationFrame( animate );
          renderer.render(scene, camera);
        }
        animate();

        const res =  {
            scene: scene,
            renderer:renderer,
            camera: camera,
        }

        if (opts.orbitControls) {
            res.controls = new OrbitControls( camera, renderer.domElement );
        }

        return res
    },
}

export default view3D