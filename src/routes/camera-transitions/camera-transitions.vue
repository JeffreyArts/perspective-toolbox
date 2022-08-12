<template>

    <div class="camera-transitions">
        <header class="title">
            <h1>Camera-transitions</h1>
        </header>

        <hr>
        <section class="viewport">
            <div class="viewport-content" ratio="1x1" />
        </section>

        <aside class="sidebar">
            <div class="options">

                <div class="option-group" name="Move to">
                    <div class="option">
                        <!-- <label>Wireframe</label>÷ -->
                        <button class="button" @click="moveTo(index, 'top')" :style="{backgroundColor: cube.color}" v-for="cube, index in cubePositions" :key="index">Cube {{index+1}}</button>
                    </div>
                </div>
                <div class="option-group" name="Options">
                    
                    
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
                </div>

            </div>
        </aside>
    </div>
</template>


<script>
import * as THREE from "three"
import _ from "lodash"

import Stats from "./../../../node_modules/three/examples/jsm/libs/stats.module.js"
import view from "../../services/3d-view.js"
import TWEEN from "@tweenjs/tween.js"
import { InteractionManager } from "three.interactive"
const three = view.init({orbitControls: true})

export default {
    props: [],
    data() {
        return {
            animation: true,
            transitionDuration: 800,
            interactionManager: new InteractionManager(
                three.renderer,
                three.camera,
                three.renderer.domElement
            ),
            mouseDown: false,
            clickTimeout: null,
            transitionType: "Quartic.InOut",
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
            cubePositions: [
                {x: 0, z:0, y:0, color: "#f06"},
                {x: -4, z:4, y:0, color: "#f09"},
                {x: 5, z:2, y:0, color: "#90f"},
                {x: 3, z:-2, y:0, color: "#60f"},
                {x: -8, z:0, y:0, color: "#00f"}
            ]
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
        this.addCubes()

        document.body.onmousedown = (evt)  =>{ 
            this.mouseDown = true
        }
        document.body.onmouseup = (evt) => {
            this.mouseDown = false
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
        moveTo(cube, face) {
            var center = null
            if (_.isNumber(cube)) {
                var cubes = _.compact(_.map(three.scene.children, object => {
                    if (object.type == "Group") {
                        return object
                    }
                }))
                center = cubes[cube].position.clone()
            } else {
                center = cube.position.clone()
            }

            // Create vector for positioning the camera
            const destination = new THREE.Vector3()

            // Set center to the center of cube
            center.y = 0.5
            
            switch (face) {
            case "right":
                destination.set( center.x+8, center.y+1.6, center.z)
                break; case "left":
                destination.set( center.x-8, center.y+1.6, center.z)
                break;case "front":
                destination.set( center.x, center.y+1.6, center.z+8)
                break; case "back":
                destination.set( center.x, center.y+1.6, center.z-8)
                break
            default: 
                destination.set( center.x+8, center.y+8, center.z+ 8)
            }
            
            
            var tween = new TWEEN.Tween( three.camera.position)   
                .to( destination, this.transitionDuration )
                .easing( TWEEN.Easing.Sinusoidal.In )
                .onUpdate(() => {
                    three.camera.lookAt( center.x, center.y, center.z)
                    three.controls.update()
                    if (this.mouseDown) {
                        tween.stop()
                    }
                })
                .start()

            new TWEEN.Tween( three.controls.target)   
                .to( center, this.transitionDuration )
                .easing( TWEEN.Easing.Sinusoidal.In )
                .start()
                .onComplete(() => {
                    three.controls.update()
                })  
        },
        createCube(cp) {
            var group = new THREE.Group()
            const material = new THREE.MeshLambertMaterial({color: cp.color, wireframe: false})
            const geometry = {
                top: new THREE.BoxGeometry(1,0.1,1),
                bottom: new THREE.BoxGeometry(1,0.1,1),
                left: new THREE.BoxGeometry(0.1,1,1),
                right: new THREE.BoxGeometry(0.1,1,1),
                front: new THREE.BoxGeometry(1,1,0.1),
                back: new THREE.BoxGeometry(1,1,0.1),
            }
            var top = new THREE.Mesh(geometry.top, material)
            top.position.y = 1 - 0.05
            top.name = "top"

            var bottom = new THREE.Mesh(geometry.bottom, material)
            bottom.position.y = 0.05
            bottom.name = "bottom"

            var left = new THREE.Mesh(geometry.left, material)
            left.position.x = -0.5 + 0.05
            left.position.y = 0.5
            left.name = "left"

            var right = new THREE.Mesh(geometry.right, material)
            right.position.x = 0.5 - 0.05
            right.position.y = 0.5
            right.name = "right"

            var front = new THREE.Mesh(geometry.front, material)
            front.position.z = 0.5 - 0.05
            front.position.y = 0.5
            front.name = "front"

            var back = new THREE.Mesh(geometry.back, material)
            back.position.z = -0.5 + 0.05
            back.position.y = 0.5
            back.name = "back"

            group.add(top, bottom, left, right, front, back)
            return group
        },
        addCubes(cubesize) {
            _.each(this.cubePositions, (cp, index) => {
                var cube = this.createCube(cp)
                cube.position.x = cp.x
                cube.position.z = cp.z
                cube.name = `cube-${index}`
                _.each(cube.children, face => {
                    this.interactionManager.add(face)
                    face.addEventListener("mousedown", (event) => {
                        clearTimeout(this.clickTimeout)
                        const start = {
                            x: event.coords.x,
                            y: event.coords.y
                        }
                        event.stopPropagation()
                        var target = event.target
                        this.clickTimeout = setTimeout(() => {
                            if (!this.mouseDown) {
                                this.moveTo(cube, target.name)
                            }
                        }, 160)
                    })
                })
                
                three.scene.add(cube)
            })
        },
    }
}
</script>


<style lang="scss">

    @import '../../assets/scss/variables.scss';

    .camera-transitions {
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
