<template>

    <div class="options-overview">
        <header class="title">
            <h1>Wireframe cube</h1>
        </header>

        <hr>
        <section class="viewport">
            <div class="viewport-content" ratio="1x1" />
        </section>

        <aside class="sidebar">
            <div class="options">

                <div class="option-group" name="Point 1">
                    <div class="option">
                        <label for="cubeSize">
                            Cube size
                        </label>
                        <input type="range" id="cubeSize" v-model="cubesize" step="0.1" min="0" max="16" @change="updateCubeSize(cubesize)">
                        <input type="number"  min="0" max="16" v-model="cubesize" @change="updateCubeSize(cubesize)">
                    </div>
                    <div class="option">
                        <!-- <label>Wireframe</label>÷ -->
                        <span>
                            <input type="checkbox" id="checkbox-v0" value="true" v-model="wireframe" v-on:change="updateCubeWireframe()">
                            <label for="checkbox-v0">
                                Toggle wireframe
                            </label>
                        </span>
                    </div>
                </div>

            </div>
        </aside>
    </div>
</template>


<script>
import * as THREE from 'three';
import _ from 'lodash';

import Stats from './../../../node_modules/three/examples/jsm/libs/stats.module.js';
// import { OrbitControls } from './../../../node_modules/three/examples/jsm/controls/OrbitControls.js';
import view from './../../services/3d-view.js';

var three = view.init({orbitControls: true})


export default {
    props: [],
    data() {
        return {
            value: 0,
            points: [new THREE.Vector3(),new THREE.Vector3()],
            animation: true,
            cubesize: 1,
            wireframe: 1,
        }
    },
    methods: {

        rotateObject(scene) {
            scene.children.forEach(o => {
                if (o.uploadedObject) {
                    o.rotation.y += 0.005;
                }
            })
        },
        updateCubeWireframe() {
            var cube = _.find(three.scene.children, {type:"Mesh"});
            // cube.material.wireframe = !this.wireframe

            if (this.wireframe) {
                cube.material = new THREE.MeshLambertMaterial({color: 0xff0066, wireframe: false});
            } else {
                cube.material = new THREE.MeshBasicMaterial({color: 0xff0066, wireframe: true});
            }
        },
        updateCubeSize(cubesize) {
            var cube = _.find(three.scene.children, {type:"Mesh"});
            cube.scale.x = cubesize
            cube.scale.y = cubesize
            cube.scale.z = cubesize
        },
        updateCanvasSize(camera, renderer) {
            var width = this.$el.clientWidth;
            var height = this.$el.clientWidth;

            renderer.setSize( width, height);
            camera.bottom = -height;
            camera.top = height;
            camera.left = -width;
            camera.right = width;

            camera.updateProjectionMatrix();
        }
    },
    mounted() {

        function disposeArray() {
            this.array = null;
        }

        three.camera.position.z = 2.4
        three.camera.position.y = 2.4
        three.camera.position.x = 2.4
        three.camera.lookAt(0,0,0)
        three.scene.add(three.camera)

        var geometry = new THREE.BoxGeometry(1,1,1);
        var material = new THREE.MeshBasicMaterial({color: 0xff0066, wireframe: true});
        var mesh = new THREE.Mesh(geometry, material);
        three.scene.add(mesh);

        // const planeSize = 8;
        // const shadowGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
        // const shadowMesh = new THREE.Mesh(shadowGeo, new THREE.MeshLambertMaterial({
        //     transparent: true,    // so we can see the ground
        //     depthWrite: false,    // so we don't have to sort
        // }));
        // shadowMesh.position.y = -0.5;  // so we're above the ground slightly
        // shadowMesh.rotation.x = Math.PI * -.5;
        // const shadowSize = 1 * 4;
        // shadowMesh.scale.set(shadowSize, shadowSize, shadowSize);
        // three.scene.add(shadowMesh);

        var stats = new Stats();
        stats.dom.className = "viewport-stats"
		this.$el.querySelector(".viewport-content").append( stats.dom );

        var that = this;
        function animate(index) {
            if ( that.animation !== true) {
                return;
            }

            three.camera.updateProjectionMatrix();
            three.renderer.render(three.scene, three.camera);

			stats.update();
            requestAnimationFrame(animate);
        }
        animate();
		this.$el.querySelector(".viewport-content").append(three.renderer.domElement );
        window.addEventListener('resize', () => {this.updateCanvasSize(three.camera, three.renderer)});
        window.dispatchEvent(new Event("resize"));
    }
}
</script>


<style lang="scss">

    @import '../../assets/scss/variables.scss';

    .options-overview {
        .viewport-content {
            display: flex;
            justify-content: center;
            align-items: center;
            color: $accentColor;
            font-size: 16vw;
            position:relative;

            canvas {
                max-width: 100%;
                max-height: 100%;
            }
        }

        .viewport-stats {
            position: absolute !important;
        }
    }
</style>
