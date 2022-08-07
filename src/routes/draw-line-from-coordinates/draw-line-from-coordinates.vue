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
                            x: <input type="number" id="line1" v-model="line1.start.x" step="1" min="0" max="16" @change="updateLine('line1')">&nbsp;
                            y: <input type="number" id="line1" v-model="line1.start.y" step="1" min="0" max="16" @change="updateLine('line1')">
                        </div>
                    </div>
                    <div class="option">
                        <label for="line1">
                            End
                        </label>
                        <div class="group">
                            x: <input type="number" id="line1" v-model="line1.end.x" step="1" min="0" max="16" @change="updateLine('line1')">&nbsp;
                            y: <input type="number" id="line1" v-model="line1.end.y" step="1" min="0" max="16" @change="updateLine('line1')">
                        </div>
                    </div>
                    <div class="option">
                        <label for="line1">
                            Side
                        </label>
                        <div class="group">
                            <select name="line1side" v-model="line1.side" >
                                <option v-for="(side, index) in sides" :value="side">{{side}}</option>
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
                            x: <input type="number" id="line2" v-model="line2.start.x" step="1" min="0" max="16" @change="updateLine('line2')">&nbsp;
                            y: <input type="number" id="line2" v-model="line2.start.y" step="1" min="0" max="16" @change="updateLine('line2')">
                        </div>
                    </div>
                    <div class="option">
                        <label for="line2">
                            End
                        </label>
                        <div class="group">
                            x: <input type="number" id="line2" v-model="line2.end.x" step="1" min="0" max="16" @change="updateLine('line2')">&nbsp;
                            y: <input type="number" id="line2" v-model="line2.end.y" step="1" min="0" max="16" @change="updateLine('line2')">
                        </div>
                    </div>
                    <div class="option">
                        <label for="line2">
                            Side
                        </label>
                        <div class="group">
                            <select name="line2side" v-model="line2.side" >
                                <option v-for="(side, index) in sides" :value="side">{{side}}</option>
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

var three = view.init({orbitControls: true})
import degreesToRadians from '../../services/degrees-to-radians.js';


