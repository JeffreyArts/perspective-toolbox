import { createWebHistory, createRouter } from "vue-router";
import Home from "./home/home.vue";
import OptionsOverview from "./options-overview/options-overview.vue";
import CreateFace from "./create-face/create-face.vue";
import CreateTriangle from "./create-triangle/create-triangle.vue";
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
    path: "/create-triangle",
    name: "Create triangle",
    component: CreateTriangle,
  },
  {
    path: "/create-face",
    name: "Create face",
    component: CreateFace,
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

