<script>
import { mapGetters } from 'vuex'
import Form from '/@src/form'
import VPlaceholderPage from '/@src/components/base/placeholder/VPlaceholderPage.vue'
import VButton from '/@src/components/base/button/VButton.vue'
import VLoader from '/@src/components/base/loader/VLoader.vue'

export default {
  components: { VButton, VPlaceholderPage, VLoader },
  props: ['wizard'],
  data: () => ({
    saved: false,
    collection: null,
  }),
  computed: {
    ...mapGetters(['workspace', 'project', 'general']),
  },
  async mounted() {
    this.$props.wizard.setStep({
      number: 4,
      canNavigate: false,
    })

    this.saved = false

    // create project

    await this.saveProject()

    // collection

    await this.saveCollection()

    // asset

    if (this.$props.wizard.data.asset) {
      try {
        await this.saveAsset()

        const isOneTime = this.$props.wizard.data.schedule === 'one-time'

        if (isOneTime) {
          await this.scanNow()
        }
      } catch (e) {}
    }

    this.$store.dispatch('refreshUser')

    this.$props.wizard.reset()

    this.saved = true
  },
  methods: {
    scanNow() {
      return new Promise(async (resolve, reject) => {
        for (const tool of this.general.monitors) {
          let values = {}

          if (this.$props.wizard.data.discovery && tool.slug === 'exposure') {
            values = {
              discovery: true,
            }
          }

          if (this.$props.wizard.data.monitors.includes(tool.slug)) {
            await new Form({
              collection_id: this.collection?.id,
              monitor: tool.slug,
              values: values,
            })
              .post('/task/monitor')
              .then((res) => {})
              .catch(() => {
                this.$store.dispatch('addAlert', {
                  text: 'Error launching one time scan',
                  type: 'danger',
                })
                reject()
              })
          }
        }

        resolve()
      })
    },
    saveAsset() {
      return new Promise((resolve, reject) => {
        new Form({
          collection_id: this.collection?.id,
          value: this.$props.wizard.data.asset,
          business_impact: 'Moderate',
          project_id: this.project?.id,
        })
          .post('/asset/multiple')
          .then((res) => {
            const { data } = res.data
            resolve(data)
          })
          .catch(() => {
            this.$store.dispatch('addAlert', {
              text: 'Error creating asset',
              type: 'danger',
            })
            reject()
          })
      })
    },
    saveCollection() {
      return new Promise((resolve, reject) => {
        const monitors = {}

        const isOneTime = this.$props.wizard.data.schedule === 'one-time'

        this.general.monitors.forEach((tool) => {
          let values = {}
          if (this.$props.wizard.data.discovery && tool.slug === 'exposure') {
            values = {
              discovery: true,
            }
          }

          monitors[tool.slug] = {
            values: values,
            on: isOneTime ? false : this.$props.wizard.data.monitors.includes(tool.slug),
            schedule: isOneTime ? 'weeklyOn' : this.$props.wizard.data.schedule,
          }
        })

        new Form({
          name: this.$props.wizard.data.asset ?? 'Default Collection',
          project_id: this.project?.id,
          status: 'active',
          business_impact: 'Moderate',
          monitors: monitors,
        })
          .post('/collection')
          .then((res) => {
            this.collection = res.data.data
            resolve()
          })
          .catch(() => {
            this.$store.dispatch('addAlert', {
              text: 'Error creating collection',
              type: 'danger',
            })
            reject()
          })
      })
    },
    saveProject() {
      return new Promise((resolve, reject) => {
        new Form({
          name: this.$props.wizard.data.name,
          workspace_id: this.workspace.id,
          status: 'active',
        })
          .post('/project')
          .then((res) => {
            this.$store.commit('setProject', res.data.data)
            resolve()
          })
          .catch(() => {
            this.$store.dispatch('addAlert', {
              text: 'Error creating project',
              type: 'danger',
            })
            reject()
          })
      })
    },
  },
}
</script>

<template>
  <div id="wizard-step-7" class="inner-wrapper is-active" data-step-title="Finish">
    <div class="step-content">
      <VPlaceholderPage
        v-if="saved"
        class="end-placeholder"
        title="Congrats! You're all set."
        subtitle="Awesome, you just finished creating this project."
        larger
      >
        <template #image>
          <img
            class="light-image"
            style="max-width: 500px"
            :src="general.settings?.logo?.dark"
            alt=""
          />
          <img
            class="dark-image"
            style="max-width: 500px"
            :src="general.settings?.logo?.light"
            alt=""
          />
        </template>
        <template #action>
          <VButton
            class="mt-5"
            color="primary"
            rounded
            bold
            elevated
            :to="{
              name: 'ProjectOverview',
              params: { id: project.id },
            }"
          >
            Continue
          </VButton>
        </template>
      </VPlaceholderPage>
      <div v-else class="app-init-wrapper">
        <VLoader class="is-grey" :active="true">
          <div />
        </VLoader>
      </div>
    </div>
  </div>
</template>
