<template>

    <div class="line-animation-performance">
        <header class="title">
            <h1>Draw line from coordinates</h1>
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
                        <input type="range" id="far" v-model.number="lineThickness" step=".01" min="0.01" max="1" @change="createLines()">
                        <input type="number"  min="1" max="16" v-model.number="lineThickness" @change="createLines()">
                    </div>
                    <div class="option">
                        <label for="far">
                            Amount of Lines
                        </label>
                        <input type="range" id="far" v-model.number="amountOfLines" step="1" min="1" max="480" @change="createLines()">
                        <input type="number"  min="1" max="16" v-model.number="amountOfLines" @change="createLines()">
                    </div>

                    <div class="option">
                        <button class="button" @click="shuffleLines()" >Shuffle Lines</button>
                    </div>

                    <div class="option">
                        <label for="point1">
                            Cube <small>[width,height,depth]</small>
                        </label>

                        <div class="group">
                            <input type="number" id="cubeWidth" v-model.number="cube.width" step="1" min="3" max="16" @change="createLines()">
                            <input type="number" id="cubeHeight" v-model.number="cube.height" step="1" min="3" max="16" @change="createLines()">
                            <input type="number" id="cubeDepth" v-model.number="cube.depth" step="1" min="3" max="16" @change="createLines()">
                        </div>
                    </div>
                    
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
import * as THREE from 'three';
import _ from 'lodash';

import TWEEN from '@tweenjs/tween.js';
import Stats from './../../../node_modules/three/examples/jsm/libs/stats.module.js';
import view from '../../services/3d-view.js';
import Line from '../../services/line.js';

var three = view.init({orbitControls: true})


