const sidebar = document.querySelector('.sidebar');
const closeBtn = document.querySelector('.close-sidebar');
const toggler = document.querySelector('.sidebar-toggler');
const collapseToggle = document.querySelector('.collapse-toggle li');

toggler.addEventListener('click',() => {
  document.querySelector('.sidebar').classList.toggle('collapsed');
});

closeBtn.addEventListener('click',() => {
  document.querySelector('.sidebar').classList.toggle('collapsed');
});

collapseToggle.addEventListener('click',() => {
  document.querySelector('.collapse-toggle').classList.toggle('open');
});