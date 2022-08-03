<template>
    <div class="tube">
        <header class="title">
            <h1>Tubes performance</h1>
        </header>

        <hr>
        <section class="viewport">
            <div class="viewport-content" ratio="1x1" />
            <span class="source">
                source:
                <a href="https://threejs.org/manual/#en/primitives#Diagram-TubeGeometry">ThreeJS Manual - TubeGeometry</a>
            </span>
        </section>

        <aside class="sidebar">
            <div class="options">

                <div class="option-group" name="Coordinates">

                    <div class="option">
                        <label for="point1">
                            Point 1 <small>[x,y,z]</small>
                        </label>

                        <div class="group">
                            <input type="number" id="point1" v-model="p1.x" step="0.1" min="0" max="16" v-on:change="updateLine()">
                            <input type="number" id="point1" v-model="p1.y" step="0.1" min="0" max="16" v-on:change="updateLine()">
                            <input type="number" id="point1" v-model="p1.z" step="0.1" min="0" max="16" v-on:change="updateLine()">
                        </div>

                    </div>
                    <div class="option">
                        <label for="point1">
                            Point 2 <small>[x,y,z]</small>
                        </label>

                        <div class="group">
                            <input type="number" id="point1" v-model="p2.x" step="0.1" min="0" max="16" v-on:change="updateLine()">
                            <input type="number" id="point1" v-model="p2.y" step="0.1" min="0" max="16" v-on:change="updateLine()">
                            <input type="number" id="point1" v-model="p2.z" step="0.1" min="0" max="16" v-on:change="updateLine()">
                        </div>
                    </div>
                </div>
                <div class="option-group" name="Model properties">
                    <div class="option column-group">
                        <span>
                            <label for="radius">
                                Radius
                            </label>
                            <input type="number" id="radius" v-model.number="radius" step=".1" min=".1" max="10" v-on:change="updateLine()">
                        </span>
                        <span>
                            <label for="radialSegments">
                                Radial segments
                            </label>
                            <input type="number" id="radialSegments" v-model.number="radialSegments" step="1" min="3" max="16" v-on:change="updateLine()">
                        </span>
                        <span>
                            <label for="tubularSegments">
                                Tubular segments
                            </label>
                            <input type="number" id="tubularSegments" v-model.number="tubularSegments" step="1" min="1" max="10" v-on:change="updateLine()">
                        </span>
                    </div>
                    <div class="option column-group">
                        <span class="column">
                            <label for="rows">
                                Rows
                            </label>
                            <input type="number" id="rows" v-model.number="rows" step="1" min="1" max="10" v-on:change="createModels()">
                        </span>
                        <span class="column">
                            <label for="columns">
                                Columns
                            </label>
                            <input type="number" id="columns" v-model.number="columns" step="1" min="1" max="10" v-on:change="createModels()">
                        </span>
                    </div>
                    <div class="option">
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
import TWEEN from '@tweenjs/tween.js';

import Stats from './../../../node_modules/three/examples/jsm/libs/stats.module.js';
import view from '../../services/3d-view.js';

var three = view.init({orbitControls: true})


export default {
    props: [],
    data() {
        return {
            model: null,
            animation: true,
            wireframe: true,
            line: null,
            radius: 1,
            rows: 1,
            columns: 1,
            radialSegments: 8,
            tubularSegments: 2,
            material: null,
            p1: new THREE.Vector3(0,0,0),
            p2: new THREE.Vector3(0,8,0),
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
                that.updateLine()
                stats.update();
                TWEEN.update(index)
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
            if (this.wireframe) {
                this.material = new THREE.MeshBasicMaterial({color: 0xff0066, wireframe: true});
            } else {
                this.material = new THREE.MeshLambertMaterial({color: 0xff0066, wireframe: false});
            }
        },
        createModels() {
            for (let i = three.scene.children.length - 1; i >= 0; i--) {
                if(three.scene.children[i].type === "Mesh") {
                    three.scene.children[i].geometry.dispose();
                    three.scene.remove(three.scene.children[i]);
                }
            }
            three.renderer.renderLists.dispose();
            this.line = new THREE.LineCurve3( this.p1,  this.p2 )
            const tubeGeometry = new THREE.TubeBufferGeometry( this.line, this.tubularSegments, this.radius, this.radialSegments, false);
            this.model3D = new THREE.Mesh( tubeGeometry, this.material );
            var width = this.rows
            var height = this.columns
            for (var x=0; x<width; x++) {
                for (var y=0; y<height; y++) {
                    var newModel = this.model3D.clone()
                    newModel.position.x = x*4 - width*4/2;
                    newModel.position.z = y*4 - height*4/2;
                    three.scene.add(newModel);
                }
            }
        },
        startAnimation() {
            var radius = 5;
            const tween = new TWEEN.Tween({angle:0}) // Create a new tween that modifies 'coords'.
                .to({angle:360}, 1600) // Move to (300, 200) in 1 second.
                .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
                .repeat(Infinity)
                // .yoyo()
                .onUpdate((v,i) => {
                    this.p2.x = radius * Math.sin(Math.PI * 2 * v.angle / 360);
                    this.p2.z = radius * Math.cos(Math.PI * 2 * v.angle / 360);
                    this.updateLine();
                })
                .start() // Start the tween immediately.
        },
        updateLine() {
            _.each(three.scene.children, model => {
                if (model.type == "Mesh") {
                    model.geometry = new THREE.TubeBufferGeometry(this.line, this.tubularSegments, this.radius, this.radialSegments, false)
                }
            } )
        }
    },
    mounted() {
        this.init();

        // Prevent multiple camera's / meshes to be added
        if (three.scene.initialised) {
            this.model3D = _.find(three.scene.children, {type:"Mesh"}).geometry;
            // var pos = this.model3D.getAttribute("position").array;
            return;
        }
        // Everything below will only be added the first time that this component is mounted

        // Set camera
        three.camera.position.z = 0
        three.camera.position.y = 48
        three.camera.position.x = 0
        three.camera.lookAt(0,0,0)
        three.scene.add(three.camera)

        this.toggleWireframe();

        // Create object
        this.createModels();
        this.startAnimation();


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

    .tube {
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
        }
        // .column {
        //     width: 50%;
        //     display: inline-block;
        // }
        .source {
            text-align: center;
            width: 100%;
            margin-top: 32px;
            font-size: 12px;
            display: inline-block;
                
            a {
                text-decoration: none;
                color :#fff;
                display: inline-block;
                transition: .32s all linear;

                &:hover {
                    color: $accentColor;
                    text-decoration: underline;
                    &:after {
                        font-size: .8em;
                        transform: translate(6px, -4px);
                    }
                }
                &:after {
                    content: "↗";
                    font-size: .5em;
                    transform: translate(6px, -5px);
                    transition: .16s all linear;
                    display: inline-block;
                }
            }
        }
    }
</style>
