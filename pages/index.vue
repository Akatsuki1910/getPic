<template lang="pug">
  div {{data}}
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { $axios } from '~/utils/api'

@Component({})
export default class Index extends Vue {
  data: string[] = []

  mounted() {
    this.getData('https://qiita.com')
  }

  async getData(url: string) {
    const d = await $axios.$get('/api/getText', { params: { url } })
    const t = [...d.matchAll('/http?://[\\w/:%#\\$&\\?\\(\\)~\\.=\\+\\-]+/g')]
    this.data = t
  }
}
</script>
