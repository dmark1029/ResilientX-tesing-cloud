<template>
  <IssueViewComponent :project="project" />
</template>

<script>
import IssueViewComponent from '/@src/components/issues/IssueViewComponent.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    IssueViewComponent,
  },
  computed: {
    ...mapGetters(['project']),
  },
}
</script>