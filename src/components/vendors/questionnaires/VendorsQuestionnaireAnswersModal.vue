<template>
  <VModal
    is="div"
    :open="true"
    :title="`Answers`"
    size="extra-large"
    @close="$emit('closeModal')"
  >
    <template #content>
      <div v-if="answer" class="container">
        <div v-if="!answer.answers.length">
          <p class="has-text-centered p-5">No answered questions.</p>
        </div>
        <div v-else>
          <Question
            :questions="answer.questions"
            :answers="answer.answers"
            :view-only="true"
            :answer-id="answer.id"
          ></Question>
        </div>

        <!--        <div-->
        <!--          v-for="(question, index) in answer.answer_questions"-->
        <!--          :key="index"-->
        <!--          class="card question-card mb-4"-->
        <!--        >-->
        <!--          <header-->
        <!--            class="card-header has-background-primary is-flex is-justify-content-space-between is-align-items-center"-->
        <!--          >-->
        <!--            <div>-->
        <!--              <p-->
        <!--                v-dompurify-html="-->
        <!--                  `Question #${index + 1} ` + question.question_details.question-->
        <!--                "-->
        <!--                class="card-header-title is-block has-text-white"-->
        <!--              ></p>-->
        <!--            </div>-->
        <!--            <div>-->
        <!--              <p class="card-header-title has-text-white has-text-right">-->
        <!--                Score {{ question.score }}-->
        <!--              </p>-->
        <!--            </div>-->
        <!--          </header>-->
        <!--          <div class="card-content">-->
        <!--            <template v-if="question.question_details.type === 'upload'">-->
        <!--              <p class="subtitle is-6">-->
        <!--                <a @click="downloadFile(question)">View Uploaded File</a>-->
        <!--              </p>-->
        <!--            </template>-->
        <!--            <template v-else>-->
        <!--              <p class="subtitle is-6">Answer: {{ question.answer.join(', ') }}</p>-->
        <!--            </template>-->
        <!--          </div>-->
        <!--        </div>-->
      </div>
      <div v-else>
        <VLoader :active="true" size="small">
          <div style="height: 100px" />
        </VLoader>
      </div>
    </template>
  </VModal>
</template>

<script>
import Form from '/src/form'
import { mapGetters } from 'vuex'
import VModal from '/src/components/base/modal/VModal.vue'
import { axios } from '/@src/axios'
import VLoader from '/src/components/base/loader/VLoader.vue'
import Question from '/@src/components/vendors/questionnaires/answers/Question.vue'

export default {
  components: {
    Question,
    VLoader,
    VModal,
  },
  props: ['item'],
  emits: ['closeModal'],
  data: () => ({
    form: new Form({}),
    answer: null,
  }),
  computed: {
    ...mapGetters(['general']),
  },
  mounted() {
    this.getAnswers()
  },
  methods: {
    save() {
      this.send()
        .then(() => {
          this.$emit('closeModal')
        })
        .catch(() => {})
    },
    getAnswers() {
      let url = `/questionnaire-answer/` + this.item.id

      return axios
        .get(url)
        .then((res) => {
          this.answer = res.data.data
        })
        .catch(() => {})
    },
    downloadFile(answer) {
      axios
        .get(`/questionnaire-answer/` + this.item.id + `/` + answer.id, {
          responseType: 'blob',
        })
        .then((res) => {
          const blob = new Blob([res.data])
          const href = URL.createObjectURL(blob)

          const link = document.createElement('a')
          link.href = href
          link.setAttribute('download', answer.answer[0])
          document.body.appendChild(link)
          link.click()

          document.body.removeChild(link)
          URL.revokeObjectURL(href)
        })
        .catch(() => {})
    },
  },
}
</script>
