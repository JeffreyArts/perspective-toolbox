<template>

    <div class="text-to-threejs">
        <header class="title">
            <h1>Text to three.js</h1>
        </header>

        <hr>
        <section class="viewport">
            <section class="dashboard">
                <div class="dashboard-item" type="html">
                    <div class="html-output" id="html-output" v-html="html" :style="css" />
                </div>
                <div class="dashboard-item" type="png">
                    
                </div>
                <div class="dashboard-item" type="code">
                    <textarea name="" id="" cols="30" rows="10" v-model="html" @keyup="updateCanvas()" />
                </div>
                <div class="dashboard-item" type="threejs">
                    <div class="viewport-content"/>
                </div>
            </section>
        </section>

        <aside class="sidebar">
            <div class="options">

                <div class="option-group" name="Options">
                    <div class="option">
                        <span>
                            <input type="checkbox" id="checkbox-v0" v-model="hideDom">
                            <label for="checkbox-v0">
                                Hide html element
                            </label>
                        </span>
                    </div>
                    <div class="option">
                        
                        <label for="fontSize">
                            Font-size
                        </label>
                        <input type="number" id="fontSize" min="4" step="1" v-model.number.lazy="fontSize"  @change="updateCanvas()">
                        
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
import domtoimage from "dom-to-image"

var three = view.init({orbitControls: true})

export default {
    props: [],
    data() {
        return {
            plane: null,
            hideDom: false,
            fontSize: 10,
            css: {
                zIndex: 1
            },
            html: `<h1>Lorem ipsum</h1>
<p>Amet consectetur adipisicing elit. Sit repellendus delectus est culpa, ipsum voluptates dicta eum provident sapiente amet fugit dolor cum, odit atque aut assumenda hic non porro! Facere accusantium esse similique et recusandae pariatur! Libero, sint consequuntur alias sapiente ad impedit error, velit eum facere corporis itaque quis nemo quaerat aliquam. Quaerat, obcaecati minus, libero, magnam cupiditate excepturi harum </p>`
        }
    },
    watch: {
        hideDom(newVal, oldVal) {
            if (newVal) {
                this.css.zIndex = -1
            } else {
                this.css.zIndex = 1
            }
        },
        fontSize(newVal, oldVal) {
            this.css.fontSize = `${newVal}px`
        }
    },
    mounted() {
        this.init()

        // Prevent multiple camera's / meshes to be added
        if (three.scene.initialised) {
            // this.geometry = _.find(three.scene.children, {type:"Mesh"}).geometry;
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
        this.createPlane()

        this.updateCanvas()
        three.scene.initialised = true
        window.addEventListener("resize", this.updateCanvasSize)
    },
    unmounted() {
        // This destroys the animation loop when navigating to another page
        this.animation = false
        window.removeEventListener("resize", this.updateCanvasSize)
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
        },
        updateCanvasSize() {

            var width = this.$el.querySelector(".dashboard-item[type='threejs']").clientHeight
            var height = this.$el.querySelector(".dashboard-item[type='threejs']").clientHeight

            three.renderer.setSize( width, height)
            three.camera.bottom = -height
            three.camera.top = height
            three.camera.left = -width
            three.camera.right = width

            three.camera.updateProjectionMatrix()
        },
        updateCanvas() {
            var domElement = document.getElementById("html-output")
            domtoimage.toPng(domElement).then( (dataUrl) => {
                var img = new Image()
                img.src = dataUrl

                var targetElement = document.querySelector(".dashboard-item[type='png']")
                targetElement.innerHTML = ""
                targetElement.appendChild(img)
                img.onload = () => {
                    new THREE.TextureLoader().load( img.src, texture => {
                        this.plane.material = new THREE.MeshBasicMaterial( {color: 0xffffff, map: texture} )
                    }, null, (error) => {
                        console.error(error)
                    }) 
                    
                    window.dispatchEvent(new Event("resize"))
                    this.plane.geometry = new THREE.PlaneGeometry( img.clientWidth / img.clientHeight * 1, 1 ) 
                }
            })
                .catch(function (error) {
                    console.error("oops, something went wrong!", error)
                })
        },
        createPlane() {
            const geometry = new THREE.PlaneGeometry( 1, 1 ) // update with height/width of image
            const material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide} )
            const plane = new THREE.Mesh( geometry, material )
            plane.position.x = 0
            plane.position.y = 0
            plane.position.z = 0
            three.scene.add( plane )
            this.plane = _.find(three.scene.children, {type:"Mesh"})
        },
    }
}
</script>


<style lang="scss">

    @import '../../assets/scss/variables.scss';

    .dashboard {
        display: grid;
        grid-template-columns: 100%;
        height: 100%;
        margin-top: 32px;

        @media all and (min-width: 768px) {
            max-height: calc(100vh - 148px);
            grid-template-columns: 50% 50%;
        }
    }

    .text-to-threejs {
        .html-output {
            padding: 16px;
            position: relative;
            background-color: #fff;
            color: #222;
            font-size: 10px;
            
            h1 {
                font-size: 16px;
                text-decoration: underline;
            }
        }

        textarea {
            padding: 16px;
            font-family: monospace;
            margin: 0;
            border: 0 none transparent;
            width: 100%;
            height: 100%;
            &:focus {
                outline: 0 none transparent;
            }
        }

        .viewport {
            width: calc(100vh - 148px);
            height: calc(100vh - 148px);
            padding-top: 0;
        }
        .viewport-stats {
            position: absolute !important;
            left: auto !important;
            top: auto !important;
            right: 0 !important;
            bottom: 0 !important;
        }

        .viewport-content {
            position: relative;
            width: calc(50vh - 74px);
            height: calc(50vh - 74px);
        }

        .sidebar {
            width: calc(100vw - (100vh - 148px) - 40px - 96px);
        }

        .dashboard-item {
            background-color: #fff;
            position: relative;
            overflow: auto;
            width: calc(50vh - 74px);
            height: calc(50vh - 74px);

            &[type="code"] {
                textarea {
                    font-size: 12px;
                    font-family: monospace;
                }
            }
            &[type="threejs"] {
                background-color: transparent;
                justify-content: center;
                align-items: center;
                overflow: hidden;
                
                .viewport-content {
                    background-color: transparent;
                }
            }
            &:after {
                content: attr(type);
                position: absolute;
                left: 0;
                top: 0;
                font-size: 8px;
                padding: 4px;
                z-index: 20220;
                background-color: #f09;
                color: #fff;
                display: none;
            }
            &:hover {
                &:after {
                    display: block;
                }
            }
        }
    }
    
    body.__menuOpen {
        .text-to-threejs {
            .sidebar {
                width: calc(100vw - (100vh - 148px) - 40px - 96px - 320px);
            }
        }
    }
</style>
