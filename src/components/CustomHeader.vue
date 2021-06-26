<template>
  <!--<div
    class="
      flex flex-row flex-grow
      justify-between
      flex-shrink
      w-full
      bg-green-300
      h-14
      content-center
      items-stretch
    "
  >
    <router-link
      to="/search"
      class="w-1/6 p-3 content-center hover:bg-green-500"
      >Расширенный поиск</router-link
    >
    <router-link
      to="/add-creation"
      class="w-1/6 p-3 content-center hover:bg-green-500"
      >Добавить произведение</router-link
    >
    <router-link
      to="/add-author"
      class="w-1/6 p-3 content-center hover:bg-green-500"
      >Добавить автора</router-link
    >
    <div
      class="relative inline-block text-left text-gray-800 self-center flex-1"
    >
      <input
        class="w-5/6"
        type="text"
        placeholder="Интересное произведение"
        v-model="form.searchText"
        @input="searchTextChanged()"
        @focus="setSearchOptions(true)"
        @blur="setSearchOptions(false)"
      />
      <button type="button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
      <transition
        enter-active-class="transition ease-out duration-100"
        enter-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div
          v-if="searchOptionsShow"
          class="
            origin-top-right
            absolute
            left-0
            mt-2
            w-5/6
            rounded-md
            shadow-lg
            text-sm
            overflow-hidden
            border
            z-20
            bg-white
          "
        >
          <ul
            v-if="optionsCreations.length != 0"
            class="divide-y divide-gray-300 overflow-auto h-full"
          >
            <li
              v-for="creation in optionsCreations"
              :key="creation.id"
              class="hover:bg-gray-100"
            >
              <mini-creation-info
                :creation_id="creation.id"
                :img_height="30"
                :img_width="30"
                :isApproved="true"
              />
            </li>
          </ul>
          <label v-if="optionsCreations.length == 0"> Ничего не найдено </label>
        </div>
      </transition>
    </div>

    <div
      v-if="isLoggedIn"
      class="relative inline-block text-left text-gray-800 w-1/6 p-3"
    >
      <router-link
        @mouseenter="setProfileShown(true)"
        @mouseleave="setProfileShown(false)"
        to="/main-page"
      >
        {{ email }}
        <transition
          enter-active-class="transition ease-out duration-100"
          enter-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <div
            v-if="profileShown"
            class="
              origin-top-right
              absolute
              right-0
              mt-2
              w-56
              rounded-md
              shadow-lg
              text-sm
              overflow-hidden
              border
              z-20
              bg-white
              flex flex-col
            "
          >
            <router-link
              to="/admin-page"
              class="text-center border border-gray-100 hover:bg-gray-100"
              >Панель управления</router-link
            >
            <button
              class="text-center border border-gray-100 hover:bg-gray-100"
              @click="logout()"
            >
              Выход
            </button>
          </div>
        </transition>
      </router-link>
    </div>
    <div v-if="!isLoggedIn" class="relative inline-block text-gray-800 w-1/6">
      <button
        type="button"
        class="
          w-full
          mt-3
          text-lg text-white
          transition-all
          duration-150
          ease-linear
          rounded-lg
          shadow
          outline-none
          bg-green-500
          hover:bg-green-600
          hover:shadow-lg
          focus:outline-none
        "
        @click="$router.push('/login')"
      >
        Вход
      </button>
    </div>
  </div>-->
  <header>
    <MDBNavbar expand="lg" light bg="light" container>
      <!-- Search form -->
      <div class="d-flex w-2/6 mr-auto">
        <input
          type="search"
          class="form-control"
          placeholder="Искать.."
          aria-label="Search"
          v-model="form.searchText"
          @input="searchTextChanged()"
          @focus="setSearchOptions(true)"
          @blur="setSearchOptions(false)"
        />
        <transition
          enter-active-class="transition ease-out duration-100"
          enter-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <div
            v-if="searchOptionsShow"
            class="
              absolute
              left-2
              top-8
              mt-6
              w-2/6
              rounded-md
              shadow-lg
              text-sm
              overflow-hidden
              border
              z-20
              bg-white
            "
          >
            <ul
              v-if="optionsCreations.length != 0"
              class="divide-y divide-gray-300 overflow-auto h-full p-0 m-0"
            >
              <li
                v-for="creation in optionsCreations"
                :key="creation.id"
                class="hover:bg-gray-100"
              >
                <mini-creation-info
                  :creation_id="creation.id"
                  :img_height="30"
                  :img_width="30"
                  :isApproved="true"
                />
              </li>
            </ul>
            <label v-if="optionsCreations.length == 0">
              Ничего не найдено
            </label>
          </div>
        </transition>
      </div>
      <MDBNavbarNav class="mb-2 mb-lg-0 m-0 ms-auto">
        <MDBNavbarItem to="/search" active> Расширенный поиск </MDBNavbarItem>
        <MDBNavbarItem to="/add-creation" active>
          Добавить произведение
        </MDBNavbarItem>
        <MDBDropdown v-if="email" class="nav-item" v-model="profileShown">
          <MDBDropdownToggle
            tag="a"
            class="nav-link text-dark"
            @click="profileShown = !profileShown"
            >{{ email }}</MDBDropdownToggle
          >
          <MDBDropdownMenu aria-labelledby="dropdownMenuButton">
            <MDBDropdownItem v-if="isAdmin" to="/admin-page"
              >Панель управление</MDBDropdownItem
            >
            <MDBDropdownItem to="/profile">Профиль</MDBDropdownItem>
            <MDBDropdownItem divider />
            <MDBDropdownItem @click="logout()" href="#">Выйти</MDBDropdownItem>
          </MDBDropdownMenu>
        </MDBDropdown>
        <MDBNavbarItem v-if="!email" to="/login" active>Войти</MDBNavbarItem>
      </MDBNavbarNav>
    </MDBNavbar>
  </header>
