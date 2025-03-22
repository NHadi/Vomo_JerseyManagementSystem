const menuIcons = {
  dashboard: 'tv-2',
  'shopping-cart': 'cart',
  box: 'box-2',
  folder: 'folder-17',
  users: 'single-02',
  'chart-bar': 'chart-bar-32',
  settings: 'settings'
};

function getMenuIcon(icon) {
  // Remove 'ni ni-' prefix if present
  const cleanIcon = icon.replace('ni ni-', '');
  return menuIcons[cleanIcon] || cleanIcon;
}

function isMenuActive(menuUrl) {
  const currentPath = window.location.pathname;
  return currentPath.endsWith(menuUrl);
}

function renderMenu(menus, container) {
  menus.forEach(menu => {
    if (menu.children && menu.children.length > 0) {
      // Parent menu with dropdown
      const menuItem = $(`
        <li class="nav-item">
          <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#menu-${menu.id}" aria-expanded="false">
            <i class="${menu.icon}"></i>
            <span class="nav-link-text">${menu.name}</span>
          </a>
          <div class="collapse" id="menu-${menu.id}">
            <ul class="nav nav-sm flex-column pl-4">
            </ul>
          </div>
        </li>
      `);

      const submenuContainer = menuItem.find('.nav');
      menu.children.forEach(child => {
        const childItem = $(`
          <li class="nav-item">
            <a class="nav-link py-2" href="${child.url}">
              <i class="${child.icon}"></i>
              <span class="nav-link-text">${child.name}</span>
            </a>
          </li>
        `);
        submenuContainer.append(childItem);
      });

      container.append(menuItem);

      // Initialize collapse
      $(`#menu-${menu.id}`).on('show.bs.collapse', function() {
        $(this).siblings('.nav-link').removeClass('collapsed');
        $(this).siblings('.nav-link').attr('aria-expanded', 'true');
      });

      $(`#menu-${menu.id}`).on('hide.bs.collapse', function() {
        $(this).siblings('.nav-link').addClass('collapsed');
        $(this).siblings('.nav-link').attr('aria-expanded', 'false');
      });

    } else {
      // Regular menu item
      const menuItem = $(`
        <li class="nav-item">
          <a class="nav-link" href="${menu.url}">
            <i class="${menu.icon}"></i>
            <span class="nav-link-text">${menu.name}</span>
          </a>
        </li>
      `);
      container.append(menuItem);
    }
  });

  // Add active class and expand current menu
  const currentPath = window.location.pathname;
  $('.nav-link').each(function() {
    const href = $(this).attr('href');
    if (href && currentPath.endsWith(href)) {
      $(this).addClass('active');
      $(this).parents('.collapse').addClass('show');
      $(this).parents('.collapse').siblings('.nav-link').removeClass('collapsed');
      $(this).parents('.collapse').siblings('.nav-link').attr('aria-expanded', 'true');
    }
  });
}