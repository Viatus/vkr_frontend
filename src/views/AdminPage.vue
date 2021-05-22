<template>
  <div class="top-container">
    <custom-header />
    <div class="parent_container">
      <select v-model="choosenPage" class="main-select" @change="changePage()">
        <option>Выберите действие</option>
        <option>Добавить жанр</option>
        <option>Добавить тэг</option>
        <option>Добавить роль</option>
      </select>
      <div v-if="showGenre" class="genre-container">
        <input
          v-model="genreName"
          type="text"
          placeholder="Название жанра"
          class="normal-input"
        />
        <input
          v-model="genreDescription"
          type="text"
          placeholder="Описание жанра"
          class="normal-input"
        />
        <button type="button" @click="addGenreRequest()">Отправить</button>
      </div>
      <div v-if="showTag" class="tag-container">
        <input
          v-model="tagName"
          type="text"
          placeholder="Тэг"
          class="normal-input"
        />
        <input
          v-model="tagDescription"
          type="text"
          placeholder="Описание тэга"
          class="normal-input"
        />
        <button type="button" @click="addTagRequest()">Отправить</button>
      </div>
      <div v-if="showRole" class="genre-container">
        <input
          v-model="roleName"
          type="text"
          placeholder="Название роли"
          class="normal-input"
        />
        <input
          v-model="roleDescription"
          type="text"
          placeholder="Описание роли"
          class="normal-input"
        />
        <button type="button" @click="addRoleRequest()">Отправить</button>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { APIURL } from "../constants";
import CustomHeader from "../components/CustomHeader";

export default {
  components: {
    "custom-header": CustomHeader,
  },
  data() {
    return {
      showGenre: false,
      showTag: false,
      showRole: false,
      choosenPage: "Выберите действие",
      genreName: "",
      genreDescription: "",
      tagName: "",
      tagDescription: "",
      roleName: "",
      roleDescription: "",
    };
  },
  async created() {},
  methods: {
    changePage() {
      switch (this.choosenPage) {
        case "Выберите действие":
          this.showGenre = false;
          this.showTag = false;
          this.showRole = false;
          break;
        case "Добавить жанр":
          this.showGenre = true;
          this.showTag = false;
          this.showRole = false;
          break;
        case "Добавить тэг":
          this.showGenre = false;
          this.showTag = true;
          this.showRole = false;
          break;
        case "Добавить роль":
          this.showGenre = false;
          this.showTag = false;
          this.showRole = true;
          break;
      }
    },
    addGenreRequest() {
      if (this.genreName == "") {
        alert("Не заполнено название жанра");
        return;
      }
      if (this.genreDescription == "") {
        alert("Не заполнено описание жанра");
        return;
      }
      const token = localStorage.getItem("token");
      axios
        .post(
          `${APIURL}/genres`,
          { name: this.genreName, description: this.genreDescription },
          {
            headers: {
              authorization: token,
            },
          }
        )
        .catch((error) => {
          alert(error.message);
        });
    },
    addTagRequest() {
      if (this.tagName == "") {
        alert("Не заполнено название тэга");
        return;
      }
      if (this.tagDescription == "") {
        alert("Не заполнено описание тэга");
        return;
      }
      const token = localStorage.getItem("token");
      axios
        .post(
          `${APIURL}/tags`,
          { name: this.tagName, description: this.tagDescription },
          {
            headers: {
              authorization: token,
            },
          }
        )
        .catch((error) => {
          alert(error.message);
        });
    },
    addRoleRequest() {
      if (this.roleName == "") {
        alert("Не заполнено название роли");
        return;
      }
      if (this.roleDescription == "") {
        alert("Не заполнено описание роли");
        return;
      }
      const token = localStorage.getItem("token");
      axios
        .post(
          `${APIURL}/roles`,
          { name: this.roleName, description: this.roleDescription },
          {
            headers: {
              authorization: token,
            },
          }
        )
        .catch((error) => {
          alert(error.message);
        });
    },
  },
};
</script>
<style scoped>
</style>