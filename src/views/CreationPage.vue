<template>
  <div class="wrapper">
    <custom-header />
    <label class="creation_type">{{ info.genre }}</label>
    <label class="name-label">{{ info.name }}</label>
    <div class="outer-container">
      <img v-if="image" :src="image" class="image_preview" />
      <div class="info_container">
        <div class="details_container">
          <table class="cross-table data-right-align">
            <tbody>
              <tr>
                <th>Дата публикации</th>
                <td>{{ info.date_published.substring(0, 10) }}</td>
              </tr>
              <tr>
                <th>Описание</th>
                <td>{{ info.description }}</td>
              </tr>
              <tr>
                <th>Страна публикации</th>
                <td>{{ info.country }}</td>
              </tr>
              <tr>
                <th>Возрастной рейтинг</th>
                <td>{{ info.age_rating }}</td>
              </tr>
            </tbody>
          </table>
          <ul>
            <li v-for="tag in tags" :key="tag.id">
              <label :title="tag.description">{{ tag.name }} </label>
            </li>
          </ul>
          <ul>
            <li v-for="inv in involvement" :key="inv.id">
              <label>{{ inv.name }} </label>
              <label>{{ inv.Authors[0].name }} </label>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div>
      <ul>
        <h2>Похожие на основе тэгов</h2>
        <li v-for="creation in similar" :key="creation.id">
          <label> {{ creation.name }} </label>
        </li>
      </ul>
    </div>
    <button v-if="isAdmin" @Click="deleteCreation">Удалить</button>
    <button @Click="this.$router.go(-1)">Назад</button>
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
      info: null,
      similar: null,
      isAdmin: false,
      image: require("@/assets/logo.png"),
      tags: null,
      involvment: null,
    };
  },
  async created() {
    this.fetchCreationInfo();
    this.fetchCreationTags();
    this.fetchSimilar();
    this.fetchinvolved();
    this.isAdmin = localStorage.getItem("isAdmin");
  },
  methods: {
    fetchCreationInfo() {
      const fetchedId = this.$route.params.id;
      axios
        .get(`${APIURL}/creations/${this.$route.params.id}`)
        .then((result) => {
          if (this.$route.params.id !== fetchedId) return;
          if (result.data.result !== undefined) {
            this.info = result.data.result;
          }
          axios
            .get(`${APIURL}/genres`)
            .then((result) => {
              if (this.$route.params.id !== fetchedId) return;
              if (result.data.result !== undefined) {
                var genre = null;
                for (genre of result.data.result) {
                  if (genre.id == this.info.CreationTypeId) {
                    this.info.genre = genre.name;
                    break;
                  }
                }
              }
            })
            .catch((error) => {
              alert(`${error}`);
            });
        })
        .catch((error) => {
          alert(`${error}`);
        });
    },
    fetchSimilar() {
      const fetchedId = this.$route.params.id;
      axios
        .get(`${APIURL}/creations-similar`, {
          headers: { creation_id: fetchedId },
        })
        .then((result) => {
          if (this.$route.params.id !== fetchedId) return;
          if (result.data.result !== undefined) {
            this.similar = result.data.result;
          }
        })
        .catch((error) => {
          alert(`${error.message}`);
        });
    },
    deleteCreation() {
      const token = localStorage.getItem("token");
      axios
        .delete(
          `${APIURL}/creations/${this.$route.params.id}`,
          {
            new_record_id: this.$route.params.id,
          },
          { headers: { authorization: token } }
        )
        .then(() => {
          this.$router.push("/main-list");
        })
        .catch((error) => {
          alert(error);
        });
    },
    fetchCreationTags() {
      const fetchedId = this.$route.params.id;
      axios
        .get(`${APIURL}/creation-tags/${this.$route.params.id}`)
        .then((result) => {
          if (this.$route.params.id !== fetchedId) return;
          this.tags = result.data.result;
        })
        .catch((error) => {
          alert(error);
        });
    },
    fetchinvolved() {
      const fetchedId = this.$route.params.id;
      axios
        .get(`${APIURL}/creation-role/${this.$route.params.id}`)
        .then((result) => {
          if (this.$route.params.id !== fetchedId) return;
          this.involvement = result.data.result;
        })
        .catch((error) => {
          alert(error);
        });
    },
  },
};
</script>

<style scoped>
.wrapper {
  display: grid;
}
.creation_type {
  opacity: 0.5;
}

.outer-container {
  display: flex;
  flex-direction: row;
}

.info_container {
  margin-bottom: 2rem;
  margin-right: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.details_container {
  margin-left: 0.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: flex-start;
}

.name-label {
  font-size: large;
}
</style>