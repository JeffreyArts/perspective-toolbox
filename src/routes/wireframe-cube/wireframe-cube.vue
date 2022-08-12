<template>

    <div class="wireframe-cube">
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
                            <input type="checkbox" id="checkbox-v0" v-model="wireframe" v-on:change="toggleWireframe()">
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

import Stats from "./../../../node_modules/three/examples/jsm/libs/stats.module.js"
// import { OrbitControls } from './../../../node_modules/three/examples/jsm/controls/OrbitControls.js';
import view from "./../../services/3d-view.js"

var three = view.init({orbitControls: true})


export default {
    props: [],
    data() {
        return {
            animation: true,
            wireframe: true,
            
            cubesize: 1,
        }
    },
    mounted() {
        this.init()

        // Prevent multiple camera's / meshes to be added
        if (three.scene.initialised) {
            this.mesh = _.find(three.scene.children, {type:"Mesh"})
            return
        }
        // Everything below will only be added the first time that this component is mounted


        // Set camera
        three.camera.position.z = 2.4
        three.camera.position.y = 2.4
        three.camera.position.x = 2.4
        three.camera.lookAt(0,0,0)
        three.scene.add(three.camera)


        // Create object
        var geometry = new THREE.BoxGeometry(1,1,1)
        this.mesh = new THREE.Mesh(geometry)
        three.scene.add(this.mesh)
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
                this.mesh.material = new THREE.MeshBasicMaterial({color: 0xff0066, wireframe: true})
            } else {
                this.mesh.material = new THREE.MeshLambertMaterial({color: 0xff0066, wireframe: false})
            }
        },
        updateCubeSize(cubesize) {
            var cube = _.find(three.scene.children, {type:"Mesh"})
            cube.scale.x = cubesize
            cube.scale.y = cubesize
            cube.scale.z = cubesize
        },
    }
}
</script>


<style lang="scss">

    @import '../../assets/scss/variables.scss';

    .wireframe-cube {
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
