<template>
  <div>
    <div v-for="(question, index) in questions" :key="index" class="card">
      <div class="card-body">
        <i
          class="fa fa-caret-down"
          style="
            position: absolute;
            right: 20px;
            cursor: pointer;
            padding: 5px;
            top: 15px;
          "
          @click="toggleShow($event)"
        ></i>

        <div class="field">
          <label class="label">Question</label>
          <input
            v-model="question.question"
            class="input"
            type="text"
            placeholder="Enter the question"
          />
        </div>

        <div class="toggled">
          <div class="columns mb-0">
            <div class="column col-6">
              <div class="field">
                <label class="label">Input type</label>
                <div class="control">
                  <div class="select">
                    <select v-model="question.type" @change="handleTypeChange(question)">
                      <option value="block">Block</option>
                      <option value="radiogroup">Radio</option>
                      <option value="checkgroup">Checkbox</option>
                      <option value="select">Select Dropdown</option>
                      <option value="line">Input</option>
                      <option value="box">Box</option>
                      <option value="upload">File</option>
                      <option value="danger">Danger</option>
                      <option value="info">Info</option>
                      <option value="warning">Warning</option>
                      <option value="tip">Tip</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div class="column col-6">
              <div class="field">
                <div>
                  <label
                    class="checkbox is-outlined"
                    style="margin-top: 18px; margin-bottom: 0px"
                  >
                    <input
                      type="checkbox"
                      :checked="question.required"
                      @change="toggleRequired(question)"
                    />
                    <span></span>Answer required
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div v-if="advancedMode" class="columns mb-0">
            <div v-if="advancedMode" class="column col-6">
              <div class="field">
                <label class="label">Condition</label>
                <input
                  v-model="question.condition"
                  class="input"
                  type="text"
                  placeholder="Condition to match with specific option value"
                />
              </div>
            </div>
            <div v-if="question.condition" class="column col-6">
              <div class="field">
                <label class="label">
                  <span>Risk (Associated with condition)</span>&nbsp;
                  <span>{{ question.risk }}</span>
                </label>
                <div
                  class="is-flex is-justify-content-space-between is-align-items-center columns mx-0 mt-1"
                >
                  <input
                    v-model="question.risk"
                    type="range"
                    min="0"
                    max="100"
                    class="slider column is-three-quarters px-0"
                  />
                  <span class="is-one-quarter" :class="riskClass(question.risk)">{{
                    riskLabel(question.risk)
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="['radiogroup', 'checkgroup', 'select'].includes(question.type)"
            class="mb-4"
          >
            <div class="field">
              <label class="label">Options</label>
              <div
                v-for="(option, oIndex) in question.options"
                :key="`option-${oIndex}`"
                class="field"
              >
                <div class="columns">
                  <div class="column is-3">
                    <div class="field">
                      <label class="label"> <span>Label</span>&nbsp; </label>
                      <div class="control is-expanded">
                        <input
                          v-model="option.label"
                          class="input"
                          type="text"
                          placeholder="Label"
                        />
                      </div>
                    </div>
                  </div>
                  <div v-if="advancedMode" class="column is-3">
                    <div class="field">
                      <label class="label"> <span>Value</span>&nbsp; </label>
                      <div class="control">
                        <input
                          v-model="option.value"
                          class="input"
                          type="text"
                          placeholder="Value"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="column is-3">
                    <div class="field">
                      <label class="label">
                        <span>Risk (Associated with answer)</span>&nbsp;
                        <span>{{ option.score }}</span>
                      </label>
                      <div
                        class="is-flex is-justify-content-space-between is-align-items-center columns mx-0 mt-1"
                      >
                        <input
                          v-model="option.score"
                          type="range"
                          min="0"
                          max="100"
                          class="slider column is-three-quarters px-0"
                        />
                        <span class="is-one-quarter" :class="riskClass(option.score)">{{
                          riskLabel(option.score)
                        }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="column is-3">
                    <div class="field">
                      <label class="label"> <span> </span>&nbsp; </label>
                      <div class="control">
                        <button
                          class="button v-button is-outlined is-danger"
                          type="button"
                          @click="removeOption(question, oIndex)"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button
              class="button v-button is-primary"
              type="button"
              @click="addOption(question)"
            >
              Add Option
            </button>
          </div>

          <div v-if="question.questions && question.questions.length">
            <question-form
              :questions="question.questions"
              :advanced-mode="advancedMode"
            ></question-form>
          </div>

          <hr />

          <div class="buttons">
            <button class="button v-button is-primary" @click="addSubQuestion(question)">
              Add Sub-Question
            </button>
            <button
              class="button v-button is-outlined is-danger"
              @click="removeQuestion(index)"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
    <button class="button is-primary" @click="addQuestion()">Add New Question</button>
  </div>
</template>

<script>
export default {
  name: 'QuestionForm',
  props: ['questions', 'advancedMode'],
  created() {
    if (this.questions.length === 0) {
      this.addQuestion()
    }
  },
  methods: {
    toggleShow(event) {
      event.target.classList.toggle('fa-caret-right')
      event.target.nextSibling.nextSibling.classList.toggle('is-hidden')
    },
    addQuestion() {
      // eslint-disable-next-line
      this.questions.push({
        question: '',
        risk: 0,
        order: this.questions.length + 1,
        required: false,
        type: 'line',
        options: this.getDefaultOptions('input'),
        questions: [],
      })
    },
    addSubQuestion(parentQuestion) {
      if (!parentQuestion.questions) {
        this.$set(parentQuestion, 'questions', [])
      }
      parentQuestion.questions.push({
        question: '',
        risk: 0,
        order: parentQuestion.questions.length + 1,
        required: false,
        type: 'line',
        options: this.getDefaultOptions('input'),
        questions: [],
      })
    },
    addOption(question) {
      question.options.push({ label: '', value: '', score: 0 })
    },
    removeOption(question, index) {
      question.options.splice(index, 1)
    },
    removeQuestion(index) {
      // eslint-disable-next-line
      this.questions.splice(index, 1)

      this.questions.forEach((question, i) => {
        question.order = i + 1
      })
    },
    getDefaultOptions(type) {
      if (['radiogroup', 'checkgroup', 'select'].includes(type)) {
        return [{ label: '', value: '', score: 0 }]
      }
      return []
    },
    handleTypeChange(question) {
      question.options = this.getDefaultOptions(question.type)
    },
    toggleRequired(question) {
      question.required = !question.required
    },
    riskLabel(risk) {
      risk = parseInt(risk, 10)
      if (risk === 0) {
        return 'None'
      } else if (risk <= 25) {
        return 'Low'
      } else if (risk <= 50) {
        return 'Medium'
      } else if (risk <= 75) {
        return 'High'
      } else if (risk <= 100) {
        return 'Critical'
      }
    },
    riskClass(risk) {
      risk = parseInt(risk, 10)
      if (risk === 0) {
        return 'tag is-light is-capitalized'
      } else if (risk < 25) {
        return 'tag is-info is-capitalized'
      } else if (risk < 50) {
        return 'tag is-warning is-capitalized has-text-white'
      } else if (risk < 75) {
        return 'tag is-danger is-capitalized'
      } else if (risk <= 100) {
        return 'tag is-critical is-capitalized'
      }
    },
  },
}
</script>

<style scoped>
.card {
  margin-bottom: 20px;
}

.buttons {
  margin-top: 10px;
}
.buttons button {
  display: inline-block;
}
</style>