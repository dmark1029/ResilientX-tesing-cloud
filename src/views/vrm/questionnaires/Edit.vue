<template>
  <div class="page-content-inner">
    <div class="card">
      <div class="card-body">
        <QuestionnaireForm
          v-if="!loading"
          :workspace="workspace"
          :editable="questionnaire"
          @changed="() => (formChanged = true)"
          @saved="() => (formChanged = false)"
        />
      </div>
    </div>

    <div class="breadcrumb-wrapper">
      <VBreadcrumb :items="links" :center="true" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { axios } from '/@src/axios'
import VBreadcrumb from '/@src/components/base/breadcrumb/VBreadcrumb.vue'
import QuestionnaireForm from '/@src/components/vendors/questionnaires/QuestionnaireForm.vue'

export default {
  components: {
    QuestionnaireForm,
    VBreadcrumb,
  },
  beforeRouteLeave(to, from, next) {
    if (this.confirmLeave()) {
      next()
    } else {
      next(false)
    }
  },
  data: () => ({
    questionnaire: null,
    loading: true,
    links: [],
    formChanged: false,
  }),
  computed: {
    ...mapGetters(['general', 'workspace']),
  },
  beforeCreate() {
    this.loading = true
  },
  beforeUnmount() {
    window.removeEventListener('beforeunload', this.confirmLeave)
  },
  async mounted() {
    window.addEventListener('beforeunload', (event) => {
      if (!this.confirmLeave()) {
        event.preventDefault()
        event.returnValue = ''
      }
    })

    await Promise.all([this.getQuestionnaire()])
      .then(() => {
        this.links = [
          {
            label: 'Home',
            to: {
              name: 'Home',
            },
          },
          {
            label: 'Workspaces',
            to: {
              name: 'Workspaces',
            },
          },
          {
            label: this.workspace.name,
            to: {
              name: 'WorkspacesView',
              params: { id: this.workspace.id },
            },
          },
          {
            label: 'Questionnaires',
            to: {
              name: 'VendorsView',
              params: { id: this.workspace.id },
            },
          },
          {
            label: this.questionnaire.title,
            to: {},
          },
          {
            label: 'Edit',
            to: {},
          },
        ]
      })
      .finally(() => {
        this.loading = false
      })
  },
  methods: {
    confirmLeave() {
      if (this.formChanged) {
        return confirm('You have unsaved changes. Are you sure you want to leave?')
      } else {
        return true
      }
    },
    async getQuestionnaire() {
      return axios
        .get(`/questionnaire/${this.$route.params.questionnaire}`)
        .then((res) => {
          this.questionnaire = res.data.data
        })
        .catch(() => {})
    },
  },
  metaInfo() {
    return {
      title: this.questionnaire ? this.questionnaire.title + ' edit' : '',
    }
  },
}
</script>
