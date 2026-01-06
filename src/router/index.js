import { createRouter, createWebHistory } from 'vue-router';
import Classes from '@/pages/Classes.vue';
import Home from '@/pages/Home.vue';
import Labels from '@/pages/Labels.vue';
import Overview from '@/pages/Overview.vue';
import Pipe from '@/pages/Pipe.vue';
import Validation from '@/pages/Validation.vue';
import Variables from '@/pages/Variables.vue';

import Test from '@/pages/Test.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/overview',
    name: 'Overview',
    component: Overview,
  },
  {
    path: '/pipe',
    name: 'Pipe',
    component: Pipe,
  },
  {
    path: '/validation',
    name: 'Validation',
    component: Validation,
  },
  {
    path: '/variables',
    name: 'Variables',
    component: Variables,
  },
  {
    path: '/classes',
    name: 'Classes',
    component: Classes,
  },
  {
    path: '/labels',
    name: 'Labels',
    component: Labels,
  },
  {
    path: '/test',
    name: 'Test',
    component: Test,
  },
  // You can add other pages here
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
