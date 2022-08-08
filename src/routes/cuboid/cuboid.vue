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
                        <input type="range" id="far" v-model.number="lineThickness" step=".01" min="0.01" max="1" @change="createCuboid()">
                        <input type="number" step=".01" min="0" max="1" v-model.number="lineThickness" @change="createCuboid()">
                    </div>
                    <div class="option">
                        <label for="transitionType">
                            Sensitivity
                            <select name="transitionType" v-model="sensitivity" @change="createCuboid()">
                                <option v-for="s in sensitivityScales" :value="s">{{s}}</option>
                            </select>
                        </label>
                    </div>
                    <div class="option">
                        <label for="seed">
                            Seed
                            <input type="number" id="seed" v-model="seed" @change="createCuboid()">
                        </label>
                    </div>

                    <div class="option">
                        <button class="button" @click="shuffleLines()" >Shuffle Lines</button>
                    </div>

                    <div class="option">
                        <label for="point1">
                            Cube <small>[width,height,depth]</small>
                        </label>

                        <div class="group">
                            <input type="number" id="cubeWidth" v-model.number="cube.width" step="1" min="3" max="16" @change="createCuboid()">
                            <input type="number" id="cubeHeight" v-model.number="cube.height" step="1" min="3" max="16" @change="createCuboid()">
                            <input type="number" id="cubeDepth" v-model.number="cube.depth" step="1" min="3" max="16" @change="createCuboid()">
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
                   
                </div>

            </div>
        </aside>
    </div>
</template>


<script>
import * as THREE from 'three';
import _ from 'lodash';
import {PolylineAlgorithm, Grid, Polyline} from 'visual-pattern-generator';
import TWEEN from '@tweenjs/tween.js';
import Stats from './../../../node_modules/three/examples/jsm/libs/stats.module.js';
import view from '../../services/3d-view.js';
import Line from '../../services/line.js';

var three = view.init({orbitControls: true})
var symbols = [
    {
        polylines: [
            [{x:0, y:0},{ x:1, y:0}]
        ],
        connectCords: [
            {x:0, y:0},
            {x:1, y:0}
        ],
        width:2,
        height:1
    },
    {
        polylines: [
            [{x:0, y:0},{ x:0, y:1}]
        ],
        connectCords: [
            {x:0, y:0},
            {x:0, y:1}
        ],
        width:1,
        height:2
    }
];

const algorithmConfig = {
    width: 5,
    height: 5,
    symbols: symbols,
    algorithm: {
        type: "polylines",
        startPoint: {x:0, y:0},
        mirrorX: 1,
        mirrorY: 1,
        drawConnectLines: true
    }
}


export default {
    props: [],
    data() {
        return {
            animation: true,
            transitionDuration: 1600,
            lineThickness: .25,
            helperCubeVisibility: false,
            amountOfLines: 32,
            seed: Math.floor(Math.random()*9000+1000).toString(),
            sensitivity: "abstract",
            sensitivityScales: ["abstract","non-identity","identity","open"],
            sides: ["left","right","front","back","top","bottom"],
            polylines: {
                bottom: [],
                top: [],
                left: [],
                right: [],
                front: [],
                back: []
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
            
            _.each(cube.children, (line, lineIndex) => {
                line.data.length = Line.getLength(line);
                const scale = (line.data.length + this.lineThickness) * (1/this.lineThickness)

                if (animateLines) {
                    setTimeout(() => {

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
                    })
                } else {
                    line.scale.x = scale;
                    line.rotation.setFromVector3(Line.getRotation(line));
                    line.position.copy(Line.getPosition(line, this.cube));
                }
            });
        },
        shuffleLines() {
            const cube = _.find(three.scene.children, {name: 'cube'});
            var newFaceIndex;
            
           _.each(cube.children, (line) => {
               switch (line.data.side) {
                   case "front":    newFaceIndex = "back";      break; 
                    case "back":     newFaceIndex = "front";     break; 
                    case "bottom":   newFaceIndex = "top";       break; 
                    case "top":      newFaceIndex = "bottom";    break; 
                    case "left":     newFaceIndex = "right";     break; 
                    case "right":    newFaceIndex = "left";      break; 
                }
                line.data.side = newFaceIndex;
            })

            this.updateLines(true)
        },
        addFace(cube, polylines, side) {
            _.each(polylines, polyline => {
                const line = {
                    start: {
                        x: polyline[0].x,
                        y: polyline[0].y,
                    },
                    end: {
                        x: polyline[1].x,
                        y: polyline[1].y,
                    },
                    color: `#ff0066`,
                    side: side
                };

                cube.add(Line.create(line, this.lineThickness));
            })
        },
        createCuboid() {
            this.lines.length = 0;
            const cube = _.find(three.scene.children, {name: 'cube'});
            const helperCube = _.find(three.scene.children, {name: 'helper-cube'});
            
            for (let i = cube.children.length - 1; i >= 0; i--) {
                if(cube.children[i].type === "Mesh") {
                    cube.children[i].geometry.dispose();
                    cube.children[i].material.dispose();
                    cube.remove(cube.children[i]);
                }
            }
            
            if (helperCube) {
                for (let i = helperCube.children.length - 1; i >= 0; i--) {
                    if(helperCube.children[i].type === "Mesh") {
                        helperCube.children[i].geometry.dispose();
                        helperCube.children[i].material.dispose();
                        helperCube.remove(helperCube.children[i]);
                    }
                }
            }
            
            var query = _.merge({},algorithmConfig, {width: this.cube.width, height: this.cube.height});

            if (this.sensitivity == 'abstract') {
                _.merge(query.algorithm, {
                    mirrorX: 1,
                    mirrorY: 1,
                    // mask: [
                    //     [1,0,0,0,1],
                    //     [0,0,0,0,0],
                    //     [0,0,0,0,0],
                    //     [0,0,0,0,0],
                    //     [1,0,0,0,1],
                    // ]
                });

                var polylines = PolylineAlgorithm(query).polylines;
                this.polylines.front = polylines;
                this.polylines.back = polylines;
                this.polylines.top = polylines;
                this.polylines.bottom = polylines;
                this.polylines.left = polylines;
                this.polylines.right = polylines;
            }

            
            _.each(this.polylines, (face, faceIndex) => {
                _.each(face, polyline => {
                    const line = {
                        start: {
                            x: polyline[0].x,
                            y: polyline[0].y,
                        },
                        end: {
                            x: polyline[1].x,
                            y: polyline[1].y,
                        },
                        color: `#ff0066`,
                        side: faceIndex
                    };

                    cube.add(Line.create(line, this.lineThickness));
                })
            })

            three.controls.target.set((this.cube.width-1)/2, (this.cube.height-1)/2, (this.cube.depth-1)/2);
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


        
        this.createCuboid()
        this.updateLines(false)
        this.toggleHelperCube()


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
