<template>

    <div class="line-animation-performance">
        <header class="title">
            <h1>Line animation performance test</h1>
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
                        <input type="range" id="far" v-model.number="lineThickness" step=".01" min="0.01" max="1" @change="updateThickness()">
                        <input type="number"  min="1" max="16" v-model.number="lineThickness" @change="updateThickness()">
                    </div>
                    <div class="option">
                        <label for="far">
                            Amount of Lines
                        </label>
                        <input type="range" id="far" v-model.number="amountOfLines" step="1" min="1" :max="maxLines" @change="createLines(true)">
                        <input type="number"  min="1" :max="maxLines" v-model.number="amountOfLines" @change="createLines(true)">
                    </div>
                    <div class="option">
                        <label for="far">
                            Max Lines
                        </label>
                        <input type="number"  min="1" v-model.number="maxLines" @change="updateMaxLines()">
                    </div>

                    <div class="option">
                        <button class="button" @click="createLines(true)" >Shuffle Lines</button>
                    </div>

                    <div class="option">
                        <label for="point1">
                            Cube <small>[width,height,depth]</small>
                        </label>

                        <div class="group">
                            <input type="number" id="cubeWidth" v-model.number="cube.width" step="1" min="3" max="16" @change="createCuboid(true)">
                            <input type="number" id="cubeHeight" v-model.number="cube.height" step="1" min="3" max="16" @change="createCuboid(true)">
                            <input type="number" id="cubeDepth" v-model.number="cube.depth" step="1" min="3" max="16" @change="createCuboid(true)">
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
                        <!-- <label>Wireframe</label>÷ -->
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
            transitionDuration: 1600,
            lineThickness: .25,
            helperCubeVisibility: false,
            delay: 0,
            amountOfLines: 32,
            maxLines: 320,
            sides: ["left","right","front","back","top","bottom"],
            cube: {
                width: 5,
                height: 5,
                depth: 5,
            },
            cuboidLines: [],
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
        three.camera.position.z = this.cube.depth*4
        three.camera.position.y = this.cube.height/2
        three.camera.position.x = this.cube.width/2
        three.camera.lookAt(this.cube.width/2, this.cube.height/2, this.cube.depth/2)
        three.scene.add(three.camera)
        
        const cube = new THREE.Group()
        cube.name = "cube"
        three.scene.add(cube)


        
        this.createHelperCube()
        this.createCuboid()
        this.createLines(true)
        this.toggleHelperCube()


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
        createCuboid(update = false) {
            const cube = _.find(three.scene.children, {name: "cube"})
            cube.material = new THREE.MeshLambertMaterial({color: "#ff0099", wireframe: false})

            // Clean cube
            for (let i = cube.children.length - 1; i >= 0; i--) {
                if(cube.children[i].type === "Mesh") {
                    cube.children[i].geometry.dispose()
                    cube.children[i].material.dispose()
                }
                cube.remove(cube.children[i])
            }
            
            const lineData = {
                start: {
                    x: 0,
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
                position: {}
            }

            let line = null

            for (let index = 0; index < this.maxLines; index++) {
                line = Line.create(lineData, this.cube)
                cube.add(line)
                line.material = cube.material
                line.rotation.setFromVector3( line.data.rotation )
                line.position.copy( line.data.position )
                line.scale.copy( line.data.scale )
            }

            three.controls.target.set((this.cube.width-1)/2, (this.cube.height-1)/2, (this.cube.depth-1)/2)
            three.camera.lookAt(three.controls.target)
            if (update) {
                this.createLines(true)
            }
        },
        createHelperCube() {

            var helperCube = _.find(three.scene.children, {name: "helper-cube"})
            if (!helperCube) {
                helperCube = new THREE.Group()
                helperCube.name = "helper-cube"
                three.scene.add(helperCube)
            }

            let sphere = new THREE.Mesh(new THREE.SphereGeometry( 0.01, 32, 16 ), new THREE.MeshBasicMaterial({color: 0xcccccc, wireframe: true}))
            
            for (var x=0; x<this.cube.width; x++) {
                for (var y=0; y<this.cube.height; y++) {

                    // Back
                    sphere.position.x = x
                    sphere.position.y = y
                    sphere.position.z = 0
                    helperCube.add(sphere.clone())

                    // Front
                    sphere.position.x = x
                    sphere.position.y = y
                    sphere.position.z = this.cube.depth-1
                    helperCube.add(sphere.clone())
                }
            }
            
            for (var x=0; x<this.cube.depth; x++) {
                for (var y=0; y<this.cube.height; y++) {
                    // Left
                    sphere.position.x = 0
                    sphere.position.y = y
                    sphere.position.z = x
                    helperCube.add(sphere.clone())

                    // Right
                    sphere.position.x = this.cube.width-1
                    sphere.position.y = y
                    sphere.position.z = x
                    helperCube.add(sphere.clone())
                }
            }
            
            for (var x=0; x<this.cube.width; x++) {
                for (var y=0; y<this.cube.depth; y++) {
                    // Bottom
                    sphere.position.x = x
                    sphere.position.y = 0
                    sphere.position.z = y
                    helperCube.add(sphere.clone())

                    // Top
                    sphere.position.x = x
                    sphere.position.y = this.cube.height-1
                    sphere.position.z = y
                    helperCube.add(sphere.clone())
                }
            }

            helperCube.visible = this.helperCubeVisibility
        },
        createLines(update = false) {
            this.cuboidLines.length = 0
            let horizontal, horSize, vertSize, lineData

            for (var i=0; i<this.amountOfLines; i++) {
                lineData = {
                    start: {
                        x: 0,
                        y: 0,
                    },
                    end: {
                        x: 0,
                        y: 1,
                    },
                    color: "#ff0066",
                    thickness: this.lineThickness
                }
                
                lineData.side = this.sides[Math.floor(Math.random()*this.sides.length)]
                horizontal = Math.random() < 0.5
                if (lineData.side == "front" || lineData.side == "back") {
                    horSize = this.cube.width
                    vertSize = this.cube.height
                } else if (lineData.side == "left" || lineData.side == "right") {
                    horSize = this.cube.depth
                    vertSize = this.cube.height
                } else {
                    horSize = this.cube.width
                    vertSize = this.cube.depth
                } 

                if (horizontal) {
                    lineData.start.x = Math.floor(Math.random() * horSize)
                    lineData.end.x = lineData.start.x

                    lineData.start.y = Math.floor(Math.random() * vertSize)
                    lineData.end.y = lineData.start.y
                    
                    while(lineData.end.x == lineData.start.x) {
                        lineData.end.x = Math.floor(Math.random() * horSize)
                    }
                } else {
                    lineData.start.x = Math.floor(Math.random() * horSize)
                    lineData.end.x = lineData.start.x

                    lineData.start.y = Math.floor(Math.random() * vertSize)
                    lineData.end.y = lineData.start.y
                    
                    while(lineData.end.y == lineData.start.y) {
                        lineData.end.y = Math.floor(Math.random() * vertSize)
                    }
                }
                var line = Line.create(lineData, this.cube)

                line.rotation.setFromVector3( line.data.rotation )
                line.position.copy( line.data.position )
                line.scale.copy( line.data.scale )
                
                this.cuboidLines.push(line)
            }

            if(update){
                three.controls.target.set((this.cube.width-1)/2, (this.cube.height-1)/2, (this.cube.depth-1)/2)
                three.camera.lookAt(three.controls.target)
                this.createHelperCube()
                this.updateLines()
            }
            
        },
        updateLines(delay = 0) {
            const cube = _.find(three.scene.children, {name: "cube"})
            this.cuboidLines = _.shuffle(this.cuboidLines)

            _.each(cube.children, (line, lineIndex) => {
                if (!this.cuboidLines[lineIndex]) {
                    line.visible = false
                    return
                }

                if (line.visible == false) {
                    line.visible = true
                }

                setTimeout(() => {
                    new TWEEN.Tween( cube.children[lineIndex].scale  )   
                        .to( this.cuboidLines[lineIndex].scale, this.transitionDuration )
                        .easing( this.transitionTypes[this.transitionType] )
                        .start()

                    new TWEEN.Tween( cube.children[lineIndex].position  )   
                        .to( this.cuboidLines[lineIndex].position, this.transitionDuration )
                        .easing( this.transitionTypes[this.transitionType] )
                        .start()                    

                    new TWEEN.Tween(cube.children[lineIndex].rotation)   
                        .to({
                            x: this.cuboidLines[lineIndex].rotation.x,
                            z: this.cuboidLines[lineIndex].rotation.z,
                            y: this.cuboidLines[lineIndex].rotation.y
                        }, this.transitionDuration )
                        .easing( this.transitionTypes[this.transitionType] )
                        .start()
                }, lineIndex * delay)
                
            })
        },
        toggleHelperCube() {
            var helperCube = _.find(three.scene.children, {name:"helper-cube"})
            helperCube.visible = this.helperCubeVisibility
        },
        updateMaxLines() {
            if (this.cuboidLines.length>this.maxLines) {
                this.cuboidLines.length = this.maxLines
                this.amountOfLines = this.maxLines
            }
            this.createCuboid(true)
        },
        updateThickness() {
            var cube = _.find(three.scene.children, {name: "cube"})
            _.each(this.cuboidLines, (cuboidLine, lineIndex) => {
                cuboidLine.data.thickness = this.lineThickness
                cuboidLine.data.length = Line.getLength(cuboidLine)

                new TWEEN.Tween( cube.children[lineIndex].scale  )   
                    .to( Line.getScale(cuboidLine), this.transitionDuration )
                    .easing( this.transitionTypes[this.transitionType] )
                    .start()
            })
        },
    }
}
</script>


<style lang="scss">

    @import '../../assets/scss/variables.scss';

    .line-animation-performance {
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
