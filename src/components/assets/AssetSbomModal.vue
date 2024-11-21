<template>
  <VModal
    is="form"
    :open="true"
    title="Import SBOM"
    size="big"
    actions="right"
    @close="$emit('close')"
  >
    <template #content>
      <div>
        <p>
          A software supply chain is composed of the components, libraries, tools, and
          processes used to develop, build, and publish a software artifact.
        </p>
        <p class="mb-5">
          <a href="https://cyclonedx.org/specification/overview/" target="_blank"
            >Learn more</a
          >
        </p>

        <h3 v-if="!type" class="is-size-5 mb-3 has-text-centered">Select import type</h3>

        <div v-if="!type" class="columns has-text-centered type-columns">
          <div class="column is-4">
            <div class="card">
              <div class="card-body" @click="type = 'manual'">
                <i class="fa fa-file"></i>
                <h5 class="card-title">MANUAL</h5>
              </div>
            </div>
          </div>
          <div class="column is-4">
            <div class="card">
              <div class="card-body" @click="type = 'gitlab'">
                <i class="fab fa-gitlab"></i>
                <h5 class="card-title">GITLAB</h5>
              </div>
            </div>
          </div>
          <div class="column is-4">
            <div class="card" @click="type = 'github'">
              <div class="card-body">
                <i class="fab fa-github"></i>
                <h5 class="card-title">GITHUB</h5>
              </div>
            </div>
          </div>
        </div>

        <div v-if="type === 'manual'">
          <h3 class="is-size-5 mb-2">
            Manual SBOM upload
            <small
              class="has-text-right is-pulled-right is-clickable has-text-white back-button"
              @click="type = null"
              >Back</small
            >
          </h3>

          <form @submit.prevent="importData" @keydown="form.onKeydown($event)">
            <div class="field">
              <label class="label">Upload BOM .JSON or .XML File</label>
              <div class="control">
                <div class="file has-name">
                  <label class="file-label">
                    <input
                      ref="file"
                      class="file-input"
                      type="file"
                      multiple="multiple"
                      accept=".json,.xml"
                      @change="handleFileUpload()"
                    />
                    <span class="file-cta">
                      <span class="file-icon"><i class="fas fa-cloud-upload-alt" /></span>
                      <span class="file-label"> Choose a file… </span>
                    </span>
                    <span class="file-name light-text">
                      {{
                        form.files && form.files.length
                          ? form.files.length + ' Files selected'
                          : 'Select files'
                      }}
                    </span>
                  </label>
                  <HasError :form="form" field="files" />
                </div>
              </div>
            </div>

            <div class="modal-card-foot">
              <button type="button" class="button v-button" @click="$emit('close')">
                {{ $t('Close') }}
              </button>
              <FormButton :form="form" class="button v-button is-primary btn-sm">
                {{ $t('Import') }}
              </FormButton>
            </div>
          </form>
        </div>

        <div v-if="type === 'github' || type === 'gitlab'">
          <h3 v-if="type === 'github'" class="is-size-5 mb-2">
            GITHUB import
            <small
              class="has-text-right is-pulled-right is-clickable has-text-white"
              @click="type = null"
              >Back</small
            >
          </h3>
          <h3 v-if="type === 'gitlab'" class="is-size-5 mb-2">
            GITLAB import
            <small
              class="has-text-right is-pulled-right is-clickable has-text-white"
              @click="type = null"
              >Back</small
            >
          </h3>

          <div v-if="!noIntegration && !loading" class="columns is-multiline">
            <div
              v-for="(item, index) in repositoryBranchPairs"
              :key="index"
              class="column is-12"
            >
              <div class="columns is-multiline">
                <div class="column is-6">
                  <div class="field">
                    <label class="label">Repository</label>
                    <Multiselect
                      v-model="item.repository"
                      placeholder="Search repository"
                      aria-autocomplete="none"
                      :internal-search="false"
                      :clear-on-blur="false"
                      :clear-on-select="true"
                      :close-on-select="true"
                      :options-limit="300"
                      :limit="20"
                      :max-height="600"
                      :show-no-results="false"
                      :hide-selected="true"
                      open-direction="bottom"
                      :searchable="true"
                      :options="repositories"
                      @open="() => getRepositories('', index)"
                      @search-change="(search) => getRepositories(search, index)"
                      @change="(value, label) => handleRepositoryChange(index)"
                    />
                  </div>
                </div>
                <div class="column is-6">
                  <div
                    class="is-flex"
                    style="align-items: center; justify-content: space-between"
                  >
                    <div style="flex-grow: 1; margin-right: 10px">
                      <div class="field">
                        <label class="label">Branch</label>
                        <Multiselect
                          v-model="item.branch"
                          placeholder="Search branch"
                          aria-autocomplete="none"
                          :internal-search="false"
                          :clear-on-blur="false"
                          :clear-on-select="true"
                          :close-on-select="false"
                          :options-limit="300"
                          :limit="20"
                          :max-height="600"
                          :show-no-results="false"
                          :hide-selected="true"
                          open-direction="bottom"
                          :searchable="true"
                          :options="item.branches"
                          @open="() => getBranch('', index)"
                          @search-change="(search) => getBranch(search, index)"
                        />
                      </div>
                    </div>
                    <div style="margin-top: 25px">
                      <button
                        class="button is-danger"
                        type="button"
                        @click="removeRow(index)"
                      >
                        X
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="column is-12 has-text-right">
              <button class="button v-button" type="button" @click="addRow">
                Add More
              </button>
            </div>
          </div>

          <div class="has-text-centered">
            <VLoader v-if="loading" :active="true">
              <div style="height: 100px"></div>
            </VLoader>
          </div>

          <div v-if="!noIntegration" class="columns">
            <div class="column is-12">
              <button
                type="button"
                class="button v-button is-primary"
                :disabled="!canImportGit"
                @click="importGit"
              >
                {{ $t('Import') }}
              </button>
            </div>
          </div>

          <div v-if="noIntegration">
            <p class="mb-3">
              No integration settings found, please add integration first.
            </p>
            <router-link
              :to="{
                name: 'ProjectIntegrationsView',
                params: { id: project.id },
              }"
              class="v-button button is-primary"
            >
              Add integration
            </router-link>
          </div>
        </div>
      </div>
    </template>
  </VModal>
