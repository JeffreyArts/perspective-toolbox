<template>

    <div class="story-cloud">
        <header class="title">
            <h1>Story cloud</h1>
        </header>

        <hr>
        <section class="viewport">
            <div class="viewport-content" ratio="1x1">
                <story-box :chapter="story[chapterIndex]" :index="paragraphIndex"></story-box>
            </div>
        </section>

        <aside class="sidebar">
            <div class="options">
                <div class="option-group" name="Options">
                    <div class="option">
                        <label for="index">Index</label>
                        <input type="number" v-model="paragraphIndex" min="0" :max="story[chapterIndex]" id="index">
                    </div>
                    <div class="option">
                        <label for="chapterIndex">chapterIndex</label>
                        <input type="number" v-model="chapterIndex" min="0" :max="story.length-1" id="chapterIndex">
                    </div>
                </div>

            </div>
        </aside>
    </div>
</template>


<script>
import _ from "lodash"
import TWEEN from "@tweenjs/tween.js"
import StoryBox from "./../../components/story-box.vue"

export default {
    name: "storyCloud",
    components: {
        StoryBox
    },
    props: [],
    data() {
        return {
            transitionDuration: 1600,
            story: [
                [
                    "In een wereld waarin er meer informatie wordt <glitch>verspreid</glitch> in een minuut dan <em>dat</em> je in een <strong>mensenleven tot je kunt</strong> nemen.",
                    "Is het niet verwonderlijk dat de nuttigheid van deze informatie ontzettend verschilt.",
                    "Ja, ik <i>kan</i> je vertellen dat de wombats het enige dier is dat vierkante keutels poept",
                    "Of dat de afstand tussen de aarde en de maan minder dan 10x de omtrek van onze planeet is.",
                    "Maar de kans is groot dat deze informatie niet van grote waarde is voor jou.",
                    "Dat is namelijk grotendeels afhankelijk van jouw positie in de wereld.",
                ],
                [
                    "Daarom wil ik je graag meenemen op een reis, om je kennis te laten maken met de waarde van perceptie.",
                    "Het punt waar vandaan je informatie tot je neemt is namelijk net zo relevant als de informatie zelf.",
                    "Laat me je dit uitleggen."
                ]
            ],
            paragraphIndex: 0,
            chapterIndex: 0
        }
    },
    mounted() {
        // this.init()

    },
    methods: {
        init(){
        },
        
    }
}
</script>


<style lang="scss">

    @import '../../assets/scss/variables.scss';

    .story-cloud {
        .viewport-content {
            padding: 20px;
            font-size: 16px;
            color: $accentColor;
            text-align: center;
        }
    }
</style>
