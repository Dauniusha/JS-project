function transition() {
  document.documentElement.classList.add('transition');
  window.setTimeout( () => {
    document.documentElement.classList.remove('transition');
  }, 1000);
}

function toggleTheme() {
  if(this.checked) {
    transition();
    document.documentElement.setAttribute('data-theme', 'dark');
    elems.forEach(elem => {
      elem.setAttribute('data-theme', 'dark');
    });
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    elems.forEach(elem => {
      elem.setAttribute('data-theme', 'light');
    });
  }
}

let checkbox = document.getElementById('switch');
const elems = document.querySelectorAll('div[data-theme]');
checkbox.addEventListener('change', toggleTheme);