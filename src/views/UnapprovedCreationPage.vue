<template>
  <div class="">
    <div>
      <input type="text" readonly="true" v-model="info.name" />
      <input type="text" readonly="true" v-model="info.creation_type" />
      <!--ПОменять дату на дейтпикер-->
      <input
        type="text"
        v-model="date_published"
        placeholder="Дата публикации"
      />
      <input type="text" v-model="description" placeholder="Описание" />
      <input type="text" v-model="country" placeholder="Страна" />
      <input type="text" v-model="age_rating" placeholder="Возраст" />
    </div>
    <button @Click="approveCreation">Утвердить</button>
    <button @Click="deleteCreation">Удалить</button>
    <button @Click="this.$router.go(-1)">Назад</button>
  </div>
</template>
<script>
import axios from "axios";
import { APIURL } from "../constants";
export default {
  data() {
    return {
      info: {
        name: "",
        creation_type: "",
        date_published: "",
        description: "",
        country: "",
        age_rating: "",
      },
      description: "",
      country: "",
      age_rating: "",
      date_published: "",
    };
  },
  async created() {
    this.fetchCreationInfo();
  },
  methods: {
    fetchCreationInfo() {
      const fetchedId = this.$route.params.id;
      axios
        .get(`${APIURL}/creations/${this.$route.params.id}`)
        .then((result) => {
          if (this.$route.params.id !== fetchedId) return;
          if (result.data.result !== undefined) {
            this.info.country = result.data.result.country
              ? result.data.result.country
              : "";
            this.info.age_rating = result.data.result.age_rating
              ? result.data.result.age_rating
              : "";
            this.info.description = result.data.result.description
              ? result.data.result.description
              : "";
            this.info.date_published = result.data.result.date_published
              ? result.data.result.date_published
              : "";
            this.info.name = result.data.result.Creation_Names[0].name
              ? result.data.result.Creation_Names[0].name
              : "";
            this.description = this.info.description;
            this.country = this.info.country;
            this.age_rating = this.info.age_rating;
            this.date_published = this.info.date_published;
            axios
              .get(`${APIURL}/genres/${result.data.result.CreationTypeId}`)
              .then((resultGenre) => {
                this.info.creation_type = resultGenre.data.result.name;
              })
              .catch((error) => {
                alert(`${error}`);
              });
          }
        })
        .catch((error) => {
          alert(`${error}`);
        });
    },
    approveCreation() {
      const token = localStorage.getItem("token");
      let body = {};
      if (this.country != this.info.country) {
        body.country = this.country;
      }
      if (this.age_rating != this.info.age_rating) {
        body.age_rating = this.age_rating;
      }
      if (this.description != this.info.description) {
        body.description = this.description;
      }
      if (this.date_published != this.info.date_published) {
        body.date_published = this.date_published;
      }
      axios
        .put(
          `${APIURL}/creations-unapproved/${this.$route.params.id}`,
          body,
          { headers: { authorization: token } }
        )
        .then(() => {
          this.$router.push("/main-list");
        })
        .catch((error) => {
          alert(error);
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
  },
};
</script>

<style scoped>
.wrapper {
  display: grid;
}
</style>