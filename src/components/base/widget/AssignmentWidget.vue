<template>
  <div
    class="stat-widget grouped-stat-widget is-straight"
  >
    <div class="widget-head mb-4">
      <h3 class="dark-inverted">
        Total Assignment: 1200
      </h3>
    </div>
    <div class="widget-body is-flex is-justify-content-center">
      <div class="details">
        <p class="pb-4">Assigned</p>
        <p>63%</p>
        <p>756 Lorem Ipsum</p>
      </div>
      <div class="details">
        <p class="pb-4">Unassigned</p>
        <p>75%</p>
        <p>756 Lorem Ipsum</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.stat-widget {
  &.grouped-stat-widget {
    padding: 20px 32px !important;
    width: 100%;
    height: 216px;

    .group-content {
      transition: all 0.3s;
      &:hover {
        transform: scale(1.05);
      }
    }

    .widget-body {
      flex-wrap: wrap;
      gap: 12px;

      .details {
        flex: 1;
        height: 130px;
        background-color: var(--sidebar-color);
        border-radius: 8px;
        padding: 27.5px 16px;

        p {
          font-family: Poppins;
          font-stretch: normal;
          font-style: normal;
          letter-spacing: normal;
          text-align: center;

          &:first-child {
            font-size: 14px;
            font-weight: 600;
            line-height: 1.2;
            color: #e1e1ef;
          }

          &:nth-child(2) {
            padding-bottom: 6px;
            font-size: 20px;
            font-weight: 600;
            line-height: 1.2;
            color: #b8c4ff;
          }

          &:last-child {
            font-size: 12px;
            font-weight: 500;
            line-height: 1.5;
            color: #c3c5d9;
          }
        }
      }
    }
  }
}
</style>
