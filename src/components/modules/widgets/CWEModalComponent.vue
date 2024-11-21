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
        <p>{{ details.details }}</p>

        <div class="mt-4">
          <table class="table datatable-table is-fullwidth">
            <tbody>
              <tr>
                <td><b>URL</b></td>
                <td>{{ details.identification ?? '-' }}</td>
              </tr>
              <tr>
                <td><b>Method</b></td>
                <td>{{ details.method ? details.method : '-' }}</td>
              </tr>
              <tr>
                <td><b>Parameters</b></td>
                <td>{{ details.parameters ? details.parameters : '-' }}</td>
              </tr>
              <tr>
                <td><b>Attack</b></td>
                <td>{{ details.attack ? details.attack : '-' }}</td>
              </tr>
              <tr>
                <td><b>Evidence</b></td>
                <td>{{ details.evidence ? details.evidence : '-' }}</td>
              </tr>
              <tr>
                <td><b>Input vector</b></td>
                <td>{{ details.input_vector ? details.input_vector : '-' }}</td>
              </tr>
            </tbody>
          </table>
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
    loading: true,
  }),
  computed: {
    ...mapGetters(['general', 'project']),
  },
}
</script>
