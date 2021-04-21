<template>
  <div>
    <div v-if="loading" class="loading">Loading...</div>

    <div v-if="!loading">
      <ul>
        <li v-for="creation in creations" :key="creation.id">
          <div class="list-item">
            <h4 v-if="approved"
              class="creation_name"
              @click="$router.push(`/creations/${creation.id}`)"
            >
              {{ creation.name }}
            </h4>
            <h4 v-if="!approved"
              class="creation_name"
              @click="$router.push(`/unapproved-creations/${creation.id}`)"
            >
              {{ creation.name }}
            </h4>
          </div>
        </li>
      </ul>

      <button v-if="approved" @click="$router.push(`/add-creation`)">
        Добавить произведение
      </button>
      <button @click="logout">Выйти</button>
      <button v-if="isAdmin&&approved" @click="fetchUnapprovedCreations">
        Список ожидающих одобрения
      </button>
      <button v-if="isAdmin&&!approved" @click="fetchCreations">
        Список одобренных
      </button>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { APIURL } from "../constants";
export default {
  data() {
    return {
      loading: false,
      creations: null,
      isAdmin: false,
      approved: true,
    };
  },
  created() {
    if (localStorage.getItem("is_admin")) {
      this.isAdmin = true;
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
          alert(`${error}`);
        });
    },
    fetchUnapprovedCreations() {
      this.loading = true;
      const fetchedId = this.$route.params.id;
      axios
        .get(`${APIURL}/creations-unapproved`)
        .then((result) => {
          if (this.$route.params.id !== fetchedId) return;
          this.loading = false;
          if (result.data.result !== undefined) {
            this.creations = result.data.result;
            this.approved = false;
          }
        })
        .catch((error) => {
          alert(`${error}`);
        });
    },
    logout() {
      localStorage.setItem("token", "");
      this.$router.push("/");
    },
  },
};
</script>
<style scoped>
.list-item {
  display: grid;
}
</style>
