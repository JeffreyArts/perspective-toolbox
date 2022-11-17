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
                        <input type="number" v-model="paragraphIndex" min="0" :max="story[chapterIndex]" id="index" @change="checkMaxParagraph">
                    </div>
                    <div class="option">
                        <label for="chapterIndex">chapterIndex</label>
                        <input type="number" v-model="chapterIndex" min="0" :max="story.length-1" id="chapterIndex" @change="paragraphIndex=0">
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
                    "In een wereld waarin er meer informatie wordt verspreid per minuut dan dat je in een mensenleven tot je kunt nemen.",
                    "Is het niet verwonderlijk dat niet alle informatie even waardevol is.",
                    "Ja, ik kan je vertellen dat wombats de enige dieren ter wereld zijn die vierkante drollen poepen.",
                    "Of dat de afstand van onze planeet tot de maan minder dan 10x de omtrek van de aarde is.",
                    "Maar de kans is groot dat geen van deze informatie voor jou van grote waarde is.",
                ],
                [
                    "Als mens ben ik geïnteresseerd geraakt in wat het is dat iets waardevol maakt.",
                    "Binnen dit project wil ik het daarbij hebben over een specifiek onderwerp: informatie.",
                    "Informatie — dan wel kennis — is iets waar we sinds de opkomst van digitale technologie een overschot aan hebben.",
                    "Het internet vormt daarbij de marktplaats voor het uitwisselen van deze (digitale) informatie.",
                    "De vraag komt voort uit de wens om bepaalde dingen te willen weten, en het aanbod vormt de informatie die we via websites en andere digitale media tot ons nemen.",
                ],
                [
                    "Er zijn vele partijen die in deze markt opereren, en er is een nog groter aanbod van individuen die bij deze partijen een rol vervullen.",
                    "Ieder bericht dat je op een sociaal medium deelt, draagt bij aan de databank van dit platform.",
                    "Hoe groter de hoeveelheid informatie die deze partij bezit, hoe waardevoller deze partij wordt.",
                ],
                [
                    "De komende 15 minuten wil ik je graag meenemen op een ontdekkingsreis naar de waardebepaling van deze informatie.",
                    "Want het hebben van veel informatie staat niet gelijk aan het hebben van goede informatie.",
                    "Maar wat maakt informatie eigenlijk goed of slecht?",
                    "Waarom vinden “we” het 1 belangrijker dan het ander?",
                ]
            ],
            paragraphIndex: 0,
            chapterIndex: 0
        }
    },
    mounted() {
        window.dispatchEvent(new Event("resize"))
    },
    methods: {
        init(){
        },
        checkMaxParagraph(){
            if(this.paragraphIndex > this.story[this.chapterIndex].length-1){
                this.chapterIndex++
                this.paragraphIndex = 0
            }
        }
        
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
