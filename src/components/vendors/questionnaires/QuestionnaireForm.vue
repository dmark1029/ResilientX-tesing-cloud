<template>
  <div class="questionnaire">
    <div class="columns is-mobile mb-0">
      <div class="column is-narrow is-flex is-align-items-center pb-0">
        <p>Settings</p>
      </div>
      <div class="column is-narrow is-fullwidth pb-0">
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label" style="min-width: 70px">Auto save</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <VControl>
                  <VSwitchSegment
                    class="is-inline"
                    color="success"
                    :model-value="autoSave"
                    @update:modelValue="
                      (value) => {
                        autoSave = value
                      }
                    "
                  />
                </VControl>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-narrow is-fullwidth pb-0">
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label" style="min-width: 100px">Advanced mode</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <VControl>
                  <VSwitchSegment
                    class="is-inline"
                    color="success"
                    :model-value="advancedMode"
                    @update:modelValue="
                      (value) => {
                        advancedMode = value
                      }
                    "
                  />
                </VControl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <hr />

    <div class="field">
      <label class="label">Title</label>
      <input v-model="form.title" class="input" type="text" placeholder="Title" />
      <HasError :form="form" field="title" />
    </div>

    <div class="field">
      <label class="label">Description</label>
      <textarea v-model="form.description" class="textarea" placeholder="Description" />
      <HasError :form="form" field="description" />
    </div>

    <div class="field">
      <label class="label">Status</label>
      <div class="select">
        <select v-model="form.status">
          <option value="Active">Active</option>
          <option value="Archive">Inactive</option>
        </select>
      </div>
      <HasError :form="form" field="status" />
    </div>

    <div class="columns">
      <div class="column is-6">
        <div class="field">
          <label class="label">Questionnaire score calculation</label>
          <div class="select">
            <select v-model="form.exclude">
              <option value="1">Exclude</option>
              <option value="0">Include</option>
            </select>
          </div>
          <HasError :form="form" field="exclude" />
        </div>
      </div>
      <div class="column is-6">
        <div class="field">
          <label class="label">Language</label>
          <div class="select">
            <select v-model="form.language" class="form-select">
              <option :value="null">Select language</option>
              <option
                v-for="(value, index) in general.languages"
                :key="index"
                :value="index"
              >
                {{ value }}
              </option>
            </select>
            <HasError :form="form" field="language" />
          </div>
        </div>
      </div>
    </div>

    <div v-if="advancedMode" class="field">
      <label class="label column is-full">
        <span>Acceptable Score</span>&nbsp;
        <span>{{ form.acceptable_score }}</span>
      </label>
      <div class="columns mx-0">
        <input
          v-model="form.acceptable_score"
          class="slider column is-4 px-0"
          type="range"
          min="0"
          max="100"
        />
      </div>
      <input
        v-model="form.acceptable_score"
        class="input"
        type="number"
        placeholder="Acceptable Score"
      />
      <HasError :form="form" field="acceptable_score" />
    </div>

    <div class="field">
      <label class="label">Questions</label>
    </div>
    <question-form
      :questions="form.questions"
      :advanced-mode="advancedMode"
    ></question-form>
    <HasError :form="form" field="questions" />

    <div class="field mt-6">
      <FormButton :form="form" class="button is-primary" @click="submitQuestionnaire">
        Save
      </FormButton>
    </div>
  </div>
</template>

<script>
import QuestionForm from './QuestionForm.vue'
import Form from '/@src/form'
import { Button as FormButton, HasError } from 'vform/src/components/bootstrap5'
import VControl from '/@src/components/base/form/VControl.vue'
import VSwitchSegment from '/@src/components/base/form/VSwitchSegment.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    VSwitchSegment,
    VControl,
    QuestionForm,
    HasError,
    FormButton,
  },
  props: ['workspace', 'editable'],
  emits: ['saved', 'changed'],
  data: () => ({
    questionnaire: null,
    form: new Form({}),
    autoSave: true,
    advancedMode: false,
    interval: null,
    initialChange: false,
    formChanged: false,
  }),
  computed: {
    ...mapGetters(['general']),
  },
  watch: {
    'form.questions': {
      handler() {
        if (!this.initialChange) {
          this.initialChange = true
        } else {
          this.formChanged = true
          this.$emit('changed')
        }
      },
      deep: true,
    },
  },
  created() {
    this.questionnaire = this.editable

    this.form = new Form({})
    this.form.title = this.editable ? this.editable.title : ''
    this.form.workspace_id = this.workspace.id
    this.form.status = this.editable ? this.editable.status : 'Active'
    this.form.acceptable_score = this.editable ? this.editable.acceptable_score : 50
    this.form.questions = this.editable ? this.editable.questions ?? [] : []
    this.form.description = this.editable ? this.editable.description : ''
    this.form.exclude = this.editable ? this.editable.exclude : '0'
    this.form.language = this.editable ? this.editable.language : 'en'

    this.interval = setInterval(() => {
      if (this.autoSave && this.formChanged) {
        if (!this.form.title) {
          return
        }
        this.$store.dispatch('addAlert', {
          text: 'Performing auto save.',
          type: 'success',
        })
        setTimeout(() => {
          this.submitQuestionnaire()
        }, 1000)
      }
    }, 10000)
  },
  beforeUnmount() {
    clearInterval(this.interval)
    this.interval = null
  },
  methods: {
    async submitQuestionnaire() {
      let form
      if (this.questionnaire) {
        form = this.form.put(`questionnaire/${this.questionnaire.id}`, this.questionnaire)
      } else {
        form = this.form.post(`questionnaire`, this.questionnaire)
      }

      return form
        .then((response) => {
          this.formChanged = false
          this.$emit('saved')
          this.questionnaire = response.data.data

          if (this.autoSave) {
            this.$store.dispatch('addAlert', {
              text: 'Questionnaire saved successfully.',
              type: 'success',
            })
          } else {
            this.$router.push({
              name: 'VendorsQuestionnaires',
            })
          }
        })
        .catch(() => {
          if (this.autoSave) {
            this.$store.dispatch('addAlert', {
              text: 'Questionnaire could not be saved.',
              type: 'danger',
            })
          } else {
            this.$store.dispatch('addAlert', {
              text: 'Questionnaire could not be saved.',
              type: 'danger',
            })
          }
        })
    },
  },
}
</script>

<style scoped>
/* Your styles here */
</style>
