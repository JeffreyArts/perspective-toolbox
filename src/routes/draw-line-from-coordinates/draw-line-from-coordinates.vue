<template>

    <div class="draw-line-from-coordinates">
        <header class="title">
            <h1>Draw line from coordinates</h1>
        </header>

        <hr>
        <section class="viewport">
            <div class="viewport-content" ratio="1x1" />
        </section>

        <aside class="sidebar">
            <div class="options">

                <div class="option-group" name="Lines">
                    <label for="line1">
                        <h1>Line 1 <small>pink</small></h1>
                    </label>
                    <div class="option">
                        <label for="line1">
                            Start
                        </label>
                        <div class="group">
                            x: <input type="number" id="line1" v-model="line1.start.x" step="1" min="0" max="16" @change="updateLines( )">&nbsp;
                            y: <input type="number" id="line1" v-model="line1.start.y" step="1" min="0" max="16" @change="updateLines( )">
                        </div>
                    </div>
                    <div class="option">
                        <label for="line1">
                            End
                        </label>
                        <div class="group">
                            x: <input type="number" id="line1" v-model="line1.end.x" step="1" min="0" max="16" @change="updateLines( )">&nbsp;
                            y: <input type="number" id="line1" v-model="line1.end.y" step="1" min="0" max="16" @change="updateLines( )">
                        </div>
                    </div>
                    <div class="option">
                        <label for="line1">
                            Side
                        </label>
                        <div class="group">
                            <select name="line1side" v-model="line1.side" @change="updateLines( )">
                                <option v-for="(side, index) in sides" :value="side" :key="index">{{side}}</option>
                            </select>
                        </div>
                    </div>
                    <hr />
                    <label for="line2">
                        <h1>Line 2 <small>purple</small></h1>
                    </label>
                    <div class="option">
                        <label for="line2">
                            Start
                        </label>
                        <div class="group">
                            x: <input type="number" id="line2" v-model="line2.start.x" step="1" min="0" max="16" @change="updateLines( )">&nbsp;
                            y: <input type="number" id="line2" v-model="line2.start.y" step="1" min="0" max="16" @change="updateLines( )">
                        </div>
                    </div>
                    <div class="option">
                        <label for="line2">
                            End
                        </label>
                        <div class="group">
                            x: <input type="number" id="line2" v-model="line2.end.x" step="1" min="0" max="16" @change="updateLines( )">&nbsp;
                            y: <input type="number" id="line2" v-model="line2.end.y" step="1" min="0" max="16" @change="updateLines( )">
                        </div>
                    </div>
                    <div class="option">
                        <label for="line2">
                            Side
                        </label>
                        <div class="group">
                            <select name="line2side" v-model="line2.side" @change="updateLines( )">
                                <option v-for="(side, index) in sides" :value="side" :key="index">{{side}}</option>
                            </select>
                        </div>
                    </div>
                    
                    <hr />
                    
                    <div class="option">
                        <!-- <label>Wireframe</label>÷ -->
                        <span>
                            <input type="checkbox" id="checkbox-v0" v-model="helperCubeVisibility" v-on:change="toggleHelperCube()">
                            <label for="checkbox-v0">
                                Helper cube
                            </label>
                        </span>
                    </div>
                    <div class="option">
                        <span>
                            <input type="checkbox" id="checkbox-v1" v-model="animateLines">
                            <label for="checkbox-v1">
                                Animate lines
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

import TWEEN from "@tweenjs/tween.js"
import Stats from "./../../../node_modules/three/examples/jsm/libs/stats.module.js"
import view from "../../services/3d-view.js"
import Line from "../../services/line.js"

var three = view.init({orbitControls: true})


