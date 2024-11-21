<template>
  <VDropdown icon="fas fa-ellipsis-v" spaced right>
    <template #content>
      <a
        :class="
          canPerformAction('scans', 'create')
            ? 'dropdown-item is-media'
            : 'dropdown-item is-media is-disabled'
        "
        @click="relaunch(item)"
      >
        <div class="icon">
          <i aria-hidden="true" class="fa fa-rocket" />
        </div>
        <div class="meta">
          <span>Relaunch</span>
          <span>Relaunch scan</span>
        </div>
      </a>

      <a
        :class="[
          isTrial(item) || !item.report
            ? 'dropdown-item is-media is-disabled'
            : 'dropdown-item is-media',
        ]"
        @click="downloadExecutiveReport(item, $event)"
      >
        <div class="icon">
          <i aria-hidden="true" class="fa fa-download" />
        </div>
        <div class="meta">
          <span>Download</span>
          <span>Download executive report</span>
        </div>
      </a>

      <a
        :class="[
          isTrial(item) || !item.report
            ? 'dropdown-item is-media is-disabled'
            : 'dropdown-item is-media',
        ]"
        @click="downloadReport(item, $event)"
      >
        <div class="icon">
          <i aria-hidden="true" class="fa fa-download" />
        </div>
        <div class="meta">
          <span>Download</span>
          <span>Download full report</span>
        </div></a
      >
    </template>
  </VDropdown>
</template>

<script>
import permissionsMixin from '/@src/mixins/permissionsMixin'
import slugify from 'slugify'
import { axios } from '/@src/axios'

export default {
  mixins: [permissionsMixin],
  props: ['item'],
  emits: ['relaunch'],
  methods: {
    isTrial(item) {
      return item?.report?.task?.licenseItem?.license?.trial
    },
    downloadExecutiveReport(item, event) {
      axios
        .get('/report/' + item.report.id + '/print-summary', {
          responseType: 'blob',
        })
        .then((res) => {
          if (res.status === 200) {
            const blob = new Blob([res.data], { type: 'application/pdf' })
            const href = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = href

            let name =
              slugify(item.asset.name + '-' + item.module.name, {
                lower: true,
              }) +
              '-' +
              slugify(item.finished_at) +
              '-executive-report.pdf'

            link.setAttribute('download', name)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(href)
          } else if (res.status === 204) {
            event.target.textContent = 'Generation started, please come back later'
            setTimeout(() => {
              event.target.textContent = 'Download executive report'
            }, 3000)
          } else {
            event.target.textContent = 'Error'
          }
        })
        .catch(() => {})
    },
    downloadReport(item, event) {
      axios
        .get('/report/' + item.report.id + '/print', {
          responseType: 'blob',
        })
        .then((res) => {
          if (res.status === 200) {
            const blob = new Blob([res.data], { type: 'application/pdf' })
            const href = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = href

            let name =
              slugify(item.asset.name + '-' + item.module.name, {
                lower: true,
              }) +
              '-' +
              slugify(item.finished_at) +
              '.pdf'

            link.setAttribute('download', name)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(href)
          } else if (res.status === 204) {
            event.target.textContent = 'Generation started, please come back later'
            setTimeout(() => {
              event.target.textContent = 'Download full report'
            }, 3000)
          } else {
            event.target.textContent = 'Error'
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    relaunch(item) {
      this.$emit('relaunch', item)
    },
  },
}
</script>
