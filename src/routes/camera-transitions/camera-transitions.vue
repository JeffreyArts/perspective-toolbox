<template>

    <div class="options-overview">
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
                        <button class="button" @click="moveTo(`cube-${index}`)" :style="{backgroundColor: cube.color}" v-for="cube, index in cubePositions" :key="key">Cube {{index+1}}</button>
                    </div>
                </div>
                <div class="option-group" name="Options">
                    
                    
                    <div class="option">
                        <label for="transitionType">
                            Transition type
                            <select name="transitionType" v-model="transitionType" >
                                <option v-for="(tween, index) in transitionTypes" :value="index">{{index}}</option>
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
import * as THREE from 'three';
import _ from 'lodash';

import Stats from './../../../node_modules/three/examples/jsm/libs/stats.module.js';
import view from '../../services/3d-view.js';
import TWEEN from '@tweenjs/tween.js';
import { InteractionManager } from "three.interactive";
const three = view.init({orbitControls: true});

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
    methods: {
        init(){
            // Rendering scene
            var that = this;
            function animate(index) {
                if (!that.animation) {
                    return;
                }
                three.renderer.render(three.scene, three.camera);
                that.interactionManager.update();
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
        moveTo(cubeName) {
            var cube = _.find(three.scene.children, {name:cubeName});
            const tmpCamera = three.camera.clone();
            tmpCamera.position.set( cube.position.x, cube.position.y+8, cube.position.z+8)
            tmpCamera.lookAt( cube.position.x, cube.position.y, cube.position.z)
            
            new TWEEN.Tween( three.camera.quaternion)   
                .to( tmpCamera.quaternion, this.transitionDuration )
                .easing( this.transitionTypes[this.transitionType] )
                .start( );
            
            new TWEEN.Tween( three.camera.position)   
                .to( tmpCamera.position, this.transitionDuration )
                .easing( this.transitionTypes[this.transitionType] )
                .start( )
            
            new TWEEN.Tween( three.controls.target)   
                .to( cube.position, this.transitionDuration )
                .easing( this.transitionTypes[this.transitionType] )
                .start( )
                .onComplete(() => {
                    three.controls.target.set( cube.position.x, cube.position.y, cube.position.z );
                } );
                
        },
        addCubes(cubesize) {
            var geometry = new THREE.BoxGeometry(1,1,1);
            var cube = null;
            _.each(this.cubePositions, (cp, index) => {
                var material = new THREE.MeshLambertMaterial({color: cp.color, wireframe: false});
                cube = new THREE.Mesh(geometry, material);
                cube.position.x = cp.x;
                cube.position.z = cp.z;
                cube.name = `cube-${index}`

                this.interactionManager.add(cube);
                cube.addEventListener("click", (event) => {
                    this.moveTo(event.target.name)
                });
                
                three.scene.add(cube)
            })
        },
    },
    mounted() {
        this.init();

        // Prevent multiple camera's / meshes to be added
        if (three.scene.initialised) {
            this.mesh = _.find(three.scene.children, {type:"Mesh"});
            return;
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



        three.scene.initialised = true;
    },
    unmounted() {
        // This destroys the animation loop when navigating to another page
        this.animation = false;
    }
}
</script>


<style lang="scss">

</style>
