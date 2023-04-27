//
AFRAME.registerComponent('step-ctrl', {
    schema: {
    },
    init() {
        console.log("Step-ctrl init - 2304271950");

        // document.addEventListener("DOMContentLoaded", function () 
        // {
        //     console.log("Step-ctrl DOMContentLoaded");
        
            // Variable ----------
            let stepIdx = -1
            let interval = null
            let animInterval = null
            let sequnceInterval = null;
            let isFirstTime = true;
            let isNeedRabbitIdle = false;
            let isNeedOutherAnim = false;
            let delightCount = -1;

            let isFirstSequence = false;

            const MAX_STEP_LEN = 8;

            const car = document.getElementById('car')
            const rabbit = document.getElementById('rabbit')

            // Guide Panel ----------
            const guideDiv = document.getElementById('guidePanel')

            // TTS Script
            const captionList = [
                // '「갓생살기 with 펀드」란? 특정한 목표를 정하고, 이를 성취하기 위해 생산적이고 계획적인 생활을 실천한다는 의미의 MZ세대 유행어로, "펀드와 함께 재테크 목표달성을 위한 생활을 시작해보자"라는의미의 이벤트명 입니다.',
                // '펀드신규 이벤트 기간은 5월 2일부터 6월 30일까지!!',
                // '모든 상품이 대상은 아니고 참여운용사 상품을 가입했을때만 이벤트 대상이 된답니다!', 
                // '임의식펀드 5백만원이상 또는 적립식펀드 30만원 이상, 신규및 자동이체를 등록한 고객중 1,623명을 추첨하여 다양한 경품을 드립니다~ ',
                // '큰 금액을 가입한 고객에게는 더 큰 혜택을 드려요. 임의식펀드 5천만원이상 또는 적립식펀드 1백만원이상, 신규및 자동이체를 등록한 고객 중 510명을 추첨하여 경품을 드립니다~',  
                // '연금저축펀드 TDF상품을 가입한고객중 100명을 추첨하여 베스킨라빈스 패밀리아이스크림 쿠폰도 드려요!',  
                // '펀드 신규고객 총 2233명을 추첨하여 경품을 드리는 펀드신규이벤트입니다. 고객님께 이벤트를 안내하며 영업에 활용해 보세요! 기타 자세한 내용은 시행문을 참고해주세요.', 
                
                // 안녕하세요
                '「갓생살기 with 펀드」',
                '「갓생살기 with 펀드」\n펀드와 함께 재테크\n목표 달성을 시작해보자!',
                '5월 2일부터 6월 30일까지!',
                '참여운용사 상품을 가입했을\n때만 이벤트 대상!', 
                '임의식펀드 5백만원 이상\n적립식펀드 30만원 이상\n1,623명을 추첨!',
                ' 임의식펀드 5천만원 이상\n적립식펀드 1백만원 이상\n510명을 추첨!',  
                '연금저축펀드 TDF상품을\n가입한 고객 100명을 추첨!',  
                '펀드 신규고객 2233명을\n추첨하여 경품을 드리는\n펀드신규이벤트!', 
                '감사합니다'
            ]
            const subtitle = document.getElementById('subtitleBtn')
            subtitle.innerText = '「갓생살기 with 펀드」'
            
            const clickHand = document.getElementById('click-hand')
            clickHand.style.display = 'none'

            // Audio - BGM & TTS ------
            let soundTTS = null // TTS
            let soundEffect = null // TTS

            // BGM
            const soundMain = new window.Howl({
                src: (`../../assets/audios/Cute_Avalanche_-_RKVC.mp3`),
                loop: true,
                autoplay: true,
                volume: 0.2,
            })
            soundMain.play()

            // Handle page visibility change:
            // - If the page is hidden, pause the video
            // - If the page is shown, play the video
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    soundMain.pause()
                    if (soundTTS !== null) soundTTS.pause()
                } else {
                    soundMain.play()
                }
            })

            // Animation Evnet ----------
        rabbit.addEventListener('animation-finished', () => {

            console.log('The Rabbit anim all loop is finished!')

            if (isNeedRabbitIdle) {
                isNeedRabbitIdle = false;
                console.log("isNeedRabbitIdle")
                rabbit.setAttribute('animation-mixer', { 
                    clip: 'Idle', 
                    loop: 'repeat', 
                    startAt: 0,
                    timeScale: 1,
                    repetitions: 'Infinity', 
                    crossFadeDuration: 0.4
                 })
            } else if (isNeedOutherAnim) {
                isNeedOutherAnim = false;
                isNeedRabbitIdle = true;
                console.log("isNeedOutherAnim")
                rabbit.setAttribute('animation-mixer', {
                    clip: 'Deligh',
                    loop: 'repeat',
                    startAt: 0,
                    timeScale: 1,
                    repetitions: 'Infinity', 
                    crossFadeDuration: 0.4
                })
                delightCount = 0
            }
        })

        rabbit.addEventListener('animation-loop', (action) => { 
            if(delightCount > -1){
                ++delightCount;
                if(delightCount === 2){
                    delightCount = -1;
                    rabbit.setAttribute('animation-mixer', { 
                        clip: 'Idle', 
                        loop: 'repeat', 
                        startAt: 0,
                        timeScale: 1,
                        repetitions: 'Infinity', 
                        crossFadeDuration: 0.4
                     })
                }
            }
        })


        const urlLog = 'http://ec2-43-201-69-96.ap-northeast-2.compute.amazonaws.com:8000/api/fund-events/log';
        const urlEnd = 'http://ec2-43-201-69-96.ap-northeast-2.compute.amazonaws.com:8000/api/fund-events/2/additional-data';
        const urlData = 'http://ec2-43-201-69-96.ap-northeast-2.compute.amazonaws.com:8000/api/fund-events/log';

        const Http = new XMLHttpRequest();

        Http.open('GET', urlLog);
        Http.send();
        Http.onreadystatechange = (e) => {
            console.log(Http.responseText);
        };


            // car.addEventListener('animation-finished', () => {
            //     console.log('The car animation is finished!')
            // })


            // 01: Idle      (Frame Start:  0,         Frame End :  48 )
            // 02: Wave_google   (Frame Start: 60,         Frame End : 105 )
            // 03: Walk      (Frame Start: 115,        Frame End : 138 )
            // 04: Joy       (Frame Start: 149,        Frame End : 256 )
            // 05: Pride     (Frame Start: 270,        Frame End : 346 )
            // 06: Confetti  (Frame Start: 379,        Frame End : 447 )
            // 07: Wave goodbye (Frame Start: 480,     Frame End : 573 )
            // 08: Surprise   (Frame Start: 600,     Frame End : 619 )
            // 09: Gift_01 (Frame Start: 640 ,     Frame End :880 )
            // 10: Gift_02 (Frame Start: 940 ,     Frame End :1180  )
            // 11: Gift_03 (Frame Start: 1252,     Frame End :1490 )

            //Open_Door Close_Door Wheel_Rotate

            /// //////////////////////////////////////////////////////////
            /// -------------------- stepHandler -------------------- ///
            /// //////////////////////////////////////////////////////////
            const userClickHandler = () => {
                if (isFirstSequence) return;
                
                if (interval !== null) clearInterval(interval)
                ++stepIdx

                // ---------- Caption ----------
                subtitle.innerText = captionList[stepIdx]
                // ---------- Sound ----------
                if (soundTTS !== null) {
                    soundTTS.stop()  // 플레이중인 음원이 있으면 스탑
                    soundTTS = null;
                }
                if (stepIdx > 0 && stepIdx < 9) {
                    soundTTS = new window.Howl({
                        src: (`./assets/audios/tts_0${stepIdx -1}.mp3`),
                    })
                    soundTTS.play()
                } 
               
                // ---------- Animation ---------- walk spin point stand bow wave idle break
                if (animInterval != null) {
                    clearInterval(animInterval)
                }

                clickHand.style.display = 'none'
                if (sequnceInterval != null) {
                    clearInterval(sequnceInterval)
                }
                
                // const animationMixer = rabbit.getAttribute('animation-mixer')
                // if (animationMixer) {
                //     animationMixer.clampWhenFinished = true
                //     animationMixer.crossFadeDuration = 0.2
                //     animationMixer.startAt = 0
                // }
              
                isNeedRabbitIdle = false;
                isNeedOutherAnim = false;

                if (stepIdx === 0) { // 안녕하세요
                    rabbit.removeAttribute('animation-mixer');
                    if(isFirstTime){
                        isFirstTime = false; 

                        isFirstSequence = true;
                        rabbit.setAttribute('animation-mixer', { 
                            clip: 'Idle',
                            loop: 'repeat', 
                            repetitions: 'Infinity', 
                            timeScale: 1,
                            clampWhenFinished : true,
                            crossFadeDuration: 0.4
                        })
                      
                        car.setAttribute('animation__position', {property: 'position', to: {x: -4, y: 0, z: 0}, dur: 4000, easing: 'easeInOutCubic', loop: false})
                        // car.setAttribute('animation__scale', {property: 'scale', to: {x: 0.8, y: 0.8, z: 0.8}, dur: 8000, easing: 'easeInOutCubic', loop: false})
                        car.setAttribute('animation-mixer', { clip: 'Wheel_Rotate', loop: 'once' })
                        
                        animInterval = setTimeout(() => {
                            car.setAttribute('animation-mixer', { clip: 'Open_Door', loop: 'once', clampWhenFinished : true});
                          
                            rabbit.setAttribute('animation-mixer', {
                                clip: 'Walk',
                                loop: 'repeat',
                                startAt: 0,
                                timeScale: 1,
                                crossFadeDuration: 0.4
                            })
                            rabbit.setAttribute('animation__rotation', {property: 'rotation', to: {x: 0, y: 90, z: 0}, dur: 2000, easing: 'linear', loop: false})
                            
                            setTimeout(() => {
                                rabbit.setAttribute('animation__position', {property: 'position', to: {x: 2.7, y: 1, z: 0}, dur: 3000, easing: 'linear', loop: false})
                            }, 500)

                            setTimeout(() => {
                                rabbit.setAttribute('animation__position', {property: 'position', to: {x: 4, y: 0, z: 0}, dur: 1000, easing: 'easeOutExpo', loop: false})
                                // rabbit.setAttribute('animation__scale', {property: 'scale', to: {x: 1.7, y: 1.7, z: 1.7}, dur: 1000, easing: 'easeInCubic', loop: false})
                            }, 3500)

                            setTimeout(() => {
                                car.setAttribute('animation__position', {property: 'position', to: {x: -12, y: 0, z: 0}, dur: 4000, easing: 'easeInOutCubic', loop: false})
                                
                                rabbit.setAttribute('animation-mixer', {
                                    clip: 'Idle',
                                    loop: 'repeat',
                                    startAt: 0,
                                    timeScale: 1,
                                    crossFadeDuration: 0.4
                                })

                                rabbit.setAttribute('animation__position', {property: 'position', to: {x: 12, y: 0, z: 0}, dur: 4000, easing: 'easeInOutCubic', loop: false})
                                rabbit.setAttribute('animation__rotation', {property: 'rotation', to: {x: 0, y: 0, z: 0}, dur: 1000, easing: 'easeInOutCubic', loop: false})
                            }, 5000)

                            setTimeout(() => {
                                 rabbit.setAttribute('animation__scale', {property: 'scale', to: {x: 2, y: 2, z: 2}, dur: 1000, easing: 'easeInCubic', loop: false})
                                 rabbit.setAttribute('animation-mixer', {clip: 'Wave_google', loop: 'repeat', startAt: 0,timeScale: 1,crossFadeDuration: 0.4})
                                delightCount = 1
                            }, 6000)

                            setTimeout(() => {
                               isFirstSequence = false;
                               clickHand.style.display = 'block'
                           }, 8000)

                        }, 4000)

                    } else {
                        rabbit.setAttribute('animation-mixer', {clip: 'Wave_google', loop: 'repeat', startAt: 0,timeScale: 1,crossFadeDuration: 0.4})
                        delightCount = 1
                    }
                } else if (stepIdx === 1) { // 「갓생살기 with 펀드」란?
                    rabbit.setAttribute('animation-mixer', {clip: 'Joy', loop: 'repeat', repetitions: 3, crossFadeDuration: 0.4 })
                    isNeedRabbitIdle = true;
                } else if (stepIdx === 2) { // 펀드신규 이벤트
                    rabbit.setAttribute('animation-mixer', { clip: 'Pride', loop: 'repeat', repetitions : 2, crossFadeDuration: 0.4})
                    isNeedRabbitIdle = true;
                } else if (stepIdx === 3) { // 모든 상품이 대상은 아니고
                    rabbit.setAttribute('animation-mixer', { clip: 'Surprise', loop: 'once', timeScale: 0.25, crossFadeDuration: 0.4 })
                    isNeedRabbitIdle = true;
                } else if (stepIdx === 4) {
                    rabbit.setAttribute('animation-mixer', { clip: 'Gift_01', loop: 'once',  timeScale: 1, crossFadeDuration: 0.4 })
                    isNeedRabbitIdle = true;
                } else if (stepIdx === 5) {
                    rabbit.setAttribute('animation-mixer', { clip: 'Gift_02', loop: 'once', timeScale: 1, crossFadeDuration: 0.4 })
                    isNeedOutherAnim = true;
                } else if (stepIdx === 6) {
                    rabbit.setAttribute('animation-mixer', { clip: 'Gift_03', loop: 'once', timeScale: 1, crossFadeDuration: 0.4 })
                    isNeedRabbitIdle = true;
                } else if (stepIdx === 7) { // 펀드 신규고객 총 2233명
                    rabbit.setAttribute('animation-mixer', { clip: 'Confetti', loop: 'repeat', timeScale: 1, repetitions : 4, crossFadeDuration: 0.4})
                    isNeedOutherAnim = true;
                   
                    if (soundEffect !== null) {
                        soundEffect.stop()  // 플레이중인 음원이 있으면 스탑
                        soundEffect = null;
                        soundEffect = new window.Howl({
                            src: (`../../assets/audios/.mp3`),
                        })
                        soundEffect.play()
                    }
                } else if (stepIdx === 8) { // 감사합니다
                    rabbit.setAttribute('animation-mixer', { clip: 'Wave_google', loop: 'repeat', startAt: 0, timeScale: 1, repetitions: 'Infinity' })
                    delightCount = 1
                }

                if (stepIdx !== 0){
                    sequnceInterval = setTimeout(() => {
                        clickHand.style.display = 'block'
                    }, 7000)
                }
                
                if (stepIdx === MAX_STEP_LEN) {
                  stepIdx = -1
                }
            }
           
            // ---------- Reset ----------
            subtitle.onclick = userClickHandler

            setTimeout(() => {
                userClickHandler();

                Http.open('GET', "http://ec2-43-201-69-96.ap-northeast-2.compute.amazonaws.com:8000/api/fund-events");
                Http.send();
                Http.onreadystatechange = (e) => {
                    console.log(Http.responseText);
                };
            }, 3000)

        // })
    },
})

