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
    sessionStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    elems.forEach(elem => {
      elem.setAttribute('data-theme', 'light');
    });
    sessionStorage.setItem('theme', 'light');
  }
}

let checkbox = document.getElementById('switch');
const elems = document.querySelectorAll('div[data-theme]');
checkbox.addEventListener('change', toggleTheme);

if(sessionStorage.getItem('theme') === 'dark') {
  checkbox.click();
  toggleTheme.call(checkbox);
}