</template>
<script>
import axios from "axios";
import { APIURL } from "../constants";
import MiniCreationInfo from "./MiniCreationInfo.vue";
import {
  MDBNavbar,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from "mdb-vue-ui-kit";
export default {
  components: {
    "mini-creation-info": MiniCreationInfo,
    MDBNavbar,
    MDBNavbarNav,
    MDBNavbarItem,
    MDBDropdown,
    MDBDropdownToggle,
    MDBDropdownMenu,
    MDBDropdownItem,
  },
  data() {
    return {
      loading: false,
      optionsCreations: [],
      isAdmin: false,
      form: {
        searchText: "",
      },
      searchOptionsShow: false,
      topOptions: false,
      profileShown: false,
      creationsTypes: [],
      email: "",
      isLoggedIn: false,
    };
  },
  created() {
    if (localStorage.getItem("token")) {
      this.isLoggedIn = true;
      if (localStorage.getItem("is_admin") == "true") {
        this.isAdmin = true;
      }
      this.email = localStorage.getItem("email");
    } else {
      this.isLoggedIn = false;
    }
    this.fetchCreations();
  },
  watch: {
    $route: "fetchCreations",
  },
  methods: {
    fetchCreations() {
      this.loading = true;
      const fetchedId = this.$route.params.id;
      axios
        .get(`${APIURL}/creations`)
        .then((result) => {
          if (this.$route.params.id !== fetchedId) return;
          this.loading = false;
          if (result.data.result !== undefined) {
            this.creations = result.data.result;
            this.approved = true;
          }
        })
        .catch((error) => {
          this.$notify({
            title: "Произошла ошибка",
            text: error.response.data.error,
            type: "error",
          });
        });
    },
    fetchGenres() {
      const fetchedId = this.$route.params.id;
      axios
        .get(`${APIURL}/genres`)
        .then((result) => {
          if (this.$route.params.id !== fetchedId) return;
          if (result.data.result !== undefined) {
            this.genres = result.data.result;
          }
        })
        .catch((error) => {
          this.$notify({
            title: "Произошла ошибка",
            text: error.response.data.error,
            type: "error",
          });
        });
    },
    fetchTags() {
      const fetchedId = this.$route.params.id;
      axios
        .get(`${APIURL}/tags`)
        .then((result) => {
          if (this.$route.params.id !== fetchedId) return;
          if (result.data.result !== undefined) {
            this.tags = result.data.result;
          }
        })
        .catch((error) => {
          this.$notify({
            title: "Произошла ошибка",
            text: error.response.data.error,
            type: "error",
          });
        });
    },
    searchTextChanged() {
      if (this.form.searchText == "") {
        this.form.optionsCreations = null;
        return;
      }
      const fetchedId = this.$route.params.id;
      axios
        .get(`${APIURL}/creations-search`, {
          params: { string: this.form.searchText },
        })
        .then((result) => {
          if (this.$route.params.id !== fetchedId) return;
          if (result.data.result !== undefined) {
            this.optionsCreations = result.data.result;
          }
        })
        .catch((error) => {
          this.$notify({
            title: "Произошла ошибка",
            text: error.response.data.error,
            type: "error",
          });
        });
    },
    setSearchOptions(flag) {
      this.searchOptionsShow = flag;
    },
    setTopOptions(flag) {
      this.topOptionsShow = flag;
    },
    setProfileShown(flag) {
      this.profileShown = flag;
    },
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("is_admin");
      this.isLoggedIn = false;
      this.$router.push("/search");
    },
  },
};
</script>
<style scoped>
</style>>