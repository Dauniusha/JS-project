function chooseVideo(elem) {
  if (elem.target.classList.contains('mini-frame')) {
    let src = elem.target.src;
    let mainId;
    miniId = src.slice(26, 37);
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