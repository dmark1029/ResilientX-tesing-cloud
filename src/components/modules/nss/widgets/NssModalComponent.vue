<template>
  <VModal
    is="form"
    :open="true"
    title="Details"
    size="big"
    actions="right"
    @close="$emit('closeModal')"
  >
    <template #content>
      <div>
        <p style="white-space: pre-wrap">{{ details.description }}</p>

        <hr />

        <table class="table datatable-table is-fullwidth">
          <tbody>
            <tr>
              <td><b>Name</b></td>
              <td>{{ details.name }}</td>
            </tr>
            <tr>
              <td><b>Host</b></td>
              <td>{{ details.host_text }}</td>
            </tr>
            <tr>
              <td><b>Hostname</b></td>
              <td>{{ details.host_hostname }}</td>
            </tr>
            <tr>
              <td><b>Port</b></td>
              <td>{{ details.port }}</td>
            </tr>
            <tr>
              <td><b>Category</b></td>
              <td>{{ details.nvt_family }}</td>
            </tr>
            <tr>
              <td><b>Threat</b></td>
              <td>{{ details.threat }}</td>
            </tr>
          </tbody>
        </table>

        <div class="mt-4">
          <h4 class="title is-6">Other details</h4>

          <div>
            <p class="mb-2">
              <b>Impact: </b>
            </p>

            <p class="mb-2">
              {{ details.nvt_tags?.impact ? details.nvt_tags.impact : '-' }}
            </p>

            <p class="mb-2">
              <b>Insight: </b>
            </p>

            <p class="mb-2">
              {{ details.nvt_tags?.insight ? details.nvt_tags.insight : '-' }}
            </p>

            <p class="mb-2">
              <b>Affected: </b>
            </p>

            <p class="mb-2">
              {{ details.nvt_tags?.affected ? details.nvt_tags.affected : '-' }}
            </p>

            <p class="mb-2">
              <b>Vulnerability detection: </b>
            </p>

            <p class="mb-2">
              {{ details.nvt_tags?.vuldetect ? details.nvt_tags.vuldetect : '-' }}
            </p>

            <p class="mb-2">
              <b>References: </b>
            </p>

            <ul class="mb-2 ps-3">
              <li v-for="reference in details.references" :key="reference">
                <a v-if="reference.type === 'url'" :href="reference.id" target="_blank">{{
                  reference.id
                }}</a>
                <span v-else>{{ reference.id }}</span>
              </li>
            </ul>
            <p v-if="!details.references.length" class="mb-2">-</p>

            <p
              v-if="showCvss"
              class="mb-2 is-clickable"
              @click="
                () => {
                  showCvss = !showCvss
                }
              "
            >
              <b>Hide CVSS details</b>
            </p>
            <p
              v-else
              class="mb-2 is-clickable"
              @click="
                () => {
                  showCvss = !showCvss
                }
              "
            >
              <b>Show CVSS details</b>
            </p>

            <div v-if="showCvss" class="columns mb-0 is-multiline">
              <div class="column is-4 has-text-light">
                <b>CVSS base vector</b>
              </div>
              <div class="column is-8 has-text-light">
                {{ details.nvt_tags.cvss_base_vector }}
              </div>
              <div class="column is-4 has-text-light"><b>Integrity</b></div>
              <div class="column is-8 has-text-light">
                {{ details.cvss_base_vector.Integrity }}
              </div>
              <div class="column is-4 has-text-light">
                <b>Complexity</b>
              </div>
              <div class="column is-8 has-text-light">
                {{ details.cvss_base_vector.Complexity }}
              </div>
              <div class="column is-4 has-text-light">
                <b>Availability</b>
              </div>
              <div class="column is-8 has-text-light">
                {{ details.cvss_base_vector.Availability }}
              </div>
              <div class="column is-4 has-text-light">
                <b>Authentication</b>
              </div>
              <div class="column is-8 has-text-light">
                {{ details.cvss_base_vector.Authentication }}
              </div>
              <div class="column is-4 has-text-light">
                <b>Confidentiality</b>
              </div>
              <div class="column is-8 has-text-light">
                {{ details.cvss_base_vector.Confidentiality }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </VModal>
</template>

<script>
import { mapGetters } from 'vuex'
import VModal from '/@src/components/base/modal/VModal.vue'

export default {
  components: {
    VModal,
  },
  props: ['details'],
  emits: ['closeModal'],
  data: () => ({
    cve: null,
    showCvss: false,
    loading: true,
  }),
  computed: {
    ...mapGetters(['general', 'project']),
  },
}
</script>
