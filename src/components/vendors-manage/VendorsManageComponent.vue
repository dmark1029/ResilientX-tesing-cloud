<template>
  <div>
    <div class="tile-grid tile-grid-v2">
      <TransitionGroup name="list" tag="div" class="columns is-multiline">
        <div
          v-for="item in manageableVendors.slice(0, limit)"
          :key="item.id"
          class="column is-4"
        >
          <div
            class="tile-grid-item"
            @click="
              () => {
                $router.push({
                  name: 'VrmManageView',
                  params: { asset: item.vendor.id },
                })
              }
            "
          >
            <div class="tile-grid-item-inner">
              <div class="meta">
                <span class="dark-inverted">{{ item.vendor.name }}</span>
                <span>
                  <span>{{
                    item.vendor.industries.map((industry) => industry.name).join(',')
                  }}</span>
                </span>
              </div>
              <div class="right-menu">
                <div>
                  <button class="button v-button">View</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="add" class="column is-4">
          <div
            class="tile-grid-item"
            style="height: 70px"
            @click="
              () => {
                $router.push({ name: 'VrmManage' })
              }
            "
          >
            <div class="tile-grid-item-inner">
              <div class="meta">
                <span class="dark-inverted">View all companies</span>
                <span> </span>
              </div>
              <div class="right-menu">
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  components: {},
  props: ['add', 'limit'],
  data: () => ({}),
  computed: {
    ...mapGetters(['manageableVendors', 'general']),
  },
}
</script>
