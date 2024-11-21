<template>
  <VDropdown icon="fas fa-ellipsis-v" spaced right>
    <template #content>
      <router-link
        v-if="$route.name !== 'ProjectAssetView'"
        :to="{
          name: 'ProjectAssetView',
          params: { id: item.project_id, asset: item.id },
        }"
        role="menuitem"
        href="#"
        class="dropdown-item is-media"
        @click.stop.prevent=""
      >
        <div class="icon">
          <i aria-hidden="true" class="fa fa-eye" />
        </div>
        <div class="meta">
          <span>View</span>
          <span>View asset</span>
        </div>
      </router-link>
      <a
        :class="
          canPerformAction('assets', 'update')
            ? 'dropdown-item is-media'
            : 'dropdown-item is-media is-disabled'
        "
        @click.stop.prevent="editAsset(item)"
      >
        <div class="icon">
          <i aria-hidden="true" class="fa fa-pencil-alt" />
        </div>
        <div class="meta">
          <span>Edit</span>
          <span>Edit asset</span>
        </div>
      </a>
      <a
        :class="
          canPerformAction('assets', 'update')
            ? 'dropdown-item is-media'
            : 'dropdown-item is-media is-disabled'
        "
        @click.stop.prevent="showAuthModal = true"
      >
        <div class="icon">
          <i aria-hidden="true" class="fa fa-lock" />
        </div>
        <div class="meta">
          <span>Authentication</span>
          <span>Edit default authentication</span>
        </div>
      </a>
      <a
        :class="
          canPerformAction('assets', 'update')
            ? 'dropdown-item is-media'
            : 'dropdown-item is-media is-disabled'
        "
        @click.stop.prevent="showRepoModal = true"
      >
        <div class="icon">
          <i aria-hidden="true" class="fab fa-git" />
        </div>
        <div class="meta">
          <span>Repositories</span>
          <span>Edit connected repositories</span>
        </div>
      </a>
    </template>
  </VDropdown>

  <VModal
    is="form"
    :open="showAuthModal"
    :title="`Asset authentication configuration`"
    size="big"
    actions="right"
    @close="showAuthModal = false"
  >
    <template #content>
      <div class="has-text-centered">
        <application-scanner
          :values="item.authentication_configuration"
          :asset="item"
          :form="form"
        />
      </div>
    </template>
  </VModal>

  <VModal
    is="form"
    :open="showRepoModal"
    :title="`Asset repositories configuration`"
    size="big"
    actions="right"
    @close="showAuthModal = false"
  >
    <template #content>
      <div>
        <sbom :values="{}" :asset="item" :form="form" />
      </div>
    </template>
  </VModal>
</template>

<script>
import permissionsMixin from '/@src/mixins/permissionsMixin'
import VDropdown from '/@src/components/base/dropdown/VDropdown.vue'
import ApplicationScanner from '/@src/components/tasks/modules/application-scanner.vue'
import VModal from '/@src/components/base/modal/VModal.vue'
import Form from '/@src/form'
import Sbom from '/@src/components/tasks/modules/sbom.vue'

export default {
  components: { Sbom, VModal, ApplicationScanner, VDropdown },
  mixins: [permissionsMixin],
  props: ['item'],
  emits: ['editAsset'],
  data() {
    return {
      form: new Form(),
      showAuthModal: false,
      showRepoModal: false,
    }
  },
  methods: {
    editAsset(item) {
      this.$emit('editAsset', item)
    },
  },
}
</script>