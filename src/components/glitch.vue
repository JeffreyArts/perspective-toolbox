<!-- 
    Made possible with the help of Matt Gross
    https://codepen.io/mattgrosswork/pen/VwprebG
    https://codepen.io/mattgrosswork/pen/bGgWGxy
 -->
<template>
    <span class="glitch">
        <span ref="glitchLayer0" v-html="glitchedInput" />
        <span ref="glitchLayer1" v-html="glitchedInput" />
        <span ref="glitchLayer2" v-html="glitchedInput" />
    </span>
</template>

<script>

import _ from "lodash"
export default {
    name: "glitch-component",
    props: {
        inputs: {
            type: Array,
            required: false
        },
        duration: {
            type: Number,
            required: false,
            default: 800
        },
        delay: {
            type: Number,
            required: false,
            default: 4800
        },
        positionJumps: {
            type: Number,
            required: false,
            default: 6
        },
        glitchJumps: {
            type: Number,
            required: false,
            default: 6
        },
        opacityJumps: {
            type: Number,
            required: false,
            default: 6
        }
    },
    data() {
        return {
            glitchedInput: "",
            clipPaths: [["polygon(0% 100%,100% 100%)"],["polygon(0% 100%,100% 100%)"],["polygon(0% 100%,100% 100%)"]],
            clipIndex: 0,
            textIndex: 0,
            startTime: 0,
        }
    },
    watch:{
    },
    mounted() {

        if (!this.inputs) {
            this.glitchedInput = this.$slots.default()[0].text
        } else {
            this.glitchedInput = this.inputs[0]
        }

        this.glitchLayers()
    },
    unmounted() {
        
    },
    methods: {
        generateGlitchMasksPath() {
            const number = Math.floor(Math.random() * 60)
            const points = []
            let x = 0
            let y = 0

            for (let i = 0; i < number; i++) {
                // Alternate between x and y
                if (i % 2) {
                    x = Math.floor(Math.random() * 100)
                } else {
                    y = Math.floor(Math.random() * 100)
                }

                points.push(`${x}% ${y}%`)
            }
            return `polygon(${points.join(",")})`
        },
        animateClipPath(domElement, index = 0) {
            const clipPath = this.generateGlitchMasksPath()
            domElement.style.setProperty("--path", clipPath)
            var delay =  index % 2 === 0 ? Math.ceil(Math.random() * (this.duration / glitchJumps)) + (this.duration / glitchJumps / 4) : (this.duration / glitchJumps / 4)
            setTimeout(() => {
                if (this.startTime + this.duration > Date.now()) {
                    this.animateClipPath(domElement, index + 1)
                } else {
                    domElement.style.setProperty("--path", "")
                    return
                }
            }, delay)
        },
        animatePosition(domElement, index = 0) {
            const position = {
                left: Math.floor(Math.random() * 32) - 16,
                top: Math.floor(Math.random() * 32) - 16,
            }

            position.left = position.left < 0 ? position.left - 16 : position.left + 16
            position.top = position.top < 0 ? position.top - 16 : position.top + 16
            var delay = Math.ceil(Math.random() * (this.duration / this.positionJumps) + (this.duration / this.positionJumps / 4))

            domElement.style.setProperty("translate", `${position.left}% ${position.top}%`)
            setTimeout(() => {
                if (this.startTime + this.duration > Date.now() + delay) {
                    this.animatePosition(domElement, index + 1)
                } else {
                    domElement.style.setProperty("translate", "0 0")
                    return
                }
            }, delay) 
        },
        animateOpacity(domElement, opts, index = 0) {
            // const minDelay = opts.minDelay || 512
            const offDelay = opts.offDelay || 512
            const onDelay = opts.onDelay || 128
            
            let opacity =  index % 2 === 0 ? 1 : 0
            if (opts.inverted === true) {
                opacity = index % 2 === 0 ? 0 : 1
            }

            domElement.style.setProperty("opacity", opacity)
            var delay =  index % 2 === 0 ? Math.ceil(Math.random() * offDelay) + offDelay : Math.ceil(Math.random() * onDelay) + onDelay
            
            setTimeout(() => {
                if (this.startTime + this.duration > Date.now() + delay) {
                    this.animateOpacity(domElement, opts, index + 1)
                } else {
                    domElement.style.setProperty("opacity", 1)
                    return
                }
            }, delay)            
        },
        glitchLayer(layerIndex) {
            // Set timestamp for this.startTime
            this.startTime = Date.now()
            

            var inverted = layerIndex === 0 ? false : true
            var minDelay = layerIndex === 0 ? this.duration / this.opacityJumps / 4 : this.duration / this.opacityJumps
            const targetLayer = this.$refs[`glitchLayer${layerIndex}`]
            
            this.animatePosition(targetLayer)
            this.animateClipPath(targetLayer)
            this.animateOpacity(targetLayer, {
                minDelay: minDelay,
                onDelay: minDelay,
                offDelay: minDelay * 2,
                inverted: inverted
            })
        },
        glitchLayers() {
            this.glitchLayer(0)
            this.glitchLayer(1)
            this.glitchLayer(2)
            
            setTimeout(() => {
    
                this.textIndex = (this.textIndex + 1) % this.inputs.length
                this.glitchedInput = this.inputs[this.textIndex]
                this.$emit("glitchChange", this.glitchedInput)

                setTimeout(() => {
                    this.glitchLayers()
                }, this.delay)
                

            }, this.duration*.8)
        },
    }
}

</script>

<style lang="scss">
@import "./../assets/scss/variables.scss";
.glitch {
    position: relative;
    z-index: 1;
    > * {
        display: inline-block;  
        clip-path: var(--path);
        
        &:nth-child(1) {
            position: relative;
            z-index: 2;
        }

        &:nth-child(2),
        &:nth-child(3) {
            position: absolute;
            clip-path: var(--path);
            top: 0;
            left: 0;
            z-index: -1;
        }
        
        &:nth-child(2) {
            color: $accentColor;
        }
        &:nth-child(3) {
            color: #ddd;
        }
    }
}

</style>