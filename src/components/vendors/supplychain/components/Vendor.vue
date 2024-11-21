<template>
  <svg
    viewBox="0 0 200 59"
    width="200"
    height="59"
    xmlns="http://www.w3.org/2000/svg"
    class="svg-container"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
  >
    <rect width="200" height="59" rx="4" fill="#282933" />
    <text
      x="50%"
      y="18"
      dominant-baseline="middle"
      text-anchor="middle"
      style="fill: white; font-weight: 700; font-size: 13px"
    >
      {{ vendor.name }}
    </text>
    <AGrade
      v-if="vendor.exposure_score >= 0 && vendor.exposure_score < 5"
      :x="140"
      :y="28"
    />
    <BGrade
      v-else-if="vendor.exposure_score >= 5 && vendor.exposure_score < 20"
      :x="140"
      :y="28"
    />
    <CGrade
      v-else-if="vendor.exposure_score >= 20 && vendor.exposure_score < 40"
      :x="140"
      :y="28"
    />
    <DGrade
      v-else-if="vendor.exposure_score >= 40 && vendor.exposure_score < 70"
      :x="140"
      :y="28"
    />
    <EGrade
      v-else-if="vendor.exposure_score >= 70 && vendor.exposure_score < 85"
      :x="140"
      :y="28"
    />
    <FGrade v-else :x="140" :y="28" />
    <text x="53" y="46" style="fill: white; font-size: 12">
      {{ getIssues() }} {{ getIssues() === 1 ? 'Issue' : 'Issues' }}
    </text>
    <path
      d="M 45 45 L 41.19 38.14 C 40.68 37.22 39.97 36.72 39.19 36.72 C 38.41 36.72 37.70 37.22 37.19 38.14 L 33.38 45 C 32.90 45.88 32.85 46.72 33.23 47.38 C 33.62 48.04 34.38 48.41 35.38 48.41 L 43 48.41 C 44 48.41 44.77 48.04 45.15 47.38 C 45.54 46.72 45.49 45.88 45 45 Z M 38.74 40.88 C 38.74 40.63 38.94 40.43 39.19 40.43 C 39.44 40.43 39.64 40.63 39.64 40.88 L 39.64 43.86 C 39.64 44.11 39.44 44.31 39.19 44.31 C 38.94 44.31 38.74 44.11 38.74 43.86 L 38.74 40.88 Z M 39.61 45.06 L 39.52 45.13 C 39.49 45.15 39.45 45.17 39.41 45.18 C 39.37 45.20 39.33 45.21 39.29 45.22 C 39.25 45.22 39.21 45.22 39.17 45.22 C 39.13 45.22 39.09 45.21 39.05 45.22 C 39.01 45.21 38.97 45.20 38.93 45.18 C 38.89 45.17 38.85 45.15 38.81 45.13 L 38.72 45.06 C 38.61 44.94 38.55 44.77 38.55 44.63 C 38.55 44.48 38.61 44.32 38.72 44.19 L 38.81 44.12 C 38.85 44.10 38.89 44.08 38.93 44.07 C 39.05 44.02 39.19 44.01 39.30 44.04 C 39.33 44.05 39.37 44.06 39.41 44.07 C 39.45 44.08 39.49 44.10 39.52 44.12 L 39.61 44.19 C 39.72 44.32 39.78 44.48 39.78 44.63 C 39.78 44.77 39.72 44.94 39.61 45.06 Z"
      fill="#E7151A"
    />
  </svg>
</template>

<script>
import AGrade from '/src/components/vendors/supplychain/components/grade/agrade.vue'
import BGrade from '/src/components/vendors/supplychain/components/grade/bgrade.vue'
import FGrade from '/src/components/vendors/supplychain/components/grade/fgrade.vue'
import CGrade from '/src/components/vendors/supplychain/components/grade/cgrade.vue'
import DGrade from '/src/components/vendors/supplychain/components/grade/dgrade.vue'
import EGrade from '/src/components/vendors/supplychain/components/grade/egrade.vue'

export default {
  components: { EGrade, DGrade, CGrade, FGrade, AGrade, BGrade },
  props: ['vendor'],
  data() {
    return {
      isDragging: false,
      startX: 0,
      startY: 0,
    }
  },
  methods: {
    getIssues() {
      let issues = 0
      this.vendor.assets.forEach((asset) => {
        issues += asset.issues_count
      })
      return issues
    },
    handleMouseDown(event) {
      this.isDragging = false
      this.startX = event.clientX
      this.startY = event.clientY
      document.addEventListener('mousemove', this.handleMouseMove)
      document.addEventListener('mouseup', this.handleMouseUp)
    },
    handleMouseMove(event) {
      const dx = event.clientX - this.startX
      const dy = event.clientY - this.startY
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        this.isDragging = true
      }
    },
    handleMouseUp(event) {
      document.removeEventListener('mousemove', this.handleMouseMove)
      document.removeEventListener('mouseup', this.handleMouseUp)
      if (!this.isDragging) {
        this.handleClick()
      }
    },
    handleClick() {
      this.$router.push({
        name: 'VendorView',
        params: { asset: this.vendor.id },
      })
    },
  },
}
</script>

<style scoped>
.svg-container {
  cursor: pointer;
}

.svg-container:hover rect {
  fill: #2a2b38;
}
</style>
