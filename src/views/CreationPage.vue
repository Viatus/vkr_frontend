<template>
  <MDBModal
    id="reviewModal"
    tabindex="-1"
    labelledby="reviewModalLabel"
    class="w-100"
    v-model="showReviewModal"
  >
    <MDBModalHeader>
      <MDBModalTitle id="reviewModalLabel"> Оставить отзыв </MDBModalTitle>
    </MDBModalHeader>
    <MDBModalBody
      ><star-rating
        v-model:rating="choosenRating"
        :increment="1"
        :max-rating="10"
        v-bind:star-size="40"
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
    </MDBModalBody>
    <MDBModalFooter>
      <MDBBtn color="secondary" @click="showReviewModal = false"
        >Закрыть</MDBBtn
      >
      <MDBBtn color="primary" @click="sendReview()">Отправить</MDBBtn>
    </MDBModalFooter>
  </MDBModal>
  <MDBModal
    id="discussionModal"
    tabindex="-1"
    labelledby="discussionModalLabel"
    class="w-100"
    v-model="showNewDiscussionModal"
  >
    <MDBModalHeader>
      <MDBModalTitle id="discussionModalLabel">
        Добавить обсуждение
      </MDBModalTitle>
    </MDBModalHeader>
    <MDBModalBody>
      <input
        type="text"
        placeholder="Название обсуждения"
        v-model="discussionTitle"
      />
      <textarea
        placeholder="Первый комментарий"
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
    </MDBModalBody>
    <MDBModalFooter>
      <MDBBtn color="secondary" @click="showNewDiscussionModal = false"
        >Закрыть</MDBBtn
      >
      <MDBBtn color="primary" @click="addDiscussion()">Отправить</MDBBtn>
    </MDBModalFooter>
  </MDBModal>

  <MDBModal
    id="relationModal"
    tabindex="-1"
    labelledby="relationModalLabel"
    class="w-100"
    v-model="shoNewRealtionModal"
  >
    <MDBModalHeader>
      <MDBModalTitle id="relationModalLabel">
        Добавить связанное произведение
      </MDBModalTitle>
    </MDBModalHeader>
    <MDBModalBody>
      <div class="flex flex-col">
        <input
          type="text"
          v-model="relationModalTextSearch"
          placeholder="Название связанного произведения"
          @input="searchTextChanged()"
          @focus="setSearchOptions(true)"
          @blur="setSearchOptions(false)"
        />
        <input
          type="text"
          placeholder="Положение этого произведения"
          v-model="thisCreationStanding"
        />
        <input
          placeholder="Положение связанного произведения"
          v-model="otherCreationStanding"
          type="text"
        />
      </div>
      <transition
        enter-active-class="transition ease-out duration-100"
        enter-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div
          v-if="searchOptionsShow"
          class="
            origin-bottom-left
            absolute
            left-0
            bottom-8
            mt-2
            w-5/6
            rounded-md
            shadow-lg
            text-sm
            overflow-hidden
            border
            z-20
            bg-white
            p-0
          "
        >
          <ul
            v-if="realtionModalCreations.length != 0"
            class="divide-y divide-gray-300 overflow-auto h-full w-full p-0"
          >
            <li
              v-for="creation in realtionModalCreations"
              :key="creation.id"
              class="hover:bg-gray-100"
            >
              <button
                v-if="creation.id != $route.params.id"
                @click="
                  otherCreationId = creation.id;
                  relationModalTextSearch = creation.Creation_Names[0].name;
                "
              >
                {{ creation.Creation_Names[0].name }}
              </button>
            </li>
          </ul>
          <label v-if="realtionModalCreations.length == 0">
            Ничего не найдено
          </label>
        </div>
      </transition>
    </MDBModalBody>
    <MDBModalFooter>
      <MDBBtn color="secondary" @click="shoNewRealtionModal = false"
        >Закрыть</MDBBtn
      >
      <MDBBtn color="primary" @click="addRelatedCreation()">Отправить</MDBBtn>
    </MDBModalFooter>
  </MDBModal>
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
      <input
        type="text"
        v-model="authorModalTextSearch"
        placeholder="Имя участника"
        @input="authorSearchTextChanged()"
        @focus="setAuthorSearchOptions(true)"
        @blur="setAuthorSearchOptions(false)"
      />
      <select v-model="newAuthorRole" class="form-select">
        <option>Выберите роль</option>
        <option v-for="role in roles" :value="role.name" :key="role.id">
          {{ role.name }}
        </option>
      </select>
      <transition
        enter-active-class="transition ease-out duration-100"
        enter-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div
          v-if="authorSearchOptionsShow"
          class="
            origin-bottom-left
            absolute
            left-0
            bottom-2
            mt-2
            w-5/6
            rounded-md
            shadow-lg
            text-sm
            overflow-hidden
            border
            z-20
            bg-white
            p-0
          "
        >
          <ul
            v-if="modalAuthors.length != 0"
            class="divide-y divide-gray-300 overflow-auto h-full"
          >
            <li
              v-for="author in modalAuthors"
              :key="author.id"
              class="hover:bg-gray-100"
            >
              <button
                @click="
                  newAuthorId = author.id;
                  authorModalTextSearch = author.name;
                "
              >
                {{ author.name }}
              </button>
            </li>
          </ul>
          <label v-if="modalAuthors.length == 0"> Ничего не найдено </label>
        </div>
      </transition>
    </MDBModalBody>
    <MDBModalFooter>
      <MDBBtn color="secondary" @click="showAddAuthorModal = false"
        >Закрыть</MDBBtn
      >
      <MDBBtn color="primary" @click="addAuthor()">Отправить</MDBBtn>
    </MDBModalFooter>
  </MDBModal>

  <MDBModal
    id="newNameModal"
    tabindex="-1"
    labelledby="newNameLabel"
    class="w-100"
    v-model="showNewNameModal"
  >
    <MDBModalHeader>
      <MDBModalTitle id="newNameLabel">
        Добавить альтернативное название
      </MDBModalTitle>
    </MDBModalHeader>
    <MDBModalBody>
      <input
        type="text"
        placeholder="Название произведения"
        v-model="newName"
      />
    </MDBModalBody>
    <MDBModalFooter>
      <MDBBtn color="secondary" @click="showNewNameModal = false"
        >Закрыть</MDBBtn
      >
      <MDBBtn color="primary" @click="addNewName()">Отправить</MDBBtn>
    </MDBModalFooter>
  </MDBModal>

  <MDBModal
    id="newRecModal"
    tabindex="-1"
    labelledby="newRecLabel"
    class="w-100"
    v-model="showNewRecModal"
  >
    <MDBModalHeader>
      <MDBModalTitle id="newRecLabel"> Добавить рекомендацию </MDBModalTitle>
    </MDBModalHeader>
    <MDBModalBody>
      <div class="flex flex-col">
        <input
          type="text"
          v-model="relationModalTextSearch"
          placeholder="Название рекомендуемого произведения"
          @input="searchTextChanged()"
          @focus="setSearchOptions(true)"
          @blur="setSearchOptions(false)"
        />
        <input
          placeholder="Причина рекомендации"
          v-model="userRecContent"
          type="text"
        />
      </div>
      <transition
        enter-active-class="transition ease-out duration-100"
        enter-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div
          v-if="searchOptionsShow"
          class="
            origin-bottom-left
            absolute
            left-0
            bottom-2
            mt-2
            w-5/6
            rounded-md
            shadow-lg
            text-sm
            overflow-hidden
            border
            z-20
            bg-white
            p-0
          "
        >
          <ul
            v-if="realtionModalCreations.length != 0"
            class="divide-y divide-gray-300 overflow-auto h-full w-full p-0"
          >
            <li
              v-for="creation in realtionModalCreations"
              :key="creation.id"
              class="hover:bg-gray-100"
            >
              <button
                v-if="creation.id != $route.params.id"
                @click="
                  userRecSecondCreationId = creation.id;
                  relationModalTextSearch = creation.Creation_Names[0].name;
                "
              >
                {{ creation.Creation_Names[0].name }}
              </button>
            </li>
          </ul>
          <label v-if="realtionModalCreations.length == 0">
            Ничего не найдено
          </label>
        </div>
      </transition>
    </MDBModalBody>
    <MDBModalFooter>
      <MDBBtn color="secondary" @click="showNewRecModal = false"
        >Закрыть</MDBBtn
      >
      <MDBBtn color="primary" @click="addNewRec()">Отправить</MDBBtn>
    </MDBModalFooter>
  </MDBModal>

  <div class="min-h-screen">
    <custom-header />
    <div v-if="loading">
      <label> Загрузка </label>
    </div>
    <div v-if="!loading" class="grid grid-cols-5 grid-rows-4 pt-4">
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
          p-2
          col-sapn-1 col-start-1
        "
      />
      <div
        class="pl-12 col-span-3 col-start-2 row-span-4 flex-col align-middle"
      >
        <div class="flex flex-row">
          <h1 class="text-3xl font-bold pt-8 lg:pt-0">
            {{ info.Creation_Names[0].name }}
          </h1>
          <MDBBtn
            tag="a"
            color="light"
            rounded
            @click="showNewNameModal = true"
            size="sm"
            class="mb-2 ms-2 mt-2"
          >
            <MDBIcon iconStyle="fas" icon="plus"></MDBIcon>
          </MDBBtn>
        </div>
        <div
          class="mx-auto lg:mx-0 w-100 border-b-2 border-green-600 opacity-25"
        ></div>
        <h1 class="pt-2 text-gray-500 text-base">{{ info.genre }}</h1>
        <star-rating
          v-model:rating="rating"
          :increment="0.01"
          :max-rating="10"
          :read-only="true"
          @click="showReviewModal = true"
        />
        <h1 class="text-base pt-16">
          Персонализированный рейтинг:
          {{ predictedScore ? predictedScore : "Отсутствует" }}
        </h1>
        <h1 v-if="info.country" id="country" class="text-base pt-16">
          Страна: {{ info.country }}
        </h1>
        <h1 v-if="info.age_rating" id="country" class="text-base pt-2">
          Возрастной рейтинг: {{ info.age_rating }}
        </h1>
        <div v-if="info.Creation_Names.length > 1">
          Альтернативные названия:
          {{
            info.Creation_Names.slice(1)
              .map((a) => a.name)
              .join()
          }}
        </div>
        <div class="pt-6">
          <label for="description" class="text-base font-bold">Описание</label>
          <h1 id="description" class="text-base pl-4">
            {{ info.description }}
          </h1>
        </div>
        <div v-if="tags.length > 1">
          Тэги:
          {{ tags.map((a) => a.name).join() }}
        </div>
        <div class="pt-2">
          <div class="flex flex-row h-6">
            Связанные произведения
            <MDBBtn
              tag="a"
              color="light"
              rounded
              @click="shoNewRealtionModal = true"
              size="sm"
            >
              <MDBIcon iconStyle="fas" icon="plus"></MDBIcon>
            </MDBBtn>
          </div>
          <ul v-if="relatedCreations.length != 0" class="pl-4">
            <li
              v-for="relatedCreation in relatedCreations"
              :key="relatedCreation.id"
            >
              <router-link
                v-if="relatedCreation.firstCreationId == $route.params.id"
                :to="{ path: `/creations/${relatedCreation.secondCreationId}` }"
                >{{
                  relatedCreation.secondCreationNames
                    ? relatedCreation.secondCreationNames[0].name
                    : relatedCreation.secondCreationId
                }}
                :
                {{ relatedCreation.secondCreationStanding }}
              </router-link>
              <router-link
                v-if="relatedCreation.secondCreationId == $route.params.id"
                :to="{ path: `/creations/${relatedCreation.firstCreationId}` }"
                >{{
                  relatedCreation.firstCreationNames
                    ? relatedCreation.firstCreationNames[0].name
                    : relatedCreation.firstCreationId
                }}
                :
                {{ relatedCreation.firstCreationStanding }}
              </router-link>
            </li>
          </ul>
          <label v-if="relatedCreations.length == 0" class="pl-4"
            >Отсутствуют</label
          >
        </div>
      </div>

      <div
        class="pl-12 col-span-1 col-start-5 row-span-4 flex-col align-middle"
      >
        <div class="flex flex-row">
          <h2>Участники</h2>
          <MDBBtn
            tag="a"
            color="light"
            rounded
            @click="
              showAddAuthorModal = true;
              fetchRoles();
            "
            size="sm"
            class="m-2"
          >
            <MDBIcon iconStyle="fas" icon="plus"></MDBIcon>
          </MDBBtn>
        </div>
        <ul
          v-if="involvment"
          class="divide-y divide-gray-300 overflow-auto h-full pr-4"
        >
          <li v-for="inv in involvment" :key="inv.id">
            <ul
              v-if="involvment"
              class="divide-y divide-gray-300 overflow-auto h-full pr-4"
            >
              <li
                v-for="author in inv.Authors"
                :key="author.id"
                class="hover:bg-gray-100"
              >
                <mini-author-info
                  :author_id="author.id"
                  :img_height="80"
                  :img_width="80"
                  :role="inv.name"
                  :isApproved="true"
                />
              </li>
            </ul>
          </li>
        </ul>
        <label v-if="involvment === null" class="pl-4">Никто не указан</label>
      </div>
    </div>
    <div class="grid grid-cols-3 grid-rows-1">
      <div
        class="h-80 col-start-1 col-span-1 flex flex-col align-items-center p-4"
      >
        <h2>Похожие на основе тэгов</h2>
        <ul
          v-if="similar.length > 0"
          class="divide-y divide-gray-300 overflow-auto h-full w-full"
        >
          <li
            v-for="creation in similar"
            :key="creation.id"
            class="hover:bg-gray-100"
          >
            <mini-creation-info
              :creation_id="creation.id"
              :img_height="80"
              :img_width="80"
              :isApproved="true"
            />
          </li>
        </ul>
        <label v-if="similar.length == 0" class="pl-4"
          >Такие произведения не найдены</label
        >
      </div>
      <div
        class="h-80 col-start-2 col-span-1 flex flex-col align-items-center p-4"
      >
        <h2>Похожие на основе участников</h2>
        <ul
          v-if="similarByAuthor.length > 0"
          class="divide-y divide-gray-300 overflow-auto h-full w-full"
        >
          <li
            v-for="creation in similarByAuthor"
            :key="creation.id"
            class="hover:bg-gray-100"
          >
            <mini-creation-info
              :creation_id="creation.id"
              :img_height="80"
              :img_width="80"
              :isApproved="true"
            />
          </li>
        </ul>
        <label v-if="similarByAuthor.length == 0" class="pl-4"
          >Такие произведения не найдены</label
        >
      </div>
      <div
        class="h-80 col-start-3 col-span-1 flex flex-col align-items-center p-4"
      >
        <div class="flex flex-row">
          <h2>Пользовательские рекомендации</h2>
          <MDBBtn
            tag="a"
            color="light"
            rounded
            @click="showNewRecModal = true"
            size="sm"
            class="mb-2 ms-2 mt-2"
          >
            <MDBIcon iconStyle="fas" icon="plus"></MDBIcon>
          </MDBBtn>
        </div>
        <ul
          v-if="userRecs.length > 0"
          class="divide-y divide-gray-300 overflow-auto h-full w-full"
        >
          <li
            v-for="userRec in userRecs"
            :key="userRec.id"
            class="hover:bg-gray-100"
          >
            <mini-creation-info
              :creation_id="
                userRec.firstCreationId == $route.params.id
                  ? userRec.secondCreationId
                  : userRec.firstCreationId
              "
              :img_height="80"
              :img_width="80"
              :isApproved="true"
            />
          </li>
        </ul>
        <label v-if="userRecs.length == 0" class="pl-4"
          >Такие произведения не найдены</label
        >
      </div>
    </div>
    <div class="grid grid-cols-2 grid-rows-1">
      <div
        class="h-80 col-start-1 col-span-1 flex flex-col align-items-center p-4"
      >
        <h2>Обсуждения</h2>
        <ul
          v-if="discussions.length > 0"
          class="divide-y divide-gray-300 overflow-auto h-full"
        >
          <li
            v-for="discussion in discussions"
            :key="discussion.id"
            class="hover:bg-gray-100 border-2 border-gray-400"
          >
            <router-link :to="{ path: `/discussion-page/${discussion.id}` }">
              <h1 class="text-black">{{ discussion.title }}</h1>
              <div
                class="
                  mx-auto
                  lg:mx-0
                  w-100
                  border-b-2 border-gray-400
                  opacity-25
                "
              ></div>
              <h2 class="text-black">{{ discussion.content }}</h2>
            </router-link>
          </li>
        </ul>
        <label v-if="discussions.length == 0" class="pl-4"
          >Обсуждений нет</label
        >
      </div>
      <div
        class="h-80 col-start-2 col-span-1 flex flex-col align-items-center p-4"
      >
        <h2>Отзывы</h2>
        <ul
          v-if="reviews.length != 0"
          class="divide-y divide-gray-300 overflow-auto h-full w-full"
        >
          <li
            v-for="review in reviews"
            :key="review.id"
            class="hover:bg-gray-100 border-2 border-gray-400"
          >
            <review-block :review_id="review.id" :isOnUserPage="false" />
          </li>
        </ul>
        <label v-if="reviews.length == 0" class="pl-4"
          >Детальных отзывов нет</label
        >
      </div>
    </div>
    <MDBBtn color="light" v-if="isAdmin" @Click="deleteCreation"
      >Удалить произведение</MDBBtn
    >
    <MDBBtn color="light" @Click="showNewDiscussionModal = true"
      >Добавить обсуждение</MDBBtn
    >
  </div>
