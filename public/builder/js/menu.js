window.addEventListener('load', () =>
{
  const moduleName = 'nav.c-menu';
  document.querySelectorAll(moduleName).forEach((root, i) =>
  {
    const store = {
      langSelectors: document.querySelectorAll('.c-lang-selector'),
      button: root.querySelector('.menu-button'),
      wrap: root.querySelector('.menu-wrap'),
      links: root.querySelector('.submenu>.links'),
      close: root.querySelector('.menu-close'),
      onResize: () =>
      {
        // console.log('menu.js onResize');
        const hasMenu = store.links.scrollWidth > store.links.clientWidth;
        root.classList.toggle('has-menu', hasMenu);
        if (hasMenu) store.langSelectors.forEach(selector =>
        {
          const floater = selector.querySelector('.floater');
          if (floater)
          {
            floater.classList.toggle('from-top', !hasMenu);
            floater.classList.toggle('from-bottom', hasMenu);
          }
        });
        console.log('menu.js onResize hasMenu:', hasMenu, root);
      },
      openMenu: () =>
      {
        document.querySelector('html').classList.add('no-scroll');
        store.wrap.classList.add('is-open');
      },
      closeMenu: () =>
      {
        document.querySelector('html').classList.remove('no-scroll');
        store.wrap.classList.remove('is-open');
      },
      closeAllLangSelectors: (e) =>
      {
        if (!e.target.closest('.c-lang-selector'))
        {
          store.langSelectors.forEach(
            s => s.classList.remove('is-open')
          );
        }
      }
    };

    window.removeEventListener('resize', store.onResize);
    window.addEventListener('resize', store.onResize);
    store.onResize();

    store.button.addEventListener('click', store.openMenu);
    store.close.addEventListener('click', store.closeMenu);


    // Lang selector open/close:
    store.langSelectors.forEach(selector =>
    {
      window.removeEventListener('click', store.closeAllLangSelectors);
      window.addEventListener('click', store.closeAllLangSelectors);
      selector.addEventListener('click',
        () => requestAnimationFrame(() => selector.classList.toggle('is-open'))
      );
    });
  })
})
