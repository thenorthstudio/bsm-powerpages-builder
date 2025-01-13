window.addEventListener('load', () =>
{
  const moduleName = 'nav.c-menu';
  document.querySelectorAll(moduleName).forEach((root, i) =>
  {
    const store = {
      langSelectors: document.querySelectorAll('.c-lang-selector'),
      button: root.querySelector('.menu-button'),
      wrap: root.querySelector('.menu-wrap'),
      formButton: root.querySelector('.form-button-div'),
      close: root.querySelector('.menu-close'),
      calculatingFreeSpace: false,
      onClickFormButton: () =>
      {
        if (document.querySelector('main.in-builder')) return;
        const form = document.querySelector('.c-module.c-formulario');
        if (form) form.scrollIntoView(true);
        const event = {
          event: 'contact_form',
          contact_form_info: {
            contact_form_name: 'solicita información',
            // contact_form_id: '1234',
            contact_form_location: 'cta sticky',
            contact_form_step: 'pagina formulario',
            value: 1,
            ecommerce_timestamp_in_utc: new Date().toISOString(),
          },
          // program_info: {
          //   program_id: '30',
          //   program_name: '015000',
          //   program_area: 'executive MBA',
          // },
        };
        console.log(event);
        dataLayer.push(event);
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
        if (store.calculatingFreeSpace) return;
        else store.calculatingFreeSpace = true;

        root.classList.remove('has-menu');
        root.classList.remove('has-floating-button');
        const calculateBurgerButton = () =>
        {
          const spacer = root.querySelector('.flex-space');
          let freeSpace = spacer.scrollWidth;
          const hasMenu = freeSpace < 20;
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
          store.calculatingFreeSpace = false;
        }
        requestAnimationFrame(() =>
        {
          const spacer = root.querySelector('.flex-space');
          let freeSpace = spacer.scrollWidth;
          if (store.formButton && freeSpace < 20)
          {
            // Take button into account to determine if it should be floating:
            root.classList.add('has-floating-button');
            requestAnimationFrame(() => calculateBurgerButton());
            return;
          }
          calculateBurgerButton();
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

    // Hide lang selectors on TYP:
    const isTYP = document.querySelector('section.c-thank-you');
    if (isTYP) store.langSelectors.forEach(selector => selector.style.display = 'none');
    // Lang selector open/close:
    else store.langSelectors.forEach(selector =>
    {
      window.removeEventListener('click', store.closeAllLangSelectors);
      window.addEventListener('click', store.closeAllLangSelectors);

      selector.addEventListener('click',
        () => requestAnimationFrame(() => selector.classList.toggle('is-open'))
      );
    });
  })
})
