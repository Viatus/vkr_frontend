<template>
  <MDBModal
    id="addAuthorModal"
    tabindex="-1"
    labelledby="addAuthorModalLabel"
    class="w-100"
    v-model="showAddAuthorModal"
  >
    <MDBModalHeader>
      <MDBModalTitle id="addAuthorModalLabel">
        Добавить участника
      </MDBModalTitle>
    </MDBModalHeader>
    <MDBModalBody>
      <div class="grid grid-cols-3 grid-rows-1 pt-4 w-full justify-center">
        <img
          v-if="urlAuthor"
          :src="urlAuthor"
          class="
            row-span-1
            rounded-none
            lg:rounded-lg
            shadow-xl
            hidden
            lg:block
            p-2
            col-sapn-1 col-start-1
          "
        />
        <form class="flex flex-col items-stretch col-span-2 col-start-2 p-4">
          <MDBInput
            label="Имя участника"
            v-model="authorForm.name"
            type="text"
            class="pt-2"
          />
          <MDBInput
            label="Страна"
            v-model="authorForm.country"
            type="text"
            class="pt-2"
          />
          <div class="flex flex-row pt-2">
            <label class="pr-4">День рождения</label>
            <datepicker
              v-model="authorForm.date"
              :locale="locale"
              class="border"
            />
          </div>
          <MDBTextarea
            v-model="authorForm.description"
            label="Описание"
            rows="4"
            class="pt-4"
          />
          <label> Добавить фотографию: </label>
          <MDBFile
            accept="image/*"
            @change="previewImageAuthor($event)"
            id="file-input-author"
          />
        </form>
      </div>
    </MDBModalBody>
    <MDBModalFooter>
      <MDBBtn
        color="secondary"
        @click="
          showAddAuthorModal = false;
          fetchAuthors();
        "
        >Закрыть</MDBBtn
      >
      <MDBBtn
        color="primary"
        @click="
          sendAuthor();
          fetchAuthors();
        "
        >Отправить</MDBBtn
      >
    </MDBModalFooter>
  </MDBModal>

  <custom-header />
  <h1>Добавить произведение</h1>
  <div class="grid grid-cols-3 grid-rows-1 pt-4 w-full justify-center">
    <img
      v-if="url"
      :src="url"
      class="
        row-span-1
        rounded-none
        lg:rounded-lg
        shadow-xl
        hidden
        lg:block
        p-2
        col-sapn-1 col-start-1
      "
    />
    <form class="flex flex-col items-stretch col-span-2 col-start-2 p-4">
      <MDBInput
        label="Название произведения"
        v-model="form.name"
        type="text"
        class="pt-2"
      />
      <select v-model="form.type" class="form-select">
        <option>Выберите жанр</option>
        <option v-for="genre in genres" :value="genre.name" :key="genre.id">
          {{ genre.name }}
        </option>
      </select>
      <div v-if="form.type == 'Книга'" class="pt-2">
        <MDBInput label="ISBN" v-model="isbn" type="text" />
        <MDBBtn tag="a" color="light" @click="fillFieldsByISBN()">
          Заполнить по ISBN
        </MDBBtn>
      </div>
      <MDBInput
        label="Страна"
        v-model="form.country"
        type="text"
        class="pt-2"
      />
      <MDBInput
        label="Возрастной рейтниг"
        v-model="form.ageRating"
        type="text"
        class="pt-2"
      />
      <div class="flex flex-row pt-2">
        <label class="pr-4">Дата</label>
        <datepicker v-model="form.date" :locale="locale" class="border" />
      </div>
      <ul class="pt-2">
        <label>Тэги</label>
        <li v-for="tag in tags" :key="tag.id">
          <input
            type="checkbox"
            :value="tag.name"
            name="tag"
            v-model="checkedTags"
          />
          <label :title="tag.description">{{ tag.name }} </label>
        </li>
      </ul>
      <ul class="form-list">
        <li
          v-for="choosenAuthor in form.choosenAuthors"
          :key="choosenAuthor.name"
          class="author-list-element"
        >
          <select v-model="choosenAuthor.name" class="form-select">
            <option>Выберите автора</option>
            <option
              v-for="author in authors"
              :value="author.name"
              :key="author.id"
            >
              {{ author.name }}
            </option>
          </select>
          <select v-model="choosenAuthor.role" class="form-select">
            <option>Выберите роль</option>
            <option v-for="role in roles" :value="role.name" :key="role.id">
              {{ role.name }}
            </option>
          </select>
          <MDBBtn @click="showAddAuthorModal = true">+</MDBBtn>
        </li>
      </ul>
      <MDBBtn tag="a" color="light" @click="setupNewAuthor()"
        >Добавить автора</MDBBtn
      >
      <MDBTextarea
        v-model="form.description"
        label="Описание"
        rows="4"
        class="pt-4"
      />
      <label> Добавить обложку: </label>
      <MDBFile
        accept="image/*"
        @change="previewImage($event)"
        id="file-input"
      />
      <MDBBtn tag="a" color="light" @click="sendCreation">Отправить</MDBBtn>
    </form>
  </div>