export default {
    props: [],
    data() {
        return {
            animation: true,
            animateLines: true,
            wireframe: true,
            transitionDuration: 512,
            lineThickness: .25,
            helperCubeVisibility: true,
            sides: ["left","right","front","back","top","bottom"],
            cube: {
                width: 5,
                height: 5,
                depth: 5,
            },
            line1: {
                start: {
                    x: 1,
                    y: 0,
                },
                end: {
                    x: 0,
                    y: 0,
                },
                color:"#ff0066",
                thickness: this.lineThickness,
                length: 0,
                rotation: {},
                position: {},
                side: "left"
            },
            line2: {
                start: {
                    x: 0,
                    y: 0,
                },
                end: {
                    x: 0,
                    y: 1,
                },
                color:"#6600ff",
                thickness: this.lineThickness,
                length: 0,
                rotation: {},
                position: {},
                side: "right"
            },
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

        
        // Set camera in front position
        three.camera.position.z = this.cube.depth/2
        three.camera.position.y = this.cube.height*4
        three.camera.position.x = this.cube.width/2
        three.camera.lookAt(this.cube.width/2, this.cube.height/2, this.cube.depth/2)
        three.scene.add(three.camera)


        // Create object
        this.createHelperCube()
        
        const cube = new THREE.Group()
        cube.name = "cube"
        three.scene.add(cube)

        const line1 = Line.create(this.line1, this.cube)
        line1.rotation.setFromVector3( line1.data.rotation )
        line1.position.copy( line1.data.position )
        line1.scale.copy( line1.data.scale )

        const line2 = Line.create(this.line2, this.cube)
        
        line2.rotation.setFromVector3( line2.data.rotation )
        line2.position.copy( line2.data.position )
        line2.scale.copy( line2.data.scale )

        cube.add(line1)
        cube.add(line2)
        
        this.updateLines()


        three.controls.target.set((this.cube.width-1)/2, (this.cube.height-1)/2, (this.cube.depth-1)/2)
        three.camera.lookAt(three.controls.target)
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
        createHelperCube() {
            const helperCube = new THREE.Group()
            helperCube.name = "helper-cube"
            let sphere = null
            // Create bottom face
            for (var x=0; x<this.cube.width; x++) {
                for (var y=0; y<this.cube.height; y++) {
                    sphere = new THREE.Mesh(new THREE.SphereGeometry( 0.01, 32, 16 ), new THREE.MeshBasicMaterial({color: 0xff0066, wireframe: true}))
                    sphere.position.x = x
                    sphere.position.y = y
                    sphere.position.z = 0
                    helperCube.add(sphere.clone())

                    sphere.position.x = x
                    sphere.position.y = 0
                    sphere.position.z = y
                    helperCube.add(sphere.clone())

                    sphere.position.x = 0
                    sphere.position.y = x
                    sphere.position.z = y
                    helperCube.add(sphere.clone())

                    sphere.position.x = x
                    sphere.position.y = y
                    sphere.position.z = this.cube.depth -1
                    helperCube.add(sphere.clone())

                    sphere.position.x = this.cube.depth -1
                    sphere.position.y = x
                    sphere.position.z = y
                    helperCube.add(sphere.clone())

                    sphere.position.x = x
                    sphere.position.y = this.cube.depth -1
                    sphere.position.z = y
                    helperCube.add(sphere.clone())
                    
                }
            }
            three.scene.add(helperCube)
        },
        updateLines(delay = 0) {
            const cube = _.find(three.scene.children, {name: "cube"})
            var cuboidLines = [
                Line.create(this.line1, this.cube),
                Line.create(this.line2, this.cube)
            ]

            _.each(cuboidLines, (line, lineIndex) => {
                line.rotation.setFromVector3( line.data.rotation )
                line.position.copy( line.data.position )
                line.scale.copy( line.data.scale )
            })

            _.each(cube.children, (line, lineIndex) => {
                if (!cuboidLines[lineIndex]) {
                    line.visible = false
                    return
                }

                if (line.visible == false) {
                    line.visible = true
                }

                setTimeout(() => {
                    new TWEEN.Tween( cube.children[lineIndex].scale  )   
                        .to( cuboidLines[lineIndex].scale, this.transitionDuration )
                        .easing( TWEEN.Easing.Back.InOut )
                        .start()

                    new TWEEN.Tween( cube.children[lineIndex].position  )   
                        .to( cuboidLines[lineIndex].position, this.transitionDuration )
                        .easing( TWEEN.Easing.Back.InOut )
                        .start()                    

                    new TWEEN.Tween(cube.children[lineIndex].rotation)   
                        .to({
                            x: cuboidLines[lineIndex].rotation.x,
                            z: cuboidLines[lineIndex].rotation.z,
                            y: cuboidLines[lineIndex].rotation.y
                        }, this.transitionDuration )
                        .easing( TWEEN.Easing.Back.InOut )
                        .start()
                }, lineIndex * delay)
                
            })
        },
        toggleHelperCube() {
            var helperCube = _.find(three.scene.children, {name:"helper-cube"})
            helperCube.visible = this.helperCubeVisibility
        },
    }
}
</script>


<style lang="scss">

    @import '../../assets/scss/variables.scss';

    .draw-line-from-coordinates {
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