export default {
    props: [],
    data() {
        return {
            animation: true,
            animateLines: true,
            transitionDuration: 1600,
            lineThickness: .25,
            helperCubeVisibility: false,
            amountOfLines: 32,
            sides: ["left","right","front","back","top","bottom"],
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
            cube: {
                width: 5,
                height: 5,
                depth: 5,
            },
            lines: [{
                start: {
                    x: 0,
                    y: 0,
                },
                end: {
                    x: 0,
                    y: 1,
                },
                color:'#f06',
                side: "left"
            }],
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
        createHelperCube() {

            var helperCube = _.find(three.scene.children, {name: 'helper-cube'});
            if (!helperCube) {
                helperCube = new THREE.Group();
                helperCube.name = "helper-cube";
                three.scene.add(helperCube)
            }

            let sphere = new THREE.Mesh(new THREE.SphereGeometry( 0.01, 32, 16 ), new THREE.MeshBasicMaterial({color: 0xcccccc, wireframe: true}));
            
            for (var x=0; x<this.cube.width; x++) {
                for (var y=0; y<this.cube.height; y++) {

                    // Back
                    sphere.position.x = x
                    sphere.position.y = y
                    sphere.position.z = 0
                    helperCube.add(sphere.clone());

                    // Front
                    sphere.position.x = x
                    sphere.position.y = y
                    sphere.position.z = this.cube.depth-1
                    helperCube.add(sphere.clone());
                }
            }
            
            for (var x=0; x<this.cube.depth; x++) {
                for (var y=0; y<this.cube.height; y++) {
                    // Left
                    sphere.position.x = 0
                    sphere.position.y = y
                    sphere.position.z = x
                    helperCube.add(sphere.clone());

                    // Right
                    sphere.position.x = this.cube.width-1
                    sphere.position.y = y
                    sphere.position.z = x
                    helperCube.add(sphere.clone());
                }
            }
            
            for (var x=0; x<this.cube.width; x++) {
                for (var y=0; y<this.cube.depth; y++) {
                    // Bottom
                    sphere.position.x = x
                    sphere.position.y = 0
                    sphere.position.z = y
                    helperCube.add(sphere.clone());

                    // Top
                    sphere.position.x = x
                    sphere.position.y = this.cube.height-1
                    sphere.position.z = y
                    helperCube.add(sphere.clone());
                }
            }
        },
        updateLines(animateLines) {
            var cube = _.find(three.scene.children, {name: 'cube'});
            
            _.each(cube.children, line => {
                line.data.length = Line.getLength(line);
                const scale = (line.data.length + this.lineThickness) * (1/this.lineThickness)

                if (animateLines) {
                    new TWEEN.Tween( line.scale  )   
                        .to( {x: scale}, this.transitionDuration )
                        .easing( this.transitionTypes[this.transitionType] )
                        .start()

                    new TWEEN.Tween( line.position )   
                        .to( Line.getPosition(line, this.cube), this.transitionDuration )
                        .easing( this.transitionTypes[this.transitionType] )
                        .start()

                    new TWEEN.Tween( line.rotation )   
                        .to( Line.getRotation(line), this.transitionDuration )
                        .easing( this.transitionTypes[this.transitionType] )
                        .start()
                } else {
                    line.scale.x = scale;
                    line.rotation.setFromVector3(Line.getRotation(line));
                    line.position.copy(Line.getPosition(line, this.cube));
                }
            });
        },
        shuffleLines() {
            const cube = _.find(three.scene.children, {name: 'cube'});
            let horizontal, horSize, vertSize;

            _.each(cube.children, line => {
                line.data.side = this.sides[Math.floor(Math.random()*this.sides.length)]
                horizontal = Math.random() < 0.5;
                if (line.data.side == 'front' || line.data.side == 'back') {
                    horSize = this.cube.width;
                    vertSize = this.cube.height;
                } else if (line.data.side == 'left' || line.data.side == 'right') {
                    horSize = this.cube.depth;
                    vertSize = this.cube.height;
                } else {
                    horSize = this.cube.width;
                    vertSize = this.cube.depth;
                } 

                if (horizontal) {
                    line.data.start.x = Math.floor(Math.random() * horSize);
                    line.data.end.x = line.data.start.x

                    line.data.start.y = Math.floor(Math.random() * vertSize);
                    line.data.end.y = line.data.start.y;
                    
                    while(line.data.end.x == line.data.start.x) {
                        line.data.end.x = Math.floor(Math.random() * horSize);
                    }
                } else {
                    line.data.start.x = Math.floor(Math.random() * horSize);
                    line.data.end.x = line.data.start.x

                    line.data.start.y = Math.floor(Math.random() * vertSize);
                    line.data.end.y = line.data.start.y;
                    
                    while(line.data.end.y == line.data.start.y) {
                        line.data.end.y = Math.floor(Math.random() * vertSize);
                    }
                }
            })

            this.updateLines(this.animateLines)
        },
        createLines() {
            this.lines.length = 0;
            let horizontal, horSize, vertSize, line;
            const cube = _.find(three.scene.children, {name: 'cube'});
            const helperCube = _.find(three.scene.children, {name: 'helper-cube'});
            
            for (let i = cube.children.length - 1; i >= 0; i--) {
                if(cube.children[i].type === "Mesh") {
                    cube.children[i].geometry.dispose();
                    cube.children[i].material.dispose();
                    cube.remove(cube.children[i]);
                }
            }
            
            console.log(helperCube)
            if (helperCube) {
                for (let i = helperCube.children.length - 1; i >= 0; i--) {
                    if(helperCube.children[i].type === "Mesh") {
                        helperCube.children[i].geometry.dispose();
                        helperCube.children[i].material.dispose();
                        helperCube.remove(helperCube.children[i]);
                    }
                }
                console.log(helperCube.children.length)
            }

                

            for (var i=0; i<this.amountOfLines; i++) {
                line = {
                    start: {
                        x: 0,
                        y: 0,
                    },
                    end: {
                        x: 0,
                        y: 1,
                    },
                    color: `#ff0066`,
                    side: "left"
                };
                
                line.side = this.sides[Math.floor(Math.random()*this.sides.length)]
                horizontal = Math.random() < 0.5;
                if (line.side == 'front' || line.side == 'back') {
                    horSize = this.cube.width;
                    vertSize = this.cube.height;
                } else if (line.side == 'left' || line.side == 'right') {
                    horSize = this.cube.depth;
                    vertSize = this.cube.height;
                } else {
                    horSize = this.cube.width;
                    vertSize = this.cube.depth;
                } 

                if (horizontal) {
                    line.start.x = Math.floor(Math.random() * horSize);
                    line.end.x = line.start.x

                    line.start.y = Math.floor(Math.random() * vertSize);
                    line.end.y = line.start.y;
                    
                    while(line.end.x == line.start.x) {
                        line.end.x = Math.floor(Math.random() * horSize);
                    }
                } else {
                    line.start.x = Math.floor(Math.random() * horSize);
                    line.end.x = line.start.x

                    line.start.y = Math.floor(Math.random() * vertSize);
                    line.end.y = line.start.y;
                    
                    while(line.end.y == line.start.y) {
                        line.end.y = Math.floor(Math.random() * vertSize);
                    }
                }

                cube.add(Line.create(line, this.lineThickness));
            }
            this.createHelperCube()
            this.updateLines()
        },
        toggleHelperCube() {
            var helperCube = _.find(three.scene.children, {name:"helper-cube"});
            helperCube.visible = this.helperCubeVisibility
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


        // Set camera in front position
        three.camera.position.z = this.cube.depth*4
        three.camera.position.y = this.cube.height/2
        three.camera.position.x = this.cube.width/2
        three.camera.lookAt(this.cube.width/2, this.cube.height/2, this.cube.depth/2)
        three.scene.add(three.camera)
        
        const cube = new THREE.Group();
        cube.name = 'cube';
        three.scene.add(cube);

        // const line1 = Line.create(this.line1, this.lineThickness)


        
        this.createLines()
        this.updateLines(false)


        three.controls.target.set((this.cube.width-1)/2, (this.cube.height-1)/2, (this.cube.depth-1)/2);
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
