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
      <div class="has-text-left p-5">
        <div class="mb-3">
          <div v-if="details.status_extended">
            <p>{{ details.status_extended }}</p>
          </div>

          <div v-if="details.description">
            <p>{{ details.description }}</p>
          </div>

          <div v-if="details.risk">
            <p>{{ details.risk }}</p>
          </div>
        </div>

        <hr />

        <div class="columns is-multiline">
          <div class="column is-12">
            <div v-if="details.remediation" class="title-wrap mb-3">
              <p class="mb-2"><b>Remediation</b></p>
              <p v-if="details.remediation">
                {{ details.remediation.desc }}
              </p>
              <p class="mt-2 mb-2">
                <b>References</b>
                <a
                  v-for="(ref, index) in details.remediation.references"
                  :key="index"
                  class="is-block"
                  :href="ref"
                  target="_blank"
                  >{{ ref }}</a
                >
              </p>
            </div>
            <div v-if="details.related_url" class="title-wrap mb-3">
              <p class="mb-2"><b>References</b></p>
              <p>
                <a :href="details.related_url" target="_blank">{{
                  details.related_url
                }}</a>
              </p>
            </div>
            <!--                      <div class="title-wrap mb-3" v-if="details.compliance">-->
            <!--                        <p class="mb-2"><b>Compliance</b></p>-->
            <!--                        <div class="columns is-multiline">-->
            <!--                          <div class="column is-half" style="padding-bottom: 0px !important;" v-for="(value, key) in details.compliance">-->
            <!--                            <p>-->
            <!--                              <b>{{ key }}:</b>-->
            <!--                              <span v-if="Array.isArray(value)">-->
            <!--          <span v-for="(item, index) in value">-->
            <!--            {{ item }}<span v-if="index !== value.length - 1">, </span>-->
            <!--          </span>-->
            <!--        </span>-->
            <!--                              <span v-else>{{ value }}</span>-->
            <!--                            </p>-->
            <!--                          </div>-->
            <!--                        </div>-->
            <!--                      </div>-->
          </div>

          <div class="column is-12">
            <div class="title-wrap mb-3">
              <p class="mb-2"><b>Resource</b></p>

              <p v-if="details.resource_id"><b>Resource:</b> {{ details.resource_id }}</p>
              <p v-if="details.resource_name">
                <b>Resource name:</b> {{ details.resource_name }}
              </p>
              <p v-if="details.resource_arn">
                <b>Resource ARN:</b> {{ details.resource_arn }}
              </p>
              <p v-if="details.resource_details">
                <b>Resource details:</b> {{ details.resource_details }}
              </p>
              <p v-if="details.tenant_domain">
                <b>Tenant:</b> {{ details.tenant_domain }}
              </p>
              <p v-if="details.subscription">
                <b>Subscription:</b> {{ details.subscription }}
              </p>
              <p v-if="details.account_id"><b>Account:</b> {{ details.account_id }}</p>
              <p v-if="details.region"><b>Region:</b> {{ details.region }}</p>
              <p v-if="details.location"><b>Location:</b> {{ details.location }}</p>
              <p v-if="details.cloud_project">
                <b>Project:</b> {{ details.cloud_project }}
              </p>
            </div>
            <div v-if="details.service_name" class="title-wrap mb-3">
              <p class="mb-2"><b>Service</b></p>
              <p>
                <span>{{ details.service_name }}</span>
                <span v-if="details.sub_service_name">{{
                  details.sub_service_name
                }}</span>
              </p>
            </div>
            <div class="title-wrap mb-3">
              <p class="mb-2"><b>Tags</b></p>
              <span v-if="details.resource_type" class="tag mr-2">{{
                details.resource_type
              }}</span>
              <span
                v-for="(tag, index) in getTags(details)"
                :key="index"
                class="tag mr-2"
                >{{ tag }}</span
              >
              <span v-if="details.notes" class="tag">{{ details.notes }}</span>
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
    loading: true,
  }),
  computed: {
    ...mapGetters(['general', 'project']),
  },
  methods: {
    getTags(item) {
      let tags = []
      if (item.resource_tags) {
        tags = tags.concat(item.resource_tags)
      }
      if (item.check_type) {
        tags = tags.concat(item.check_type)
      }
      if (item.categories) {
        tags = tags.concat(item.categories)
      }
      return tags
    },
  },
}
</script>
