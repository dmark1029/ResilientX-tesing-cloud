<template>
  <DastScannerSummaryWidget :workspace="workspace" :project="project" :module="module" />
</template>

<script>
import DastScannerSummaryWidget from './widgets/DastScannerSummaryWidget.vue'

export default {
  components: {
    DastScannerSummaryWidget,
  },
  props: ['project', 'workspace', 'module'],
}
</script>
