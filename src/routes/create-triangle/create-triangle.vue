<template>

    <div class="create-triangle">
        <header class="title">
            <h1>Create triangle</h1>
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
                            Point 1 <small>[x,y,z]</small>
                        </label>

                        <div class="group">
                            <input type="number" id="point1" v-model="point1[0]" step="0.1" min="0" max="16" @change="updateTriangle(point1)">
                            <input type="number" id="point1" v-model="point1[1]" step="0.1" min="0" max="16" @change="updateTriangle(point1)">
                            <input type="number" id="point1" v-model="point1[2]" step="0.1" min="0" max="16" @change="updateTriangle(point1)">
                        </div>
                    </div>
                    <div class="option">
                        <label for="point2">
                            Point 2 <small>[x,y,z]</small>
                        </label>

                        <div class="group">
                            <input type="number" id="point2" v-model="point2[0]" step="0.1" min="0" max="16" @change="updateTriangle(point2)">
                            <input type="number" id="point2" v-model="point2[1]" step="0.1" min="0" max="16" @change="updateTriangle(point2)">
                            <input type="number" id="point2" v-model="point2[2]" step="0.1" min="0" max="16" @change="updateTriangle(point2)">
                        </div>
                    </div>
                    <div class="option">
                        <label for="point3">
                            Point 3 <small>[x,y,z]</small>
                        </label>

                        <div class="group">
                            <input type="number" id="point3" v-model="point3[0]" step="0.1" min="0" max="16" @change="updateTriangle(point3)">
                            <input type="number" id="point3" v-model="point3[1]" step="0.1" min="0" max="16" @change="updateTriangle(point3)">
                            <input type="number" id="point3" v-model="point3[2]" step="0.1" min="0" max="16" @change="updateTriangle(point3)">
                        </div>
                    </div>

                    <div class="option">
                        <!-- <label>Wireframe</label>÷ -->
                        <span>
                            <input type="checkbox" id="checkbox-v0" value="true" v-model="wireframe" v-on:change="toggleWireframe()">
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
import view from './../../services/3d-view.js';

var three = view.init({orbitControls: true})


export default {
    props: [],
    data() {
        return {
            animation: true,
            wireframe: true,

            point1: [0,0,0],
            point2: [0,1,0],
            point3: [0,1,1],
        }
    },
    methods: {
        init(){
            // Rendering scene
            var that = this;
            function animate(index) {
                if (!that.animation) {
                    return;
                }
                three.renderer.render(three.scene, three.camera);

                stats.update();

                requestAnimationFrame(animate);
            }

            // Helper for displaying FPS
            var stats = new Stats();
            stats.dom.className = "viewport-stats"
            this.$el.querySelector(".viewport-content").append( stats.dom );


            // Enable animation loop
            this.animation = true;
            animate();

            // Add scene to dom
            this.$el.querySelector(".viewport-content").append(three.renderer.domElement );

            // Helper function for updating scene on screen resizing
            window.addEventListener('resize', () => {this.updateCanvasSize(three.camera, three.renderer)});
            window.dispatchEvent(new Event("resize"));
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
        },
        toggleWireframe() {
            var obj = _.find(three.scene.children, {type:"Mesh"});

            if (this.wireframe) {
                obj.material = new THREE.MeshBasicMaterial({color: 0xff0066, wireframe: true});
            } else {
                obj.material = new THREE.MeshLambertMaterial({color: 0xff0066, wireframe: false});
            }
        },
        updateTriangle() {
            var positions = [].concat(this.point1, this.point2, this.point3)

            this.geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
            this.geometry.computeVertexNormals();
        }
    },
    mounted() {
        this.init();

        // Prevent multiple camera's / meshes to be added
        if (three.scene.initialised) {
            this.geometry = _.find(three.scene.children, {type:"Mesh"}).geometry;
            var pos = this.geometry.getAttribute("position").array;

            this.point1 = [pos[0],pos[1],pos[2]];
            this.point2 = [pos[3],pos[4],pos[5]];
            this.point3 = [pos[6],pos[7],pos[8]];
            return;
        }
        // Everything below will only be added the first time that this component is mounted


        // Set camera
        three.camera.position.z = 2.4
        three.camera.position.y = 2.4
        three.camera.position.x = 2.4
        three.camera.lookAt(0,0,0)
        three.scene.add(three.camera)

        // Create object
        this.geometry = new THREE.BufferGeometry();
        var mesh = new THREE.Mesh(this.geometry);
        three.scene.add(mesh);
        this.toggleWireframe();
        this.updateTriangle();


        three.scene.initialised = true;
    },
    unmounted() {
        // This destroys the animation loop when navigating to another page
        this.animation = false;
    }
}
</script>


<style lang="scss">
    @import '../../assets/scss/variables.scss';

    .create-triangle {
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
