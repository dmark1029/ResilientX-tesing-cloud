<template>
  <SummaryWidget
    :workspace="workspace"
    :project="project"
    :module="module"
    :grouped="true"
  />

  <MapWidget :workspace="workspace" :project="project" :module="module" />

  <div class="columns">
    <div class="column is-12 d-flex align-items-stretch">
      <div class="card">
        <div class="card-body">
          <IpsTableWidget
            class="w-100"
            height="300"
            :workspace="workspace"
            :project="project"
            :module="module"
          />
        </div>
      </div>
    </div>
  </div>

  <div class="columns">
    <div class="column is-12 d-flex align-items-stretch">
      <div class="card">
        <div class="card-body">
          <VulnerabilitiesTableWidget
            :grouped="true"
            :workspace="workspace"
            :project="project"
            :module="module"
            class="w-100"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SummaryWidget from './widgets/SummaryWidget.vue'
import VulnerabilitiesTableWidget from './widgets/VulnerabilitiesTableWidget.vue'
import MapWidget from './widgets/MapWidget.vue'
import IpsTableWidget from '/@src/components/modules/cyber-ex/widgets/IpsTableWidget.vue'

export default {
  components: {
    IpsTableWidget,
    MapWidget,
    VulnerabilitiesTableWidget,
    SummaryWidget,
  },
  props: ['project', 'workspace', 'module'],
}
</script>
