import { createWebHistory, createRouter } from "vue-router";
import Home from "./home/home.vue";
import OptionsOverview from "./options-overview/options-overview.vue";
import CameraTransitions from "./camera-transitions/camera-transitions.vue";
import CreateFace from "./create-face/create-face.vue";
import CreateTriangle from "./create-triangle/create-triangle.vue";
import ConvexGeometry from "./convex-geometry/convex-geometry.vue";
import DepthOfField from "./depth-of-field/depth-of-field.vue";
import Tube from "./tube/tube.vue";
import TubesAnimated from "./tubes-animated/tubes-animated.vue";
import WireframeCube from "./wireframe-cube/wireframe-cube.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/camera-transitions",
    name: "Camera transitions",
    component: CameraTransitions,
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
    path: "/convex-geometry",
    name: "Convex geometry",
    component: ConvexGeometry,
  },
  {
    path: "/depth-of-field",
    name: "Depth of field",
    component: DepthOfField,
  },
  {
    path: "/tube",
    name: "Tube",
    component: Tube,
  },
  {
    path: "/tubes-animated",
    name: "Tubes animated",
    component: TubesAnimated,
  },
  {
    path: "/wireframe-cube",
    name: "Wireframe cube",
    component: WireframeCube,
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

