import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'VueHome',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/Main.vue')
  },
  {
    path: '/title',
    name: 'title',
    component: () => import('../views/Title.vue')
  },
  {
    path: '/contents',
    name: 'contents',
    component: () => import('../views/ContentList.vue')
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router
