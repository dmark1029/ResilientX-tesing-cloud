<template>
  <svg
    ref="svg"
    viewBox="0 0 200 59"
    width="200"
    height="59"
    xmlns="http://www.w3.org/2000/svg"
    class="svg-container"
  >
    <rect width="200" height="59" rx="4" fill="#282933" />
    <text
      x="50%"
      y="20"
      text-anchor="middle"
      dominant-baseline="middle"
      style="fill: white; font-weight: 700; font-size: 11px"
    >
      <tspan x="50%" dy="1.2em">{{ meta.message }}</tspan>
    </text>
  </svg>
</template>

<script>
export default {
  props: ['meta'],
}
</script>