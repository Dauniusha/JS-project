function slide() {
  const output = this.parentElement.children[0].firstElementChild;
  if (this.value < 10) {
    output.innerHTML = `0${this.value}`;
  } else {
    output.innerHTML = `${this.value}`;
  }
}

function mapSlide() {
  slide.call(this);
  const slides = this.offsetParent.querySelectorAll('.map-page-slider__each');
  
  let margins;
  let activeMargins;


  if(choose) { // Чтобы выбирало только один раз и не проскальзовало
    for (let i = 0; i < slides.length; i++) {
      if (!slides[i].classList.contains('circle-animals__active') && !slides[i].matches(':hover')) {
        slideWidth = slides[i].offsetWidth;
        choose = false;
        break;
      }
    }
  }

  if (window.innerWidth <= 640 && window.innerWidth > 320) {
    margins = 7.5;
    activeMargins = 4;
  } else {
    switch(slideWidth) {
      case 108:
      case 109:
        margins = 15;
        activeMargins = 12;
        slideWidth = 108;
        break;
      case 60:
        margins = 5;
        activeMargins = 0;
        break;
      default:
        margins = 10;
        activeMargins = 0;
        break;
    }
  }

  const blockWidth = this.offsetParent.querySelector('.map-page-slider__all').offsetWidth;
  let activePos = this.offsetParent.querySelector('.circle-animals__active').dataset.pos;
  const inOneTime = Math.floor((blockWidth + margins * 2) / (slideWidth + margins * 2));
  if (checker) { // Выставляю первоначальные состаяния
    slides.forEach( (slide) => {
      if (slide.dataset.pos <= inOneTime) {
        slide.dataset.state = 'o';
      }
    });
    checker = false;
  }
  //console.log((blockWidth + margins * 2) / (slideWidth + margins * 2));
  slides.forEach( (slide) => {
    if (slide.classList.contains('circle-animals__active') && slide.dataset.pos !== this.value) {
      slide.classList.remove('circle-animals__active');
      slide.querySelector('img').classList.remove('animals__active');
    }
    if (!slide.classList.contains('circle-animals__active') && slide.dataset.pos === this.value) {
      slide.classList.add('circle-animals__active');
      slide.querySelector('img').classList.add('animals__active');
      changeIcon(slide.dataset.pos);
      changeWatchLink(slide.dataset.pos);
      switch (slide.dataset.state) {
        case 'h':
          if (slide.dataset.pos < activePos) { // лево
            slide.parentElement.style.transform = `translateX(${-(slide.dataset.pos - 1) * (slideWidth + margins * 2) - margins + activeMargins * 2}px)`;
            stateCheck(slides, inOneTime, slide.dataset.pos, true);
          } else if (slide.dataset.pos > activePos) {
            slide.parentElement.style.transform = `translateX(${-(slide.dataset.pos - inOneTime) * (slideWidth + margins * 2) - margins - activeMargins * 2}px)`;
            stateCheck(slides, inOneTime, slide.dataset.pos, false);
          }
          break;
        case 'o':
          if (slide.dataset.pos < activePos && (slide.dataset.pos == 1 || slides[slide.dataset.pos - 2].dataset.state === 'h')) {
            slide.parentElement.style.transform = `translateX(${-(slide.dataset.pos - 1) * (slideWidth + margins * 2) - margins + activeMargins * 2}px)`;
          } else if (slide.dataset.pos > activePos && (slide.dataset.pos == slides.length || slides[slide.dataset.pos].dataset.state === 'h')) {
            slide.parentElement.style.transform = `translateX(${-(slide.dataset.pos - inOneTime) * (slideWidth + margins * 2) - margins - activeMargins * 2}px)`;
          }
        default:
          break;
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
  while (!elem.path[j].classList.contains(`${className}`)) { // Li элемент
    j++;
  }
  input.value = elem.path[j].dataset.pos;
  return input;
}

function changeIcon(pos) {
  const icons = map.querySelectorAll('.map-page__each-animal');
  icons.forEach( (icon) => {
    if (icon.dataset.pos == pos) {
      icon.classList.add('map__active');
    } else if (icon.classList.contains('map__active')) {
      icon.classList.remove('map__active');
    }
  });
}

function chooseIcon(elem) {
  i = 1;
  let activeIcon = elem.path[3].querySelector('.map__active');
  if (activeIcon) {
    activeIcon.classList.remove('map__active');
  }
  const target = elem.path[1];
  const pos = target.dataset.pos;
  target.classList.add('map__active');
  while (!elem.path[i].querySelector('input')) {
    i++;
  }
  const input = elem.path[i].querySelector('input');
  input.value = pos;
  return input;
}

function changeWatchLink(pos) {
  switch(Number(pos)) {
    case 1:
      watchButton.href = '../zoos/gorilla.html';
      break;
    case 2:
      watchButton.href = '../zoos/panda.html';
      break;
    case 3:
      watchButton.href = '../zoos/alligator.html';
      break;
    case 4:
      watchButton.href = '../zoos/eagle.html';
      break;
    default:
      watchButton.href = '/stop';
      break;
  }
}

function clickLink(elem) {
  if (elem.target.href.endsWith('/stop')) {
    elem.preventDefault();
  }
}

const section = document.querySelector('.map-page__main');
const slider = section.querySelector('.map-page-slider');
const input = section.querySelector('.gallery__slider');
input.addEventListener('input', mapSlide);
let slideWidth;
let choose = true;
let checker = true;
slider.addEventListener('click', (elem) => {
  if (elem.target.classList.contains('vectors')) {
    mapSlide.call(zoosButtonSlide(elem, 'vectors-left'));
  } else if (elem.target.classList.contains('circle-animals')) {
    mapSlide.call(zoosSlideClick(elem, 'map-page-slider__each'));
  }
});
const map = section.querySelector('.map__main');
map.addEventListener('click', (elem) => {
  if(elem.path[1].classList.contains('map-page__each-animal')) {
    mapSlide.call(chooseIcon(elem));
  }
});

const watchButton = section.querySelector('.watch-online');
watchButton.addEventListener('click', clickLink);