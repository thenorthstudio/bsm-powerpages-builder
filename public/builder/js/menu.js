window.addEventListener('load', () =>
{
  const moduleName = 'nav.c-menu';
  document.querySelectorAll(moduleName).forEach((root, i) =>
  {
    const store = {
      langSelectors: document.querySelectorAll('.c-lang-selector'),
      button: root.querySelector('.menu-button'),
      wrap: root.querySelector('.menu-wrap:not(.permanent)'),
      formButton: root.querySelector('.form-button-div'),
      close: root.querySelector('.menu-close'),
      onClickFormButton: () =>
      {
        const form = document.querySelector('.c-module.c-formulario');
        if (form) form.scrollIntoView(true);
      },
      onScroll: () =>
      {
        const form = document.querySelector('.c-module.c-formulario');
        if (!form) return;

        const posY = form.getBoundingClientRect().top + 80 + 80 + 98 + 40;
        const inView = posY < window.innerHeight;
        store.formButton.classList.toggle('is-visible', inView);
      },
      onResize: () =>
      {
        root.classList.toggle('has-menu', false);
        requestAnimationFrame(() =>
        {
          const measure = root.querySelector('.flex-space');
          const hasMenu = measure.scrollWidth < 20;
          root.classList.toggle('has-menu', hasMenu);
          store.langSelectors.forEach(selector =>
          {
            const floater = selector.querySelector('.floater');
            if (floater && floater.closest('nav.c-menu'))
            {
              floater.classList.toggle('from-top', !hasMenu);
              floater.classList.toggle('from-bottom', hasMenu);
            }
          });
        })
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

    if (store.formButton)
    {
      store.formButton.removeEventListener('click', store.onClickFormButton);
      store.formButton.addEventListener('click', store.onClickFormButton);
      window.removeEventListener('scroll', store.onScroll);
      window.addEventListener('scroll', store.onScroll);
      store.onScroll();
    }

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
