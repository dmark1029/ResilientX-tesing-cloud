<template>
  <span>
    <span class="score" :style="`color:` + color">{{ score }} %</span>
    <span v-if="previousScore !== null && previousScore !== undefined" class="trend">
      <span v-if="previousScore > score" class="up">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="#ff2833">
          <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
          <path
            d="M384 160c-17.7 0-32-14.3-32-32s14.3-32 32-32H544c17.7 0 32 14.3 32 32V288c0 17.7-14.3 32-32 32s-32-14.3-32-32V205.3L342.6 374.6c-12.5 12.5-32.8 12.5-45.3 0L192 269.3 54.6 406.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160c12.5-12.5 32.8-12.5 45.3 0L320 306.7 466.7 160H384z"
          />
        </svg>
      </span>
      <span v-else-if="previousScore < score" class="down">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="#22b783">
          <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
          <path
            d="M384 352c-17.7 0-32 14.3-32 32s14.3 32 32 32H544c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32s-32 14.3-32 32v82.7L342.6 137.4c-12.5-12.5-32.8-12.5-45.3 0L192 242.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0L320 205.3 466.7 352H384z"
          />
        </svg>
      </span>
      <span v-else class="unchanged">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="#057BC1">
          <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
          <path
            d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"
          />
        </svg>
      </span>
    </span>
  </span>
</template>

<script>
export default {
  props: ['score', 'previousScore'],
  data: () => ({
    color: null,
  }),
  watch: {
    status: function () {
      this.setClass()
    },
  },
  mounted() {
    this.setClass()
  },
  methods: {
    setClass() {
      if (this.score > 0 && this.score < 20) {
        this.color = '#ff2833'
      } else if (this.score >= 20 && this.score < 50) {
        this.color = '#CD1619'
      } else if (this.score >= 50 && this.score < 80) {
        this.color = '#FFB622'
      } else if (this.score >= 80 && this.score <= 100) {
        this.color = '#057BC1'
      }
    },
  },
}
</script>

<style scoped>
.score {
  inset-inline-start: -45px;
  font-family: var(--font);
  font-size: 0.95rem;
  font-weight: 500;
}
.trend {
  font-size: 1em;
  vertical-align: -0.1em;

  svg {
    margin-left: 10px;
    display: inline-block;
    width: 1em;
    height: 1em;
  }
}
</style>