const button = document.getElementById('explicar');
const detail = document.getElementById('detalhe');

button.addEventListener('click', () => {
  detail.hidden = !detail.hidden;
  button.setAttribute('aria-expanded', String(!detail.hidden));
});
