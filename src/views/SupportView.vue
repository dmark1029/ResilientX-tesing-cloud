<template>
  <div class="confirm-account-wrapper is-block">
    <div class="wrapper-inner">
      <div class="action-box">
        <VLoader class="is-grey" :active="loading">
          <div class="box-content">
            <div id="hubspotForm" />
          </div>
        </VLoader>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VLoader from '/@src/components/base/loader/VLoader.vue'

export default {
  components: { VLoader },
  data: () => ({
    links: [],
    hsLoaded: false,
    script: null,
  }),
  computed: {
    ...mapGetters(['loading', 'user', 'general']),
  },
  beforeUnmount() {
    this.script.remove()
  },
  async mounted() {
    this.script = document.createElement('script')

    this.script.src = '//js-eu1.hsforms.net/forms/embed/v2.js'

    document.body.appendChild(this.script)

    this.script.addEventListener('load', () => {
      if (window.hbspt) {
        window.hbspt.forms.create({
          region: 'eu1',
          portalId: '26980278',
          formId: '197c4438-3bfc-4afc-881c-88b5b758b121',
          target: '#hubspotForm',
          onFormReady: function ($form) {
            $form.style.background = '#313135'
            $form.getElementsByTagName('input')[0].value = this.user.email
            $form.getElementsByTagName('input')[0].readOnly = true
            $form
              .getElementsByTagName('input')[0]
              .dispatchEvent(new Event('input', { bubbles: true }))
          }.bind(this),
        })
      }
    })

    this.links = [
      {
        name: 'Home',
        to: {
          name: 'Home',
        },
        active: false,
      },
      {
        name: 'Support requests',
        to: {},
        active: true,
      },
    ]
  },
  metaInfo() {
    return {
      title: `Support requests`,
    }
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
@import '/@src/scss/abstracts/all';

/* ==========================================================================
1. Confirm Account
========================================================================== */
.confirm-account-wrapper {
  .wrapper-inner {
    .action-box {
      @include vuero-s-card;

      padding: 40px;

      .box-content {
      }
    }
  }
}

.is-dark {
  .confirm-account-wrapper {
    .wrapper-inner {
      .action-box {
        @include vuero-card--dark;
      }
    }

    .wrapper-outer {
      @include vuero-card--dark;
    }
  }
}

@media only screen and (width <= 767px) {
  .confirm-account-wrapper {
    .wrapper-inner {
      .action-box {
        padding: 20px;

        .box-content {
          .buttons {
            .button {
              min-width: 130px;
            }
          }
        }
      }
    }
  }
}
</style>
