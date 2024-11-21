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
        <div class="mt-0">
          <table class="table datatable-table is-fullwidth">
            <tbody>
              <tr>
                <td><b>Email</b></td>
                <td>{{ details.email ?? '-' }}</td>
              </tr>
              <tr>
                <td><b>Password</b></td>
                <td>{{ details.password }}</td>
              </tr>
              <tr>
                <td><b>Password type</b></td>
                <td>{{ details.password_type }}</td>
              </tr>
              <tr>
                <td><b>Leak</b></td>
                <td>{{ details.leak }}</td>
              </tr>
              <tr>
                <td><b>Leak date</b></td>
                <td>{{ details.leak_date }}</td>
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
