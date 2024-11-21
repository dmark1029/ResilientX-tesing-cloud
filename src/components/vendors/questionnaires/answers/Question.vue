<template>
  <div>
    <div v-for="question in questions" :key="question.id">
      <div
        v-if="question.condition == null || question.show"
        class="card question-card"
        :class="{
          'is-danger': question.type === 'danger',
          'is-info': question.type === 'info',
          'is-warning': question.type === 'warning',
          'is-tip': question.type === 'tip',
        }"
      >
        <header
          :class="{
            'card-header has-background-primary': ![
              'danger',
              'info',
              'warning',
              'tip',
            ].includes(question.type),
            'is-transparent': ['danger', 'info', 'warning', 'tip'].includes(
              question.type
            ),
          }"
        >
          <i
            v-if="question.questions && question.questions.length > 0"
            class="fa fa-caret-down"
            style="
              position: absolute;
              right: 20px;
              cursor: pointer;
              padding: 5px;
              top: 10px;
              color: white;
            "
            @click="toggleShow($event, question.id)"
          ></i>
          <div v-if="viewOnly && question.score" class="pl-4 pr-4 pb-2 pt-4">
            <span class="tag is-capitalized has-text-white has-background-critical"
              >Risk associated</span
            >
          </div>
          <div
            v-dompurify-html="question.question"
            class="card-header-title has-text-white is-block"
          />
        </header>
        <div class="card-content">
          <div class="content">
            <template v-if="question.type === 'line'">
              <input
                :value="question.answer_value ? question.answer_value[0] : null"
                placeholder="Enter your answer"
                class="input"
                type="text"
                :disabled="viewOnly"
                :required="question.required"
                @input="handleInputChange(question, $event.target.value)"
              />
            </template>
            <!-- Additional conditional rendering for 'file' and 'upload' types -->
            <template v-else-if="question.type === 'upload'">
              <input
                v-if="!viewOnly"
                class="input"
                :disabled="viewOnly"
                type="file"
                :required="question.required"
                @change="handleFileChange(question, $event)"
              />
              <div v-if="viewOnly">
                <div v-if="question.answer_value ? question.answer_value[0] : null">
                  <a class="button v-button is-primary" @click="downloadFile(question)">
                    View file
                  </a>
                </div>
                <div v-else>
                  <p>No file uploaded.</p>
                </div>
              </div>
            </template>
            <template v-if="question.type === 'radiogroup'">
              <div v-for="option in question.options" :key="option.value" class="control">
                <label class="radio pb-0 is-outlined">
                  <input
                    type="radio"
                    :disabled="viewOnly"
                    :value="option.value"
                    :name="'radio-' + question.id"
                    :required="question.required"
                    :checked="question.answer_choice_value.includes(option.id)"
                    @change="handleRadioChange(question, option)"
                  />
                  <span></span>
                  <span v-dompurify-html="option.label" />
                </label>
              </div>
            </template>

            <template v-else-if="question.type === 'select'">
              <div class="select">
                <select
                  :required="question.required"
                  :disabled="viewOnly"
                  @change="
                    handleSelectChange(question, question.options, $event.target.value)
                  "
                >
                  <option value="">Choose answer</option>
                  <option
                    v-for="option in question.options"
                    :key="option.value"
                    :selected="question.answer_choice_value.includes(option.id)"
                    :value="option.id"
                  >
                    <span v-dompurify-html="option.label" />
                  </option>
                </select>
              </div>
            </template>

            <template v-else-if="question.type === 'checkgroup'">
              <div v-for="option in question.options" :key="option.value" class="control">
                <div class="field">
                  <label class="checkbox is-outlined pb-0">
                    <input
                      type="checkbox"
                      :disabled="viewOnly"
                      :checked="question.answer_choice_value.includes(option.id)"
                      :value="option.value"
                      @change="handleCheckboxChange(question, option, $event)"
                    />
                    <span></span> <span v-dompurify-html="option.label" />
                  </label>
                </div>
              </div>
            </template>
            <template
              v-else-if="
                ['danger', 'info', 'warning', 'tip', 'textarea', 'box'].includes(
                  question.type
                )
              "
            >
              <textarea
                class="textarea"
                :disabled="viewOnly"
                :value="question.answer_value[0] ?? null"
                placeholder="Enter your answer"
                :required="question.required"
                @input="handleInputChange(question, $event.target.value)"
              />
            </template>
            <div v-if="question.error" class="invalid-feedback d-block mt-2">
              This field is required.
            </div>
            <!-- Recursive rendering of nested questions -->
            <Question
              v-if="
                question.questions &&
                question.questions.length > 0 &&
                !checkHide(question.id)
              "
              :questions="question.questions"
              :answers="answers"
              :view-only="viewOnly"
              :answer-id="answerId"
              :is-nested-level="true"
              class="mt-4 mb-0"
              @question-answer-changed="handleQuestionAnswerChanged"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { axios } from '/@src/axios'

