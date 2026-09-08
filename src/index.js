import { createApp } from 'vue';
import { createMemoryHistory, createWebHashHistory, createWebHistory, createRouter } from 'vue-router';

import ToDo from './pages/ToDo.vue';
import Modals from './pages/Modals.vue';
import Messages from './pages/Messages.vue';
import ChuckNorris from './pages/ChuckNorris.vue';
import RickAndMorty from './pages/RickAndMorty.vue';
import APIdemo from './pages/APIdemo.vue';
const routes = [
  { path: '/', component: ToDo, name: 'to do' },
  { path: '/modals', component: Modals, name: 'modal' },
  { path: '/messages', component: Messages, name: 'message' },
  { path: '/chuck', component: ChuckNorris, name: 'Chuck Nuggets' },
  { path: '/rickandmorty', component: RickAndMorty, name: 'RandM' },
  { path: '/apidemo', component: APIdemo, name: 'Api Demo' },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

import App from './App.vue';

const app = createApp(App).use(router).mount('#app');