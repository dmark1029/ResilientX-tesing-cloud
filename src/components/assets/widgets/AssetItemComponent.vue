<template>
  <div class="media-flex-center inner-list-item">
    <div class="v-avatar">
      <i class="fa fa-network-wired"></i>
    </div>
    <div class="flex-meta is-lighter">
      <span></span>
      <router-link :to="getAssetViewURL(asset)">{{ asset.value }}</router-link>
    </div>
    <div class="flex-end">
      <AssetExposureScoreBadge
        :previous-score="asset.previous_exposure_score"
        :score="asset.exposure_score"
        class="mr-2"
      />

      <router-link :to="getAssetViewURL(asset)" class="go-icon">
        <svg
          c
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          role="img"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
          data-icon="feather:chevron-right"
          class="iconify iconify--feather"
        >
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m9 18l6-6l-6-6"
          ></path>
        </svg>
      </router-link>
    </div>
  </div>
</template>

<script>
import AssetExposureScoreBadge from '/@src/components/assets/AssetExposureScoreBadge.vue'
import urlMixin from '/@src/mixins/urlMixin'

export default {
  components: { AssetExposureScoreBadge },
  mixins: [urlMixin],
  props: ['asset'],
}
</script>

<style lang="scss" scoped>
.go-icon {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 36px;
  width: 36px;
  border-radius: var(--radius-rounded);
  background: var(--widget-grey);
  color: var(--light-text);

  &::before {
    content: attr(data-content);
    position: absolute;
    inset-inline-start: -45px;
    font-family: var(--font);
    font-size: 0.95rem;
    font-weight: 500;
  }

  &.is-squared {
    border-radius: 10px;
  }

  &.is-up {
    &::before {
      color: var(--green);
    }
  }

  &.is-down {
    &::before {
      color: var(--red);
    }
  }

  svg {
    height: 16px;
    width: 16px;
    stroke-width: 3px;
  }
}

.is-dark {
  .go-icon {
    background: var(--dark-sidebar-light-3);
    border: 1px solid var(--dark-sidebar-light-12);
  }
}
.media-flex {
  display: flex;
  margin-bottom: 1rem;
  width: 100%;

  &:last-child,
  &.no-margin {
    margin-bottom: 0;
  }

  .flex-meta {
    margin-inline-start: 12px;
    line-height: 1.3;

    &.is-lighter {
      span,
      > a {
        &:first-child {
          font-weight: 400;
        }
      }
    }

    &.is-light {
      span,
      > a {
        &:first-child {
          font-weight: 500;
        }
      }
    }

    span,
    > a {
      display: block;

      &:first-child {
        font-family: var(--font-alt);
        color: var(--dark-text);
        font-weight: 600;
      }

      &:nth-child(2) {
        font-family: var(--font);
        color: var(--light-text);
        font-size: 0.9rem;
      }
    }

    a:hover {
      color: var(--primary);
    }
  }

  .flex-end {
    margin-inline-start: auto;
    display: flex;
    justify-content: flex-end;

    .end-action {
      margin-inline-start: 1rem;
    }
  }
}

.media-flex-center {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  width: 100%;

  &:last-child,
  &.no-margin {
    margin-bottom: 0;
  }

  .flex-meta {
    margin-inline-start: 12px;
    line-height: 1.4;

    &.is-lighter {
      span,
      > a {
        &:first-child {
          font-weight: 400;
        }
      }
    }

    &.is-light {
      span,
      > a {
        &:first-child {
          font-weight: 500;
        }
      }
    }

    span,
    > a {
      display: block;

      &:first-child {
        font-family: var(--font-alt);
        font-size: 0.95rem;
        color: var(--dark-text);
        font-weight: 600;
      }

      &:nth-child(2) {
        font-family: var(--font);
        color: var(--light-text);
        font-size: 0.9rem;
      }
    }

    a:hover {
      color: var(--primary);
    }
  }

  .flex-end {
    margin-inline-start: auto;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .end-action {
      margin-inline-start: 1rem;
    }
  }
}

.is-dark {
  .media-flex-center,
  .media-flex {
    .flex-meta {
      span,
      a {
        &:first-child {
          color: var(--dark-dark-text) !important;
        }
      }

      a:hover {
        color: var(--primary);
      }
    }
  }
}

@media only screen and (width <= 767px) {
  .media-flex,
  .media-flex-center {
    &.is-responsive-mobile {
      flex-direction: column;
      text-align: center;

      .v-avatar,
      .v-icon {
        margin: 0 auto;
      }

      .flex-meta {
        margin: 10px auto 0;
      }

      .flex-end {
        margin: 10px auto;

        .end-action {
          margin-inline-start: 0;
        }

        .button {
          min-width: 140px;
        }
      }
    }
  }
}

@media only screen and (width >= 768px) and (width <= 1024px) and (orientation: portrait) {
  .media-flex,
  .media-flex-center {
    &.is-responsive-tablet-p {
      flex-direction: column;
      text-align: center;

      .v-avatar,
      .v-icon {
        margin: 0 auto;
      }

      .flex-meta {
        margin: 10px auto 0;
      }

      .flex-end {
        margin: 10px auto;

        .end-action {
          margin-inline-start: 0;
        }

        .button {
          min-width: 140px;
        }
      }
    }
  }
}

@media only screen and (width >= 768px) and (width <= 1024px) and (orientation: landscape) {
  .media-flex,
  .media-flex-center {
    &.is-responsive-tablet-l {
      flex-direction: column;
      text-align: center;

      .v-avatar,
      .v-icon {
        margin: 0 auto;
      }

      .flex-meta {
        margin: 10px auto 0;
      }

      .flex-end {
        margin: 10px auto;

        .end-action {
          margin-inline-start: 0;
        }

        .button {
          min-width: 140px;
        }
      }
    }
  }
}
</style>
