<template>
  <NssScannerSummaryWidget :workspace="workspace" :project="project" :module="module" />
</template>

<script>
import NssScannerSummaryWidget from './widgets/NssScannerSummaryWidget.vue'

export default {
  components: {
    NssScannerSummaryWidget,
  },
  props: ['project', 'workspace', 'module'],
}
</script>
