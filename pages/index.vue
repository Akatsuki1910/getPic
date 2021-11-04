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
  nowCount: number = 0
  allLength: number = 0
  inputURL = 'https://qiita.com'
  isProcessing = false

  clickButton() {
    this.getData(this.inputURL)
  }

  async getData(url: string) {
    this.isProcessing = true
    let allArr: string[] = []

    const address = url.match(/https?:\/\/[^/]+\//)![0]

    const d = await $axios.$get('/api/getText', { params: { url } })

    const obj = [
      { front: '', regexp: /https?:\/\/[\w/:%#$&?()~.=+-]+/g },
      { front: url, regexp: /\/[\w/:%#$&?()~.=+-]+/g },
      { front: address, regexp: /\/[\w/:%#$&?()~.=+-]+/g },
      { front: 'https:', regexp: /\/\/[\w/:%#$&?()~.=+-]+/g },
    ]

    obj.forEach((o) => {
      allArr = allArr.concat(
        [...d.matchAll(o.regexp)].map((arr) => o.front + arr[0]),
      )
    })

    const set = new Set(allArr)

    this.allLength = set.size
    this.nowCount = 0
    this.data = []

    for (const u of Array.from(set)) {
      await this.loadImage(u)
      this.nowCount++
    }

    this.isProcessing = false
  }

  async loadImage(src: string) {
    return await new Promise<void>((resolve) => {
      const img = new Image()
      img.onload = () => {
        this.data.push(src)
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
