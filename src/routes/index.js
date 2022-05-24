import { createWebHistory, createRouter } from "vue-router";
import Home from "./home/home.vue";
import OptionsOverview from "./options-overview/options-overview.vue";
import TwoVertices from "./2-vertices/2-vertices.vue";
import WireframeCube from "./wireframe-cube/wireframe-cube.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/wireframe-cube",
    name: "Wireframe cube",
    component: WireframeCube,
  },
  {
    path: "/2-vertices",
    name: "Two vertices",
    component: TwoVertices,
  },
  {
        path: "/options-overview",
        name: "Options overview",
        component: OptionsOverview,
  }
];


const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;

