import { createApp } from 'vue';
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router';
import "tailwindcss/tailwind.css"
import Login from '@/views/Login';
import Register from '@/views/Register';
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
import UnapprovedAuthorPage from '@/views/UnapprovedAuthorPage';
import 'mdb-vue-ui-kit/css/mdb.min.css';
import Notifications from '@kyvg/vue3-notification'

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
const beforeEnterLogged = (to, from, next) => {
  const token = localStorage.getItem('token');
  if (token === null) {
    next()
    return true;
  }
  next({ path: '/profile' });
  return false;
};

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
  if (token && isAdmin == "true") {
    next()
    return true;
  }
  next({ path: '/profile' });
  return false;
};

const routes = [
  { path: '/login', beforeEnterLogged, component: Login },
  { path: '/register', beforeEnterLogged, component: Register },
  { path: '/add-creation', beforeEnter, component: AddCreation },
  { path: '/add-author', beforeEnter, component: AddAuthor },
  { path: '/creations/:id', component: CreationPage },
  { path: '/authors/:id', component: AuthorPage },
  { path: '/unapproved-creations/:id', beforeEnterAdmin, component: UnapprovedCreationPage },
  { path: '/admin-page', beforeEnterAdmin, component: AdminPage },
  { path: '/search', component: SearchPage },
  { path: '/profile', component: MainPage },
  { path: '/discussion-page/:id', component: DiscussionPage },
  { path: '/unapproved-authors/:id', beforeEnterAdmin, component: UnapprovedAuthorPage },
  {
    path: '/', redirect: () => {
      if (localStorage.getItem('token') !== null) {
        return '/profile';
      }
      return '/login';
    }
  }
];
const router = createRouter({
  history: createWebHistory(),
  routes
});

const app = createApp(App);
app.use(VueUniversalModal, {
  teleportTarget: '#modals'
})
app.use(Notifications)
app.use(router);
app.mount('#app');
