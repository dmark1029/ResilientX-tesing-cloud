<template>
  <div v-if="asset && asset.taskable_type === 'asset'" class="mb-3">
    <p class="v-label sub-1">Configuration</p>

    <div class="field">
      <label class="label">Connected repositories</label>
    </div>

    <div v-if="activeRepositories.length" class="datatable-container">
      <table class="table datatable-table is-fullwidth mb-0">
        <thead>
          <tr>
            <th>Repository</th>
            <th>Branch</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in activeRepositories" :key="item.id">
            <td>{{ item.repository }}</td>
            <td>{{ item.branch }}</td>
            <td>
              <button
                class="button is-danger"
                type="button"
                @click="deleteActiveRepository(item)"
              >
                <i class="fa fa-trash" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <p>No data available</p>
    </div>

    <div v-if="!showAdd" class="mt-3" @click="showAdd = true">
      <button class="v-button button">Add repositories</button>
    </div>

    <div v-if="showAdd">
      <hr />
      <div class="field">
        <label class="label">Integration</label>
        <div class="select">
          <select v-model="integration" class="input v-input">
            <option :value="undefined" disabled>Select integration</option>
            <option value="github">GitHub</option>
            <option value="gitlab">GitLab</option>
          </select>
        </div>
      </div>

      <div v-if="integration && !noIntegration" class="columns is-multiline">
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

        <div class="column is-6 has-text-left">
          <button
            type="button"
            class="button v-button is-primary"
            :disabled="!canImportGit"
            @click="importGit"
          >
            {{ $t('Add repositories') }}
          </button>
        </div>

        <div class="column is-6 has-text-right">
          <button class="button v-button" type="button" @click="addRow">Add More</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { axios } from '/@src/axios'
import { mapGetters } from 'vuex'
import Multiselect from '@vueform/multiselect'

export default {
  components: {
    Multiselect,
  },
  props: ['values', 'asset', 'form'],
  data() {
    return {
      repositoryBranchPairs: [{ repository: null, branch: null, branches: [] }],
      activeRepositories: [],
      repositories: [],
      integration: undefined,
      noIntegration: false,
      showAdd: false,
    }
  },
  computed: {
    ...mapGetters(['general', 'project']),
    canImportGit() {
      return this.repositoryBranchPairs.every((item) => item.repository && item.branch)
    },
  },
  watch: {
    integration: {
      handler: function (value) {
        this.checkIntegration()
      },
    },
  },
  async mounted() {
    if (this.asset) {
      if (this.asset.taskable_type === 'asset') {
        this.getAuthentications()
      }
    }
  },
  methods: {
    deleteActiveRepository(item) {
      axios
        .delete('/asset-repositories/' + item.id)
        .then(() => {
          this.getAuthentications()
        })
        .catch(() => {
          // Handle error
        })
    },
    async importGit() {
      for (const item of this.repositoryBranchPairs) {
        await axios
          .post('/asset-repositories', {
            asset_id: this.asset?.id,
            collection_id: this.collection?.id,
            type: this.integration,
            repository: item.repository.git,
            branch: item.branch.name,
          })
          .then(() => {})
          .catch(() => {
            // Handle error
          })
      }

      this.showAdd = false

      this.repositoryBranchPairs = [{ repository: null, branch: null, branches: [] }]

      this.getAuthentications()
    },
    getAuthentications() {
      axios
        .get('/asset-repositories', {
          params: {
            asset_id: this.asset.id,
          },
        })
        .then((response) => {
          this.activeRepositories = response.data.data
        })
    },
    checkIntegration() {
      this.noIntegration = false
      axios
        .get('/integration/' + this.integration + '/' + this.project.id, {})
        .then((response) => {
          if (Object.keys(response.data).length === 0) {
            this.noIntegration = true
            this.$store.dispatch('addAlert', {
              text: 'Please check your integration settings.',
              type: 'danger',
            })
          }
        })
        .catch((e) => {})
    },
    getRepositories(query = '', index = null) {
      if (this.integration === 'github' || this.integration === 'gitlab') {
        if (query === '') {
          return
        }

        axios
          .get('/integration/' + this.integration + '/' + this.project.id + '/projects', {
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
        .get('/integration/' + this.integration + '/' + this.project.id + '/branches', {
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
.sub-1 {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.33;
  letter-spacing: normal;
  margin-bottom: 10px;
}
</style>
