<template>

    <div class="Glitch">
        <header class="title">
            <h1>Glitch effect</h1>
        </header>

        <hr>
        <section class="viewport">
            <div class="glitch-effect-container" ratio="1x1">
                <glitch :texts="texts">{{texts[0]}}</glitch>
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
            </div>
        </aside>
    </div>
</template>


<script>
// import * as THREE from "three"
// import _ from "lodash"
// import Glitch from "@/components/glitch.vue"
import Glitch from "./../../components/glitch.vue"

export default {
    components: {
        Glitch
    },
    props: [],
    data() {
        return {
            texts: ["Hello World", "Hallo wereld", "lorum ipsum dolor sit amet"],
        }
    },
    mounted() {
        // this.init()
    },
    methods: {
       
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
    font-size: 24px;
    font-weight: bold;
}
</style>
