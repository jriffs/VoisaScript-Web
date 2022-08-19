const body = document.body
const head = document.head
const elements = body.children
let recorder
let dataArray = []
InitializeAudio()
createRecordArea()

function createRecordArea() {
    let recordArea = document.createElement('div')
    recordArea.innerHTML = `
        <a href="" class="hidden" id="file-download"></a>
    `
    recordArea.classList.add('hidden')
    body.appendChild(recordArea)
}

// getting elements with audio links 
function getElementsWithKeyWord() {
    const elementsArr = []
    const valueArr = []

    function checkChildren(elements) {
        
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i]
            elementsArr.push(element) 
            if (element.children.length > 0) {
                const elems = element.children
                checkChildren(elems)
            }
        }
               
    }

    function checkSyntax(elementArr) {
        elementArr.forEach(element => {
            if (element.localName !== 'script') {
                let nodes = element.childNodes
                nodes.forEach(node => {
                    if (node.nodeValue !== null && node.nodeValue.includes('https://voisascript.com')) {
                        let text = `${node.textContent.split('//')[1]}//${node.textContent.split('//')[2]}` 
                        valueArr.push({element: element, ID: `${element.id}`, text: `${text}`})
                    }
                })
            }                    
        })    
    }

    checkChildren(elements)
    checkSyntax(elementsArr)
        
    return valueArr
}

function changeElement(contentArr) {
    contentArr.forEach(item => {
        console.log(item.text)
        item.element.textContent = ''
        let container = document.createElement('div')
        container.classList.add('cont')
        container.innerHTML = `
        <audio src="https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-61905/zapsplat_multimedia_alert_chime_short_musical_notification_cute_child_like_001_64918.mp3?_=1" data-id="v-audio" class=""></audio>
        <div class="hover-test-box">
            <div class="v-logo"></div>
            <span class="popup-audio" id="myPopup">
                <div class="audio-control play" style="content: url(${browser.runtime.getURL('./icons/content/icons8-play-64.png')});"></div>
                <div class="seek-box">
                    <div class="forward" style="content: url(${browser.runtime.getURL('./icons/content/icons8-fast-forward-64.png')});"></div>
                    <div class="rewind" style="content: url(${browser.runtime.getURL('./icons/content/icons8-rewind-64.png')});"></div>
                </div>
                <span class="audio-time">3:13</span>
                <div class="main-anim-container">
                    <div class="bar"></div>
                    <div class="bar"></div>
                    <div class="bar"></div>
                    <div class="bar"></div>
                    <div class="bar"></div>
                    <div class="bar"></div>
                </div>
            </span>
        </div>
        `        
        item.element.parentElement.appendChild(container)  
    })
}

/* function communicateWithBackground(message) {
    let myPort = browser.runtime.connect({name:"port-from-cs"}) // creates message port
    myPort.postMessage({message}) // sends message to background
    myPort.onMessage.addListener((response) => { // listens for message from background
        console.log(`background sent -> ${response.greeting}`)
    })
} */

