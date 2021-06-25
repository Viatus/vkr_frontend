<template>
  <div class="min-h-screen p-0">
    <custom-header />
    <div class="grid grid-cols-2 grid-rows-4">
      <div
        class="
          row-span-1 row-start-1
          col-span-2 col-start-1
          grid grid-cols-3 grid-rows-1
        "
      >
        <div class="col-span-1 col-start-1 flex flex-col p-2 pb-4">
          <h1>Жанр</h1>
          <MDBInput
            v-model="genreName"
            type="text"
            placeholder="Название"
            class="normal-input"
          />
          <MDBInput
            v-model="genreDescription"
            type="text"
            placeholder="Описание"
            class="normal-input"
          />
          <MDBBtn @click="addGenreRequest()">Добавить</MDBBtn>
        </div>
        <div class="col-span-1 col-start-2 flex flex-col p-2 pb-4">
          <h1>Тэг</h1>
          <MDBInput
            v-model="tagName"
            type="text"
            placeholder="Название"
            class="normal-input"
          />
          <MDBInput
            v-model="tagDescription"
            type="text"
            placeholder="Описание"
            class="normal-input"
          />
          <MDBBtn @click="addTagRequest()">Добавить</MDBBtn>
        </div>
        <div class="col-span-1 col-start-3 flex flex-col p-2 pb-4">
          <h1>Роль</h1>
          <MDBInput
            v-model="roleName"
            type="text"
            placeholder="Название"
            class="normal-input"
          />
          <MDBInput
            v-model="roleDescription"
            type="text"
            placeholder="Описание"
            class="normal-input"
          />
          <MDBBtn @click="addRoleRequest()">Добавить</MDBBtn>
        </div>
      </div>
      <div
        class="
          row-span-3 row-start-2
          col-span-1 col-start-1
          flex flex-col
          align-items-center
          p-4
        "
      >
        <h2>Ожидающие одобрения произведения</h2>
        <ul
          class="divide-y divide-gray-300 overflow-auto h-full w-full"
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
      <div
        class="
          row-span-3 row-start-2
          col-span-1 col-start-2
          flex flex-col
          align-items-center
          p-4
        "
      >
        <h2>Ожидающие одобрения участники</h2>
        <ul
          class="divide-y divide-gray-300 overflow-auto h-full w-full"
          v-if="authorsUnapproved.length != 0"
        >
          <li
            v-for="author in authorsUnapproved"
            :key="author.id"
            class="hover:bg-gray-100"
          >
            <mini-author-info
              v-bind:author_id="author.id"
              v-bind:img_height="80"
              v-bind:img_width="80"
            />
          </li>
        </ul>
        <label v-if="authorsUnapproved.length == 0" class="m-4"
          >Здесь ничего нет</label
        >
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { APIURL } from "../constants";
import CustomHeader from "../components/CustomHeader";
import MiniCreationInfo from "../components/MiniCreationInfo";
import MiniAuthorInfo from "../components/MiniAuthorInfo";
import { MDBBtn, MDBInput } from "mdb-vue-ui-kit";

export default {
  components: {
    "custom-header": CustomHeader,
    "mini-creation-info": MiniCreationInfo,
    "mini-author-info": MiniAuthorInfo,
    MDBBtn,
    MDBInput,
  },
  data() {
    return {
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
    this.fetchUnapprovedCreations();
    this.fetchUnapprovedAuthors();
  },
  methods: {
    addGenreRequest() {
      if (this.genreName == "") {
        this.$notify({
          title: "Ошибка при вводе",
          text: "Не заполнено название жанра",
          type: "error",
        });
        return;
      }
      if (this.genreDescription == "") {
        this.$notify({
          title: "Ошибка при вводе",
          text: "Не заполнено описание жанра",
          type: "error",
        });
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
        .then(() => {
          this.$notify({
            title: "Успех",
            text: "Жанр добавлен",
            type: "sucess",
          });
          this.genreName = "";
          this.genreDescription = "";
        })
        .catch((error) => {
          this.$notify({
            title: "Произошла ошибка",
            text: error.response.data.error,
            type: "error",
          });
        });
    },
    addTagRequest() {
      if (this.tagName == "") {
        this.$notify({
          title: "Ошибка при вводе",
          text: "Не заполнено название тэга",
          type: "error",
        });
        return;
      }
      if (this.tagDescription == "") {
        this.$notify({
          title: "Ошибка при вводе",
          text: "Не заполнено описание тэга",
          type: "error",
        });
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
        .then(() => {
          this.$notify({
            title: "Успех",
            text: "Тэг добавлен",
            type: "sucess",
          });
          this.tagName = "";
          this.tagDescription = "";
        })
        .catch((error) => {
          this.$notify({
            title: "Произошла ошибка",
            text: error.response.data.error,
            type: "error",
          });
        });
    },
    addRoleRequest() {
      if (this.roleName == "") {
        this.$notify({
          title: "Ошибка при вводе",
          text: "Не заполнено название роли",
          type: "error",
        });
        return;
      }
      if (this.roleDescription == "") {
        this.$notify({
          title: "Ошибка при вводе",
          text: "Не заполнено описание роли",
          type: "error",
        });
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
        .then(() => {
          this.$notify({
            title: "Успех",
            text: "Роль добавлена",
            type: "sucess",
          });
          this.roleName = "";
          this.roleDescription = "";
        })
        .catch((error) => {
          this.$notify({
            title: "Произошла ошибка",
            text: error.response.data.error,
            type: "error",
          });
        });
    },
    fetchUnapprovedCreations() {
      const token = localStorage.getItem("token");
      console.log(token);
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
          this.$notify({
            title: "Произошла ошибка",
            text: error.response.data.error,
            type: "error",
          });
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
          this.$notify({
            title: "Произошла ошибка",
            text: error.response.data.error,
            type: "error",
          });
        });
    },
  },
};
</script>
<style scoped>
</style>