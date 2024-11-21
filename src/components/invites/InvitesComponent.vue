<template>
  <div v-if="user && user?.invites?.length">
    <div class="columns">
      <div v-for="item in user.invites" :key="item.id" class="column is-12">
        <div class="card">
          <div class="card-body has-text-centered">
            <h4 class="title is-6 mb-2">
              Invite to join workspace "{{ item.workspace.name }}"
            </h4>

            <p class="mb-5 is-size-6">
              You have been invited to workspace "{{ item.workspace.name }}".
            </p>

            <div class="button-items">
              <button
                type="button"
                class="button v-button is-bold is-big is-raised is-primary"
                @click="approve(item)"
              >
                {{ $t('Accept invite') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Form from '/@src/form'
import { mapGetters } from 'vuex'

export default {
  components: {},
  data: () => ({
    form: new Form({}),
  }),
  computed: {
    ...mapGetters(['user']),
  },
  methods: {
    approve(item) {
      return new Promise((resolve, reject) => {
        this.form
          .post('/invite?id=' + item.id)
          .then((res) => {
            const { data } = res.data
            resolve(data)
            window.location.reload()
          })
          .catch(() => {
            reject()
          })
      })
    },
  },
}
</script>
