

const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement ('video');
var peer = new Peer(undefined,{
    path: '/peerjs',
    host: '/',
    port: '443'
});


myVideo.muted = true;



let myVideoStream
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream =>{
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video,userVideoStream)
    })
})



    socket.on('user-connected', (userId) => {
        connecToNewUser(userId, stream);
    })
    
    let msg = $('input');
    console.log(msg);

    $('html').keydown((e) => {
        if (e.which == 13 && msg.val().length !==0) {
            socket.emit('message1',msg.val());
            msg.val('')
        }
    });

    socket.on('createMessage',message1 =>{
        $('ul').append(`<li class="message1"><b>user</b><br/>${message1}</li>`)
        scrollToBottom();
    })
})

peer.on('open', id => {
    socket.emit('join-room', ROOM_ID,id); 
})

 


const connecToNewUser = (userId,stream) => {
    const call= peer.call (userId, stream)
    const video = document.createElement('video')
    call.on('stream',userVideoStream =>{
        addVideoStream(video, userVideoStream)
    })
}

const addVideoStream = (video, stream) =>{
    video.srcObject = stream;
    video.addEventListener('loadedmetadata',() => {
        video.play();
    })
    videoGrid.append(video);
}
const scrollToBottom=() =>{
    let d=$('.main__chat__window');
    d.scrollTop(d.prop("scrollHeight"));
}

const mute = () => {
    const enabled= myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled=false;
        setUnmuteButton();
    }
    else{
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled=true;
    }
}

const setMuteButton =() =>
{
    const html = `
    <i class= "fas fa-microphone"></i>
    <span>Mute</span>
    `
    document.querySelector('.main__mute__button').innerHTML=html;
}

const setUnmuteButton =() =>
{
    const html = `
    <i class="fas fa-microphone-slash"></i>
    <span>Unmute</span>
    `
    document.querySelector('.main__mute__button').innerHTML=html;
}


const videostop = () => {
    const enabled= myVideoStream.getVideoTracks()[0].enabled;
    if(enabled){
        myVideoStream.getVideoTracks()[0].enabled=false;
        pauseVideoButton();
    }
    else{
        playVideoButton();
        myVideoStream.getVideoTracks()[0].enabled=true;
    }
}


const playVideoButton =() =>
{
    const html = `
    <i class="fas fa-video"></i>
    <span>Camera Off</span>
    `
    document.querySelector('.main__video__button').innerHTML=html;
}

const pauseVideoButton =() =>
{
    const html = `
    <i class="fas fa-video-slash"></i>
    <span>Camera On</span>
    `
    document.querySelector('.main__video__button').innerHTML=html;
}

function getEl(id) {
    return document.getElementById(id)
}
const editor = getEl("editor")
editor.addEventListener("keyup", (evt) => {
    const text = editor.value
    socket.send(text)
})
socket.on('message', (data) => {
    editor.value = data
})
