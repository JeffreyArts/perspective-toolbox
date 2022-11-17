<template>

    <div class="cuboid">
        <header class="title">
            <h1>Cuboid variations test</h1>
        </header>

        <hr>
        <section class="viewport">
            <div class="viewport-content" ratio="1x1" />
        </section>

        <aside class="sidebar">
            <div class="options">

                <div class="option-group" name="Options">
                    <div class="option">
                        <label for="far">
                            Line thickness
                        </label>
                        <input type="range" id="far" v-model.number="lineThickness" step=".01" min="0.01" max="1" @change="updateLineThickness()">
                        <input type="number" step=".01" min="0" max="1" v-model.number="lineThickness" @change="updateLineThickness()">
                    </div>
                    <div class="option">
                        <label for="transitionType">
                            Sensitivity
                            <select name="transitionType" v-model="sensitivity" @change="updateCuboid()">
                                <option v-for="(s,i) in sensitivityScales" :value="s" :key="i">{{s}}</option>
                            </select>
                        </label>
                    </div>
                    <div class="option">
                        <label for="seed">
                            Seed
                            <input type="number" id="seed" v-model="seed" @change="updateCuboid(true)">
                        </label>
                        <label for="delay">
                            Delay
                            <input type="range" id="far" v-model.number="delay" step="1" min="0" max="100" @change="createCuboid(true)">
                            <input type="number" step="1" min="0" max="100" v-model.number="delay" @change="createCuboid(true)">
                        </label>
                    </div>

                    <!-- <div class="option">
                        <button class="button" @click="updateLines(true)" >Shuffle Lines</button>
                    </div> -->

                    <div class="option">
                        <label for="point1">
                            Cube <small>[width,height,depth]</small>
                        </label>

                        <div class="group">
                            <input type="number" id="cubeWidth" v-model.number="cubeDimensions.width" step="1" min="3" max="16" :disabled="sensitivity!='custom'" @change="createCuboid(true)">
                            <input type="number" id="cubeHeight" v-model.number="cubeDimensions.height" step="1" min="3" max="16" :disabled="sensitivity!='custom'" @change="createCuboid(true)">
                            <input type="number" id="cubeDepth" v-model.number="cubeDimensions.depth" step="1" min="3" max="16" :disabled="sensitivity!='custom'" @change="createCuboid(true)">
                        </div>
                    </div>
                    
                    <div class="option">
                        <label for="transitionType">
                            Transition type
                            <select name="transitionType" v-model="transitionType" >
                                <option v-for="(tween, index) in transitionTypes" :value="index" :key="tween">{{index}}</option>
                            </select>
                        </label>
                    </div>
                    <div class="option">
                        <label for="transitionDuration">
                            Transition duration
                            <input name="transitionDuration" v-model.number="transitionDuration" />
                        </label>
                    </div>

                    <hr />
                    
                    <div class="option">
                        <span>
                            <input type="checkbox" id="checkbox-v0" v-model="helperCubeVisibility" v-on:change="toggleHelperCube()">
                            <label for="checkbox-v0">
                                Helper cube
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
import {PolylineAlgorithm, Grid, Polyline} from "visual-pattern-generator"
import TWEEN from "@tweenjs/tween.js"
import Stats from "./../../../node_modules/three/examples/jsm/libs/stats.module.js"
import view from "../../services/3d-view.js"
import Line from "../../services/line.js"
import Cuboid from "../../services/cuboid.js"

var three = view.init({orbitControls: true})

