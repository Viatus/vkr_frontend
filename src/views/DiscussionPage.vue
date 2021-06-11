<template>
  <div class="min-h-screen p-0 sm:p-12">
    <custom-header />
    <label v-if="discussionLoading">Загрузка обсуждения</label>
    <div v-if="!discussionLoading" class="flex flex-col">
      <h5 class="bg-green-300">{{ discussionInfo.title }}</h5>
      <h1 class="text-xl">{{ discussionInfo.content }}</h1>
    </div>
    <label v-if="commentsLoading">Загрузка комментариев</label>
    <ul v-if="!commentsLoading" class="overflow-auto h-full">
      <li v-for="comment in comments" :key="comment.id">
        <comment
          :content="comment.content"
          :date_published="comment.datePublished"
          :user_nickname="comment.Client.nickname"
        />
      </li>
    </ul>
    <div class="flex flex-row">
      <button v-if="page > 1" @click="prevPage()">Предыдущая страница</button>
      <button @click="nextPage()">Следующая страница</button>
    </div>
    <textarea
      v-model="userComment"
      type="text"
      placeholder="Ваш комментарий"
      class=""
    />
    <button @click="addComment()">Оставить комментарий</button>
  </div>
</template>
<script>
import axios from "axios";
import { APIURL } from "../constants";
import CustomHeader from "../components/CustomHeader";
import Comment from "../components/Comment";

export default {
  components: {
    "custom-header": CustomHeader,
    "comment": Comment,
  },
  data() {
    return {
      page: 1,
      comments: [],
      discussionInfo: null,
      commentsLoading: true,
      discussionLoading: true,
      userComment: "",
    };
  },
  async created() {
    this.fetchDiscussionInfo();
    this.fetchComments();
  },
  methods: {
    fetchDiscussionInfo() {
      const fetchedId = this.$route.params.id;
      const token = localStorage.getItem("token");
      this.discussionLoading = true;
      axios
        .get(`${APIURL}/discussions/${this.$route.params.id}`, {
          headers: { authorization: token },
        })
        .then((result) => {
          if (this.$route.params.id !== fetchedId) return;
          if (result.data.result !== undefined) {
            this.discussionInfo = result.data.result;
          }
          this.discussionLoading = false;
        })
        .catch((error) => {
          alert(`${error.message}`);
        });
    },
    fetchComments() {
      this.commentsLoading = true;
      const fetchedId = this.$route.params.id;
      const token = localStorage.getItem("token");
      axios
        .get(`${APIURL}/discussion-comments/${this.$route.params.id}`, {
          headers: { authorization: token },
        })
        .then((result) => {
          if (this.$route.params.id !== fetchedId) return;
          if (result.data.result !== undefined) {
            this.comments = result.data.result;
          }
          this.commentsLoading = false;
        })
        .catch((error) => {
          alert(`${error.message}`);
        });
    },
    prevPage() {
      if (this.page <= 1) {
        return;
      }
      this.page--;
      this.fetchComemnts();
    },
    nextPage() {
      this.page++;
      this.fetchComemnts();
    },
    addComment() {
      //ПРоверить залогинен ли пользователь
      const token = localStorage.getItem("token");
      axios
        .post(
          `${APIURL}/comments`,
          {
            DiscussionId: this.$route.params.id,
            datePublished: "2020",
            content: this.userComment,
          },
          {
            headers: {
              authorization: token,
            },
          }
        )
        .then((result) => {
          alert(result.status);
        })
        .catch((error) => {
          alert(error.message);
        });
    },
  },
};
</script>
<style scoped>
</style>