// playing audio function
function audioControl() {
    let v_logos = document.querySelectorAll('.v-logo'),
    rewind = document.querySelector('.rewind'),
    forward = document.querySelector('.forward'),
    play_buttons = document.querySelectorAll('.audio-control')
    /* barsContainer = document.querySelector('.main-anim-container'),
    bars = barsContainer.children */


    v_logos.forEach(v_logo => {
        v_logo.addEventListener('click', () => {
            let audio = v_logo.parentElement.previousElementSibling
            active_audio_toggle(audio)
            let audio_time = v_logo.parentElement.querySelector('.audio-time')
            audio_time.textContent = convertMin(audio.duration)
            let audioBox = v_logo.nextElementSibling
            visibility_toggle(audioBox)        
        })
    })

    function visibility_toggle(target) {
        if (target.classList.contains('show')) {
            target.classList.remove('show')
        }else target.classList.add('show')
    }

    function active_audio_toggle(target) {
        if (target.classList.contains('v-audio-active')) {
            target.classList.remove('v-audio-active')
        }else target.classList.add('v-audio-active')
    }

    play_buttons.forEach(play_button => {
        play_button.addEventListener('click', () => {
            let bars = play_button.parentElement.querySelector('.main-anim-container').children        
            let v_audio = document.querySelector('.v-audio-active')
            let audio_time = play_button.parentElement.querySelector('.audio-time')       
            if (v_audio.paused) {
                v_audio.play()
                play_button.setAttribute("style", `content: url(${browser.runtime.getURL('./icons/content/icons8-pause-64.png')});`)
                audio_time.textContent = convertMin(v_audio.currentTime)
                const audioTimer = setInterval(() => {
                    audio_time.textContent = convertMin(v_audio.currentTime)
                    if (v_audio.currentTime == v_audio.duration) {
                        animateBar(bars)
                        v_audio.pause()
                        play_button.setAttribute("style", `content: url(${browser.runtime.getURL('./icons/content/icons8-play-64.png')});`)
                        clearInterval(audioTimer)                    
                    }                
                }, 1000)
            } else {
                v_audio.pause()
                play_button.setAttribute("style", `content: url(${browser.runtime.getURL('./icons/content/icons8-play-64.png')});`)
                audio_time.textContent = convertMin(v_audio.currentTime)                        
            }
            animateBar(bars)                                  
        })
    })

    function animateBar(bars) {
        for (const bar of bars) {
            if (bar.classList.contains('up-down')) {
                bar.classList.remove('up-down')
            } else {
                bar.classList.add('up-down')
            }
        }
    }

    function convertMin(time) {
        time = Math.round(time)

        if (time >= 60) {
                let min = Math.round(time/60)
                let sec
                let rem = time - 60
                if (rem < 10) {
                    sec = Number(time - 60).toFixed()
                    return `${min}:0${sec}`
                } else {
                    sec = Math.round(time - 60)
                    return `${min}:${sec}`
                }
                
            }else if(time == 0) {
                return `${0}:${0}`
        } else{
            let min = 0
            let rem = Math.round(time)
            if (rem < 10) {
                sec = Number(time).toFixed()
                return `${min}:0${sec}`
            } else {
                sec = Math.round(time)
                return `${min}:${sec}`
            }  
        }
            
    }

    rewind.addEventListener('click', ()=>{
        let v_audio = document.querySelector('.v-audio-active')
        v_audio.currentTime -= 5
        audio_time.textContent = convertMin(v_audio.currentTime)
    })

    forward.addEventListener('click', ()=>{
        let v_audio = document.querySelector('.v-audio-active')
        v_audio.currentTime += 5
        audio_time.textContent = convertMin(v_audio.currentTime)
    })
}

body.addEventListener('mouseover', () => {
    if (getElementsWithKeyWord().length > 0) {
        let content = getElementsWithKeyWord()
        changeElement(content)
        audioControl()
        body.removeEventListener('mouseover', ()=>{})
        return
    }   
})

async function InitializeAudio() {
    let audioIN = { audio: true }
    try {
        const mediastremObj = await navigator.mediaDevices.getUserMedia(audioIN)
        const mediaRecorder = new MediaRecorder(mediastremObj)
        recorder = mediaRecorder
        recorder.ondataavailable = (ev)=>{
            dataArray.push(ev.data)
        }
        recorder.onstop = (ev) => {
            const downloadTag = document.querySelector('#file-download')
            const audioFile = new Blob(dataArray, {'type': 'audio/mp3;'})
            const url = window.URL.createObjectURL(audioFile)
            downloadTag.href = url
            downloadTag.download = `my-${Date.now()}-audio.mp3`
            downloadTag.click()
            window.URL.revokeObjectURL(url)
            dataArray = []
        }
    } catch (err) {
        throw err
    }
}

// communicateWithBackground('Hi from content')

browser.runtime.onMessage.addListener((request) => {
    switch (request.action) {
        case 'start':
            recorder.start()
            console.log(recorder.state)
            return Promise.resolve({recorderState: recorder.state})
            break;
        case 'pause':
            recorder.pause()
            console.log(recorder.state)
            return Promise.resolve({recorderState: recorder.state})
            break;
        case 'stop':
            recorder.stop()
            console.log(recorder.state)
            return Promise.resolve({recorderState: recorder.state})
            break;
        case 'retreive':
            console.log(recorder.state)
            return Promise.resolve({recorderState: recorder.state})
            break;
        case 'resume':
            recorder.resume()
            console.log(recorder.state)
            return Promise.resolve({recorderState: recorder.state})
            break;
    } 
})

