<template>

    <div class="orbit-controls">
        <header class="title">
            <h1>Orbit controls</h1>
        </header>

        <hr>
        <section class="viewport">
            <div class="viewport-content" ratio="1x1" />
            <span class="source">
                source:
                <a href="https://stackoverflow.com/questions/15827074/how-do-i-put-limits-on-orbitcontrol" target="_blank">Orbit controls limits</a>
            </span>
        </section>

       

        <aside class="sidebar">
            <div class="options">

                <div class="option-group" name="Options">
                    <div class="option">
                        <label for="far">
                            Vertical radius
                        </label>
                        <MultiRangeSlider
                            :baseClassName="'multi-range-slider'"
                            :min="0"
                            :max="180"
                            :step="1"
                            :ruler="false"
                            :minValue="radiusVertMin"
                            :maxValue="radiusVertMax"
                            @input="updateOrbitRadius"
                        />
                    </div>
                    <div class="option">
                        <label for="far">
                            Zoom
                        </label>
                        <MultiRangeSlider
                            :baseClassName="'multi-range-slider'"
                            :min="0"
                            :max="32"
                            :step=".1"
                            :ruler="false"
                            :minValue="zoomMin"
                            :maxValue="zoomMax"
                            @input="updateOrbitZoom"
                        />
                    </div>
                    <!-- <div class="option">
                        <label for="far">
                            Vertical radius (min)
                        </label>
                        <input type="range" id="radiusVertMin" v-model.number="radiusVertMin" step="1" min="1" max="180" @change="updateOrbitRadius()">
                        <input type="number"  min="1" max="180" v-model.number="radiusVertMin" @change="updateOrbitRadius()">
                    </div>
                    <div class="option">
                        <label for="far">
                            Vertical radius (max)
                        </label>
                        <input type="range" id="radiusVertMax" v-model.number="radiusVertMax" step="1" min="1" max="180" @change="updateOrbitRadius()">
                        <input type="number"  min="1" max="180" v-model.number="radiusVertMax" @change="updateOrbitRadius()">
                    </div> -->
                    <div class="option">
                        <span>
                            <input type="checkbox" id="checkbox-v0" v-model="showGroundplane" v-on:change="toggleGroundPlane()">
                            <label for="checkbox-v0">
                                Ground plane
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

import MultiRangeSlider from "multi-range-slider-vue";
import Stats from './../../../node_modules/three/examples/jsm/libs/stats.module.js';
import view from '../../services/3d-view.js';
import degreesToRadians from '../../services/degrees-to-radians.js';
import TWEEN from '@tweenjs/tween.js';
import { InteractionManager } from "three.interactive";
const three = view.init({orbitControls: true});

