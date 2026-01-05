import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/Home.vue';
import About from '@/pages/About.vue';
import Variables from '@/pages/Variables.vue';
import Pipe from '@/pages/Pipe.vue';
import Classes from '@/pages/Classes.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
  {
    path: '/classes',
    name: 'Classes',
    component: Classes,
  },
  {
    path: '/variables',
    name: 'Variables',
    component: Variables,
  },
  {
    path: '/pipe',
    name: 'Pipe',
    component: Pipe,
  },
  // You can add other pages here
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
