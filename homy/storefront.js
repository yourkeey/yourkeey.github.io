const directions = {
  wood: { title: 'Сандал, бурштин та кедр', description: 'У нашій демонстраційній добірці — Cedar та Amber Sandal від HEM. Відкрийте картку, щоб перевірити опис, ціну та наявність.' },
  flower: { title: 'Фіалка, вишня та жасмин', description: 'У добірці — Violet та Cherry Jasmine від HEM. Порівняйте повні описи квіткових і квітково-фруктових композицій у магазині.' },
  fresh: { title: 'Ноти зеленого чаю', description: 'У добірці — Green Tea від HEM. Назва допоможе визначитися з напрямом; характеристики перевіряйте в картці товару.' },
  spice: { title: 'Гвоздика та кориця', description: 'У добірці — Clove Cinnamon від HEM. Якщо цікавлять пряні ноти, відкрийте товар, щоб дізнатися більше.' }
};
let selectedScent = 'wood';
function filterProducts(family) {
  let count = 0;
  document.querySelectorAll('[data-family]').forEach(card => {
    const visible = family === 'all' || card.dataset.family === family;
    card.hidden = !visible;
    if (visible) count++;
  });
  document.querySelectorAll('[data-filter]').forEach(button => {
    const active = button.dataset.filter === family;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  document.getElementById('product-count').textContent = `У добірці: ${count}`;
}
document.querySelectorAll('[data-scent]').forEach(button => button.addEventListener('click', () => {
  selectedScent = button.dataset.scent;
  document.querySelectorAll('[data-scent]').forEach(item => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  const choice = directions[selectedScent];
  document.getElementById('scent-title').textContent = choice.title;
  document.getElementById('scent-description').textContent = choice.description;
}));
document.getElementById('scent-link').addEventListener('click', () => filterProducts(selectedScent));
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => filterProducts(button.dataset.filter)));
const menuButton = document.querySelector('.menu-button');
const menu = document.querySelector('.header nav');
function closeMenu() {
  menu.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Відкрити меню');
}
menuButton.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Закрити меню' : 'Відкрити меню');
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