</template>

<script>
import Form from '/@src/form'
import { Button as FormButton, HasError } from 'vform/src/components/bootstrap5'
import { mapGetters } from 'vuex'
import VModal from '/@src/components/base/modal/VModal.vue'
import { axios } from '/@src/axios'
import Multiselect from '@vueform/multiselect'
import VLoader from '/@src/components/base/loader/VLoader.vue'

export default {
  components: {
    VLoader,
    FormButton,
    HasError,
    VModal,
    Multiselect,
  },
  props: ['asset', 'collection'],
  emits: ['closeModal', 'close'],
  data: () => ({
    form: new Form({}),
    repositoryBranchPairs: [{ repository: null, branch: null, branches: [] }],
    type: null,
    repositories: [],
    branches: [],
    noIntegration: false,
    loading: false,
  }),
  computed: {
    ...mapGetters(['general', 'project']),
    canImportGit() {
      return this.repositoryBranchPairs.every((item) => item.repository && item.branch)
    },
  },
  watch: {
    type() {
      if (this.type === 'github' || this.type === 'gitlab') {
        this.checkIntegration()
      }
    },
  },
  methods: {
    handleFileUpload() {
      this.form.files = this.$refs.file.files
    },
    importGit() {
      let values = {
        git: [],
        branch: [],
      }

      this.repositoryBranchPairs.forEach((item) => {
        values.git.push(item.repository.git)
        values.branch.push(item.branch.name)
      })

      values.type = this.type

      axios
        .post('/task/monitor', {
          asset_id: this.asset?.id,
          collection_id: this.collection?.id,
          monitor: 'sbom',
          values: values,
        })
        .then((res) => {
          if (res.data.success) {
            this.$store.dispatch('addAlert', {
              text: 'SBOM processing, results will be available shortly.',
              type: 'success',
            })
            this.$emit('close')
          } else {
            this.$store.dispatch('addAlert', {
              text: 'SBOM for this asset already processed today.',
              type: 'danger',
            })
          }
        })
        .catch(() => {
          // Handle error
        })
    },
    checkIntegration() {
      this.noIntegration = false
      this.loading = true
      axios
        .get('/integration/' + this.type + '/' + this.project.id, {})
        .then((response) => {
          this.loading = false
          if (Object.keys(response.data).length === 0) {
            this.noIntegration = true
            this.$store.dispatch('addAlert', {
              text: 'Please check your integration settings.',
              type: 'danger',
            })
          }
        })
        .catch((e) => {
          this.loading = false
        })
    },
    importData() {
      this.form.asset_id = this.asset?.id
      this.form.collection_id = this.collection?.id

      this.form
        .post('/sbom')
        .then((data) => {
          this.form.files = null

          this.$store.dispatch('addAlert', {
            text: data.data.processed
              ? 'SBOM processed.'
              : 'SBOM processing, results will be available shortly.',
            type: 'success',
          })

          this.$emit('close')
        })
        .catch(() => {})
    },
    getRepositories(query = '', index = null) {
      if (this.type === 'github' || this.type === 'gitlab') {
        if (query === '') {
          return
        }

        axios
          .get('/integration/' + this.type + '/' + this.project.id + '/projects', {
            params: {
              q: query,
            },
          })
          .then((response) => {
            const newRepositories = response.data.data.map((item) => ({
              value: item,
              label: item.name,
            }))

            newRepositories.forEach((newRepo) => {
              const exists = this.repositories.some(
                (repo) => repo.value.id === newRepo.value.id
              )

              if (!exists) {
                this.repositories.push(newRepo)
              }
            })

            if (index !== null) {
              // this.repositoryBranchPairs[index].repository = null
              // this.repositoryBranchPairs[index].branches = []
            }
          })
          .catch((e) => {
            if (e.response && e.response.status === 422) {
              this.$store.dispatch('addAlert', {
                text: 'Please check your integration settings.',
                type: 'danger',
              })
            }
          })
      }
    },
    getBranch(query = '', index) {
      const repository = this.repositoryBranchPairs[index]?.repository

      if (!repository) return

      if (query === '') {
        this.repositoryBranchPairs[index].branches = []
        return
      }

      this.repositoryBranchPairs[index].branches = []

      axios
        .get('/integration/' + this.type + '/' + this.project.id + '/branches', {
          params: {
            id: repository.id,
            owner: repository.owner,
            repo: repository.name,
            q: query,
          },
        })
        .then((response) => {
          this.repositoryBranchPairs[index].branches = response.data.data.map((item) => ({
            value: item,
            label: item.name,
          }))
        })
        .catch(() => {})
    },
    addRow() {
      this.repositoryBranchPairs.push({ repository: null, branch: null, branches: [] })
    },
    removeRow(index) {
      this.repositoryBranchPairs.splice(index, 1)
    },
    handleRepositoryChange(index) {
      this.repositoryBranchPairs[index].branch = null
      this.getBranch('', index)
    },
  },
}
</script>

<style scoped>
.type-columns .card {
  cursor: pointer;
}
.type-columns .card-body {
  padding: 2rem;
}
.type-columns .card-title {
  margin-top: 1rem;
  font-weight: bold;
}
.type-columns .card i {
  font-size: 2.5rem;
}
.type-columns .card:hover {
  background-color: rgb(49, 49, 53);
  opacity: 0.9;
}
.back-button {
  cursor: pointer;
  color: #fff;
  font-size: 14px;
  margin-top: 10px;
}
</style>