</template>
<script>
import axios from "axios";
import { APIURL } from "../constants";
import CustomHeader from "../components/CustomHeader";
import StarRating from "vue-star-rating";
import MiniCreationInfo from "../components/MiniCreationInfo";
import MiniAuthorInfo from "../components/MiniAuthorInfo";
import Review from "../components/Review.vue";
import {
  MDBModal,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBBtn,
  MDBIcon,
} from "mdb-vue-ui-kit";

export default {
  components: {
    "custom-header": CustomHeader,
    "mini-creation-info": MiniCreationInfo,
    "mini-author-info": MiniAuthorInfo,
    "review-block": Review,
    StarRating,
    MDBModal,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
    MDBBtn,
    MDBIcon,
  },
  data() {
    return {
      info: null,
      similar: [],
      similarByAuthor: [],
      isAdmin: false,
      image: require("@/assets/placeholder.png"),
      tags: [],
      involvment: null,
      loading: true,
      rating: null,
      showReviewModal: false,
      choosenRating: 0,
      reviewText: "",
      discussionContent: "",
      discussionTitle: "",
      showNewDiscussionModal: false,
      relatedCreations: [],
      thisCreationStanding: "",
      otherCreationStanding: "",
      otherCreationId: null,
      shoNewRealtionModal: false,
      relationModalTextSearch: "",
      realtionModalCreations: [],
      searchOptionsShow: false,
      showAddAuthorModal: false,
      roles: [],
      newAuthorRole: null,
      authorSearchOptionsShow: false,
      authorModalTextSearch: "",
      modalAuthors: [],
      newAuthorId: null,
      showNewNameModal: false,
      newName: "",
      discussions: [],
      reviews: [],
      userRecs: [],
      showNewRecModal: false,
      userRecSecondCreationId: null,
      userRecContent: "",
      predictedScore: null,
    };
  },
  async created() {
    this.fetchCreationInfo();
    this.fetchCreationTags();
    this.fetchSimilar();
    this.fetchinvolved();
    this.fetchRating();
    this.fetchSimilarByAuthors();
    this.fetchRelatedCreations();
    this.fetchDiscussions();
    this.fetchReviews();
    this.fetchUserRecs();
    this.fetchPredictedScore();
    if (localStorage.getItem("is_admin") == "true") {
      this.isAdmin = true;
    }
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
            if (this.info.image !== undefined) {
              this.image = "data:image/jpg;base64," + this.info.image;
            }
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
              this.$notify({
                title: "Произошла ошибка",
                text: error.response.data.error,
                type: "error",
              });
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
    fetchSimilar() {
      const fetchedId = this.$route.params.id;
      axios
        .get(`${APIURL}/creations-similar/${this.$route.params.id}`)
        .then((result) => {
          if (this.$route.params.id !== fetchedId) return;
          if (result.data.result !== undefined) {
            this.similar = result.data.result;
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
          this.$router.push("/main-page");
        })
        .catch((error) => {
          this.$notify({
            title: "Произошла ошибка",
            text: error.response.data.error,
            type: "error",
          });
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
          this.$notify({
            title: "Произошла ошибка",
            text: error.response.data.error,
            type: "error",
          });
        });
    },
    fetchinvolved() {
      const fetchedId = this.$route.params.id;
      axios
        .get(`${APIURL}/creation-role/${this.$route.params.id}`)
        .then((result) => {
          if (this.$route.params.id !== fetchedId) return;
          this.involvment = result.data.result;
        })
        .catch((error) => {
          this.$notify({
            title: "Произошла ошибка",
            text: error.response.data.error,
            type: "error",
          });
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
          this.$notify({
            title: "Произошла ошибка",
            text: error.response.data.error,
            type: "error",
          });
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
          this.$notify({
            title: "Произошла ошибка",
            text: error.response.data.error,
            type: "error",
          });
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
        })
        .catch((error) => {
          this.$notify({
            title: "Произошла ошибка",
            text: error.response.data.error,
            type: "error",
          });
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
          this.$notify({
            title: "Произошла ошибка",
            text: error.response.data.error,
            type: "error",
          });
        });
      this.showNewDiscussionModal = false;
    },
    fetchRelatedCreations() {
      const fetchedId = this.$route.params.id;
      axios
        .get(`${APIURL}/creation-relations/${this.$route.params.id}`)
        .then((result) => {
          if (this.$route.params.id !== fetchedId) return;
          this.relatedCreations = result.data.result;
          for (var relatedCreation of this.relatedCreations) {
            axios
              .get(`${APIURL}/creations/${relatedCreation.firstCreationId}`)
              .then((creationInfo) => {
                relatedCreation.firstCreationNames =
                  creationInfo.data.result.Creation_Names;
              })
              .catch((error) => {
                this.$notify({
                  title: "Произошла ошибка",
                  text: error.response.data.error,
                  type: "error",
                });
              });
            axios
              .get(`${APIURL}/creations/${relatedCreation.secondCreationId}`)
              .then((creationInfo) => {
                relatedCreation.secondCreationNames =
                  creationInfo.data.result.Creation_Names;
              })
              .catch((error) => {
                this.$notify({
                  title: "Произошла ошибка",
                  text: error.response.data.error,
                  type: "error",
                });
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
    addRelatedCreation() {
      if (this.otherCreationId === null) {
        alert("Не указано связанное произведение");
        return;
      }
      const fetchedId = this.$route.params.id;
      const token = localStorage.getItem("token");
      axios
        .post(
          `${APIURL}/creation-relations`,
          {
            firstCreationId: this.$route.params.id,
            secondCreationId: this.otherCreationId,
            firstCreationStanding: this.thisCreationStanding,
            secondCreationStanding: this.otherCreationStanding,
          },
          { headers: { authorization: token } }
        )
        .then(() => {
          if (this.$route.params.id !== fetchedId) return;
          this.shoNewRealtionModal = false;
          //Оповестить пользователя что все классно
        })
        .catch((error) => {
          this.$notify({
            title: "Произошла ошибка",
            text: error.response.data.error,
            type: "error",
          });
        });
      this.shoNewRealtionModal = false;
    },
    searchTextChanged() {
      if (this.relationModalTextSearch == "") {
        this.relationModalTextSearch = null;
        return;
      }
      const fetchedId = this.$route.params.id;
      axios
        .get(`${APIURL}/creations-search`, {
          params: { string: this.relationModalTextSearch },
        })
        .then((result) => {
          if (this.$route.params.id !== fetchedId) return;
          if (result.data.result !== undefined) {
            this.realtionModalCreations = result.data.result;
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
    setSearchOptions(flag) {
      this.searchOptionsShow = flag;
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
    setAuthorSearchOptions(flag) {
      this.authorSearchOptionsShow = flag;
    },
    authorSearchTextChanged() {
      if (this.authorModalTextSearch == "") {
        this.authorModalTextSearch = null;
        return;
      }
      const fetchedId = this.$route.params.id;
      axios
        .get(`${APIURL}/authors`, {
          params: { string: this.authorModalTextSearch },
        })
        .then((result) => {
          if (this.$route.params.id !== fetchedId) return;
          if (result.data.result !== undefined) {
            this.modalAuthors = result.data.result;
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
    addAuthor() {
      if (this.authorModalTextSearch == "") {
        return;
      }
      const token = localStorage.getItem("token");
      var roleId;
      for (var role of this.roles) {
        if (role.name == this.newAuthorRole) {
          roleId = role.id;
        }
      }
      axios
        .post(
          `${APIURL}/author-role`,
          {
            creation_id: this.$route.params.id,
            author_id: this.newAuthorId,
            role_id: roleId,
          },
          {
            headers: {
              authorization: token,
            },
          }
        )
        .then(() => {
          this.$notify({
            title: "Успех",
            text: "Участник добавлен",
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
      this.showAddAuthorModal = false;
    },
    addNewName() {
      if (this.newName == "") {
        return;
      }
      const token = localStorage.getItem("token");
      axios
        .post(
          `${APIURL}/creation-names/${this.$route.params.id}`,
          {
            name: this.newName,
          },
          {
            headers: {
              authorization: token,
            },
          }
        )
        .then(() => {})
        .catch((error) => {
          this.$notify({
            title: "Произошла ошибка",
            text: error.response.data.error,
            type: "error",
          });
        });
      this.showNewNameModal = false;
    },
    fetchDiscussions() {
      const fetchedId = this.$route.params.id;
      axios
        .get(`${APIURL}/creation-discussions/${this.$route.params.id}`)
        .then((result) => {
          if (this.$route.params.id !== fetchedId) return;
          this.discussions = result.data.result;
        })
        .catch((error) => {
          this.$notify({
            title: "Произошла ошибка",
            text: error.response.data.error,
            type: "error",
          });
        });
    },
    fetchReviews() {
      const fetchedId = this.$route.params.id;
      axios
        .get(`${APIURL}/reviews-creation/${this.$route.params.id}`)
        .then((result) => {
          if (this.$route.params.id !== fetchedId) return;
          this.reviews = result.data.result;
        })
        .catch((error) => {
          this.$notify({
            title: "Произошла ошибка",
            text: error.response.data.error,
            type: "error",
          });
        });
    },
    fetchUserRecs() {
      const fetchedId = this.$route.params.id;
      axios
        .get(`${APIURL}/user-reccomendations/${this.$route.params.id}`)
        .then((result) => {
          if (this.$route.params.id !== fetchedId) return;
          this.userRecs = result.data.result;
        })
        .catch((error) => {
          this.$notify({
            title: "Произошла ошибка",
            text: error.response.data.error,
            type: "error",
          });
        });
    },
    addNewRec() {
      if (this.userRecSecondCreationId === null) {
        alert("Не указано рекомендуемое произведение");
        return;
      }
      const fetchedId = this.$route.params.id;
      const token = localStorage.getItem("token");
      axios
        .post(
          `${APIURL}/user-reccomendations`,
          {
            firstCreationId: this.$route.params.id,
            secondCreationId: this.userRecSecondCreationId,
            content: this.userRecContent,
          },
          { headers: { authorization: token } }
        )
        .then(() => {
          if (this.$route.params.id !== fetchedId) return;
          this.showNewRecModal = false;
          //Оповестить пользователя что все классно
        })
        .catch((error) => {
          this.$notify({
            title: "Произошла ошибка",
            text: error.response.data.error,
            type: "error",
          });
        });
      this.showNewRecModal = false;
    },
    fetchPredictedScore() {
      const fetchedId = this.$route.params.id;
      const token = localStorage.getItem("token");
      axios
        .get(`${APIURL}/predict-score/${this.$route.params.id}`, {
          authorization: token,
        })
        .then((result) => {
          if (this.$route.params.id !== fetchedId) return;
          this.predictedScore = result.data.result;
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
.modal {
  width: 700px;
  padding: 30px;
  box-sizing: border-box;
  background-color: #fff;
  font-size: 20px;
  text-align: center;
}
</style>