export default {
    props: [],
    data() {
        return {
            animation: true,
            wireframe: true,
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
                    x: 0,
                    y: 0,
                },
                end: {
                    x: 0,
                    y: 1,
                },
                color:'#f06',
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
                color:'#60f',
                side: "right"
            },
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
            const helperCube = new THREE.Group();
            helperCube.name = "helper-cube";
            let sphere = null;
            // Create bottom face
            for (var x=0; x<this.cube.width; x++) {
                for (var y=0; y<this.cube.height; y++) {
                    sphere = new THREE.Mesh(new THREE.SphereGeometry( 0.01, 32, 16 ), new THREE.MeshBasicMaterial({color: 0xff0066, wireframe: true}));
                    sphere.position.x = x
                    sphere.position.y = y
                    sphere.position.z = 0
                    helperCube.add(sphere.clone());

                    sphere.position.x = x
                    sphere.position.y = 0
                    sphere.position.z = y
                    helperCube.add(sphere.clone());

                    sphere.position.x = 0
                    sphere.position.y = x
                    sphere.position.z = y
                    helperCube.add(sphere.clone());

                    sphere.position.x = x
                    sphere.position.y = y
                    sphere.position.z = this.cube.depth -1
                    helperCube.add(sphere.clone());

                    sphere.position.x = this.cube.depth -1
                    sphere.position.y = x
                    sphere.position.z = y
                    helperCube.add(sphere.clone());

                    sphere.position.x = x
                    sphere.position.y = this.cube.depth -1
                    sphere.position.z = y
                    helperCube.add(sphere.clone());
                    
                }
            }
            // helperCube.material = ;
            three.scene.add(helperCube)
        },
        createLine(line, cube) {
            const geometry = new THREE.BoxGeometry(this.lineThickness,this.lineThickness,this.lineThickness);
            
            const mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: line.color, wireframe: false}));
            mesh.data = line;
            return mesh
        },
        setLineRotation(line) {
            var length = line.scale.x 
            if (line.data.side == 'left' || line.data.side == 'right') {
                if (Math.abs(line.data.start.x - line.data.end.x)) {
                    line.rotation.x = degreesToRadians(90);
                    line.rotation.y = 0;
                    line.rotation.z = 0;
                } else {
                    line.rotation.x = 0;
                    line.rotation.y = 0;
                    line.rotation.z = degreesToRadians(90);
                }
            }
        },
        setLineLength(line) {
            if (line.data.side == 'left' || line.data.side == 'right') {
                var length = Math.abs(line.data.start.x - line.data.end.x);
                
                if (length === 0) {
                    length = Math.abs(line.data.start.y - line.data.end.y);
                }
                line.data.length = length;
                line.scale.x = length * (1/this.lineThickness)
            }
        },
        getLinePosition(line) {
            var result = new THREE.Vector3();
            if (line.data.side == 'left') {
                result.z = 0
                if (line.data.start.y > line.data.end.y) {
                    result.x = line.data.start.x;
                    result.y = line.data.end.y + line.data.length/2;
                } else if (line.data.start.y < line.data.end.y) {
                    result.x = line.data.start.x;
                    result.y = line.data.start.y + line.data.length/2;
                } else if (line.data.start.x > line.data.end.x) {
                    result.x = line.data.end.x + line.data.length/2;
                    result.y = line.data.start.y;
                } else if (line.data.start.x < line.data.end.x) {
                    result.x = line.data.start.x + line.data.length/2;
                    result.y = line.data.start.y;
                }
            } else if (line.data.side == 'right') {
                var startX = this.cube.depth -1;
                result.z = this.cube.width - 1
                if (line.data.start.y > line.data.end.y) {
                    result.x = startX - line.data.start.x;
                    result.y = line.data.end.y + line.data.length/2;
                } else if (line.data.start.y < line.data.end.y) {
                    result.x = startX - line.data.start.x;
                    result.y = line.data.start.y + line.data.length/2;
                } else if (line.data.start.x > line.data.end.x) {
                    result.x = startX - line.data.end.x - line.data.length/2; // for non-mirrored version: line.data.end.x + line.data.length/2; 
                    result.y = line.data.start.y;
                } else if (line.data.start.x < line.data.end.x) {
                    result.x = startX - line.data.start.x - line.data.length/2; // for non-mirrored version: line.data.start.x + line.data.length/2
                    result.y = line.data.start.y;
                }
                // result.x = line.position.x; // Mirror face
            }
            return result
        },
        updateLine(lineName, cube) {
            //this[lineName]
            var cube = _.find(three.scene.children, {name: 'cube'});
            var scale = 1/this.lineThickness
            _.each(cube.children, line => {
                this.setLineLength(line);
                this.setLineRotation(line);
                line.position.copy(this.getLinePosition(line));
            })

            // var line = _.find(cube.children, {name: lineName});
            // console.log(lineMesh.position)
        },
        toggleWireframe() {
            if (this.wireframe) {
                this.mesh.material = new THREE.MeshBasicMaterial({color: 0xff0066, wireframe: true});
            } else {
                this.mesh.material = new THREE.MeshLambertMaterial({color: 0xff0066, wireframe: false});
            }
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


        // Set camera
        three.camera.position.z = 2.4
        three.camera.position.y = 2.4
        three.camera.position.x = 2.4
        three.camera.lookAt(0,0,0)
        three.scene.add(three.camera)


        // Create object
        this.createHelperCube()
        // var geometry = new THREE.BoxGeometry(1,1,1);
        // this.mesh = new THREE.Mesh(geometry);
        // three.scene.add(this.mesh);
        // this.toggleWireframe();
        const cube = new THREE.Group();
        cube.name = 'cube';
        three.scene.add(cube);

        const line1 = this.createLine(this.line1, cube)
        const line2 = this.createLine(this.line2, cube)
        // const line1Mesh = new THREE.Mesh(line1Geometry, new THREE.MeshLambertMaterial({color: "#60f", wireframe: false}))
        //         line1Mesh.name = 'line1'
        // line1Mesh.name = 'line1'
        cube.add(line1);
        cube.add(line2);
        this.updateLine("line1", cube)
        this.updateLine("line2", cube)


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
