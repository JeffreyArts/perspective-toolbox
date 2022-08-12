<template>
    <div class="convex-geometry">
        <header class="title">
            <h1>Convex geometry</h1>
        </header>

        <hr>
        <section class="viewport">
            <div class="viewport-content" ratio="1x1" />
            <span class="source">
                source:
                <a href="https://threejs.org/examples/?q=convex#webgl_geometry_convex" target="_blank">webgl_geometry_convex</a>
            </span>
        </section>

        <aside class="sidebar">
            <div class="options">

                <div class="option-group" name="Options">
                    <div class="option">
                        <!-- <label>Wireframe</label>÷ -->
                        <span>
                            <input type="checkbox" id="checkbox-v0" value="true" v-model="wireframe" v-on:change="toggleWireframe()">
                            <label for="checkbox-v0">
                                Wireframe
                            </label>
                        </span>
                    </div>
                    <div class="option">
                        <span>
                            <input type="checkbox" id="convex" value="true" v-model="convex" v-on:change="toggleConvex()">
                            <label for="convex">
                                Convex
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

import * as BufferGeometryUtils from "./../../../node_modules/three/examples/jsm/utils/BufferGeometryUtils.js"
import { ConvexGeometry } from "./../../../node_modules/three/examples/jsm/geometries/ConvexGeometry.js"
import Stats from "./../../../node_modules/three/examples/jsm/libs/stats.module.js"
import view from "./../../services/3d-view.js"
import dotImage from "./../../assets/images/dot.png"

var three = view.init({orbitControls: true})


export default {
    props: [],
    data() {
        return {
            animation: true,
            wireframe: true,
            convex: true,

            point1: [0,0,0],
            point2: [0,1,0],
            point3: [0,1,1],
            point4: [0,0,1],
        }
    },
    mounted() {
        this.init()

        // Prevent multiple camera's / meshes to be added
        if (three.scene.initialised) {
            return
        }
        // Everything below will only be added the first time that this component is mounted

        // Set camera
        three.camera.position.z = 0
        three.camera.position.y = 48
        three.camera.position.x = 0
        three.camera.lookAt(0,0,0)
        three.scene.add(three.camera)

        // Create object
        this.createModel()
        
       
        // Features
        this.toggleConvex()
        this.toggleWireframe()


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
        toggleWireframe() {
            var group = _.find(three.scene.children, {type:"Group"})
            group.children.forEach(obj => {
                if (obj.type === "Mesh") {
                    if (this.wireframe) {
                        obj.material = new THREE.MeshBasicMaterial({color: 0xff0066, wireframe: true})
                    } else {
                        obj.material = new THREE.MeshLambertMaterial({color: 0xff0066, wireframe: false})
                    }
                }
            })
        },
        createModel() {
            this.geometry = new THREE.Group()
            three.scene.add( this.geometry )

            const loader = new THREE.TextureLoader()
            const texture = loader.load( dotImage )
            
            // points

            let dodecahedronGeometry = new THREE.DodecahedronGeometry( 10 )

            // if normal and uv attributes are not removed, mergeVertices() can't consolidate indentical vertices with different normal/uv data

            dodecahedronGeometry.deleteAttribute( "normal" )
            dodecahedronGeometry.deleteAttribute( "uv" )

            dodecahedronGeometry = BufferGeometryUtils.mergeVertices( dodecahedronGeometry )
            
            const vertices = []
            const positionAttribute = dodecahedronGeometry.getAttribute( "position" )

            for ( let i = 0; i < positionAttribute.count; i ++ ) {

                const vertex = new THREE.Vector3()
                vertex.fromBufferAttribute( positionAttribute, i )
                vertices.push( vertex )

            }

            // const pointsMaterial = new THREE.PointsMaterial( {
            //     color: 0xff0066,
            //     map: texture,
            //     size: 1,
            //     alphaTest: 0.5
            // } );

            const pointsGeometry = new THREE.BufferGeometry().setFromPoints( vertices )

            const points = new THREE.Points( pointsGeometry )
            this.geometry.add( points )


            // convex hull

            const meshMaterial = new THREE.MeshLambertMaterial( {
                color: 0xffffff,
                opacity: 0.5,
                transparent: true
            } )

            const meshGeometry = new ConvexGeometry( vertices )

            const mesh1 = new THREE.Mesh( meshGeometry, meshMaterial )
            mesh1.material.side = THREE.BackSide // back faces
            mesh1.renderOrder = 0
            this.geometry.add( mesh1 )

            const mesh2 = new THREE.Mesh( meshGeometry, meshMaterial.clone() )
            mesh2.material.side = THREE.FrontSide // front faces
            mesh2.renderOrder = 1
            this.geometry.add( mesh2 )
        },
        toggleConvex() {
            var group = _.find(three.scene.children, {type:"Group"})
            var points = _.find(group.children, {type:"Points"})

            const loader = new THREE.TextureLoader()
            const texture = loader.load( dotImage )

            if (this.convex) {
                points.material = new THREE.PointsMaterial( {
                    color: 0xff0066,
                    map: texture,
                    size: 1,
                    alphaTest: 0.5
                })
            } else {
                points.material = new THREE.PointsMaterial( {
                    color: 0xff0066,
                    map: texture,
                    size: 0,
                    alphaTest: 0.5
                })
            }
            // var group = _.find(three.scene.children, {type:"Group"});
            // group.children.forEach(obj => {
            //     if (obj.type === "Mesh") {
            //         if (this.wireframe) {
            //             obj.material = new THREE.MeshBasicMaterial({color: 0xff0066, wireframe: true});
            //         } else {
            //             obj.material = new THREE.MeshLambertMaterial({color: 0xff0066, wireframe: false});
            //         }
            //     }
            // })

            
        },
    }
}
</script>


<style lang="scss">
    @import '../../assets/scss/variables.scss';

    .convex-geometry {
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
    }
</style>
