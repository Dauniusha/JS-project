function remove(e) {
    const key = document.querySelector(`div[data-letter="${e.code.slice(3)}"]`);
    key.classList.remove('piano-key-active');
}

function playNote(e) {
    const audio = document.querySelector(`audio[data-letter="${e.code.slice(3)}"]`);
    const key = document.querySelector(`div[data-letter="${e.code.slice(3)}"]`);
    if(!audio)
        return;
    if(!e.repeat) {
        key.classList.add('piano-key-active');
        audio.currentTime = 0;
        audio.play();
    }
}

function playAllClick(e) {
    playClick(e);
    pianoKeys.forEach( (key) => {
        key.addEventListener('mouseover', playClick);
        key.addEventListener('mouseout', removeClick);
    })
}

function playClick(e) {
    if(e.target.classList.contains('piano-key')) {
        e.target.classList.add('piano-key-active-pseudo');
        e.target.classList.add('piano-key-active')
        const audio = document.querySelector(`audio[data-letter="${e.target.dataset.letter}"]`);
        audio.currentTime = 0;
        audio.play();
    }
}

function removeClick(e) {
    e.target.classList.remove('piano-key-active');
    e.target.classList.remove('piano-key-active-pseudo');
}

function removeAllClick(e) {
    removeClick(e);
    pianoKeys.forEach( (key) => {
        key.removeEventListener('mouseover', playClick);
        key.removeEventListener('mouseout', removeClick);
    })
}

function choose(e) {
    if(e.target.classList.contains('btn')) {
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach( (button) => {
            button.classList.toggle('btn-active');
        })
        pianoKeys.forEach( (key) => {
            key.classList.toggle('piano-key-letter');
        })
    }
}

function toggleFullScreen() {
    if(!document.fullscreenElement)
        document.documentElement.requestFullscreen();
    else
        document.exitFullscreen();
}

window.addEventListener('keydown', playNote);
window.addEventListener('keyup', remove);

const piano = document.querySelector('.piano');
const pianoKeys = document.querySelectorAll('.piano-key');
piano.addEventListener('mousedown', playAllClick);
window.addEventListener('mouseup', removeAllClick);

const button = document.querySelector('.btn-container');
button.addEventListener('click', choose);

const fullScreenButton = document.querySelector('.fullscreen');
fullScreenButton.addEventListener('click', toggleFullScreen);