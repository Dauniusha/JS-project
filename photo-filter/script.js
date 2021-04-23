const img = document.querySelector('img');
const url = 'https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images';
let imgCounter = 1;

function rangeData() {
  const output = this.labels[0].children.namedItem('result');
  output.value = this.value;
  const suffix = this.dataset.sizing || '';
  document.documentElement.style.setProperty(`--${this.name}`, this.value + suffix);
}

const inputs = document.querySelectorAll('input[type=range]');
inputs.forEach(input => input.addEventListener('mousemove', rangeData));

function resetOption() {
  inputs.forEach( (input) => {
    if(input.name === 'saturate') {
      input.value = 100;
    } else {
      input.value = 0;
    }
    rangeData.call(input);
  });
}

const reset = document.querySelector('.btn-reset');
reset.addEventListener('click', resetOption);


function changeImg() {
  let fullUrl = '';
  const date = new Date();
  const hours = date.getHours();
  if (hours >= 6 && hours < 12) {
    fullUrl = url + '/morning/';
  } else if (hours >= 12 && hours < 18) {
    fullUrl = url + '/day/';
  } else if (hours >= 18 && hours < 24) {
    fullUrl = url + '/evening/';
  } else {
    fullUrl = url + '/night/';
  }
  if (imgCounter === 21) {
    imgCounter = 1;
  }
  if (imgCounter < 10) {
    imgCounter = '0' + imgCounter;
  }
  fullUrl = fullUrl + imgCounter + '.jpg';
  imgCounter++;
  img.src = fullUrl;
}

const next = document.querySelector('.btn-next');
next.addEventListener('click', changeImg);


function upload() {
  const inputFiles = this.querySelector('input');
  inputFiles.addEventListener('change', () => {
    const reader = new FileReader();
    const file = inputFiles.files[0];
    reader.readAsDataURL(file);
    reader.onload = () => {
      img.src = reader.result;
    }
  })
}

const uploadBtn = document.querySelector('.btn-load');
uploadBtn.addEventListener('click', upload);


function download() {
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = img.width;
  canvas.height = img.height;
  let filters = '';
  inputs.forEach( (input) => {
    const suffix = input.dataset.sizing || '';
    if (input.name === 'hue') {
      filters += `hue-rotate(${input.value + suffix})`;
    } else {
      filters += `${input.name}(${input.value + suffix})`;
    }
  });
  console.log(filters);
  ctx.filter = filters;
  ctx.drawImage(img, 0, 0);
  //create temporely link for download img
  const link = document.createElement('a');
  link.download = 'image.png';
  link.href = canvas.toDataURL();
  link.click();
  link.delete;
}

const downloadBtn = document.querySelector('.btn-save');
downloadBtn.addEventListener('click', download);


function toggleFullScreen() {
  if(!document.fullscreenElement)
    document.documentElement.requestFullscreen();
  else
    document.exitFullscreen();
}

const fullScreenBtn = document.querySelector('.fullscreen');
fullScreenBtn.addEventListener('click', toggleFullScreen);