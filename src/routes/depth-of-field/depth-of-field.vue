<template>

    <div class="depth-of-field">
        <header class="title">
            <h1>Depth of field</h1>
        </header>

        <hr>
        <section class="viewport">
            <div class="viewport-content" ratio="1x1" />
        </section>

        <aside class="sidebar">
            <div class="options">

                <div class="option-group" name="Camera">
                    <div class="option">
                        <label for="far">
                            Far
                        </label>
                        <input type="range" id="far" v-model.number="far" step="1" min="1" max="1600" @change="addGrid()">
                        <input type="number"  min="1" max="16" v-model.number="far" @change="addGrid()">
                    </div>
                </div>

                <div class="option-group" name="Cubes">
                    <div class="option">
                        <label for="spacing">
                            Spacing
                        </label>
                        <input type="range" id="spacing" v-model.number="spacing" step="1" min="1" max="16" @change="addGrid()">
                        <input type="number"  min="1" max="16" v-model.number="spacing" @change="addGrid()">
                    </div>
                    <div class="option">
                        <label for="scatter">
                            Scattering
                        </label>
                        <input type="range" id="scatter" v-model.number="scatter" step="0.05" min="0" :max="16" @change="addGrid()">
                        <input type="number" min="0" step="0.05" :max="16" v-model.number="scatter" @change="addGrid()">
                    </div>
                    <div class="option column-group">
                        <div class="column">
                            <label for="rows">
                                Rows
                            </label>
                            <input type="number" id="rows" v-model.number="rows" step="1" min="1" max="32" v-on:change="addGrid()">
                        </div>
                        <div class="column">
                            <label for="columns">
                                Columns
                            </label>
                            <input type="number" id="columns" v-model.number="columns" step="1" min="1" max="32" v-on:change="addGrid()">
                        </div>
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

import { EffectComposer } from './../../../node_modules/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './../../../node_modules/three/examples/jsm/postprocessing/RenderPass.js';
import { BokehPass } from './../../../node_modules/three/examples/jsm/postprocessing/BokehPass.js';

var three = view.init({orbitControls: true})
const postprocessing = {};

export default {
    props: [],
    data() {
        return {
            animation: true,            
            far: 160,
            cubesize: 1,
            spacing: 8,
            scatter: 0,
            rows: 16,
            columns: 16,
            effectController: {
                focus: 500.0,
                aperture: 5,
                maxblur: 0.01
            }	
        }
    },
    watch: {
        far(newVal, oldVal) {
            three.camera.far = newVal;
            three.camera.updateProjectionMatrix();
            
        }
    },
    methods: {
        init(){
            three.renderer.autoClear = false;
            // Depth of field dof
            this.initPostprocessing();

            // Rendering scene
            var that = this;
            function animate(index) {
                if (!that.animation) {
                    return;
                }
                three.renderer.render(three.scene, three.camera);

                stats.update();

                postprocessing.composer.render( 0.1 );
                requestAnimationFrame(animate);
            }
            

            // Helper for displaying FPS
            var stats = new Stats();
            stats.dom.className = "viewport-stats"
            this.$el.querySelector(".viewport-content").append( stats.dom );


            // Add scene to dom
            this.$el.querySelector(".viewport-content").append(three.renderer.domElement );

            // Helper function for updating scene on screen resizing
            window.addEventListener('resize', () => {this.updateCanvasSize(three.camera, three.renderer)});
            window.dispatchEvent(new Event("resize"));


            // Enable animation loop
            this.animation = true;
            animate();
        },
        initPostprocessing() {

            const renderPass = new RenderPass( three.scene, three.camera );

            const bokehPass = new BokehPass( three.scene, three.camera, {
                focus: 16,
                aperture: 0.0001,
                maxblur: 128,
                width: this.$el.clientWidth,
                height: this.$el.clientHeight
            } );

            const composer = new EffectComposer( three.renderer );

            composer.addPass( renderPass );
            composer.addPass( bokehPass );

            postprocessing.composer = composer;
            postprocessing.bokeh = bokehPass;
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

            postprocessing.composer.setSize( width, height );
        },
        addGrid() {
            for (let i = three.scene.children.length - 1; i >= 0; i--) {
                if(three.scene.children[i].type === "Mesh") {
                    three.scene.children[i].geometry.dispose();
                    three.scene.children[i].material.dispose();
                    three.scene.remove(three.scene.children[i]);
                }
            }
            
            // Create object
            var startHor = -this.rows*this.spacing;
            var startVert = -this.columns*this.spacing;
            for (var hor=0; hor < this.rows; hor++) {
                startVert = -this.columns*this.spacing;

                for (var vert=0; vert < this.columns; vert++) {
                    var geometry = new THREE.BoxGeometry(1,1,1);
                    var material = new THREE.MeshLambertMaterial({color: `rgb(${Math.round(128*(hor/this.rows))+64},0, ${Math.round(128*(vert/this.columns))+64})`, wireframe: false});
                    var mesh = new THREE.Mesh(geometry, material);
                    mesh.position.x = hor*this.spacing + startHor + Math.random()*this.scatter - this.scatter/2;
                    mesh.position.z = vert*this.spacing + startVert + Math.random()*this.scatter - this.scatter/2;
                    three.scene.add(mesh);
                    startVert += this.spacing;
                }
                startHor += this.spacing;
            }
        },
        updateCubeSize(cubesize) {
            var cube = _.find(three.scene.children, {type:"Mesh"});
            cube.scale.x = cubesize
            cube.scale.y = cubesize
            cube.scale.z = cubesize
        },
    },
    mounted() {
        this.init();

        // Prevent multiple camera's / meshes to be added
        if (three.scene.initialised) {
            // this.mesh = _.find(three.scene.children, {type:"Mesh"});
            return;
        }
        // Everything below will only be added the first time that this component is mounted
        this.addGrid()

        // Set camera
        three.camera.position.z = 2.4
        three.camera.position.y = 2.4
        three.camera.position.x = 2.4
        three.camera.lookAt(0,0,0)
        three.scene.add(three.camera)

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

    .depth-of-field {
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

        .column-group {
            display: flex;

            input {
                width: 64px;
            }
            .column {
                display: flex;
                flex-flow: column;
                + .column {  
                    margin-left: 16px;
                }
            }
        }
    }
</style>