export default {
  name: 'Question',
  props: {
    questions: {
      type: Array,
      required: true,
    },
    answers: {
      type: Array,
      required: false,
      default: () => [],
    },
    viewOnly: {
      type: Boolean,
      required: false,
      default: false,
    },
    answerId: {
      type: String,
      required: false,
      default: null,
    },
  },
  emits: ['question-answer-changed'],
  data() {
    return {
      toggleChildren: [],
    }
  },
  beforeMount() {
    this.questions.map((q) => {
      let question_answered = this.answers.find(
        (answer) => answer.questionnaire_question_id === q.id
      )

      if (question_answered) {
        q.score = question_answered.score

        if (q.type === 'upload') {
          if (this.viewOnly) {
            q.answer_value = question_answered.answer ?? []
          }
          return
        }

        q.answer_value = question_answered.answer ?? []
        q.answer_choice_value = question_answered.questionnaire_choice_id ?? []

        const allValues = []
        q.options.map((o) => {
          allValues.push(o.value)
        })

        const selectedValues = []
        q.options.map((o) => {
          if (q.answer_choice_value.includes(o.id)) selectedValues.push(o.value)
        })

        this.questions.map((q) => {
          if (q.condition !== null) {
            if (this.isValueInCondition(allValues, q.condition))
              q.show = !!this.evaluateCondition(selectedValues, q.condition)
          }
        })

        q.questions.map((q1) => {
          if (q1.condition !== null) {
            if (this.isValueInCondition(allValues, q1.condition)) {
              q1.show = !!this.evaluateCondition(selectedValues, q1.condition)
            }
          }
        })

        if (q.type === 'checkgroup') {
          q.options.map((o) => {
            if (question_answered.questionnaire_choice_id.includes(o.id)) {
              let updatedQuestion = {
                id: q.id,
                answer: o.label,
                type: q.type,
                checked: true,
                choice: o.id,
              }

              this.$emit('question-answer-changed', updatedQuestion)
            }
          })
        } else {
          let updatedQuestion = {
            id: q.id,
            answer: question_answered.answer[0],
            type: q.type,
            choice: question_answered.questionnaire_choice_id[0] ?? null,
          }

          this.$emit('question-answer-changed', updatedQuestion)
        }
      } else {
        q.score = null
        q.answer_value = []
        q.answer_choice_value = []
      }
    })
  },
  methods: {
    downloadFile(question) {
      let question_answered = this.answers.find(
        (answer) => answer.questionnaire_question_id === question.id
      )

      console.log(question_answered)

      axios
        .get(`/questionnaire-answer/` + this.answerId + `/` + question_answered.id, {
          responseType: 'blob',
        })
        .then((res) => {
          console.log(res.data)
          const blob = new Blob([res.data])
          const href = URL.createObjectURL(blob)

          const link = document.createElement('a')
          link.href = href
          link.setAttribute('download', question_answered.answer[0])
          document.body.appendChild(link)
          link.click()

          document.body.removeChild(link)
          URL.revokeObjectURL(href)
        })
        .catch(() => {})
    },
    handleInputChange(question, text) {
      let updatedQuestion = {
        id: question.id,
        answer: text,
        type: question.type,
      }
      this.$emit('question-answer-changed', updatedQuestion)
    },
    handleRadioChange(question, option) {
      // Update the question's answer with the selected option's value and index
      let updatedQuestion = {
        id: question.id,
        choice: option.id,
        answer: option.label,
      }
      this.handleChange(question, option)
      this.$emit('question-answer-changed', updatedQuestion)
    },
    handleFileChange(question, event) {
      const file = event.target.files[0]

      const size = Math.round(file.size / 1024)

      const ext = file.name.split('.').pop().toLowerCase()

      const supportedExtensions = [
        'jpg',
        'jpeg',
        'gif',
        'png',
        'pdf',
        'txt',
        'zip',
        'rar',
        'xls',
        'xlsx',
        'doc',
        'docx',
        'ppt',
        'pptx',
        '7z',
        'tar',
        'bz2',
        'gz',
      ]

      if (!supportedExtensions.includes(ext)) {
        event.target.value = null
        alert('File type not supported')
        return
      }

      if (size > 1024) {
        event.target.value = null
        alert('File size should not exceed 1MB')
        return
      }

      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          // The result attribute contains the Base64 string
          const base64String = e.target.result
          // Update the question's answer with the Base64 string
          let updatedQuestion = {
            id: question.id,
            answer: base64String,
            type: question.type,
          }
          this.$emit('question-answer-changed', updatedQuestion)
        }
        reader.readAsDataURL(file)
      }
    },
    handleSelectChange(question, options, selected_option_id) {
      let selected_option = options.find((o) => o.id === selected_option_id)

      let updatedQuestion = {
        id: question.id,
        choice: selected_option.id,
        answer: selected_option.label,
      }

      this.handleChange(question, selected_option)
      this.$emit('question-answer-changed', updatedQuestion)
    },
    handleCheckboxChange(question, option, event) {
      let updatedQuestion = {
        id: question.id,
        choice: option.id,
        answer: option.label,
        checked: event.target.checked,
        type: question.type,
      }

      this.handleChange(question, option, event)
      this.$emit('question-answer-changed', updatedQuestion)
    },
    handleQuestionAnswerChanged(updatedQuestion) {
      this.$emit('question-answer-changed', updatedQuestion)
    },
    handleChange(question, option, event) {
      const selectedValues = []
      const allValues = []
      if (question.type === 'checkgroup') {
        option.checked = event.target.checked
        question.options.map((o) => {
          if (o.checked) selectedValues.push(o.value)
        })
      } else {
        selectedValues.push(option.value)
      }

      question.options.map((o) => {
        allValues.push(o.value)
      })

      this.questions.map((q) => {
        if (q.condition !== null) {
          if (this.isValueInCondition(allValues, q.condition))
            q.show = !!this.evaluateCondition(selectedValues, q.condition)
        }
      })

      question.questions.map((q) => {
        if (q.condition !== null) {
          if (this.isValueInCondition(allValues, q.condition))
            q.show = !!this.evaluateCondition(selectedValues, q.condition)
        }
      })
    },
    evaluateCondition(selectedValues, condition) {
      condition = condition.replace(/\s+/g, '')

      function replaceWithBooleans(expr) {
        return expr.replace(/!?[^\(||\)||!|&&|\|\|]+/g, (match) => {
          const isNegated = match.startsWith('!')
          let identifier = match

          if (isNegated) {
            identifier = match.substring(1)
          }

          // Handling identifiers that start with special characters like '^'
          if (identifier.startsWith('^')) {
            identifier = identifier.substring(1) // Remove the '^' for comparison
          }

          const result = selectedValues.includes(identifier)
          return isNegated ? !result : result
        })
      }

      function evaluateLogicalExpression(processedExpr) {
        return Function('"use strict"; return (' + processedExpr + ');')()
      }

      // Process the condition to replace identifiers with boolean values
      let processedCondition = replaceWithBooleans(condition)

      // Handle negated groups specifically to ensure correct logical evaluation
      processedCondition = processedCondition.replace(
        /!\(([^)]+)\)/g,
        (match, groupExpr) => {
          // Directly evaluate the negation of the group's result
          const result = evaluateLogicalExpression(replaceWithBooleans(groupExpr))
          return !result
        }
      )

      // Evaluate any remaining expressions outside of negated groups
      return evaluateLogicalExpression(
        processedCondition.replace(/true/g, 'true').replace(/false/g, 'false')
      )
    },

    isValueInCondition(values, condition) {
      // Normalize the condition by removing spaces and logical operators that are not part of the values
      const normalizedCondition = condition
        .replace(/\s+/g, '')
        .replace(/[\!\(\)&\|\^]/g, '')

      // Check if any value from the values array exists in the normalized condition
      return values.some((value) => normalizedCondition.includes(value))
    },
    toggleShow(event, id) {
      event.target.classList.toggle('fa-caret-right')
      const index = this.toggleChildren.findIndex((item) => item.id === id)
      if (index !== -1) {
        this.toggleChildren[index].hideChildren = !this.toggleChildren[index].hideChildren
      } else {
        this.toggleChildren.push({ id: id, hideChildren: true })
      }
    },
    checkHide(id) {
      const item = this.toggleChildren.find((item) => item.id === id)
      console.log(item ? item.hideChildren : false)
      return item ? item.hideChildren : false
    },
  },
}
</script>

<style scoped>
.card {
  margin-bottom: 1rem;
}

.card.is-transparent {
  background-color: transparent !important;
}

.card.is-danger {
  background-color: #f14668;
  /* Bulma's is-danger background color */
}

.card.is-info {
  background-color: #3273dc;
  /* Bulma's is-info background color */
}

.card.is-warning {
  background-color: #ffdd57;
  /* Bulma's is-warning background color */
}

.card.is-tip {
  background-color: #00d1b2;
  /* Bulma's is-primary background color, used for 'tip' */
}

.card-header-title {
  font-weight: bold;
}

.card-header {
  background-color: #3273dc;
  /* Blue background color */
}

.nested-card {
  margin-left: 20px;
}
</style>