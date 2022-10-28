<template>
  <div class="wrap">
    <div class="box-top">

      <div style="margin-top: 20px;margin-bottom: 20px;">
        <template v-for="(item,index) in configArr">
          切换视频源{{ index + 1 }}：
          <el-select :value="item.url" placeholder="请选择" :key="`select-${index}`" @change="(val)=>changeSrc(item,val)">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </div>
      <div class="flex-box">
        <template v-for="(item,index) in configArr">
          <h265webjs :key="index"
                     v-if="item.canShow"
                     :videoBoxClass="item.videoBoxClass"
                     :config="item"
                     :style="index===1?'margin-left: 20px;':''"/>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import h265webjs from './h265webjs/index'

export default {
  name: 'videoPlay3',
  components: {
    h265webjs
  },
  data() {
    let options = [
      {
        label: 'mp4视频-AVC(H264)',
        value: './static/video/test.mp4'
      },
      {
        label: '西瓜视频播放测试地址',
        value: this.$host() + '/videoSrc/obj/media-fe/xgplayer_doc_video/hls/xgplayer-demo.m3u8'
      }
    ]
    return {
      options: options,

      configArr: [
        {
          player: "glplayer1",
          // width: 960,
          // height: 540,
          extInfo: {
            moovStartFlag: true,
            coreProbePart: 0.1,
            ignoreAudio: 0,
          },
          url: options[0].value,
          // url: './static/video/HEVC(H.265).m3u8',
          // url: './static/video/AVC(H.264).m3u8'
          // url: './static/video/test.mp4'
          // url: this.$host() + '/videoSrc/obj/media-fe/xgplayer_doc_video/hls/xgplayer-demo.m3u8',
          videoBoxClass: 'h265web-box1',
          canShow: true // 视频源更改后，强制刷新播放器
        },
        {
          player: "glplayer2",
          extInfo: {
            moovStartFlag: true,
            coreProbePart: 0.1,
            ignoreAudio: 0,
          },
          url: options[0].value,
          videoBoxClass: 'h265web-box2',
          canShow: true // 视频源更改后，强制刷新播放器
        }
      ],
    }
  },
  mounted() {
  },
  beforeDestroy() {
    // destoryPlayerServer(this.playerObject)
  },
  methods: {
    changeSrc(item, newUrl) {
      if (item.url !== newUrl) {
        item.url = newUrl
        // 视频源更改后，v-if强制刷新播放器
        item.canShow = false

        this.$nextTick(() => {
          item.canShow = true
        })
      }
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.flex-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  > div {
    width: 100%;
    flex: auto;
  }
}

.wrap{
  padding: 20px;
  text-align: left;
  .box-top{
    background: #7cb1cc;
    padding: 20px;
    line-height: 30px;
  }
}
</style>
