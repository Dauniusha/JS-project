function slide() {
  const output = this.parentElement.children[0].firstElementChild;
  if (this.value < 10) {
    output.innerHTML = `0${this.value}`;
  } else {
    output.innerHTML = `${this.value}`;
  }
}

// Gallery slider
function galleryRangeSliders() {
  slide.call(this);
  const sliders = this.offsetParent.querySelectorAll('.img-inner__elem');
  
  let sliderWidth;
  let margins;

  for (let i = 0; i < sliders.length; i++) {
    if (!sliders[i].classList.contains('activ-img') && !sliders[i].matches(':hover')) {
      sliderWidth = sliders[i].offsetWidth;
      if(sliderWidth > 180) {
        continue;
      }
      break;
    }
  }

  switch(sliderWidth) {
    case 140:
      margins = 23;
      break;
    case 180:
      margins = 15;
      break;
    case 114:
      margins = 5;
      break;
    default:
      margins = 15;
      break;
  }

  sliders.forEach( (slider) => {
    if (slider.classList.contains('activ-img') && slider.dataset.pos !== this.value) {
      slider.classList.remove('activ-img');
      slider.querySelector('img').classList.remove('gallery-activ-img');
    }
    if (!slider.classList.contains('activ-img') && slider.dataset.pos === this.value) {
      slider.classList.add('activ-img');
      slider.querySelector('img').classList.add('gallery-activ-img');
      slider.parentElement.style.transform = `translateX(${-(slider.dataset.pos - 2) * (sliderWidth + margins * 2)}px)`;
    }
  });
}

function clickImg(elem) {
  if (elem.target.matches('img')) {
    const input = elem.currentTarget.querySelector('input');
    input.value = elem.target.parentElement.dataset.pos;
    galleryRangeSliders.call(input);
  }
}

const gallery = document.querySelector('.gallery');
const galleryInput = gallery.querySelector('input');
gallery.addEventListener('click', clickImg);
galleryInput.addEventListener('input', galleryRangeSliders);


// Zoos pets sliders
function zoosRangeSliders() {
  slide.call(this);
  const slides = this.offsetParent.querySelectorAll('.all-pets__elem');

  let slideWidth = slides[0].offsetWidth;
  let margins;
  if (window.innerWidth === 320) {
    margins = 8;
  } else {
    switch (slideWidth) {
      case 279:
        margins = 15;
        break;
      case 210:
        margins = 10;
        break;
      default:
        margins = 12.5;
        break;
    }
  }

  const blockWidth = this.offsetParent.querySelector('.zoos-pets__main').offsetWidth;
  let activePos = this.offsetParent.querySelector('.all-pets__elem-active').dataset.pos;
  const inOneTime = Math.floor(blockWidth / (slideWidth + margins));
  //console.log(blockWidth / (slideWidth + margins));
  if (checker) { // Выставляю первоначальные состаяния
    slides.forEach( (slide) => {
      if (slide.dataset.pos <= inOneTime) {
        slide.dataset.state = 'o';
      }
    });
    checker = false;
  }

  slides.forEach( (slide) => {
    if (slide.classList.contains('all-pets__elem-active') && slide.dataset.pos !== this.value) {
      slide.classList.remove('all-pets__elem-active');
      slide.querySelector('img').classList.remove('all-pets-active');
    }
    if (!slide.classList.contains('all-pets__elem-active') && slide.dataset.pos === this.value) {
      slide.classList.add('all-pets__elem-active');
      slide.querySelector('img').classList.add('all-pets-active');
      if (slide.dataset.pos < activePos && slide.dataset.state === 'h') { // лево
        slide.parentElement.style.transform = `translateX(${-(slide.dataset.pos - 1) * (slideWidth + margins * 2) - margins}px)`;
        stateCheck(slides, inOneTime, slide.dataset.pos, true);
      } else if (slide.dataset.pos > activePos && slide.dataset.state === 'h') {
        slide.parentElement.style.transform = `translateX(${-(slide.dataset.pos - inOneTime) * (slideWidth + margins * 2) - margins}px)`;
        stateCheck(slides, inOneTime, slide.dataset.pos, false);
      }
    }
  });
}

function stateCheck(slides, inOneTime, pos, boolLeft) {
  for (let j = 0; j < slides.length; j++) {
    if (slides[j].dataset.pos === pos) {
      if (boolLeft) {
        for (let i = pos - 1; i < pos - 1 + inOneTime; i++) {
          slides[i].dataset.state = 'o';
        }
        j += inOneTime - 1;
      } else {
        for (let i = pos - 1; i >= pos - inOneTime; i--) {
          slides[i].dataset.state = 'o';
        }
      }
    } else {
      slides[j].dataset.state = 'h';
    }
  }
}

function zoosButtonSlide(elem, className) { // Должно работать для любого
  let i = 0;
  while (!elem.path[i].querySelector('input')) {
    i++;
  }
  const input = elem.path[i].querySelector('input');
  if (elem.target.classList.contains(`${className}`)) { // лево
    input.value = --input.value < 1 ? input.max : input.value; 
  } else {
    input.value = ++input.value > input.max ? input.min : input.value;
  }
  return input;
}

function zoosSlideClick(elem, className) { // Должно работать для любого
  let i = 0;
  let j = 0;
  while (!elem.path[i].querySelector('input')) {
    i++;
  }
  const input = elem.path[i].querySelector('input');
  while (!elem.path[j].classList.contains(`${className}`)) {
    j++;
  }
  input.value = elem.path[j].dataset.pos;
  return input;
}

const zoos = document.querySelector('.zoos-pets__slider');
const zoosInput = zoos.querySelector('input');
const zoosVectors = zoos.querySelectorAll('.vectors');
const zoosSlides = zoos.querySelector('.zoos-pets__main');
zoosSlides.addEventListener('click', (elem) => {
  const className = 'all-pets__elem';
  zoosRangeSliders.call(zoosSlideClick(elem, className));
});
zoosVectors.forEach( (btn) => {
  btn.addEventListener('click', (elem) => {
    const className = 'vectors-left'; 
    zoosRangeSliders.call(zoosButtonSlide(elem, className));
  });
});
let searchTimeout = null;
zoosInput.addEventListener('input', zoosRangeSliders);
let checker = true; // Для состояния

// How it work sliders
function howWorkSlide() {
  if(move) {
    slide.call(this);
    const slider = this.parentElement.previousElementSibling.querySelector('ul');
    slider.style.transition = '2s all ease';
    const width = slider.querySelector('img').offsetWidth;
    if (boolNext) {
      move = false;
      slider.style.transform = `translateX(${-width * (this.max)}px)`;
      slider.addEventListener('transitionend', () => {
        slider.style.transition = 'none';
        slider.style.transform = `translateX(${-width * (this.value - 1)}px)`;
        move = true;
      });
    } else {
      slider.style.transform = `translateX(${-width * (this.value - 1)}px)`;
    }
  }
}

const howWorkInput = document.querySelector('.how-works__slider');
howWorkInput.addEventListener('input', () => {
  interval = false;
  setTimeout(() => {
    interval = true;
  }, 10000);
  howWorkSlide.call(howWorkInput);
});
let boolNext = false;
let move = true;
let interval = true;
setInterval(() => {
  if (interval) {
    let counter = howWorkInput.value;
    counter++;
    if(counter > 4) {
      counter = 1;
      boolNext = true;
    }
    howWorkInput.value = counter;
    howWorkSlide.call(howWorkInput);
    boolNext = false;
  }
}, 3000);