<template>
  <svg
    ref="svg"
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
      ref="text"
      :x="xCenter"
      :y="yCenter"
      text-anchor="middle"
      dominant-baseline="middle"
      style="fill: white; font-weight: 700; font-size: 11px"
    >
      <tspan
        v-for="(line, index) in titleLines"
        :key="index"
        x="50%"
        :dy="index === 0 ? `${-(linesCount - 1) * 0.6}em` : '1.2em'"
      >
        {{ line }}
      </tspan>
    </text>
  </svg>
</template>

<script>
export default {
  props: ['issue'],
  data() {
    return {
      isDragging: false,
      startX: 0,
      startY: 0,
      xCenter: '50%',
      yCenter: '50%',
      linesCount: 1,
    }
  },
  computed: {
    titleLines() {
      const maxLineLength = 20 // Adjust as needed
      const words = this.issue.title.split(' ')
      let lines = []
      let currentLine = ''

      words.forEach((word) => {
        if ((currentLine + word).length <= maxLineLength) {
          currentLine += word + ' '
        } else {
          lines.push(currentLine.trim())
          currentLine = word + ' '
        }
      })

      if (currentLine) {
        lines.push(currentLine.trim())
      }

      return lines
    },
  },
  watch: {
    titleLines(newLines) {
      this.linesCount = newLines.length
    },
  },
  mounted() {
    this.adjustVerticalCentering()
  },
  methods: {
    adjustVerticalCentering() {
      this.$nextTick(() => {
        const text = this.$refs.text
        const bbox = text.getBBox()
        const svgHeight = 59
        const centerY = svgHeight / 2

        console.log(bbox)

        // Adjust y position based on text height
        this.yCenter = svgHeight - bbox.height / 2 - bbox.y
      })
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
        name: 'VRMIssueView',
        params: { issue: this.issue.id, id: this.$store.getters.workspace.id },
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
