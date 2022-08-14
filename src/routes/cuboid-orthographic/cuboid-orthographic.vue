<template>

    <div class="ortographic-cuboid">
        <header class="title">
            <h1>Orthographic cuboid</h1>
        </header>

        <hr>

        <section class="viewport">
            <div class="viewport-content" ratio="1x1">
                <div class="loader" :class="[isLoading ? '' : '__isHidden']" />
            </div>
        </section>

        <aside class="sidebar">
            <div class="options">

                <div class="option-group" name="Options">
                    <div class="option">
                        <label for="transitionType">
                            Sensitivity
                            <select name="transitionType" v-model="sensitivity" @change="updateMap()">
                                <option v-for="(s,i) in sensitivityScales" :value="s" :key="i">{{s}}</option>
                            </select>
                        </label>
                    </div>
                    
                    <div class="option">
                        <label for="transitionType">
                            Transition type
                            <select name="transitionType" v-model="transitionType" @change="updateMap()" >
                                <option v-for="(tween, index) in transitionTypes" :value="index" :key="tween">{{index}}</option>
                            </select>
                        </label>
                    </div>

                    <div class="option">
                        <label for="transitionDuration">
                            Transition duration
                            <input name="transitionDuration" type="number" v-model.number="transitionDuration"  @change="updateMap()"/>
                        </label>
                    </div>

                    <div class="option">
                        <label for="delay">
                            Delay
                            <input name="delay" type="number" v-model.number="delay"  @change="updateMap()"/>
                        </label>
                    </div>
                </div>

            </div>
        </aside>
    </div>
</template>


<script>
import * as THREE from "three"
import { OrbitControls } from "./../../../node_modules/three/examples/jsm/controls/OrbitControls.js"

import _ from "lodash"
import TWEEN, { Tween } from "@tweenjs/tween.js"
import degreesToRadians from "../../services/degrees-to-radians.js"
import { InteractionManager } from "three.interactive"

import Stats from "./../../../node_modules/three/examples/jsm/libs/stats.module.js"
import view from "../../services/3d-view.js"
import Cuboid from "../../services/cuboid.js"

var three = view.init({orbitControls: true})

