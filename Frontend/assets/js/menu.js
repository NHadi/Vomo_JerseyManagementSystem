const menuIcons = {
  dashboard: 'tv-2',
  'shopping-cart': 'cart',
  box: 'box-2',
  folder: 'folder-17',
  users: 'single-02',
  'chart-bar': 'chart-bar-32'
};

function getMenuIcon(icon) {
  return menuIcons[icon] || icon;
}

function isMenuActive(menuUrl) {
  const currentPath = window.location.pathname;
  return currentPath.endsWith(menuUrl);
}

function renderMenu(menus, container) {
  menus.forEach(menu => {
    const menuItem = $(`
      <li class="nav-item">
        <a class="nav-link" href="${menu.url}">
          <i class="ni ni-${menu.icon} text-primary"></i>
          <span class="nav-link-text">${menu.name}</span>
        </a>
      </li>
    `);
    container.append(menuItem);
  });
}