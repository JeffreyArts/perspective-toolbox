<!-- 
    Made possible with the help of Matt Gross
    https://codepen.io/mattgrosswork/pen/VwprebG
    https://codepen.io/mattgrosswork/pen/bGgWGxy
 -->
<template>
    <span class="glitch">
        <span ref="glitchLayer0">{{glitchedText}}</span>
        <span ref="glitchLayer1">{{glitchedText}}</span>
        <span ref="glitchLayer2">{{glitchedText}}</span>
    </span>
</template>

<script>

import _ from "lodash"
export default {
    name: "glitch-component",
    props: {
        texts: {
            type: Array,
            required: false
        },
        // duration: {
        //     type: Number,
        //     required: false,
        //     default: 0.1
        // },
        // delay: {
        //     type: Number,
        //     required: false,
        //     default: 0.1
        // },
        // repeat: {
        //     type: Number,
        //     required: false,
        //     default: 0.1
        // },
        // repeatDelay: {
        //     type: Number,
        //     required: false,
        //     default: 0.1
        // },
        // yoyo: {
        //     type: Boolean,
        //     required: false,
        //     default: false
        // },
        // ease: {
        //     type: String,
        //     required: false,
        //     default: "linear"
        // },
        // text: {
        //     type: String,
        //     required: false,
        //     default: ""
        // }
    },
    data() {
        return {
            glitchedText: "",
            clipPaths: [["polygon(0% 100%,100% 100%)"],["polygon(0% 100%,100% 100%)"],["polygon(0% 100%,100% 100%)"]],
            clipIndex: 0,
            textIndex: 0,
        }
    },
    watch:{
    },
    mounted() {

        // target.style.setProperty("--path", `polygon(${points.join(",")})`)
        this.clipPaths[0].push(this.generateGlitchMasksSVG())
        this.clipPaths[0].push(this.generateGlitchMasksSVG())
        this.clipPaths[0].push(this.generateGlitchMasksSVG())

        this.clipPaths[1].push(this.generateGlitchMasksSVG())
        this.clipPaths[1].push(this.generateGlitchMasksSVG())
        this.clipPaths[1].push(this.generateGlitchMasksSVG())

        this.clipPaths[2].push(this.generateGlitchMasksSVG())
        this.clipPaths[2].push(this.generateGlitchMasksSVG())
        this.clipPaths[2].push(this.generateGlitchMasksSVG())

        // console.log(this.$slots.default()[0])
        if (!this.texts) {
            this.glitchedText = this.$slots.default()[0].text
        } else {
            this.glitchedText = this.texts[0]
        }

        this.animateLayer(0)
        this.animateLayer(1)
        this.animateLayer(2)
    },
    unmounted() {
        
    },
    methods: {
        generateGlitchMasksSVG() {
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
        animateLayer(layerIndex) {
            // layerIndex+=1
            setInterval(() => {
                if (!this.$refs[`glitchLayer${layerIndex}`]) {
                    return
                }

                this.clipIndex = (this.clipIndex + 1) % this.clipPaths[layerIndex].length
                this.$refs[`glitchLayer${layerIndex}`].style.setProperty("--path", this.clipPaths[layerIndex][this.clipIndex])
                if (this.clipIndex == 0 && this.texts.length > 0) {
                    this.textIndex = (this.textIndex + 1) % this.texts.length
                
                    this.glitchedText = this.texts[this.textIndex]
                }
            
            }, 480)
        }
    }
}

</script>

<style lang="scss">
.glitch {
    position: relative;
    z-index: 1;
    > * {
        animation: glitch 2.4s linear infinite alternate;
        
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
            translate: -10% 4%;
            text-shadow: 0 0 1px rgb(255, 139, 224);
            color: transparent;
        }
        &:nth-child(3) {
            translate: 2% 16%;
            color: rgb(77, 131, 248);
            animation-delay: .32s;
        }
    }

}
// .glitch-path {
//     clip-path: var(--path);
//     background-color: #f09;
//     position: absolute;
//     left: 0;
//     right: 0;
//     bottom:0;
//     top:0;
// }


@keyframes glitch {
  0%,
  5%,
  45%,
  76%,
  90% {
    clip-path: var(--path)
  }

  1%,
  7%,
  33%,
  47%,
  78%,
  93% {
    clip-path: none;
  } 
}
</style>