<template>
    <div class="story-box">
        <div v-for="(p,i) in paragraphs" :key="i" v-html="p" 
             class="story-box-paragraph" 
             :class="i <= index ? '__isVisible' : ''"
        />
    </div>
</template>

<script>

import _ from "lodash"

export default {
    props: {
        chapter: {
            type: Array,
            required: true
        },
        index: {
            type: Number,
            required: false
        }
    },
    data() {
        return {
            paragraphs: []
        }
    },
    watch:{
        chapter: {
            handler: function (val, oldVal) {
                this.newChapter()
            },
            deep: true
        },
    },
    mounted() {
        this.newChapter()
    },
    unmounted() {
        
    },
    methods: {
        newChapter() {
            this.paragraphs = []
            _.each(this.chapter, (p, index) => {
                // Put all words of paragraph in an array while respecting the html tags
                let words = p.split(/(<[^>]*>)/)
                let paragraph = []
                let startTag = false
                paragraph = _.map(words, word => {
                    // if word is not a tag, split on space
                    if(word.indexOf("<") == -1){
                        let splitWords = word.split(" ")
                        return _.map(splitWords, splitWord => {
                            // if word is not empty, add it to the array
                            if(splitWord != ""){
                                splitWord = `<span class='story-box-word'>${splitWord}</span>`
                            }
                            return splitWord
                        })
                    } else {
                        if (!startTag) {
                            startTag = true
                            // return word
                            // return word
                        } else {
                            startTag = false
                        }
                    }
                    // Return the untouched HTML tags
                    return word

                })
                this.paragraphs.push(_.flatten(paragraph).join(" "))
            })
        },
        // return true if first part of string is a span string
        isSpan(str){
            return str.indexOf("<span") == 0
        },
    }
}

</script>

<style lang="scss">

.story-box {
    height: 50%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
}
.story-box-paragraph {
    display: none;
    // display: inline-block;
    &.__isVisible {
        display: inline-block;
    }

    > * {
        // filter:blur(8px);
        opacity:0;
        display: inline-block;
        animation: fadeInStoryBoxWord .72s ease-in-out forwards;
        // sass loop for repeating animation delay
        @for $i from 1 through 256 {
            &:nth-child(#{$i}) {
                animation-delay: 0.05s * $i;
            }
        }
    }
}
    


    
@keyframes fadeInStoryBoxWord {
    0% {
        // filter:blur(8px);
        opacity:0;
        // transform: scale(1.6);
    }
    100% {
        // filter:blur(0px);
        opacity:1;
        // transform: scale(1);
    }
    
}

</style>