</template>
<script>
import axios from "axios";
import FormData from "form-data";
import { APIURL, BOOKAPIURL } from "../constants";
import Datepicker from "vue3-datepicker";
import { ru } from "date-fns/locale";
import CustomHeader from "../components/CustomHeader";
import {
  MDBModal,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBBtn,
  MDBInput,
  MDBTextarea,
  MDBFile,
} from "mdb-vue-ui-kit";

export default {
  components: {
    datepicker: Datepicker,
    "custom-header": CustomHeader,
    MDBInput,
    MDBBtn,
    MDBTextarea,
    MDBFile,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
    MDBModal,
  },
  data() {
    return {
      form: {
        name: "",
        description: "",
        country: "",
        type: "Выберите жанр",
        date: null,
        ageRating: "",
        choosenAuthors: [],
      },
      authorForm: {
        name: "",
        description: "",
        country: "",
        date: null,
      },
      genres: null,
      tags: null,
      authors: null,
      roles: null,
      checkedTags: [],
      url: require("@/assets/placeholder.png"),
      locale: ru,
      image: null,
      isbn: "",
      imageAuthor: null,
      urlAuthor: require("@/assets/placeholder.png"),
      showAddAuthorModal: false,
    };
  },
  async created() {
    this.fetchGenres();
    this.fetchTags();
    this.fetchAuthors();
    this.fetchRoles();
  },
  methods: {
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
    fetchAuthors() {
      const fetchedId = this.$route.params.id;
      axios
        .get(`${APIURL}/authors`)
        .then((result) => {
          if (this.$route.params.id !== fetchedId) return;
          if (result.data.result !== undefined) {
            this.authors = result.data.result;
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
    fetchRoles() {
      const fetchedId = this.$route.params.id;
      axios
        .get(`${APIURL}/roles`)
        .then((result) => {
          if (this.$route.params.id !== fetchedId) return;
          if (result.data.result !== undefined) {
            this.roles = result.data.result;
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
    tagSelected(tag) {
      if (!this.choosenTags.includes(tag)) {
        this.choosenTags.add(tag);
        this.toggleShow();
      }
    },
    sendCreation() {
      if (this.form.name == "") {
        this.$notify({
          title: "Ошибка при вводе",
          text: "Не заполнено название произведения",
          type: "error",
        });
        return;
      }
      if (this.form.description == "") {
        this.$notify({
          title: "Ошибка при вводе",
          text: "Не заполнено описание",
          type: "error",
        });
        return;
      }
      if (this.form.type == "Выберите жанр") {
        this.$notify({
          title: "Ошибка при вводе",
          text: "Не выбран жанр произведения",
          type: "error",
        });
        return;
      }
      if (this.form.description.length >= 255) {
        this.$notify({
          title: "Ошибка при вводе",
          text: "Слишком длинное описание",
          type: "error",
        });
        return;
      }
      const token = localStorage.getItem("token");
      var bodyFormData = new FormData();
      bodyFormData.append("cover", this.image);
      bodyFormData.append("name", this.form.name);
      bodyFormData.append("date_published", this.form.date);
      bodyFormData.append("description", this.form.description);
      bodyFormData.append("country", this.form.country);
      bodyFormData.append("age_rating", this.form.ageRating);
      bodyFormData.append("creation_type", this.form.type);
      bodyFormData.append("tags", JSON.stringify(this.checkedTags));
      let chAuthors = this.form.choosenAuthors;
      let authors = this.authors;
      let roles = this.roles;
      axios
        .post(`${APIURL}/creations`, bodyFormData, {
          headers: {
            authorization: token,
          },
        })
        .then((result) => {
          var author;
          for (author of chAuthors) {
            var authorId = -1;
            var auth;
            for (auth of authors) {
              if (auth.name == author.name) {
                authorId = auth.id;
              }
            }
            var roleId = -1;
            var ro;
            for (ro of roles) {
              if (ro.name == author.role) {
                roleId = ro.id;
              }
            }
            axios
              .post(`${APIURL}/author-role`, {
                headers: {
                  authorization: token,
                },
                body: {
                  creation_id: result.data.result.id,
                  author_id: authorId,
                  role_id: roleId,
                },
              })
              .then(() => {
                this.$notify({
                  title: "Успех",
                  text: "Произведение успешно добавлено",
                  type: "success",
                });
              })
              .catch((error) => {
                this.$notify({
                  title: "Произошла ошибка",
                  text: error.response.data.error,
                  type: "error",
                });
              });
            this.$notify({
              title: "Успех",
              text: "Произведение успешно добавлено",
              type: "success",
            });
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
    previewImage(event) {
      this.image = event.target.files[0];
      this.url = URL.createObjectURL(this.image);
    },
    setupNewAuthor() {
      let newAuthor = { name: "Выберите автора", role: "Выберите роль" };
      this.form.choosenAuthors.push(newAuthor);
    },
    fillFieldsByISBN() {
      axios
        .get(BOOKAPIURL, {
          params: {
            q: "isbn+" + this.isbn,
          },
        })
        .then((result) => {
          this.form.country = result.data.items[0].volumeInfo.language; //??????
          this.form.name = result.data.items[0].volumeInfo.title;
          //this.form.date = result.data.items[0].volumeInfo.publishedDate;
          this.form.description = result.data.items[0].volumeInfo.description;
          this.form.ageRating = result.data.items[0].volumeInfo.maturityRating;
          //Еще можно загрузить картинку из result.data.items[0].volumeInfo.imageLinks.thumbnail
          this.$notify({
            title: "Успех",
            text: "Поля заполнены по полученной инфомации",
            type: "success",
          });
        })
        .catch((error) => {
          this.$notify({
            title: "Произошла ошибка",
            text: error.response.data.error,
            type: "error",
          });
        });
    },
    sendAuthor() {
      if (this.authorForm.name == "") {
        this.$notify({
          title: "Ошибка при вводе",
          text: "Не заполнено имя участника",
          type: "error",
        });
        return;
      }
      if (this.authorForm.description == "") {
        this.$notify({
          title: "Ошибка при вводе",
          text: "Не заполнено описание",
          type: "error",
        });

        return;
      }
      const token = localStorage.getItem("token");
      var bodyFormData = new FormData();
      bodyFormData.append("cover", this.imageAuthor);
      bodyFormData.append("name", this.authorForm.name);
      bodyFormData.append("birthday", this.authorForm.date);
      bodyFormData.append("description", this.authorForm.description);
      bodyFormData.append("country", this.authorForm.country);
      axios
        .post(`${APIURL}/authors`, bodyFormData, {
          headers: {
            authorization: token,
          },
        })
        .then((result) => {
          if (result.status == 201) {
            this.$notify({
              title: "Успех",
              text: "Запись добавлена",
              type: "success",
            });
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
    previewImageAuthor(event) {
      this.imageAuthor = event.target.files[0];
      this.urlAuthor = URL.createObjectURL(this.imageAuthor);
    },
  },
};
</script>
<style scoped>
</style>