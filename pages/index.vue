<template lang="pug">
  div
    div
      input(type="text" v-model="inputURL")
      button(@click="clickButton" :disabled="isProcessing") get
      | {{nowCount}}/{{allLength}}
    div
      div(v-for="(pic,i) in data" :key="i").img-box
        a(:href="pic" target="_blank")
          img(:src="pic").img
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
  inputURL = 'https://qiita.com'
  isProcessing = false

  clickButton() {
    this.getData(this.inputURL)
  }

  async getData(url: string) {
    this.isProcessing = true

    const d = await $axios.$get('/api/getText', { params: { url } })
    const urlRegexp = /https?:\/\/[^"']+/g
    const t = [...d.matchAll(urlRegexp)]

    this.allLength = t.length
    this.nowCount = 0
    this.set = new Set()
    this.data = []

    for (const arr of t) {
      const url = arr[0]
      await this.loadImage(url)
      this.nowCount++
    }

    this.set.forEach((v) => {
      this.data.push(v)
    })

    this.isProcessing = false
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

<style lang="scss" scoped>
.img-box {
  display: inline-block;
  position: relative;
  width: 200px;
  height: 200px;
}

.img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 100%;
  height: auto;
}
</style>
