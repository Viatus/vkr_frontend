import { createApp } from 'vue';
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router';
import "tailwindcss/tailwind.css"
import Login from '@/views/Login';
import Register from '@/views/Register';
import MainList from '@/views/MainList';
import AddCreation from '@/views/AddCreation';
import CreationPage from '@/views/CreationPage';
import UnapprovedCreationPage from '@/views/UnapprovedCreationPage';
import AdminPage from '@/views/AdminPage';
import SearchPage from '@/views/SearchPage.vue';
import 'vue-universal-modal/dist/index.css';
import VueUniversalModal from 'vue-universal-modal';
import MainPage from '@/views/MainPage';
import AddAuthor from '@/views/AddAuthor';
import AuthorPage from '@/views/AuthorPage';
import DiscussionPage from '@/views/DiscussionPage';

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
  next({ path: '/login' });
  return false;
};

const beforeEnterAdmin = (to, from, next) => {
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('is_admin');
  if (token && isAdmin) {
    next()
    return true;
  }
  next(false);
  return false;
};

const routes = [
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/main-list', component: MainList },
  { path: '/add-creation', beforeEnter, component: AddCreation },
  { path: '/add-author', beforeEnter, component: AddAuthor },
  { path: '/creations/:id', component: CreationPage },
  { path: '/authors/:id', component: AuthorPage },
  { path: '/unapproved-creations/:id', beforeEnterAdmin, component: UnapprovedCreationPage },
  { path: '/admin-page', beforeEnterAdmin, component: AdminPage },
  { path: '/search', component: SearchPage },
  { path: '/main-page', component: MainPage },
  { path: '/discussion-page/:id', component: DiscussionPage }

];
const router = createRouter({
  history: createWebHistory(),
  routes
});

const app = createApp(App);
app.use(VueUniversalModal, {
  teleportTarget: '#modals'
})
app.use(router);
//app.use(ElementUI);
app.mount('#app');
