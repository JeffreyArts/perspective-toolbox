<template>
    <div class="tube">
        <header class="title">
            <h1>Tube</h1>
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
                    <div class="option">
                        <span>
                            <label for="radialSegments">
                                Radial segments
                            </label>
                            <input type="number" id="radialSegments" v-model.number="radialSegments" step="1" min="3" max="16" v-on:change="updateLine()">
                        </span>
                    </div>
                    <div class="option">
                        <span>
                            <label for="radius">
                                Radius
                            </label>
                            <input type="number" id="radius" v-model.number="radius" step=".1" min=".1" max="10" v-on:change="updateLine()">
                        </span>
                    </div>
                    <div class="option">
                        <span>
                            <label for="tubularSegments">
                                Tubular segments
                            </label>
                            <input type="number" id="tubularSegments" v-model.number="tubularSegments" step="1" min="1" max="10" v-on:change="updateLine()">
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
import * as THREE from "three"
import _ from "lodash"

import * as BufferGeometryUtils from "./../../../node_modules/three/examples/jsm/utils/BufferGeometryUtils.js"
import { ConvexGeometry } from "./../../../node_modules/three/examples/jsm/geometries/ConvexGeometry.js"
import Stats from "./../../../node_modules/three/examples/jsm/libs/stats.module.js"
import view from "../../services/3d-view.js"
import dotImage from "./../../assets/images/dot.png"

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
            radialSegments: 8,
            tubularSegments: 2,
            p1: new THREE.Vector3(0,0,0),
            p2: new THREE.Vector3(0,8,0),
        }
    },
    mounted() {
        this.init()

        // Prevent multiple camera's / meshes to be added
        if (three.scene.initialised) {
            this.model3D = _.find(three.scene.children, {type:"Mesh"}).geometry
            // var pos = this.model3D.getAttribute("position").array;
            return
        }
        // Everything below will only be added the first time that this component is mounted

        // Set camera
        three.camera.position.z = 48
        three.camera.position.y = 48
        three.camera.position.x = 0
        three.camera.lookAt(0,0,0)
        three.scene.add(three.camera)

        // Create object
        this.createModel()
        
       
        // Features
        this.toggleWireframe()


        three.scene.initialised = true
    },
    unmounted() {
        // This destroys the animation loop when navigating to another page
        this.animation = false
    },
    methods: {
        init(){
            // Rendering scene
            var that = this
            function animate(index) {
                if (!that.animation) {
                    return
                }
                three.renderer.render(three.scene, three.camera)

                stats.update()

                requestAnimationFrame(animate)
            }

            // Helper for displaying FPS
            var stats = new Stats()
            stats.dom.className = "viewport-stats"
            this.$el.querySelector(".viewport-content").append( stats.dom )


            // Enable animation loop
            this.animation = true
            animate()

            // Add scene to dom
            this.$el.querySelector(".viewport-content").append(three.renderer.domElement )

            // Helper function for updating scene on screen resizing
            window.addEventListener("resize", () => {this.updateCanvasSize(three.camera, three.renderer)})
            window.dispatchEvent(new Event("resize"))
        },
        updateCanvasSize(camera, renderer) {
            var width = this.$el.clientWidth
            var height = this.$el.clientWidth

            renderer.setSize( width, height)
            camera.bottom = -height
            camera.top = height
            camera.left = -width
            camera.right = width

            camera.updateProjectionMatrix()
        },
        toggleWireframe() {
            if (this.wireframe) {
                this.model3D.material = new THREE.MeshBasicMaterial({color: 0xff0066, wireframe: true})
            } else {
                this.model3D.material = new THREE.MeshLambertMaterial({color: 0xff0066, wireframe: false})
            }
        },
        createModel() {
            // this.model3D = new THREE.Group();
            
            this.line = new THREE.LineCurve3( this.p1,  this.p2 )
            const tubeGeometry = new THREE.TubeBufferGeometry( this.line, this.tubularSegments, this.radius, this.radialSegments, false)
            this.model3D = new THREE.Mesh( tubeGeometry )
            
            three.scene.add(this.model3D)
        },
        updateLine() {
            this.model3D.geometry = new THREE.TubeBufferGeometry(this.line, this.tubularSegments, this.radius, this.radialSegments, false)
        }
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

        .group {
            input {
                width: 64px;
                margin-right: 8px;
            }
        }
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