export default {
    name: "cuboidMap",
    props: [],
    data() {
        return {
            animation: true,
            lineThickness: .25,
            helperCubeVisibility: false,
            delay: 0,
            interactionManager: new InteractionManager(
                three.renderer,
                three.camera,
                three.renderer.domElement
            ),
            mouseDown: false,
            offset: 24,
            seed: Math.floor(Math.random()*9000+1000).toString(),
            sensitivity: "abstract",
            sensitivityScales: ["abstract","non-identity","identity","open"],
            activeCuboid: null,
            initialised: false,
            isLoading: true,
            cuboids: [],
            map: [
                [1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1],
            ],
            allCuboids: [],
            transitionDuration: 4800,
            transitionType: "Bounce.Out",
            // transitionType: "Elastic.Out",
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
        three.camera = new THREE.OrthographicCamera( -1, 1, -1, 1, 0, 1000 )
        three.camera.updateProjectionMatrix()
        
        three.scene.add(three.camera)

        three.camera.zoom = .16
        three.camera.updateProjectionMatrix()
        three.controls = new OrbitControls( three.camera, three.renderer.domElement )

        
        document.body.onmousedown = (evt)  =>{ 
            this.mouseDown = true
        }
        document.body.onmouseup = (evt) => {
            this.mouseDown = false
        }

        this.updateMap(three.scene.initialised)

        // Prevent multiple camera's / meshes to be added
        // Everything after this if statement will only be added the first time that this component is mounted
        if (three.scene.initialised) {
            this.mesh = _.find(three.scene.children, {type:"Mesh"})
            this.isLoading = false
            return
        }


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
                that.interactionManager.update()
                stats.update()
                TWEEN.update(index)

                requestAnimationFrame(animate)
            }

            three.scene.background = new THREE.Color("#ffffff") // optional

            // Helper for displaying FPS
            var stats = new Stats()
            stats.dom.className = "viewport-stats"
            this.$el.querySelector(".viewport-content").append( stats.dom )


            // Enable animation loop
            this.animation = true
            animate()

            // Add scene to dom
            this.$el.querySelector(".viewport-content").append(three.renderer.domElement)

            three.controls.minDistance = 8
            three.controls.maxDistance = 32
            
            three.controls.maxPolarAngle = degreesToRadians(180 - 90) 
            three.controls.minPolarAngle = degreesToRadians(180 - 180) 

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
        updateMap(firstLoad) {
            this.seed =  Math.floor(Math.random()*9000+1000).toString()
            let cubeDimensions = {
                x:5,
                y:5,
                z:5,
            }
            if (this.sensitivity == "open") {
                cubeDimensions.x = 7
                cubeDimensions.y = 7
                cubeDimensions.z = 7
            }

            if (!firstLoad) {
                var total = 0
                var update = false
                for (let x = 0; x < this.map.length; x++) {
                    for (let z = 0; z < this.map[x].length; z++) {
                        if (this.map[x][z] == 1) {
                        
                            if (this.allCuboids[total]) {
                                this.allCuboids[total].cuboidLines = Cuboid.generateCuboidLines(cubeDimensions, this.sensitivity, this.seed + total)
                                update = true
                            } else {
                                var cuboid = this.createCuboid(`${x}-${z}`, this.sensitivity)
                                cuboid.position.x = x*this.offset
                                cuboid.position.z = z*this.offset
                                cuboid.cuboidLines = Cuboid.generateCuboidLines(cubeDimensions, this.sensitivity, this.seed + total)

                                this.allCuboids.push(cuboid)
                            }
                            total++
                        }
                    }
                }
            
                this.isLoading = false

                var centerCuboid = this.allCuboids[Math.floor((this.allCuboids.length-1)/2)]
            } else {
                // centerCuboid
                var z = Math.floor(this.map.length/2)
                var x = Math.floor(this.map[z].length/2)
                var centerCuboid = Cuboid.get(`cuboid-${x}-${z}`, three.scene)
            }
            if (!update) {        
                three.camera.position.x = centerCuboid.position.x + 32
                three.camera.position.z = centerCuboid.position.z + 32
                three.camera.position.y = 64
            }

            Cuboid.update(centerCuboid, {
                delay: this.delay, 
                cuboidLines: centerCuboid.cuboidLines,
                transition: this.transitionTypes[this.transitionType], 
                duration: this.transitionDuration
            })

            this.moveToCuboid(centerCuboid).then(() => {
                this.initialised = true
            })
        },
        createCuboid(id, sensitivity) {
            
            let cubeDimensions = {
                x:5,
                y:5,
                z:5,
            }
            if (sensitivity == "open") {
                cubeDimensions.x = 5
                cubeDimensions.y = 5
                cubeDimensions.z = 5
            }
   
            let newCuboid = Cuboid.create(cubeDimensions, {name: `cuboid-${id}`, maxLines: 320})
            newCuboid.material.color = "#000000"
            newCuboid.material.transparent = true
            newCuboid.material.opacity = 0
            newCuboid.visible = false
            three.scene.add(newCuboid)
            // this.cuboidLines = Cuboid.generateCuboidLines(cubeDimensions, this.sensitivity, this.seed + id)

            _.each(newCuboid.children, lineObject => {
                this.interactionManager.add(lineObject)
                lineObject.addEventListener("mousedown", (event) => {
                    clearTimeout(this.clickTimeout)
                    event.stopPropagation()

                    var cuboid = event.target.parent
                    if (!cuboid.visible) {
                        return
                    }

                    if (!this.activeCuboid || cuboid.name != this.activeCuboid.name) {
                        this.moveToCuboid(cuboid)
                    // this.clickTimeout = setTimeout(() => {
                    //     if (!this.mouseDown) {
                    //     }
                    // }, 160)
                    } else {
                        this.moveToSide(event.target.data.side)
                    }
                })
            })
            
            three.controls.target.set((cubeDimensions.width-1)/2, (cubeDimensions.height-1)/2, (cubeDimensions.depth-1)/2)
            three.camera.lookAt(three.controls.target)
            return newCuboid
        },
        moveToSide(side) {
            if (side == "bottom" || side == "top") {
                return
            }
            let cameraPoint = this.activeCuboid.position.clone()
            cameraPoint.y = 2.5

            let centerPoint = this.activeCuboid.position.clone()
            if (this.sensitivity == "open") {
                centerPoint.y = 3.5
                cameraPoint.y = 3.5
            } else {   
                centerPoint.y = 2.5 
            }
            
            switch (side) {
            case "front": cameraPoint.z += 16; break
            case "back": cameraPoint.z -= 16; break
            case "left": cameraPoint.x -= 16; break
            case "right": cameraPoint.x += 16; break
            }
            
            return this.moveToPoint(cameraPoint, centerPoint)
        },
        moveToPoint(cameraPosition, centerPoint) {
            
            return new Promise((resolve, reject) => {
                this.clickTimeout = setTimeout(() => {
                    if (!this.mouseDown) {
                        var tween = new TWEEN.Tween( three.camera.position)   
                            .to( cameraPosition, this.transitionDuration )
                            .easing( this.transitionTypes[this.transitionType] )
                            .onUpdate(() => {
                                three.camera.lookAt( centerPoint.x, centerPoint.y, centerPoint.z)
                                // three.controls.update()
                                if (this.mouseDown) {
                                    tween.stop()
                                }
                            })
                            .start()

                        new TWEEN.Tween( three.controls.target)   
                            .to( centerPoint, this.transitionDuration )
                            .easing( this.transitionTypes[this.transitionType] )
                            .start()
                            .onComplete(() => {
                                three.controls.update()
                                resolve()
                            })  
                    }
                }, 160)
            })

        },
        moveToCuboid(cuboid) {
            const center = cuboid.position.clone()
            center.y = 2.5
            
            const destination = cuboid.position.clone()
            destination.y += 130

            let oldCuboid = null

            if (this.activeCuboid && cuboid.name != this.activeCuboid.name) {
                oldCuboid = this.activeCuboid
            }

            this.activeCuboid = cuboid

            if (cuboid.position.x < three.camera.position.x) {
                destination.x += 128
            } else {
                destination.x -= 128
            }

            if (cuboid.position.z < three.camera.position.z) {
                destination.z += 128
            } else {
                destination.z -= 128
            }
            
            cuboid.visible = true
            new TWEEN.Tween( cuboid.material )   
                .to( {opacity: 1}, 800 )
                .easing( this.transitionTypes[this.transitionType] )
                .start()

            if (oldCuboid) {
                new TWEEN.Tween( oldCuboid.material )   
                    .to( {opacity: 0}, this.transitionDuration )
                    .easing( this.transitionTypes[this.transitionType] )
                    .start()
                    .onComplete(() => {
                        cuboid.visible = false
                    })
            }

            return this.moveToPoint(destination, center)
        },
    }
}
</script>


<style lang="scss">

    @import '../../assets/scss/variables.scss';

    .ortographic-cuboid {
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
