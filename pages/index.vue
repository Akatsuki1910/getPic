<template lang="pug">
  div
    header.header
      input(type="text" v-model="inputURL")
      button(@click="clickButton" :disabled="isProcessing") get
      .dl-parcent {{dlInfo}}
    main.main
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

  get dlInfo() {
    return this.nowCount / this.allLength
  }

  clickButton() {
    this.getData(this.inputURL)
  }

  async getData(url: string) {
    this.isProcessing = true
    let allArr: string[] = []

    const address = url.match(/https?:\/\/[^/]+\//i)!

    const d = await $axios.$get('/api/getText', { params: { url } })

    const obj = [
      { front: '', regexp: /https?:\/\/[\w/:%#$&?()~.=+-]+/gi },
      { front: url, regexp: /\/[\w/:%#$&?()~.=+-]+/g },
      { front: address, regexp: /\/[\w/:%#$&?()~.=+-]+/g },
      { front: 'https:', regexp: /\/\/[\w/:%#$&?()~.=+-]+/g },
    ]

    obj.forEach((o) => {
      allArr = allArr.concat(
        [...d.matchAll(o.regexp)].map((arr) => o.front + arr[0]),
      )
    })

    const imgURL = Array.from(new Set(allArr)).filter(
      (url: string) => !/\.(js|css|html)$/.test(url),
    )

    this.allLength = imgURL.length
    this.nowCount = 0
    this.data = []

    for (const u of imgURL) {
      await this.loadImage(u)
    }

    this.isProcessing = false
  }

  async loadImage(src: string) {
    return await new Promise<void>((resolve) => {
      const img = new Image()
      img.onload = () => {
        this.data.push(src)
        this.nowCount++
        resolve()
      }
      img.onerror = () => {
        this.allLength--
        resolve()
      }
      img.src = src
    })
  }
}
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  height: 1.5rem;
  width: 100vh;
  background-color: white;
  z-index: 100;

  .dl-parcent {
    margin-left: 8px;
    display: inline-block;
  }
}

.main {
  padding-top: 1.5rem;
}

.img-box {
  display: inline-block;
  position: relative;
  width: 200px;
  height: 200px;

  .img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: auto;
    max-width: 100%;
    height: auto;
    max-height: 100%;
  }
}
</style>