export default {
    props: [],
    components: {
        MultiRangeSlider
    },
    data() {
        return {
            animation: true,
            transitionDuration: 800,
            zoomMin: 2,
            zoomMax: 8,
            radiusVertMin: 90,
            radiusVertMax: 180,
            showGroundplane: true,
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
            }
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
        moveTo(cube, face) {
            var center = null;
            if (_.isNumber(cube)) {
                var cubes = _.compact(_.map(three.scene.children, object => {
                    if (object.type == "Group") {
                        return object;
                    }
                }));
                center = cubes[cube].position.clone();
            } else {
                center = cube.position.clone();
            }

            // Create vector for positioning the camera
            const destination = new THREE.Vector3();

            // Set center to the center of cube
            center.y = 0.5;
            
            switch (face) {
                case "right":
                    destination.set( center.x+8, center.y+1.6, center.z)
                break; case "left":
                    destination.set( center.x-8, center.y+1.6, center.z)
                break;case "front":
                    destination.set( center.x, center.y+1.6, center.z+8)
                break; case "back":
                    destination.set( center.x, center.y+1.6, center.z-8)
                break;
                default: 
                    destination.set( center.x+8, center.y+8, center.z+ 8)
            }
            
            
            var tween = new TWEEN.Tween( three.camera.position)   
                .to( destination, this.transitionDuration )
                .easing( TWEEN.Easing.Sinusoidal.In )
                .onUpdate(() => {
                    three.camera.lookAt( center.x, center.y, center.z);
                    if (this.mouseDown) {
                        tween.stop();
                    }
                })
                .start()

            new TWEEN.Tween( three.controls.target)   
                .to( center, this.transitionDuration )
                .easing( TWEEN.Easing.Sinusoidal.In )
                .start()
                .onComplete(() => {
                    three.controls.update();
                });
                
        },
        createGroundplane() {
            const geometry = new THREE.PlaneGeometry( 320, 320 ); // update with height/width of image
            const material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
            const plane = new THREE.Mesh( geometry, material );
            plane.position.x = 0;
            plane.position.y = 0;
            plane.position.z = 0;
            plane.rotation.x = Math.PI / 2;;
            plane.name = "groundplane"
            three.scene.add( plane );
        },
        createCube() {
            var group = new THREE.Group();
            const material = new THREE.MeshLambertMaterial({color: "#ff0099", wireframe: false});
            const geometry = {
                top: new THREE.BoxGeometry(1,0.1,1),
                bottom: new THREE.BoxGeometry(1,0.1,1),
                left: new THREE.BoxGeometry(0.1,1,1),
                right: new THREE.BoxGeometry(0.1,1,1),
                front: new THREE.BoxGeometry(1,1,0.1),
                back: new THREE.BoxGeometry(1,1,0.1),
            }
            var top = new THREE.Mesh(geometry.top, material)
            top.position.y = 1 - 0.05;
            top.name = 'top'

            var bottom = new THREE.Mesh(geometry.bottom, material)
            bottom.position.y = 0.05;
            bottom.name = 'bottom'

            var left = new THREE.Mesh(geometry.left, material)
            left.position.x = -0.5 + 0.05;
            left.position.y = 0.5;
            left.name = 'left'

            var right = new THREE.Mesh(geometry.right, material)
            right.position.x = 0.5 - 0.05;
            right.position.y = 0.5;
            right.name = 'right'

            var front = new THREE.Mesh(geometry.front, material)
            front.position.z = 0.5 - 0.05;
            front.position.y = 0.5;
            front.name = 'front'

            var back = new THREE.Mesh(geometry.back, material)
            back.position.z = -0.5 + 0.05;
            back.position.y = 0.5;
            back.name = 'back'

            group.add(top, bottom, left, right, front, back);
            
            _.each(group.children, face => {
                this.interactionManager.add(face);
                face.addEventListener("mousedown", (event) => {
                    clearTimeout(this.clickTimeout);
                    const start = {
                        x: event.coords.x,
                        y: event.coords.y
                    }
                    event.stopPropagation();
                    var target = event.target
                    this.clickTimeout = setTimeout(() => {
                        if (!this.mouseDown) {
                            this.moveTo(group, target.name)
                        }
                    }, 160)
                });
            })
            
            three.scene.add(group)
        },
        updateOrbitRadius(data) {
            if (data) {
                this.radiusVertMin = data.minValue
                this.radiusVertMax = data.maxValue
            }

            three.controls.target.set(0, .5, 0 );
            three.controls.maxPolarAngle = degreesToRadians(180 - this.radiusVertMin); 
            three.controls.minPolarAngle = degreesToRadians(180 - this.radiusVertMax); 
        },
        updateOrbitZoom(data) {
            if (data) {
                this.zoomMin = data.minValue
                this.zoomMax = data.maxValue
            }
            
            three.controls.minDistance = this.zoomMin;
            three.controls.maxDistance = this.zoomMax;
        },
        toggleGroundPlane() {
            const groundplane = _.find(three.scene.children, {name:"groundplane"});
            groundplane.material.visible = this.showGroundplane
        },
    },
    mounted() {
        this.init();

        // Prevent multiple camera's / meshes to be added
        if (three.scene.initialised) {
            // this.mesh = _.find(three.scene.children, {type:"Mesh"});
            return;
        }
        // Everything below will only be added the first time that this component is mounted


        // Set camera
        three.camera.position.z = 2.4
        three.camera.position.y = 2.4
        three.camera.position.x = 2.4
        three.camera.lookAt(0,0,0)
        three.scene.add(three.camera)

        // Update orbit controls
        this.updateOrbitRadius()
        this.updateOrbitZoom()

        // Create object
        this.createCube()
        this.createGroundplane()

        document.body.onmousedown = (evt)  =>{ 
            this.mouseDown = true
        }
        document.body.onmouseup = (evt) => {
            this.mouseDown = false
        }



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

    .orbit-controls {
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
    
    .multi-range-slider {
        border: 0 none transparent;
        border-radius: 0;
        padding: 16px 0px 32px;
        box-shadow: none;

        .bar-right,
        .bar-left {
            padding: 0;
            height: 4px;
        }

        .bar-inner {
            height: 12px;
            transform:translateY(-4px);
            background-color: #ff0066;
            position: relative;
            &:after {
                content: '';
                background-color: #fff;
                opacity: 0.16;
                position: absolute;
                left: 0;
                bottom: 0;
                top: 0;
                right: 0;
            }
        }

        .thumb {
            &:before {
                width: 16px;
                height: 16px;
                margin-top: -6px;
                background-color: #ff0066;
                border: 0 none transparent;
                box-shadow: none;
            } 

            .caption {
                left: -16px;
                bottom:4px;
                display: block;
                * {
                    background-color: transparent;
                    box-shadow: none;
                    font-family: FixedSys;
                }
            }
        } 

        .bar-left,
        .bar-inner,
        .bar-right {
            box-shadow: none;
        }
        .labels {
            margin-top: 24px;
            .label + .label {
                text-align: right;
            }
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

</style>
