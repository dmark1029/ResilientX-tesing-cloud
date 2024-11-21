<template>
  <VModal
    is="div"
    :open="true"
    :title="`Preview questionnaire`"
    size="extra-large"
    @close="$emit('closeModal')"
  >
    <template #content>
      <VLoader v-if="!loaded" :active="true">
        <div style="height: 100px" />
      </VLoader>
      <div v-else>
        <h1 class="title">{{ questionnaire.title }}</h1>
        <p v-if="questionnaire.description" class="mb-5">
          {{ questionnaire.description }}
        </p>
        <div class="questionnaire">
          <Question
            :answers="[]"
            :questions="questionnaire.questions"
            @question-answer-changed="handleQuestionAnswerChanged"
          ></Question>
        </div>
      </div>
    </template>
  </VModal>
</template>

<script>
import { mapGetters } from 'vuex'
import VModal from '/src/components/base/modal/VModal.vue'
import { axios } from '/@src/axios'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import Question from '/@src/components/vendors/questionnaires/answers/Question.vue'

export default {
  components: {
    Question,
    VModal,
    VLoader,
  },
  props: ['workspace', 'editable'],
  emits: ['closeModal'],
  data: () => ({
    questionnaire: null,
    loaded: false,
  }),
  computed: {
    ...mapGetters(['general']),
  },
  async mounted() {
    if (this.editable) {
      await this.getQuestionnaire()
    }

    this.loaded = true
  },
  methods: {
    async getQuestionnaire() {
      return axios
        .get(`/questionnaire/${this.editable.id}`)
        .then((res) => {
          this.questionnaire = res.data.data
        })
        .catch(() => {})
    },
    handleQuestionAnswerChanged() {},
  },
}
</script>