export default {
    name: "cuboidVariationsTest",
    props: [],
    data() {
        return {
            animation: true,
            transitionDuration: 1600,
            lineThickness: .25,
            helperCubeVisibility: false,
            delay: 0,
            seed: Math.floor(Math.random()*9000+1000).toString(),
            sensitivity: "abstract",
            sensitivityScales: ["abstract","non-identity","identity","open", "custom"],
            sides: ["left","right","front","back","top","bottom"],
            cubeDimensions: {
                width: 5,
                height: 5,
                depth: 5,
            },
            cuboidLines: [],
            query: {
                left: {},
                right: {},
                bottom: {},
                top: {},
                front: {},
                back: {},
            },
            transitionType: "Exponential.Out",
            transitionTypes: {
                "Linear.None": TWEEN.Easing.Linear.None,
                "Quintic.In": TWEEN.Easing.Quintic.In,
                "Quintic.Out": TWEEN.Easing.Quintic.Out,
                "Quintic.InOut": TWEEN.Easing.Quintic.InOut,
                "Cubic.In": TWEEN.Easing.Cubic.In,
                "Cubic.Out": TWEEN.Easing.Cubic.Out,
                "Cubic.InOut": TWEEN.Easing.Cubic.InOut,
                "Quartic.In": TWEEN.Easing.Quartic.In,
                "Quartic.Out": TWEEN.Easing.Quartic.Out,
                "Quartic.InOut": TWEEN.Easing.Quartic.InOut,
                "Quintic.In": TWEEN.Easing.Quintic.In,
                "Quintic.Out": TWEEN.Easing.Quintic.Out,
                "Quintic.InOut": TWEEN.Easing.Quintic.InOut,
                "Sinusoidal.In": TWEEN.Easing.Sinusoidal.In,
                "Sinusoidal.Out": TWEEN.Easing.Sinusoidal.Out,
                "Sinusoidal.InOut": TWEEN.Easing.Sinusoidal.InOut,
                "Exponential.In": TWEEN.Easing.Exponential.In,
                "Exponential.Out": TWEEN.Easing.Exponential.Out,
                "Exponential.InOut": TWEEN.Easing.Exponential.InOut,
                "Circular.In": TWEEN.Easing.Circular.In,
                "Circular.Out": TWEEN.Easing.Circular.Out,
                "Circular.InOut": TWEEN.Easing.Circular.InOut,
                "Elastic.In": TWEEN.Easing.Elastic.In,
                "Elastic.Out": TWEEN.Easing.Elastic.Out,
                "Elastic.InOut": TWEEN.Easing.Elastic.InOut,
                "Back.In": TWEEN.Easing.Back.In,
                "Back.Out": TWEEN.Easing.Back.Out,
                "Back.InOut": TWEEN.Easing.Back.InOut,
                "Bounce.In": TWEEN.Easing.Bounce.In,
                "Bounce.Out": TWEEN.Easing.Bounce.Out,
                "Bounce.InOut": TWEEN.Easing.Bounce.InOut,
            }
        }
    },
    mounted() {
        this.init()

        // Prevent multiple camera's / meshes to be added
        // Everything after this if statement will only be added the first time that this component is mounted
        if (three.scene.initialised) {
            this.mesh = _.find(three.scene.children, {type:"Mesh"})
            return
        }


        // Set camera in front position
        three.camera.position.z = this.cubeDimensions.depth*4
        three.camera.position.y = this.cubeDimensions.height/2
        three.camera.position.x = this.cubeDimensions.width/2
        three.camera.lookAt(this.cubeDimensions.width/2, this.cubeDimensions.height/2, this.cubeDimensions.depth/2)
        three.scene.add(three.camera)

        // Helper Cuboid
        this.createCuboid()
        
        // Helper cube
        var helperCube = Cuboid.createHelperCube(this.cubeDimensions, {name: "helper-cube"})
        three.scene.add(helperCube)
        this.toggleHelperCube()
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
                TWEEN.update(index)

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
        createCuboid() {
   
            const oldCuboid = Cuboid.get("cuboid", three.scene)
            if (oldCuboid) {
                Cuboid.remove(oldCuboid)
            }

            const newCuboid = Cuboid.create(this.cubeDimensions, {name: "cuboid", maxLines: 1024, color: 0xff0066})
            
            three.scene.add(newCuboid)

            this.cuboidLines = Cuboid.generateCuboidLines(this.cubeDimensions, this.sensitivity, this.seed)

            Cuboid.update(newCuboid, {
                delay: this.delay, 
                cuboidLines: this.cuboidLines,
                transition: this.transitionTypes[this.transitionType], 
                duration: this.transitionDuration
            })
            three.controls.target.set((this.cubeDimensions.width-1)/2, (this.cubeDimensions.height-1)/2, (this.cubeDimensions.depth-1)/2)
            three.camera.lookAt(three.controls.target)
        },
        updateCuboid() {
            const cuboid = Cuboid.get("cuboid", three.scene)
            this.cuboidLines = Cuboid.generateCuboidLines(this.cubeDimensions, this.sensitivity, this.seed)
            Cuboid.update(cuboid, {
                delay: this.delay, 
                cuboidLines: this.cuboidLines,
                transition: this.transitionTypes[this.transitionType], 
                duration: this.transitionDuration
            })
            three.controls.target.set((this.cubeDimensions.width-1)/2, (this.cubeDimensions.height-1)/2, (this.cubeDimensions.depth-1)/2)
            three.camera.lookAt(three.controls.target)
        },
        updateLineThickness() {
            const cuboid = Cuboid.get("cuboid", three.scene)
            _.each(this.cuboidLines, (cuboidLine, lineIndex) => {
                // var newLine = Line.create(_.merge({},cuboidLine, cuboidLine.data, {thickness: this.lineThickness}), this.cube);
                cuboidLine.data.thickness = this.lineThickness
                cuboidLine.data.length = Line.getLength(cuboidLine)
                var newScale = Line.getScale(cuboidLine)

                new TWEEN.Tween( cuboid.children[lineIndex].scale  )   
                    .to( newScale, this.transitionDuration )
                    .easing( this.transitionTypes[this.transitionType] )
                    .start()
            })
        },
        toggleHelperCube() {
            const helperCube = Cuboid.get("helper-cube", three.scene)
            helperCube.visible = this.helperCubeVisibility
        },
    }
}
</script>


<style lang="scss">

    @import '../../assets/scss/variables.scss';

    .cuboid {
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
