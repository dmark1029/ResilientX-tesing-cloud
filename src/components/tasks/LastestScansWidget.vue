<template>
  <div v-if="overview?.scans?.length" class="dashboard-list">
    <div class="dashboard-title">
      <div class="left">
        <h2 class="dark-inverted">Lastest scans</h2>
        <p class="h-hidden-mobile">View your latest scan reports</p>
      </div>
      <div class="right"></div>
    </div>
    <div class="inner-list">
      <div>
        <VBlock
          v-for="item in overview.scans"
          :key="item.id"
          :title="item.taskable?.name"
          :subtitle="item.module.name + ` (${item.started})`"
          center
        >
          <template #icon>
            <VAvatar :picture="item.taskable.logo" squared />
          </template>
          <template #action>
            <div class="is-hidden-mobile">
              <TaskStatusBadge :status="item.status" />
            </div>

            <router-link
              v-if="item.report"
              class="ml-3"
              :to="{
                name: 'ReportsView',
                params: { id: item.report.id },
              }"
            >
              <VIconButton
                icon="fa fa-arrow-right"
                circle
                dark-outlined
                class="rtl-reflect"
              />
            </router-link>
            <a v-else href="#" class="is-disabled ml-3">
              <VIconButton
                icon="fa fa-arrow-right"
                circle
                dark-outlined
                class="rtl-reflect"
              />
            </a>
          </template>
        </VBlock>
      </div>
    </div>
  </div>
</template>

<script>
import permissionsMixin from '../../mixins/permissionsMixin.js'
import VAvatar from '/@src/components/base/avatar/VAvatar.vue'
import VBlock from '/@src/components/base/block/VBlock.vue'
import TaskStatusBadge from '/@src/components/tasks/TaskStatusBadge.vue'
import VIconButton from '/@src/components/base/button/VIconButton.vue'

export default {
  components: { VIconButton, TaskStatusBadge, VBlock, VAvatar },
  mixins: [permissionsMixin],
  props: ['overview'],
}
</script>

<style lang="scss" scoped>
@import '/@src/scss/abstracts/all';

.dashboard-list {
  .inner-list {
    .media-flex-center {
      @include vuero-l-card;

      display: flex;
      padding: 12px;
      max-height: 66px;

      &:hover,
      &:focus {
        .flex-end {
          .rating {
            opacity: 1;
          }
        }
      }

      .flex-meta {
        max-width: 360px;
        width: 100%;
      }

      .flex-end {
        .rating {
          padding: 0 20px;
          opacity: 0;
          transition: all 0.3s; // transition-all test

          i {
            font-size: 12px;
          }
        }
      }
    }
  }
}

.dashboard-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  font-family: var(--font);

  &.is-main {
    margin-bottom: 30px;

    h2 {
      font-size: 1.8rem;
    }
  }

  h2 {
    font-family: var(--font-alt);
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--dark-text);
  }
}

.is-dark {
  .long-card {
    @include vuero-card--dark;
  }

  .dashboard-list {
    .inner-list {
      .media-flex-center {
        @include vuero-card--dark;
      }
    }
  }
}
</style>
