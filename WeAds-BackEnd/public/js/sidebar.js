const sidebar = document.querySelector('.sidebar');
const closeBtn = document.querySelector('.close-sidebar');
const toggler = document.querySelector('.sidebar-toggler');

toggler.addEventListener('click',() => {
  document.querySelector('.sidebar').classList.toggle('collapsed');
});
closeBtn.addEventListener('click',() => {
  document.querySelector('.sidebar').classList.toggle('collapsed');
});
