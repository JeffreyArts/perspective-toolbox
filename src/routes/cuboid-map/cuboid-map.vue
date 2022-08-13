<template>

    <div class="cuboid-map">
        <header class="title">
            <h1>Cuboid map</h1>
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
                            <select name="transitionType" v-model="sensitivity" @change="updateCuboid()">
                                <option v-for="(s,i) in sensitivityScales" :value="s" :key="i">{{s}}</option>
                            </select>
                        </label>
                    </div>

                    <!-- <div class="option">
                        <button class="button" @click="updateLines(true)" >Shuffle Lines</button>
                    </div> -->
                    
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
                    
                </div>

            </div>
        </aside>
    </div>
</template>


<script>
import * as THREE from "three"
import _ from "lodash"
import TWEEN from "@tweenjs/tween.js"
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
            sensitivityScales: ["abstract","non-identity","identity","open", "custom"],
            activeCuboid: null,
            isLoading: true,
            cuboids: [],
            map: [
                [0,0,0,0,0,0,0],
                [0,0,0,0,0,1,0],
                [0,0,0,0,0,0,0],
                [0,0,0,1,0,0,0],
                [0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0],
            ],
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

        document.body.onmousedown = (evt)  =>{ 
            this.mouseDown = true
        }
        document.body.onmouseup = (evt) => {
            this.mouseDown = false
        }

        // Prevent multiple camera's / meshes to be added
        // Everything after this if statement will only be added the first time that this component is mounted
        if (three.scene.initialised) {
            this.mesh = _.find(three.scene.children, {type:"Mesh"})
            return
        }


        // Set camera in front position
        // three.camera.position.z = this.cubeDimensions.depth*4
        // three.camera.position.z = this.cubeDimensions.depth*4
        // three.camera.position.y = this.cubeDimensions.height/2
        // three.camera.position.x = this.cubeDimensions.width/2
        // three.camera.lookAt(this.cubeDimensions.width/2, this.cubeDimensions.height/2, this.cubeDimensions.depth/2)
        three.scene.add(three.camera)



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

            this.createGroundplane()
            var allCuboids = []
            for (let x = 0; x < this.map.length; x++) {
                for (let z = 0; z < this.map[x].length; z++) {
                    if (this.map[x][z] == 1) {
                        var cuboid = this.createCuboid(`${x}-${z}`, "abstract")
                        cuboid.visible = false
                        cuboid.position.x = x*this.offset
                        cuboid.position.z = z*this.offset
                        allCuboids.push(cuboid)
                    }
                }
            }
            
            this.isLoading = false

            var centerCuboid = allCuboids[Math.floor((allCuboids.length-1)/2)]
            three.camera.position.x = centerCuboid.position.x = 32
            three.camera.position.z = centerCuboid.position.z = 32
            three.camera.position.y = 64
            this.moveToCuboid(centerCuboid).then(() => {
            })

            three.controls.minDistance = 8
            three.controls.maxDistance = 32
            
            three.controls.maxPolarAngle = degreesToRadians(180 - 90) 
            three.controls.minPolarAngle = degreesToRadians(180 - 160) 

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
        createGroundplane() {
            const geometry = new THREE.PlaneGeometry( 3200, 3200 ) // update with height/width of image
            const material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide} )
            const plane = new THREE.Mesh( geometry, material )
            plane.position.x = 0
            plane.position.y = -0.25
            plane.position.z = 0
            plane.rotation.x = Math.PI / 2
            plane.name = "groundplane"
            three.scene.add( plane )
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
   
            let newCuboid = Cuboid.create(cubeDimensions, {name: `cuboid-${id}`, maxLines: 200})
            newCuboid.material.color = "#000000"
            newCuboid.material.transparent = true
            newCuboid.material.opacity = 0
            three.scene.add(newCuboid)
            this.cuboidLines = Cuboid.generateCuboidLines(cubeDimensions, this.sensitivity, this.seed + id)

            Cuboid.update(newCuboid, {
                delay: this.delay, 
                cuboidLines: this.cuboidLines,
                transition: this.transitionTypes[this.transitionType], 
                duration: this.transitionDuration
            })

            _.each(newCuboid.children, lineObject => {
                this.interactionManager.add(lineObject)
                lineObject.addEventListener("mousedown", (event) => {
                    clearTimeout(this.clickTimeout)
                    event.stopPropagation()
                    console.log(event.target, event.target.data)
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
                        console.log("event.target.data.side", event.target)
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
            console.log("move to side", side)
            switch (side) {
            case "front": cameraPoint.z += 16; break
            case "back": cameraPoint.z -= 16; break
            case "left": cameraPoint.x -= 16; break
            case "right": cameraPoint.x += 16; break
            }
            
            return this.moveToPoint(cameraPoint, this.activeCuboid.position)
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
            destination.y += 16

            const oldCuboid = this.activeCuboid

            this.activeCuboid = cuboid
            cuboid.visible = true

            if (cuboid.position.x < three.camera.position.x) {
                destination.x += 16
            } else {
                destination.x -= 16
            }

            if (cuboid.position.z < three.camera.position.z) {
                destination.z += 16
            } else {
                destination.z -= 16
            }
            
            new TWEEN.Tween( cuboid.material )   
                .to( {opacity: 1}, 800 )
                .easing( this.transitionTypes[this.transitionType] )
                .start()
            if (oldCuboid) {
                new TWEEN.Tween( oldCuboid.material )   
                    .to( {opacity: 0}, this.transitionDuration )
                    .easing( this.transitionTypes[this.transitionType] )
                    .start()
            }

            return this.moveToPoint(destination, center)
        },
        // updateCuboid(id) {
        //     const cuboid = Cuboid.get(`cuboid-${id}`, three.scene)
        //     this.cuboidLines = Cuboid.generateCuboidLines(this.cubeDimensions, this.sensitivity, this.seed)
        //     Cuboid.update(cuboid, {
        //         delay: this.delay, 
        //         cuboidLines: this.cuboidLines,
        //         transition: this.transitionTypes[this.transitionType], 
        //         duration: this.transitionDuration
        //     })
        //     // three.controls.target.set((this.cubeDimensions.width-1)/2, (this.cubeDimensions.height-1)/2, (this.cubeDimensions.depth-1)/2)
        //     // three.camera.lookAt(three.controls.target)
        // },
    }
}
</script>


<style lang="scss">

    @import '../../assets/scss/variables.scss';

    .cuboid-map {
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
