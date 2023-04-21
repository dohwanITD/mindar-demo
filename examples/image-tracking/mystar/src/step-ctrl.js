// import './subtitle.css'
// import './aframe-gif-shader'  // GIF

AFRAME.registerComponent('step-ctrl', {
  schema: {
    isLerping: {type: 'boolean', default: false},
    positions: {
      default: [
        {x: 0.4, y: -0.4, z: 0.01},
        {x: 0.4, y: -0.4, z: 0},
        {x: 0.4, y: -0.4, z: 0},
        {x: 0.4, y: -0.4, z: 0},
        {x: 0.4, y: -0.4, z: 0},
        {x: 0.4, y: -0.4, z: 0},
        {x: 0.4, y: -0.4, z: 0},
        {x: 0.4, y: -0.4, z: 0},
      ],
    },
    currPosIdx: {type: 'number', default: 0},
  },
  init() {
    // console.log('step-ctrl')
    let stepIdx = -1
    let interval = null

    const MAX_STEP_LEN = 6;

    // Guide Panel
    const guideDiv = document.getElementById('guidePanel')

    // XrScene
    // const xrScene = document.getElementById('xrScene')
    let isFirstFounded = false

    // tooltip & clickCursor
    // const tooltipBox = document.getElementById('tooltipBox')
    // const replayBox = document.getElementById('replayBox')
    // const clickCursor = document.getElementById('clickCursor')
    // tooltipBox.setAttribute('visible', false)
    // clickCursor.setAttribute('visible', false)
    // replayBox.setAttribute('visible', false)

    // const setTooltipContainer = (w, h, tooltipPos, cursorPos) => {
    //   tooltipBox.setAttribute('slice9', {color: 'red', width: w, height: h, left: 20, right: 43, top: 20, bottom: 43, src: '#tooltipImg'})
    //   tooltipBox.setAttribute('position', tooltipPos)  // "-0.105 0.018 0.002"
    //   clickCursor.setAttribute('position', cursorPos)
    // }


    const corsorY = -0.055
    const isBlocking = false
    // TTS 자막
    const captionList = [
      '입금 신청서 미리작성\n함께 체험해볼까요?',
      '먼저 입금 버튼을\n눌러보겠습니다!',
      '원하시는 입금 종류를\n선택할 수 있습니다.\n여기서는 한 건 입금을\n눌러보겠습니다!',  // <<<<<<<<<<< 종류
      '입금 은행을\n선택할 수 있습니다.\n입금 은행 칸을\n눌러보겠습니다!',
      '받는 분 계좌의 은행을\n선택해보겠습니다!',  // 여기서는 국민은해을 선택해보겠습니다!'
      '받는 분 계좌번호와\n금액을 입력해보겠습니다!',  // ~입력하고
      '받는 분 통장 표시와\n자필성명을 입력하신 후\n작성완료 버튼을\n눌러보겠습니다!',  // <<<<<<<<<<< 입력하신후 - tts수정
      '입금 신청서 미리작성이\n완료되었습니다!\n이제 미리작성서비스를\n직접 이용해보세요!',  // <<<<<<<<<<<< 멘트 수정, tts추가
    ]
    const subtitle = document.getElementById('subtitleBtn')
    subtitle.innerText = '입금 신청서 미리작성\n함께 체험해볼까요?'

    // 미리작성 이미지
    const prewriteImg = document.getElementById('prewriteImg')
  
    // 오디오
    let sound = null
    
    /// //////////////////////////////////////////////////////////
    /// -------------------- stepHandler -------------------- ///
    /// //////////////////////////////////////////////////////////
    const userClickHandler = () => {
      // console.log('Step Handler')
      if (interval !== null) clearInterval(interval)
      ++stepIdx

      // ---------- Caption ----------
      subtitle.innerText = captionList[stepIdx]

      // https://10.17.211.108:8080/examples/image-tracking/mystar/..mystar/audios/tts_00.mp3
      // ---------- Sound ----------
      if (sound !== null) sound.stop()  // 플레이중인 음원이 있으면 스탑
      sound = new window.Howl({
        src: (`../../assets/audios/tts_0${stepIdx}.mp3`),
      })
      sound.play()

      // ---------- Image ----------
      // prewriteImg.removeAttribute('src')
      // if (stepIdx === 0) {
      //   prewriteImg.setAttribute('src', `#Prewrite_0${stepIdx}`)
      //   this.data.currPosIdx = stepIdx
      // } else {
      //   prewriteImg.setAttribute('src', `#Prewrite_0${stepIdx - 1}`)

      //   if (stepIdx === 5) {
      //   }
      //   else if (stepIdx <= 7) {
      //     this.data.currPosIdx = stepIdx
      //   } else {
      //     this.data.currPosIdx = stepIdx
      //   }
      // }

      // ---------- tooltipBox and ClickCursor ----------
      // if (stepIdx === 0) {
      //   tooltipBox.setAttribute('visible', false)
      //   clickCursor.setAttribute('visible', false)
      // // subtitle.innerText = '미리작성 서비스 입금편 함께 알아볼까요?'
      // // 0.25 -0.055
      // } else if (stepIdx === 1) {
      //   // subtitle.innerText = '먼저 입금 버튼을 눌러주세요!'
      //   tooltipBox.setAttribute('visible', true)
      //   clickCursor.setAttribute('visible', true)
      //   setTooltipContainer(0.35, 0.4, {x: -0.105, y: 0.018, z: 0.002}, {x: -0.105 + 0.04 + 0.05, y: 0.018 + corsorY, z: 0.004})
      // } else if (stepIdx === 2) {
      //   // subtitle.innerText = '원하시는 입금 방법을 선택할 수 있습니다.\n여기서는 한 건 입금을 함께 해보겠습니다!'
      //   setTooltipContainer(0.62, 0.15, {x: -0.06, y: 0.008, z: 0.002}, {x: -0.06 + 0.095 + 0.05, y: 0.008 + corsorY, z: 0.004})
      // } else if (stepIdx === 3) {
      //   // subtitle.innerText = '입금 은행을 선택해보겠습니다. 입금 은행 칸을 눌러주세요!'
      //   setTooltipContainer(0.95, 0.24, {x: 0, y: 0.03, z: 0.002}, {x: 0.1, y: 0.03 + corsorY, z: 0.004})
      // } else if (stepIdx === 4) {
      //   // subtitle.innerText = '받는 분 계좌의 은행을 선택해주세요!'
      //   setTooltipContainer(0.3, 0.27, {x: -0.16, y: 0.064, z: 0.002}, {x: -0.16 + 0.064 + 0.02, y: 0.06 + corsorY, z: 0.003})
      // } else if (stepIdx === 5) {
      //   // subtitle.innerText = '받는 분 계좌번호와 금액을 입력해주세요!'
      //   setTooltipContainer(0.95, 0.38, {x: 0, y: -0.36, z: 0.002}, {x: 0.2, y: -0.36 + corsorY, z: 0.003})
      // } else if (stepIdx === 6) {
      //   // subtitle.innerText = '받는 분 통장 표시와 자필성명을 입력하신 후 작성완료 버튼을 눌러주세요!'
      //   setTooltipContainer(1.05, 0.19, {x: 0, y: -0.395, z: 0.002}, {x: 0.2, y: -0.395 + corsorY, z: 0.003})
      // } else if (stepIdx === 7) {
      //   // subtitle.innerText = '입금 신청서 미리작성이 완료되었습니다!'
      //   replayBox.setAttribute('visible', true)
      //   replayBox.classList.add('cantap')
      //   setTooltipContainer(0.95, 0.28, {x: 0, y: -0.255, z: 0.002}, {x: 0.05, y: -0.31, z: 0.003})
      // } else if (stepIdx >= 8) {
      //   // subtitle.innerText = '입금 신청서 미리작성이 완료되었습니다!'
      //   // setTooltipContainer(0.93, 0.35, {x: 0, y: -0.295, z: 0.002}, {x: 0.25, y: -0.35, z: 0.003})
      //   stepIdx = 0
      // }
    
    
      // ---------- Animation ---------- walk spin point stand bow wave idle break
      // this.data.isLerping = true

      if (stepIdx === 0) {
      } else if (stepIdx === 1) {
        this.data.isLerping = true
        this.el.setAttribute('animation', {property: 'scale', to: {x: 0.4, y: 0.4, z: 0.4}, dur: 3000, easing: 'linear', loop: false})
        this.el.setAttribute('animation-mixer', {clip: 'wave', loop: 'repeat', crossFadeDuration: 0.4})
        setTimeout(() => {
          this.data.isLerping = false
          this.el.setAttribute('animation-mixer', {clip: 'bow', loop: 'once', crossFadeDuration: 0.4})
          setTimeout(() => {
            this.el.setAttribute('animation-mixer', {clip: 'idle', loop: 'repeat', crossFadeDuration: 0.4})
          }, 1000)
        }, 3000)
        // this.el.setAttribute('animation-mixer', {clip: 'bow', clampWhenFinished: true, startAt: 1, loop: 'repeat', crossFadeDuration: 0.4})
      } else if (stepIdx === 2) {
        // this.el.setAttribute('animation-mixer', {clip: 'stand', clampWhenFinished: true, startAt: 1, loop: 'repeat', crossFadeDuration: 0.4})
        this.el.setAttribute('animation-mixer', {clip: 'point', clampWhenFinished: true, startAt: 1, loop: 'repeat', crossFadeDuration: 0.4})
        setTimeout(() => {
          this.el.setAttribute('animation-mixer', {clip: 'idle', loop: 'repeat', crossFadeDuration: 0.4})
        }, 4000)
      } else if (stepIdx === 3) {
        this.el.setAttribute('animation-mixer', {clip: 'wave', clampWhenFinished: true, startAt: 1, loop: 'repeat', crossFadeDuration: 0.4})
        setTimeout(() => {
          this.el.setAttribute('animation-mixer', {clip: 'idle', loop: 'repeat', crossFadeDuration: 0.4})
        }, 4000)
      } else if (stepIdx === 4) {
        this.el.setAttribute('animation-mixer', {clip: 'point', clampWhenFinished: true, startAt: 1, loop: 'repeat', crossFadeDuration: 0.4})
        setTimeout(() => {
          this.el.setAttribute('animation-mixer', {clip: 'idle', loop: 'repeat', crossFadeDuration: 0.4})
        }, 4000)
        // this.el.setAttribute('animation-mixer', {clip: 'walk', loop: 'repeat', crossFadeDuration: 0.2})
      } else if (stepIdx === 5) {
        this.el.setAttribute('animation-mixer', {clip: 'wave', clampWhenFinished: true, startAt: 1, loop: 'repeat', crossFadeDuration: 0.4})
        setTimeout(() => {
          this.el.setAttribute('animation-mixer', {clip: 'idle', loop: 'repeat', crossFadeDuration: 0.4})
        }, 4000)
        // this.el.setAttribute('animation-mixer', {clip: 'point', startAt: 0, loop: 'repeat', crossFadeDuration: 0.4})
      } else if (stepIdx === 6) {
        this.el.setAttribute('animation-mixer', {clip: 'point', clampWhenFinished: true, startAt: 1, Loop: 'repeat', crossFadeDuration: 0.4})
        setTimeout(() => {
          this.el.setAttribute('animation-mixer', {clip: 'idle', loop: 'repeat', crossFadeDuration: 0.4})
        }, 4000)
        // this.el.setAttribute('animation-mixer', {clip: 'point', startAt: 0, loop: 'repeat', crossFadeDuration: 0.4})
      } else if (stepIdx === 7) {
        this.el.setAttribute('animation-mixer', {clip: 'wave', clampWhenFinished: true, startAt: 1, loop: 'repeat', crossFadeDuration: 0.4})
        setTimeout(() => {
          this.el.setAttribute('animation-mixer', {clip: 'idle', loop: 'repeat', crossFadeDuration: 0.4})
        }, 4000)
        // this.el.setAttribute('animation-mixer', {clip: 'point', startAt: 0, loop: 'repeat', crossFadeDuration: 0.4})
      }

      // setTimeout(() => {
      //   // this.data.isLerping = false
      //   // this.el.setAttribute('animation-mixer', {clip: 'idle', loop: 'repeat', crossFadeDuration: 0.4})
      //   // this.data.currPosIdx = ++this.data.currPosIdx > 5 ? 0 : this.data.currPosIdx
      //   // console.log(this.data.positions[this.data.currPosIdx])
      // }, 2000)

      if (stepIdx === MAX_STEP_LEN) {
        stepIdx = -1
      }
    }


    // Start Manage
    interval = setTimeout(() => {
      userClickHandler()
    }, 3000)

    subtitle.addEventListener('click', () => {
      // console.log('[app.js] tooltipBox Click  : ')
      // if (!isBlocking)
      {
        // isBlocking = true
        if (stepIdx === 7) {
          // window.open('https://shot.kbstar.com/q.jsp#heq5j1k2');
          if (sound !== null) sound.stop()
          window.open('https://ombr2.kbstar.com/quics?page=C106533&brncd=3876&bzwkDstic=3&noct=1013&QViewPC=N')
        } else {
       
        }
        // setTimeout(() => {
        //   isBlocking = false
        // }, 1000)
      }

      userClickHandler();
    })

    // ---------- Reset ----------
    // subtitle.onclick = userClickHandler
    // tooltipBox.addEventListener('click', () => {
    //   // console.log('[app.js] tooltipBox Click  : ')
    //   // if (!isBlocking)
    //   {
    //     // isBlocking = true
    //     if (stepIdx === 7) {
    //       // window.open('https://shot.kbstar.com/q.jsp#heq5j1k2');
    //       if (sound !== null) sound.stop()
    //       window.open('https://ombr2.kbstar.com/quics?page=C106533&brncd=3876&bzwkDstic=3&noct=1013&QViewPC=N')
    //     } else {
    //       userClickHandler()
    //     }
    //     // setTimeout(() => {
    //     //   isBlocking = false
    //     // }, 1000)
    //   }
    // })

    // replayBox.addEventListener('click', () => {
    //   // console.log('[app.js] replaybox Click  : ', replayBox.getAttribute('visible'))
    //   if (stepIdx === 7 && replayBox.getAttribute('visible')) {
    //     stepIdx = 0
    //     replayBox.classList.remove('cantap')
    //     replayBox.setAttribute('visible', false)
    //     userClickHandler()
    //   }
    // })

  },
  tick() {
    if (this.data.isLerping) {
      this.el.object3D.position.lerp(this.data.positions[this.data.currPosIdx], 0.05)
    }
  },
})
