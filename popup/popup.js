const body = document.body
const fileActionArea = document.querySelector('.file-action')
const callToActionArea = document.querySelector('.call-to-action')
const createProjectButton = document.querySelector('#create-project')
const projectCreateDiv = document.querySelector('#project-create')
const projectSelect = document.querySelector('#choose-project')
const recordAudioButton = document.querySelector('#audio-mic')
const saveButton = document.querySelector('#save-button')
const animatedBars = document.querySelector('.animated-bars')
const saveButtonLogo = document.querySelector('.button-logo')
const audioFileHolder = document.querySelector('#audio-file-holder')
const chooseFileButton = document.querySelector('#choose-file-btn')
const uploadButton = document.querySelector('#upload-btn')
const copyButton = document.querySelector('#copy-button')
const linkHolder = document.querySelector('#copy-input')
const saveFileArea = document.querySelector('.file-holder')
const fileNameHolder = document.querySelector('#choose-file-btn>p')
const connect = document.querySelector('#call-to-action-btn')




createProjectButton.addEventListener('click', (e)=>{
    e.preventDefault()
    let thisButton = e.target
    
    if (thisButton.textContent == 'create new project') {
        projectCreateDiv.classList.toggle('hidden')
        projectCreateDiv.querySelectorAll('input').forEach(input =>{
            input.toggleAttribute('disabled')
        })
        projectSelect.toggleAttribute('disabled')
        thisButton.textContent = 'cancel'
    }else {
        projectCreateDiv.classList.toggle('hidden')
        projectCreateDiv.querySelectorAll('input').forEach(input =>{
            input.toggleAttribute('disabled')
            input.value = ''
        })
        projectSelect.toggleAttribute('disabled')
        thisButton.textContent = 'create new project'
    }
})

recordAudioButton.addEventListener('click', async (e)=>{
    e.preventDefault()
    const recorderState = await communicateWithContent('retreive')
    if (recorderState) {
        switch (recorderState) {
            case 'paused':
                await communicateWithContent('resume')
                recordAudioButton.childNodes[3].textContent = 'Recording...'
                for (const element of animatedBars.children) {
                    element.classList.toggle('up-down')
                }
                break;
            case 'recording':
                await communicateWithContent('pause')
                recordAudioButton.childNodes[3].textContent = 'Recording Paused'
                for (const element of animatedBars.children) {
                    element.classList.toggle('up-down')
                }
                break;
            case 'inactive':
                await communicateWithContent('start')
                saveButton.toggleAttribute('disabled')
                recordAudioButton.childNodes[3].textContent = 'Recording...'
                animatedBars.classList.toggle('hidden')
                saveButtonLogo.classList.toggle('recording')
                break;
        }
        return 
    }
    notie.alert({
        type: 3,
        text: 'Microphone permission is not enabled, please refresh page and select allow',
        time: 2
    })
})

saveButton.addEventListener('click', async (e) =>{
    e.preventDefault()
    const thisButton = e.target
    const recorderState = await communicateWithContent('retreive')
    if (recorderState != 'inactive') {
        let newRecorderState = await communicateWithContent('stop')
        if (newRecorderState == 'inactive') {
            for (const element of animatedBars.children) {
                element.classList.toggle('up-down')
            }
            animatedBars.classList.toggle('hidden')
            saveButtonLogo.classList.toggle('recording')
            recordAudioButton.childNodes[3].textContent = 'Record Audio'
            recordAudioButton.toggleAttribute('disabled')
            if (saveFileArea.classList.contains('hidden')) {
                saveFileArea.classList.toggle('hidden')
            }
            thisButton.toggleAttribute('disabled')
        }
         
    }
})

chooseFileButton.addEventListener('click', (e) => {
    e.preventDefault()
    audioFileHolder.click()
})

audioFileHolder.addEventListener('input', () => {
    let file_name = audioFileHolder.value.split('\\')[2]
    if (checkIfAudio(file_name)) {
        fileNameHolder.textContent = file_name
        uploadButton.classList.toggle('hidden')
        return
    }
    notie.alert({
        type: 3,
        text: 'Please select the audio file you just recorded & downloaded',
        time: 2
    })
    if (!uploadButton.classList.contains('hidden')) {
        uploadButton.classList.toggle('hidden')
    }
    fileNameHolder.textContent = ''
})

uploadButton.addEventListener('click', (e) => {
    e.preventDefault()
    let form = document.querySelector('form')
    let data = new FormData(form)
    if (validate()) {
        let http = new XMLHttpRequest()
        http.open('POST', 'http://localhost:5000/files/upload', true)
        http.onreadystatechange = () => {
            if (http.readyState == 4 && http.status == 200) {
                let link = http.response
                linkHolder.value = link
                notie.alert({
                    type: 1,
                    text: 'Upload Successful... copy generated link and paste anywhere in your code',
                    time: 2
                })
                audioFileHolder.value = ''
                fileNameHolder.textContent = ''
                recordAudioButton.toggleAttribute('disabled')
                uploadButton.classList.toggle('hidden')
                saveFileArea.classList.toggle('hidden')
                return 
            }
            notie.alert({
                type: 3,
                text: 'Network Error: Cannot connect, please check network connection',
                time: 2
            })
        }
        http.send(data)
        return 
    }
    notie.alert({
        type: 3,
        text: 'Please choose an existing project or Create a new one',
        time: 2
    })
})

copyButton.addEventListener('click', (e) => {
    e.preventDefault()
    linkHolder.select()
    navigator.clipboard.writeText(linkHolder.value)
    notie.alert({
        type: 1,
        text: 'Link Copied to clipboard 👍👍👌',
        time: 2
    })
})

function checkIfAudio(file_name) {
    let filename_Extension = file_name.split('.')[1]
    let acceptedExtensions = ['mp3', 'wav']
    if (acceptedExtensions.includes(filename_Extension)) {
        return true
    }
    return false
}

function validate() {
    let project = document.querySelector('select[name=project]').value
    let newProjectName = document.querySelector('input[name=new-project-name]').value
    let newProjectDesc = document.querySelector('input[name=new-project-desc]').value
    let validate = false
    if (project == '') {
        if (newProjectName !== '' && newProjectDesc !== '') {
            return validate = true
        }
        return validate
    }
    if (newProjectName == '' && newProjectDesc == '') {
        if (project !== '') {
            return validate = true
        }
        return validate
    }
    return validate
}

async function communicateWithContent(message) {
    try {
        const tabs = await browser.tabs.query({
            currentWindow: true,
            active: true
        })
        const tab = tabs[0]
        const received = await browser.tabs.sendMessage(
            tab.id,
            {action: message}
        )
        return received.recorderState
    } catch (e) {
        notie.alert({
            type: 3,
            text: e,
            time: 2
        })
    }
    
}