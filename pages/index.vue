<template lang="pug">
  div
    div {{nowCount}}/{{allLength}}
    div
      img(v-for="(pic,i) in data" :key="i" :src="pic")
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { $axios } from '~/utils/api'

@Component({})
export default class Index extends Vue {
  data: string[] = []
  set: Set<string> = new Set()
  nowCount: number = 0
  allLength: number = 0

  mounted() {
    this.getData('https://qiita.com')
  }

  async getData(url: string) {
    this.set = new Set()
    const d = await $axios.$get('/api/getText', { params: { url } })
    const urlRegexp = /https?:\/\/[^"']+/g
    const t = [...d.matchAll(urlRegexp)]
    this.allLength = t.length
    this.nowCount = 0
    for (const arr of t) {
      const url = arr[0]
      await this.loadImage(url)
      this.nowCount++
    }

    this.set.forEach((v) => {
      this.data.push(v)
    })
  }

  async loadImage(src: string) {
    return await new Promise<void>((resolve) => {
      const img = new Image()
      img.onload = () => {
        this.set.add(src)
        resolve()
      }
      img.onerror = () => {
        resolve()
      }
      img.src = src
    })
  }
}
</script>
