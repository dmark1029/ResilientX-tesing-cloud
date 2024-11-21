<template>
  <div>
    <VModal is="div" :open="true" title="Details" size="big" @close="$emit('closeModal')">
      <template #content>
        <div class="card">
          <div class="card-body">
            <h4 class="title is-5">
              {{ item.data.name }}
            </h4>
            <dl class="columns mb-0 is-multiline">
              <dt class="column is-3">Confidence</dt>
              <dd class="column is-9">
                {{ item.data.confidence }}
              </dd>
              <dt class="column is-3">Risk</dt>
              <!-- eslint-disable vue/no-v-html -->
              <dd v-dompurify-html="getRisk(item.data.risk)" class="column is-9" />
              <!-- eslint-enable -->
              <dt class="column is-3">URL</dt>
              <dd class="column is-9">
                {{ item.data.url }}
              </dd>
              <dt class="column is-3">Method</dt>
              <dd class="column is-9">
                {{ item.data.method }}
              </dd>
              <dt v-if="item.data.param" class="column is-3">Param</dt>
              <dd v-if="item.data.param" class="column is-9">
                {{ item.data.param }}
              </dd>
              <dt v-if="item.data.inputVector" class="column is-3">Input vector</dt>
              <dd v-if="item.data.inputVector" class="column is-9">
                {{ item.data.inputVector }}
              </dd>

              <dt v-if="item.data.attack" class="column is-3">Attack</dt>
              <dd v-if="item.data.attack" class="column is-9">
                {{ item.data.attack }}
              </dd>
              <dt v-if="item.data.evidence" class="column is-3">Evidence</dt>
              <dd v-if="item.data.evidence" class="column is-9">
                {{ item.data.evidence }}
              </dd>
              <dt v-if="item.data.other" class="column is-3">Other</dt>
              <dd v-if="item.data.other" class="column is-9">
                {{ item.data.other }}
              </dd>
              <dt v-if="item.data.tags.length" class="column is-3">Tags</dt>
              <dd v-if="item.data.tags.length" class="column is-9">
                <ul class="ps-3">
                  <li v-for="tag in item.data.tags" :key="tag">
                    <a :href="tag.value" target="_blank">{{ tag.name }}</a>
                  </li>
                </ul>
              </dd>
              <dt v-if="item.data.reference.length" class="column is-3">References</dt>
              <dd v-if="item.data.reference.length" class="column is-9">
                <ul class="ps-3">
                  <li v-for="reference in item.data.reference" :key="reference">
                    <a :href="reference" target="_blank">{{ reference }}</a>
                  </li>
                </ul>
              </dd>
            </dl>
          </div>
        </div>
      </template>
    </VModal>
  </div>
</template>

<script>
import VModal from '/@src/components/base/modal/VModal.vue'

export default {
  components: { VModal },
  props: ['item'],
  emits: ['closeModal'],
  mounted() {},
  methods: {
    getRisk(risk) {
      if (risk === 'High') {
        return "<span class='tag is-danger'>High</span>"
      } else if (risk === 'Medium') {
        return "<span class='tag is-warning'>Medium</span>"
      } else if (risk === 'Low') {
        return "<span class='tag is-info'>Low</span>"
      } else {
        return ''
      }
    },
  },
}
</script>
