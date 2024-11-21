<template>
  <div v-if="items.length" class="datatable-container" :style="tableResponsiveStyle">
    <table
      :class="[
        clickable
          ? 'table datatable-table is-fullwidth is-hoverable mb-0'
          : 'table datatable-table is-fullwidth mb-0',
      ]"
    >
      <thead>
        <tr>
          <th
            v-for="item in header"
            :key="item.id"
            class="is-clickable"
            @click="sort(item.value)"
          >
            {{ item.text }}
            <i
              v-if="
                item.sortable === sortBy &&
                sortDirection === '-' &&
                item.text === sortText
              "
              class="ms-1 fa fa-sort-down"
            />
            <i
              v-else-if="
                item.sortable === sortBy && sortDirection === '' && item.text === sortText
              "
              class="ms-1 fa fa-sort-up"
            />
            <i v-else-if="item.sortable" class="ms-1 fa fa-sort" />
          </th>
        </tr>
      </thead>
      <tbody :class="[trial ? 'blur' : '']">
        <tr
          v-for="item in items"
          :key="item.id"
          v-table-click="() => click(item)"
          :class="[clickable ? 'is-clickable' : '']"
        >
          <td v-for="h in header" :key="h.id">
            <span v-if="loading && !trial" class="placeholder-glow">
              <span class="placeholder is-12 column p-0" />
            </span>
            <span v-if="loading && trial" class="placeholder is-12 column p-0" />
            <span v-else>
              <span v-if="h.html">
                <!-- eslint-disable vue/no-v-html -->
                <span
                  v-if="h.value == 'cve_id'"
                  v-dompurify-html="item[h.value]"
                  class="is-clickable"
                  @click.stop.prevent="cve = item[h.value].replace(/<(?:.|\s)*?>/g, '')"
                />
                <span v-else v-dompurify-html="item[h.value]" />
                <!-- eslint-enable vue/no-v-html -->
              </span>
              <span v-else>
                <img
                  v-if="h.value == 'name' && item['image']"
                  :src="imageHost + '/' + item['image']"
                  style="height: 15px"
                />
                {{ item[h.value] }}
                <a
                  v-if="h.value == 'name' && item['website']"
                  :href="item['website']"
                  target="_blank"
                  ><i class="fa fa-external-link-alt"
                /></a>
              </span>
            </span>
          </td>
        </tr>
      </tbody>
    </table>

    <CVEModalComponent v-if="cve" :id="cve" @close="cve = null" />
  </div>
  <NoData v-else :meta="{ total: 0 }" search="" />
</template>

<script>
import NoData from '/@src/components/NoData.vue'
import CVEModalComponent from '/@src/components/modules/widgets/CVEModalComponent.vue'

export default {
  components: { CVEModalComponent, NoData },
  props: [
    'title',
    'header',
    'items',
    'height',
    'clickable',
    'defaultSort',
    'loading',
    'trial',
  ],
  emits: ['sorting'],
  data() {
    return {
      imageHost: 'https://s3.eu-central-1.amazonaws.com/rx-tech-media.resilientx.cloud',
      sortDirection: '-',
      sortBy: 'name',
      sortText: '',
      cve: false,
      tableResponsiveStyle: {
        'max-height': '600px',
      },
    }
  },
  mounted() {
    if (this.height) {
      this.tableResponsiveStyle = {
        'max-height': this.height + 'px',
      }
    }
    if (this.defaultSort) {
      this.sortBy = this.defaultSort
    }
  },
  methods: {
    sort(head) {
      const headerData = this.header.find((object) => object['value'] === head)
      if (headerData) {
        if (headerData.sortable) {
          this.sortText = headerData.text
          this.sortBy = headerData.sortable

          if (this.sortDirection === '') {
            this.sortDirection = '-'
          } else {
            this.sortDirection = ''
          }

          this.$emit('sorting', {
            field: this.sortBy,
            direction: this.sortDirection,
          })
        }
      }
    },
    click(item) {
      if (item.link) {
        this.$router.push(item.link)
      }
    },
    onContextMenu(e, item) {
      if (this.clickable) {
        e.preventDefault()
        this.$contextmenu({
          x: e.x,
          y: e.y,
          items: [
            {
              label: 'Open in new tab',
              onClick: () => {
                window.open(this.$router.resolve(item.link).href, '_blank')
              },
            },
          ],
        })
      }
    },
  },
}
</script>
