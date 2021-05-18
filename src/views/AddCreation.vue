<template>
  <div class="top-container">
    <custom-header />
    <div class="parent_container">
      <h1>Добавить произведение</h1>
      <div class="outer_container">
        <img v-if="url" :src="url" class="image_preview" />
        <form class="input_container">
          <input
            v-model="form.name"
            type="text"
            placeholder="Название произведения"
            class="form-input"
          />
          <select v-model="form.type" class="form-select">
            <option>Выберите жанр</option>
            <option v-for="genre in genres" :value="genre.name" :key="genre.id">
              {{ genre.name }}
            </option>
          </select>
          <input
            v-model="form.country"
            type="text"
            placeholder="Страна"
            class="form-input"
          />
          <input
            v-model="form.ageRating"
            type="text"
            placeholder="Возрастной рейтниг"
            class="form-input"
          />
          <datepicker v-model="form.date" :locale="locale" />
          <ul class="form-list">
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
            </li>
          </ul>
          <button type="button" @click="setupNewAuthor()">
            Добавить автора
          </button>
          <textarea
            v-model="form.description"
            type="text"
            placeholder="Описание"
            class="form-textarea"
          />
          <label> Добавить обложку: </label>
          <input
            type="file"
            accept="image/*"
            @change="previewImage($event)"
            id="file-input"
          />
          <button type="button" @click="sendCreation">Отправить</button>
          <h1>Чуть позже появятся авторы</h1>
          <button type="button" @click="$router.push('/main-list')">
            Назад
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import FormData from "form-data";
import { APIURL } from "../constants";
import Datepicker from "vue3-datepicker";
import { ru } from "date-fns/locale";
import CustomHeader from "../components/CustomHeader";

export default {
  components: {
    datepicker: Datepicker,
    "custom-header": CustomHeader,
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
      genres: null,
      tags: null,
      authors: null,
      roles: null,
      checkedTags: [],
      url: require("@/assets/logo.png"),
      locale: ru,
      image: null,
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
          alert(`${error}`);
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
          alert(`${error}`);
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
          alert(`${error}`);
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
          alert(`${error}`);
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
        alert("Не заполнено название произведения");
        return;
      }
      if (this.form.description == "") {
        alert("Не заполнено описание произведения");
        return;
      }
      if (this.form.type == "Выберите жанр") {
        alert("Не выбран жанр произведения");
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
      axios
        .post(`${APIURL}/creations`, bodyFormData, {
          headers: {
            authorization: token,
          },
        })
        .then((result) => {
          var author;
          for (author of this.form.choosenAuthors) {
            var authorId = -1;
            var auth;
            for (auth of this.authors) {
              if (auth.name == author.name) {
                authorId = auth.id;
              }
            }
            var roleId = -1;
            var ro;
            for (ro of this.roles) {
              if (ro.name == author.role) {
                roleId = ro.id;
              }
            }
            axios
              .post(
                `${APIURL}/author-role`,
                {
                  creation_id: result.data.result.id,
                  author_id: authorId,
                  role_id: roleId,
                },
                {
                  headers: {
                    authorization: token,
                  },
                }
              )
              .then(() => {
              })
              .catch((err) => {
                alert(err.message);
              });
          }
        })
        .catch((error) => {
          alert(error.message);
        });
    },
    previewImage(event) {
      const file = event.target.files[0];
      this.image = event.target.files[0];
      this.url = URL.createObjectURL(file);
    },
    setupNewAuthor() {
      let newAuthor = new Object();
      this.form.choosenAuthors.push(newAuthor);
    },
  },
};
</script>
<style scoped>
.top-container {
  display: flex;
  flex-direction: column;
}

.parent_container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
}

.input_container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.outer_container {
  display: flex;
  flex-direction: row;
  justify-items: stretch;
  align-items: stretch;
}

.image_preview {
  max-width: 30%;
  margin: 10px;
}

.form-input {
  border: none;
  border-bottom: 1px solid black;
}

.form-input:focus {
  outline: none;
}

.form-select {
  border: none;
  border-bottom: 1px solid black;
}

.form-select:focus {
  outline: none;
}

.form-list {
  list-style-type: none;
}

.form-datepicker-container {
  display: flex;
  flex-direction: column;
}

.form-datepicker:focus {
  outline: none;
}
</style>