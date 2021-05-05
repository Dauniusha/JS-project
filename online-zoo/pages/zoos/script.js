function chooseVideo(elem) {
  if (elem.target.classList.contains('mini-frame')) {
    let src = elem.target.src;
    let mainId;
    miniId = src.slice(27, 38);
    mainId = video.src.slice(30, 41);
    console.log(mainId);
    const link = 'https://www.youtube.com/embed/';
    video.src = link + miniId;
    elem.target.src = '//img.youtube.com/vi/' + mainId + '/hqdefault.jpg';
  }
}

const clearElem = document.querySelector('.main-video__all');
clearElem.addEventListener('click', chooseVideo);
const video = document.querySelector('.main-frame');


function slideVideo(elem) {
  if(elem.target.classList.contains('main-video__slider-elem')) {
    const dots = videoSlider.querySelectorAll('.main-video__slider-elem');
    dots.forEach( (dot) => {
      if (!dot.classList.contains('hidden')) {
        if (dot.classList.contains('slider-elem__active') && elem.target != dot) {
          dot.classList.remove('slider-elem__active');
        } else if (elem.target === dot){
          dot.classList.add('slider-elem__active');
          const width = allVideo.children[0].offsetWidth;
          let margins = 7;
          switch (width) {
            case 246:
              margins = 13;
              break;
            case 164:
              margins = 9;
              break;
            case 155:
              margins = 8;
              break;
            case 98:
              margins = 4.5;
              break;
            default:
              break;
          }
          allVideo.parentElement.offsetWidth / (width + margins * 2);
          allVideo.style.transform = `translateX(${-(allVideo.children[0].offsetWidth + margins * 2) * videoValue * (dot.dataset.pos - 1) - margins}px)`;
        }
      }
    });
  }
}

function makeVisible() {
  width = allVideo.children[0].offsetWidth;
  let margins = 7;
  switch (width) {
    case 246:
      margins = 13;
      break;
    case 164:
      margins = 9;
      break;
    case 155:
      margins = 8;
      break;
    case 98:
      margins = 4.5;
      break;
    default:
      break;
  }
  videoValue = (allVideo.parentElement.offsetWidth + margins * 2) / (width + margins * 2);
  if (videoValue - Math.floor(videoValue) > 0.95) {
    videoValue = Math.floor(videoValue) + 1;
  } else {
    videoValue = Math.floor(videoValue);
  }
  console.log(videoValue);
  switch (videoValue) {
    case 1:
      videoSlider.querySelectorAll('.hidden').forEach( (dot) => {
        dot.classList.remove('hidden');
      });
      break;
    case 2:
      videoSlider.querySelector('.hidden').classList.remove('hidden');
      break;
    default:
      break;
  }
}


const videoSlider = document.querySelector('.main-video__slider');
const allVideo = document.querySelector('.main-video__all-inner');
const numberVideo = 7;
let videoValue = 3;
let width;
let margins;
makeVisible();
videoSlider.addEventListener('click', slideVideo);