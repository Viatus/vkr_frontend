<template>
  <div>
    <Modal v-model="showReviewModal">
      <div class="modal">
        <h1>Оставить отзыв</h1>
        <star-rating
          v-model:rating="choosenRating"
          :increment="1"
          :max-rating="10"
        />
        <textarea
          placeholder="Оставьте детальный отзыв"
          id="reviewText"
          v-model="reviewText"
          class="
            pt-3
            pb-2
            block
            w-full
            px-0
            mt-0
            bg-transparent
            border-2
            appearance-none
            focus:outline-none
            focus:ring-0
            focus:border-black
            border-gray-200
          "
        />
        <button @click="showReviewModal = false">Закрыть</button>
        <button @click="sendReview()">Отправить</button>
      </div>
    </Modal>
  </div>
  <div>
    <Modal v-model="showNewDiscussionModal">
      <div class="modal">
        <h1>Добавить обсуждение</h1>
        <input type="text" v-model="discussionTitle" />
        <textarea
          placeholder="Первый комментарий"
          id="reviewText"
          v-model="discussionContent"
          class="
            pt-3
            pb-2
            block
            w-full
            px-0
            mt-0
            bg-transparent
            border-2
            appearance-none
            focus:outline-none
            focus:ring-0
            focus:border-black
            border-gray-200
          "
        />
        <button @click="showNewDiscussionModal = false">Закрыть</button>
        <button @click="addDiscussion()">Отправить</button>
      </div>
    </Modal>
  </div>

  <div class="min-h-screen p-0 sm:p-12">
    <custom-header />
    <div v-if="loading">
      <label> Загрузка </label>
    </div>
    <div v-if="!loading" class="grid grid-cols-4 grid-rows-4">
      <img
        v-if="image"
        :src="image"
        class="
          row-span-3
          rounded-none
          lg:rounded-lg
          shadow-xl
          hidden
          lg:block
          m-6
        "
      />
      <div class="col-span-3 col-start-2 row-span-4 flex-col align-middle">
        <h1 class="pt-2 text-gray-500 text-x">{{ info.genre }}</h1>
        <h1 class="text-3xl font-bold pt-8 lg:pt-0">{{ info.name }}</h1>
        <div
          class="
            mx-auto
            lg:mx-0
            w-4/5
            pt-3
            border-b-2 border-green-600
            opacity-25
          "
        ></div>
        <star-rating
          v-model:rating="rating"
          :increment="0.01"
          :max-rating="10"
          :read-only="true"
        />
        <p @click="showReviewModal = true">Оставить отзыв</p>
        <div class="">
          <h1 v-if="info.country" id="country">
            {{ info.country }} {{ info.age_rating }}
          </h1>
        </div>
        <div class="p-6">
          <label for="description">Описание</label>
          <h1 id="description" class="text-xl">{{ info.description }}</h1>
        </div>
        <ul class="">
          <li v-for="tag in tags" :key="tag.id">
            <label :title="tag.description">{{ tag.name }} </label>
          </li>
        </ul>
        <ul class="">
          <li v-for="inv in involvement" :key="inv.id">
            <label>{{ inv.name }} </label>
            <label>{{ inv.Authors[0].name }} </label>
          </li>
        </ul>
      </div>
    </div>
    <div class="grid grid-cols-2 grid-rows-1">
      <div class="h-80 col-start-1 col-span-1">
        <h2>Похожие на основе тэгов</h2>
        <ul class="divide-y divide-gray-300 overflow-auto h-full">
          <li v-for="creation in similar" :key="creation.id">
            <mini-creation-info
              :creation_id="creation.id"
              :img_height="80"
              :img_width="80"
            />
          </li>
        </ul>
      </div>
      <div class="h-80 col-start-2 col-span-1">
        <h2>Похожие на основе авторов</h2>
        <ul class="divide-y divide-gray-300 overflow-auto h-full">
          <li v-for="creation in similarByAuthor" :key="creation.id">
            <mini-creation-info
              :creation_id="creation.id"
              :img_height="80"
              :img_width="80"
            />
          </li>
        </ul>
      </div>
    </div>
    <button v-if="isAdmin" @Click="deleteCreation">Удалить</button>
    <button @Click="$router.go(-1)">Назад</button>
    <button @Click="showNewDiscussionModal = true">Добавить обсуждение</button>
  </div>
</template>
<script>
import axios from "axios";
import { APIURL } from "../constants";
import CustomHeader from "../components/CustomHeader";
import StarRating from "vue-star-rating";
import MiniCreationInfo from "../components/MiniCreationInfo";

export default {
  components: {
    "custom-header": CustomHeader,
    "mini-creation-info": MiniCreationInfo,
    StarRating,
  },
  data() {
    return {
      info: null,
      similar: null,
      similarByAuthor: null,
      isAdmin: false,
      image: require("@/assets/placeholder.png"),
      tags: null,
      involvment: null,
      loading: true,
      rating: null,
      showReviewModal: false,
      choosenRating: 0,
      reviewText: "",
      discussionContent: "",
      discussionTitle: "",
      showNewDiscussionModal: false,
    };
  },
  async created() {
    this.fetchCreationInfo();
    this.fetchCreationTags();
    this.fetchSimilar();
    this.fetchinvolved();
    this.fetchRating();
    this.fetchSimilarByAuthors();
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
                this.loading = false;
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
    fetchRating() {
      const fetchedId = this.$route.params.id;
      axios
        .get(`${APIURL}/rating/${this.$route.params.id}`)
        .then((result) => {
          if (this.$route.params.id !== fetchedId) return;
          this.rating = result.data.average;
        })
        .catch((error) => {
          alert(error);
        });
    },
    fetchSimilarByAuthors() {
      const fetchedId = this.$route.params.id;
      axios
        .get(`${APIURL}/creations-similar-by-author/${this.$route.params.id}`)
        .then((result) => {
          if (this.$route.params.id !== fetchedId) return;
          if (result.data.result !== undefined) {
            this.similarByAuthor = result.data.result;
          }
        })
        .catch((error) => {
          alert(`${error.message}`);
        });
    },
    sendReview() {
      const fetchedId = this.$route.params.id;
      const token = localStorage.getItem("token");
      axios
        .post(
          `${APIURL}/reviews/${this.$route.params.id}`,
          { score: this.choosenRating, content: this.reviewText },
          { headers: { authorization: token } }
        )
        .then(() => {
          if (this.$route.params.id !== fetchedId) return;
          this.fetchRating();
          this.showReviewModal = false;
          //Оповестить пользователя что все классно
        })
        .catch((error) => {
          alert(error);
        });
    },
    addDiscussion() {
      const fetchedId = this.$route.params.id;
      const token = localStorage.getItem("token");
      axios
        .post(
          `${APIURL}/discussions`,
          {
            CreationId: fetchedId,
            content: this.discussionContent,
            title: this.discussionTitle,
          },
          { headers: { authorization: token } }
        )
        .then(() => {
          if (this.$route.params.id !== fetchedId) return;
          this.showNewDiscussionModal = false;
          //Оповестить пользователя что все классно
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

.modal {
  width: 700px;
  padding: 30px;
  box-sizing: border-box;
  background-color: #fff;
  font-size: 20px;
  text-align: center;
}
</style>