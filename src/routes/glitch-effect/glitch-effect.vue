<template>

    <div class="Glitch">
        <header class="title">
            <h1>Glitch effect</h1>
        </header>

        <hr>
        <section class="viewport">
            <div class="glitch-effect-container" ratio="1x1">
                A <glitch 
                        @glitchChange="glitchUpdate" 
                        :duration="duration" 
                        :delay="delay" 
                        :inputs="texts"
                        :repeat="repeat" 
                        :opacity-duration="opacityDuration" 
                        :position-jumps="positionJumps" 
                        :glitch-jumps="glitchJumps" 
                        :glitch-offset="glitchOffset"
                        :class="[`__is-${color.toLowerCase()}`]"></glitch> tree
            </div> 
        </section>

        <aside class="sidebar">
            <div class="options">

                <div class="option-group" name="Text">
                    <div class="option">
                        <input type="text" v-model="texts[0]" placeholder="String1">
                    </div>
                    <div class="option">
                        <input type="text" v-model="texts[1]" placeholder="String2">
                    </div>
                    <div class="option">
                        <input type="text" v-model="texts[2]" placeholder="String3">
                    </div>
                </div>
                <div class="option-group" name="Options">
                    <div class="option">
                        <label for="duration">Duration</label>
                        <input type="number" id="duration" v-model="duration" >
                    </div>
                    <div class="option">
                        <label for="duration">Delay</label>
                        <input type="number" id="duration" v-model="delay" >
                    </div>
                    <div class="option">
                        <label for="opacityDuration">Opacity duration</label>
                        <input id="opacityDuration" type="number" v-model="opacityDuration" min="32">
                    </div>
                    <div class="option">
                        <label for="glitchJumps">Glitch jumps</label>
                        <input id="glitchJumps" type="number" v-model="glitchJumps" min="0">
                    </div>
                    <div class="option">
                        <label for="glitchOffset">Glitch offset</label>
                        <input id="glitchOffset" type="number" v-model="glitchOffset" min="0">
                    </div>
                    <div class="option">
                        <label for="positionJumps">Position jumps</label>
                        <input id="positionJumps" type="number" v-model="positionJumps" min="0">
                    </div>
                    <div class="option">
                        <label for="positionJumps">Repeat</label>
                        <input id="positionJumps" type="number" v-model="repeat" min="0">
                    </div>
                </div>
            </div>
        </aside>
    </div>
</template>


<script>
import Glitch from "./../../components/glitch.vue"

export default {
    components: {
        Glitch
    },
    props: [],
    data() {
        return {
            texts: [ "red", "blue", "green"],
            duration: 104,
            delay: 380,
            color: "black",
            opacityDuration: 128,
            glitchJumps: 6,
            glitchOffset: 16,
            positionJumps: 6,
            repeat: 0,
        }
    },
    mounted() {
        window.dispatchEvent(new Event("resize"))
    },
    methods: {
        glitchUpdate(glitch){
            this.color = glitch
        }
       
    }
}
</script>


<style lang="scss">

@import '../../assets/scss/variables.scss';

.glitch-effect-container {
    width: 100%;
    background-color: #fff;
    color: #333;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 64px;
    font-weight: bold;
    .glitch {
        margin-left: 0.32em;
        margin-right: 0.32em;
    }
}
.__is-red {
    > * {
        &:nth-child(2) {
            color: red;
        }
        &:nth-child(3) {
            color: tomato;
        }
    }
}
.__is-blue {
    > * {
        &:nth-child(2) {
            color: blue;
        }
        &:nth-child(3) {
            color: aqua;
        }
    }
}
.__is-green {
    > * {
        &:nth-child(2) {
            color: green;
        }
        &:nth-child(3) {
            color: lime;
        }
    }
}
</style>
