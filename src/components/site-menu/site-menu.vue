<style src="./site-menu.scss"></style>
<template>
    <div class="site-menu-container">
        <div class="site-menu">
            <router-link to="/" class="site-menu-title">Toolbox</router-link>

            <div class="site-menu-list">
                <router-link :to="route.path" class="site-menu-list-item" v-for="(route, routeIndex) in routes" :class="[currentRoute.name == route.name ? '__isCurrent' : '']" :key="routeIndex">{{route.name}}</router-link>
            </div>
        </div>


        <div class="site-menu-toggle" @click="toggleMenu()" :class="[showToggle ? '__isVisible': '']">›</div>
    </div>
</template>

<script>

import _ from "lodash"
export default {
    props: [],
    data() {
        return {
            isOpen: false,
            showToggle: true,
            routes: [],
            currentRoute:{},
            bodyElement: document.querySelector("body")
        }
    },
    watch:{
        $route (to, from){
            this.currentRoute = to
        }
    },
    mounted() {
        _.each(this.$router.getRoutes(), route => {
            if (route.name != "Home") {
                this.routes.push(route)
            }
        })

        document.addEventListener("mousemove", this.displayToggle)
    },
    unmounted() {
        document.removeEventListener("mousemove", this.displayToggle)
    },
    methods: {
        toggleMenu() {
            if (this.isOpen) {
                this.isOpen = false
                this.showToggle = false
                this.bodyElement.className = this.bodyElement.className.replace(" __menuOpen", "")
                setTimeout(()=> {
                    window.dispatchEvent(new Event("resize"))
                },160)
            } else {
                this.isOpen = true
                this.bodyElement.className += " __menuOpen"

                setTimeout(() => {
                    this.showToggle = false
                }, 0)
                setTimeout(()=> {
                    window.dispatchEvent(new Event("resize"))
                },160)
            }
        },
        displayToggle(event) {
            var width = this.$el.querySelector(".site-menu").clientWidth
            if (!this.isOpen) {
                if (event.clientX < 32) {
                    setTimeout(() => {
                        this.showToggle = true
                    })
                } else if (this.showToggle == true) {
                    setTimeout(() => {
                        this.showToggle = false
                    })
                }
            } else {
                if (event.clientX > width &&
                    event.clientX < width + 36
                ) {
                    setTimeout(() => {
                        this.showToggle = true
                    })
                } else if (this.showToggle == true) {
                    setTimeout(() => {
                        this.showToggle = false
                    })
                }
            }

        }

    }
}

</script>