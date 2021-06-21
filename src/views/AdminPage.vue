<template>
  <custom-header />
  <div class="grid grid-cols-2 grid-rows-4">
    <div class="row-span-1 row-start-1 col-span-2 col-start-1">
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
    <div class="row-span-3 row-start-2 col-span-1 col-start-1 pt-4 pl-4">
      <h2>Неодобренные произведения</h2>
      <ul
        class="divide-y divide-gray-300 overflow-auto h-full"
        v-if="creationsUnapproved.length != 0"
      >
        <li
          v-for="creation in creationsUnapproved"
          :key="creation.id"
          class="hover:bg-gray-100"
        >
          <mini-creation-info
            :creation_id="creation.id"
            :img_height="80"
            :img_width="80"
            :isApproved="false"
          />
        </li>
      </ul>
      <label v-if="creationsUnapproved.length == 0" class="m-4"
        >Здесь ничего нет</label
      >
    </div>
    <div class="row-span-3 row-start-2 col-span-1 col-start-2 pt-4 pl-4">
      <h2>Неодобренные авторы</h2>
      <ul
        class="divide-y divide-gray-300 overflow-auto h-full"
        v-if="authorsUnapproved.length != 0"
      >
        <li
          v-for="author in authorsUnapproved"
          :key="author.id"
          class="hover:bg-gray-100"
        >
          <mini-author-info v-bind="$attrs"
            :author_id="author.id"
            :img_height="80"
            :img_width="80"
          />
        </li>
      </ul>
      <label v-if="authorsUnapproved.length == 0" class="m-4"
        >Здесь ничего нет</label
      >
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { APIURL } from "../constants";
import CustomHeader from "../components/CustomHeader";
import MiniCreationInfo from "../components/MiniCreationInfo";
import MiniAuthorInfo from "../components/MiniAuthorInfo";

export default {
  components: {
    "custom-header": CustomHeader,
    "mini-creation-info": MiniAuthorInfo,
    "mini-author-info": MiniCreationInfo,
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
      loadingCreations: false,
      loadingAuthors: false,
      creationsUnapproved: [],
      authorsUnapproved: [],
    };
  },
  async created() {
    //this.fetchUnapprovedCreations();
    //this.fetchUnapprovedAuthors();
  },
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
    fetchUnapprovedCreations() {
      const token = localStorage.getItem("token");
      this.loadingCreations = true;
      axios
        .get(`${APIURL}/creations-unapproved`, {
          headers: { authorization: token },
        })
        .then((result) => {
          this.loadingCreations = false;
          if (result.data.result !== undefined) {
            this.creationsUnapproved = result.data.result;
          }
        })
        .catch((error) => {
          alert(`${error}`);
        });
    },
    fetchUnapprovedAuthors() {
      const token = localStorage.getItem("token");
      this.loadingAuthors = true;
      axios
        .get(`${APIURL}/unapproved-authors`, {
          headers: { authorization: token },
        })
        .then((result) => {
          this.loadingAuthors = false;
          if (result.data.result !== undefined) {
            this.authorsUnapproved = result.data.result;
          }
        })
        .catch((error) => {
          alert(`${error}`);
        });
    },
  },
};
</script>
<style scoped>
</style>