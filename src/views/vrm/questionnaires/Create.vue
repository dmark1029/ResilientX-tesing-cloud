<template>
  <div class="page-content-inner">
    <div class="card">
      <div class="card-body">
        <QuestionnaireForm
          v-if="!loading"
          :workspace="workspace"
          :editable="null"
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
import VBreadcrumb from '/@src/components/base/breadcrumb/VBreadcrumb.vue'
import QuestionnaireForm from '/@src/components/vendors/questionnaires/QuestionnaireForm.vue'

export default {
  components: { QuestionnaireForm, VBreadcrumb },
  beforeRouteLeave(to, from, next) {
    if (this.confirmLeave()) {
      next()
    } else {
      next(false)
    }
  },
  props: ['project'],
  data: () => ({
    loading: true,
    links: [],
    formChanged: false,
  }),
  computed: {
    ...mapGetters(['workspace']),
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
        label: 'Create',
        to: {},
      },
    ]

    this.loading = false
  },
  methods: {
    confirmLeave() {
      if (this.formChanged) {
        return confirm('You have unsaved changes. Are you sure you want to leave?')
      } else {
        return true
      }
    },
  },
  metaInfo() {
    return {
      title: 'Create questionnaire',
    }
  },
}
</script>
