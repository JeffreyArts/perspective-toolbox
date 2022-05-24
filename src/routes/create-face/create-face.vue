<template>

    <div class="options-overview">
        <header class="title">
            <h1>Create face</h1>
        </header>

        <hr>
        <section class="viewport">
            <div class="viewport-content" ratio="1x1" />
        </section>

        <aside class="sidebar">
            <div class="options">

                <div class="option-group" name="Face">
                    <div class="option">
                        <label for="point1">
                            Point 1
                        </label>

                        <div class="group">
                            <input type="number" id="point1" v-model="point1[0]" step="0.1" min="0" max="16" @change="updateFace(point1)">
                            <input type="number" id="point1" v-model="point1[1]" step="0.1" min="0" max="16" @change="updateFace(point1)">
                            <input type="number" id="point1" v-model="point1[2]" step="0.1" min="0" max="16" @change="updateFace(point1)">
                        </div>
                    </div>
                    <div class="option">
                        <label for="point2">
                            Point 2
                        </label>

                        <div class="group">
                            <input type="number" id="point2" v-model="point2[0]" step="0.1" min="0" max="16" @change="updateFace(point2)">
                            <input type="number" id="point2" v-model="point2[1]" step="0.1" min="0" max="16" @change="updateFace(point2)">
                            <input type="number" id="point2" v-model="point2[2]" step="0.1" min="0" max="16" @change="updateFace(point2)">
                        </div>
                    </div>
                    <div class="option">
                        <label for="point3">
                            Point 3
                        </label>

                        <div class="group">
                            <input type="number" id="point3" v-model="point3[0]" step="0.1" min="0" max="16" @change="updateFace(point3)">
                            <input type="number" id="point3" v-model="point3[1]" step="0.1" min="0" max="16" @change="updateFace(point3)">
                            <input type="number" id="point3" v-model="point3[2]" step="0.1" min="0" max="16" @change="updateFace(point3)">
                        </div>
                    </div>

                    <div class="option">
                        <!-- <label>Wireframe</label>÷ -->
                        <span>
                            <input type="checkbox" id="checkbox-v0" value="true" v-model="wireframe" v-on:change="updateCubeWireframe()">
                            <label for="checkbox-v0">
                                Wireframe
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
            point1: [0,0,0],
            point2: [0,1,0],
            point3: [0,1,1],
            wireframe: true,
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

            if (!this.wireframe) {
                cube.material = new THREE.MeshLambertMaterial({color: 0xff0066, wireframe: false});
            } else {
                cube.material = new THREE.MeshLambertMaterial({color: 0xff0066, wireframe: true});
            }
        },
        updateFace() {
            var face = _.find(three.scene.children, {type:"Mesh"});
            console.log(face);
            var positions = [].concat(this.point1, this.point2, this.point3)

            // console.log(positions);
            this.geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
            this.geometry.computeVertexNormals();
            // cube.scale.x = cubesize
            // cube.scale.y = cubesize
            // cube.scale.z = cubesize
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

        this.geometry = new THREE.BufferGeometry();
        // var geometry = new THREE.BoxGeometry(1,1,1);
        // this.point1 = [0,0,0]
        var positions = [].concat(this.point1, this.point2, this.point3)

        // console.log(positions);
        this.geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
        this.geometry.computeVertexNormals();

        var material = new THREE.MeshLambertMaterial({color: 0xff0066, wireframe: this.wireframe});
        var mesh = new THREE.Mesh(this.geometry, material);
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

        .group {
            input {
                width: 64px;
                margin-right: 8px;
            }
        }
    }
</style>
