import { createApp } from 'vue';
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/Login';
import Register from '@/views/Register';
import MainList from '@/views/MainList';
import AddCreation from '@/views/AddCreation';
import CreationPage from '@/views/CreationPage';
import UnapprovedCreationPage from '@/views/UnapprovedCreationPage';
/*import axios from 'axios';



axios.interceptors.request.use((config) => {
  if (config.url.includes('login') || config.url.includes('register')) {
    return config;
  }
  return {
    ...config, headers: {
      authorization: localStorage.getItem("token"),
    }
  }
}, (error) => {
  return Promise.reject(error);
});*/
const beforeEnter = (to, from, next) => {
  const token = localStorage.getItem('token');
  if (token) {
    next()
    return true;
  }
  next({ path: '/' });
  return false;
};
const routes = [
  { path: '/', component: Login },
  { path: '/register', component: Register },
  { path: '/main-list', component: MainList },
  { path: '/add-creation', beforeEnter, component: AddCreation},
  { path: '/creations/:id', component: CreationPage},
  { path: '/unapproved-creations/:id', component: UnapprovedCreationPage}
];
const router = createRouter({
  history: createWebHistory(),
  routes
});

const app = createApp(App);
app.use(router);
//app.use(ElementUI);
app.mount('#app');
