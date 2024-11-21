<template>
  <div class="container">
    <h1 class="title">{{ questionnaire.title }}</h1>
    <p style="white-space: pre">{{ questionnaire.description }}</p>

    <div v-if="questionnaire.answered">
      <p>Questionnaire already answered</p>
      <router-link :to="{ name: 'Home' }" class="button v-button is-primary mt-5">
        Return to Home
      </router-link>
    </div>
    <div v-else>
      <div v-if="loaded" class="questionnaire">
        <Question
          :questions="questionnaire.questions"
          :answers="questionnaire.answers"
          @question-answer-changed="handleQuestionAnswerChanged"
        ></Question>
      </div>

      <button
        :disabled="submitting"
        class="level-item button is-primary mr-3"
        @click="submitQuestionnaireWithAnswers('completed')"
      >
        <svg v-if="submitting" viewBox="25 25 50 50" class="loader">
          <circle r="20" cy="50" cx="50"></circle>
        </svg>
        <span v-else>Submit Questionnaire</span>
      </button>

      <p class="mt-5">
        <small
          >Questionnaire in draft status, click "Submit Questionnaire" for final
          answers.</small
        >
      </p>
    </div>
  </div>
</template>

<script>
import Question from './Question.vue'
import { axios } from '/@src/axios'

export default {
  components: {
    Question,
  },
  props: ['link'],
  emits: ['update:choice', 'changed', 'saved'],
  data() {
    return {
      questionnaire: {},
      answers_arr: [],
      errors: [],
      submitting: false,
      interval: null,
      autoSave: true,
      formChanged: false,
      loaded: false,
    }
  },
  created() {
    this.questionnaire = this.link

    this.loaded = true

    this.interval = setInterval(() => {
      if (this.autoSave && this.formChanged) {
        this.$store.dispatch('addAlert', {
          text: 'Performing auto save.',
          type: 'success',
        })
        setTimeout(() => {
          this.submitQuestionnaireWithAnswers('draft')
        }, 1000)
      }
    }, 10000)
  },
  beforeUnmount() {
    clearInterval(this.interval)
    this.interval = null
  },
  methods: {
    handleQuestionAnswerChanged(updatedQuestion) {
      this.$emit('changed')
      this.formChanged = true

      const index = this.answers_arr.findIndex(
        (q) => q.questionnaire_question_id === updatedQuestion.id
      )

      if (index !== -1) {
        if (updatedQuestion.type && updatedQuestion.type === 'checkgroup') {
          if (updatedQuestion.checked) {
            this.answers_arr[index].questionnaire_choice_id.push(updatedQuestion.choice)
            this.answers_arr[index].answer.push(updatedQuestion.answer)
          } else {
            var i = this.answers_arr[index].questionnaire_choice_id.indexOf(
              updatedQuestion.choice
            )
            if (i !== -1) {
              this.answers_arr[index].questionnaire_choice_id.splice(i, 1)
              this.answers_arr[index].answer.splice(i, 1)
            }
          }
        } else {
          this.answers_arr[index].questionnaire_choice_id = [updatedQuestion.choice]
          this.answers_arr[index].answer = [updatedQuestion.answer]
        }
      } else {
        this.answers_arr.push({
          questionnaire_question_id: updatedQuestion.id,
          questionnaire_choice_id: [updatedQuestion.choice],
          answer: [updatedQuestion.answer],
        })
      }
    },

    validateQuestionnaire() {
      this.errors = []

      this.validateQuestions(this.questionnaire.questions)
    },

    validateQuestions(questions) {
      questions.forEach((question) => {
        let answer = this.answers_arr.find(
          (a) => a.questionnaire_question_id === question.id
        )

        const isShownQuestion = question.condition == null || question.show

        if (answer) {
          if (!answer.answer[0] && !answer.questionnaire_choice_id[0]) {
            answer = null
          }
        }

        // remove hidden questions that has been pushed into answers array
        if (!isShownQuestion && answer) {
          const index = this.answers_arr.findIndex(
            (a) => a.questionnaire_question_id === question.id
          )

          this.answers_arr.splice(index, 1)
        }

        if (question.error === true) {
          question.error = false
        }

        if (
          !answer &&
          question.required &&
          (question.condition == null || question.show)
        ) {
          this.errors.push({
            question: question,
            message: question.question + ' is required',
          })
          question.error = true
        }

        if (question.questions.length > 0) {
          this.validateQuestions(question.questions)
        }
      })
    },

    async submitQuestionnaireWithAnswers(status) {
      this.submitting = true

      this.validateQuestionnaire()

      if (this.errors.length !== 0) {
        this.$store.dispatch('addAlert', {
          text: this.errors[0].message,
          type: 'danger',
        })
        this.submitting = false
        return
      }

      let questionnaire_answer = {
        answer: {
          status: status,
          questionnaire_link_id: this.questionnaire.id,
          questionnaire_id: this.questionnaire.questionnaire_id,
          vendor_id: this.questionnaire.vendor_id,
          question_answers: this.answers_arr,
        },
      }

      if (status === 'completed') {
        clearInterval(this.interval)
        this.interval = null
      }

      await axios
        .post('/questionnaire-answer', questionnaire_answer)
        .then(() => {
          this.$store.dispatch('addAlert', {
            text: 'Thank you, information saved successfully!',
            type: 'success',
          })

          this.formChanged = false
          this.$emit('saved')

          if (status === 'completed') {
            setTimeout(() => {
              this.$router.push({ name: 'Home' })
              this.submitting = false
            }, 2000)
          } else {
            this.submitting = false
          }
        })
        .catch((e) => {
          if (e.response.status === 422) {
            this.$store.dispatch('addAlert', {
              text: e.response.data.message,
              type: 'danger',
            })
          } else {
            this.$store.dispatch('addAlert', {
              text: 'Something went totally wrong',
              type: 'danger',
            })
          }
          this.submitting = false
        })
    },
    updateChoice(questionId, choiceId) {
      this.$emit('update:choice', { questionId, choiceId })
    },
  },
}
</script>

<style scoped>
.container {
  padding: 20px;
}

.questionnaire {
  margin-top: 20px;
}

svg {
  width: 3.25em;
  transform-origin: center;
  animation: rotate4 2s linear infinite;
}
.loader {
  border: 0px solid transparent !important;
}
circle {
  fill: none;
  stroke: white;
  stroke-width: 3;
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  stroke-linecap: round;
  animation: dash4 1.5s ease-in-out infinite;
}

@keyframes rotate4 {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash4 {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 90, 200;
    stroke-dashoffset: -35px;
  }

  100% {
    stroke-dashoffset: -125px;
  }
}
</style>
