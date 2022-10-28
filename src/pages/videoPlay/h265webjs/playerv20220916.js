import H265webjsModule from '../../../../static/h265webjs20220916/index'

const SHOW_LOADING = "加载中...";
const SHOW_DONE = "已就绪";

function durationFormatSubVal(val) {
  let valStr = val.toString();
  if (valStr.length < 2) {
    return '0' + valStr;
  }
  return valStr;
}

function durationText(duration) {
  if (duration < 0) {
    return "Play";
  }
  let durationSecInt = Math.round(duration);
  return durationFormatSubVal(Math.floor(durationSecInt / 3600))
    + ":" + durationFormatSubVal(Math.floor((durationSecInt % 3600) / 60))
    + ":" + durationFormatSubVal(Math.floor(durationSecInt % 60));
}

const getMsTime = () => {
  return new Date().getTime();
};

/***************************************************
 *
 *
 *
 * 1. H.265/HEVC MP4/FLV/HLS/TS
 * Demo for create player(MP4/FLV/HLS/TS)
 * 点播/直播播放器创建Demo(MP4/FLV/HLS/TS)
 *
 *
 *
 ***************************************************/
// clear cache count
H265webjsModule.clear();
// 若使用index.html中直接引入当前文件的方式，使用下面这段代码
// function clear() {
//   window.STATICE_MEM_playerCount = -1;
//   window.STATICE_MEM_playerIndexPtr = 0;
// }
// clear();
export function makeH265webjs(videoURL, config, wrapBox) {
  let configEventCallback = config.event // 官网事件回调
  let playerId = config.player;

  let playerObj = H265webjsModule.createPlayer(videoURL, config);

  let playerDom = document.querySelector('#' + playerId);
  let playerCont = document.querySelector(wrapBox);
  let controllerCont = document.querySelector(wrapBox + ' .controller');
  let progressCont = document.querySelector(wrapBox + ' .progress-contaniner');
  let progressContW = progressCont.offsetWidth;
  let cachePts = progressCont.querySelector(wrapBox + ' .cachePts');
  let progressPts = progressCont.querySelector(wrapBox + ' .progressPts');
  let progressVoice = document.querySelector(wrapBox + ' .progressVoice');
  let playBar = document.querySelector(wrapBox + ' .playBtn');
  let playBtn = playBar.getElementsByTagName('a')[0];
  let showLabel = document.querySelector(wrapBox + ' .showLabel');
  let ptsLabel = document.querySelector(wrapBox + ' .ptsLabel');
  // let coverToast = document.querySelector(wrapBox + ' .coverLayer');
  // let coverBtn = document.querySelector(wrapBox + ' .coverLayerBtn');
  let muteBtn = document.querySelector(wrapBox + ' .muteBtn');
  // let debugYUVBtn     = document.querySelector('#debugYUVBtn');
  // let debugYUVATag    = document.querySelector('#debugYUVUrl');
  let fullScreenBtn = document.querySelector(wrapBox + ' .fullScreenBtn');
  let mediaInfo = null;

  playBtn.disabled = true;
  // playBar.textContent = '>';
  showLabel.textContent = SHOW_LOADING;
  playerCont.style.width = config.width + 'px';
  playerCont.style.height = config.height + 'px';
  controllerCont.style.width = config.width + 'px';

  let muteState = false;

  // controllerCont.style.left = playerContainer.clientLeft;
  // controllerCont.style.bottom = playerContainer.clientBottom;
  // alert(playerContainer.clientLeft);

  let playAction = () => {
    console.log("is playing:", playerObj.isPlaying());
    if (playerObj.isPlaying()) {
      console.log("bar pause============>");
      // playBar.textContent = '>';
      playBar.setAttribute('class', 'playBtn');
      playerObj.pause();
    } else {
      // playBar.textContent = '||';
      playBar.setAttribute('class', 'pauseBtn');
      playerObj.play();
    }
  };

  playerCont.onmouseover = function () {
    controllerCont.hidden = false;
  };

  playerCont.onmouseout = function () {
    controllerCont.hidden = true;
  };

  playerDom.onmouseup = function () {
    playAction();
  };

  playBtn.onclick = () => {
    playAction();
  };

  // 喇叭点击
  muteBtn.onclick = () => {
    // console.log(playerObj.getVolume());
    if (muteState === true) {
      playerObj.setVoice(1.0);
      progressVoice.value = 100;
    } else {
      playerObj.setVoice(0.0);
      progressVoice.value = 0;
    }
    muteState = !muteState;
  };

  fullScreenBtn.onclick = () => {
    playerObj.fullScreen();
    // setTimeout(() => {
    //     playerObj.closeFullScreen();
    // }, 2000);
  };

  // 进度条点击
  // progressCont.addEventListener('click', (e) => {
  //   showLabel.textContent = SHOW_LOADING;
  //   let x = e.pageX - progressCont.getBoundingClientRect().left; // or e.offsetX (less support, though)
  //   let y = e.pageY - progressCont.getBoundingClientRect().top;  // or e.offsetY
  //   let clickedValue = x * progressCont.max / progressCont.offsetWidth;
  //   // alert(clickedValue);
  //   playerObj.seek(clickedValue);
  // });

  // 声音进度条点击
  progressVoice.addEventListener('click', (e) => {
    let x = e.pageX - progressVoice.getBoundingClientRect().left; // or e.offsetX (less support, though)
    let y = e.pageY - progressVoice.getBoundingClientRect().top;  // or e.offsetY
    let clickedValue = x * progressVoice.max / progressVoice.offsetWidth;
    progressVoice.value = clickedValue;
    let volume = clickedValue / 100;
    // alert(volume);
    // console.log(
    //     progressVoice.offsetLeft, // 209
    //     x, y, // 324 584
    //     progressVoice.max, progressVoice.offsetWidth);
    playerObj.setVoice(volume);
  });

  playerObj.onSeekStart = (pts) => {
    showLabel.textContent = SHOW_LOADING + " seek to:" + parseInt(pts);
  };

  playerObj.onSeekFinish = () => {
    showLabel.textContent = SHOW_DONE;
  };

  playerObj.onPlayFinish = () => {
    console.log("============= FINISHED ===============");
    // playBar.textContent = '>';
    playBar.setAttribute('class', 'playBtn');
    // playerObj.release();
    // console.log("=========> release ok");
  };

  playerObj.onRender = (width, height, imageBufferY, imageBufferB, imageBufferR) => {
    console.log("on render");
  };

  playerObj.onOpenFullScreen = () => {
    console.log("onOpenFullScreen");
  };

  playerObj.onCloseFullScreen = () => {
    console.log("onCloseFullScreen");
  };

  // Seek完成
  playerObj.onSeekFinish = () => {
    showLabel.textContent = SHOW_DONE;
  };

  // 当前正在缓存帧数据
  playerObj.onLoadCache = () => {
    showLabel.textContent = "Caching...";
  };

  // 帧数据缓存完成
  playerObj.onLoadCacheFinshed = () => {
    showLabel.textContent = SHOW_DONE;
  };

  // 播放器封面图加载完成
  playerObj.onReadyShowDone = () => {
    console.log("onReadyShowDone");
    showLabel.textContent = "Cover Img OK";
  };

  // 媒体文件当前加载成功，可以进行播放
  playerObj.onLoadFinish = () => {
    if(configEventCallback && configEventCallback.onLoadFinish){
      configEventCallback.onLoadFinish()
    }
    playerObj.setVoice(1.0);
    mediaInfo = playerObj.mediaInfo();
    console.log("mediaInfo===========>", mediaInfo);
    /*
    meta:
        durationMs: 144400
        fps: 25
        sampleRate: 44100
        size: {
            width: 864,
            height: 480
        },
        audioNone : false
    videoType: "vod"
    */
    if (mediaInfo.meta.isHEVC === false) {
      console.log("is not HEVC/H.265 media!");
      //coverToast.removeAttribute('hidden');
      //coverBtn.style.width = '100%';
      //coverBtn.style.fontSize = '50px';
      //coverBtn.innerHTML = 'is not HEVC/H.265 media!';
      //return;
    }
    //console.log("is HEVC/H.265 media.");

    playBtn.disabled = false;

    if (mediaInfo.meta.audioNone) {
      progressVoice.value = 0;
      progressVoice.style.display = 'none';
    } else {
      playerObj.setVoice(0.5);
    }

    if (mediaInfo.videoType == "vod") {
      cachePts.max = mediaInfo.meta.durationMs / 1000;
      progressCont.max = mediaInfo.meta.durationMs / 1000;
      ptsLabel.textContent = durationText(0) + '/' + durationText(progressCont.max);
    } else {
      cachePts.hidden = true;
      progressCont.hidden = true;
      ptsLabel.textContent = 'LIVE';

      if (mediaInfo.meta.audioNone === true) {
        // playBar.textContent = '||';
        // playerObj.play();
      } else {

        // coverToast.removeAttribute('hidden');
        // coverBtn.onclick = () => {
        //   // playBar.textContent = '||';
        //   playAction();
        //   coverToast.setAttribute('hidden', 'hidden');
        // };
      }

    }

    showLabel.textContent = SHOW_DONE;
  };

  // 播放器缓冲进度回调 -- no
  playerObj.onCacheProcess = (cPts) => {
    // 追帧设置
    // if(playerObj.isPlaying()){
    //   // setInterval(()=>{
    //   //   playerObj.seek(cPts);
    //   // }, 1000)
    // }


    // console.log("onCacheProcess => ", cPts, playerObj.mediaInfo().meta.durationMs);
    try {
      // cachePts.value = cPts;
      let precent = cPts / progressCont.max;
      let cacheWidth = precent * progressContW;
      // console.log(precent, precent * progressCont.offsetWidth);
      cachePts.style.width = cacheWidth + 'px';
    } catch (err) {
      console.log(err);
    }
  };

  // 播放器当前播放PTS时刻更新
  playerObj.onPlayTime = (videoPTS) => {

    // console.log(videoPTS, playerObj.mediaInfo().meta.durationMs, 111)

    if (mediaInfo.videoType == "vod") {
      // progressPts.value = videoPTS;
      let precent = videoPTS / progressCont.max;
      let progWidth = precent * progressContW;
      // console.log(precent, precent * progressCont.offsetWidth);
      progressPts.style.width = progWidth + 'px';

      ptsLabel.textContent = durationText(videoPTS) + '/' + durationText(progressCont.max);
    } else {
      // ptsLabel.textContent = durationText(videoPTS) + '/LIVE';
      ptsLabel.textContent = '/LIVE';
    }
  };

  playerObj.do();
  return playerObj;
};
// export function exposeAll(){
//   H265webjsModule.clear();
// }
