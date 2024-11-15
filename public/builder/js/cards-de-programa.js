window.addEventListener('load', () =>
{
  const moduleName = '.c-cards-de-programa';
  document.querySelectorAll(moduleName).forEach((root, i) =>
  {
    /* Cards to form */
    const forms = document.querySelectorAll('.c-form');
    if (forms.length)
    {
      const targetForm = forms[forms.length - 1];
      const field = targetForm.querySelector('select[id="alg_programadeinteres"]');
      if (field) root.querySelectorAll('button[data-programa-id]').forEach(b =>
      {
        const anchor = targetForm.closest('header, section');
        const programaId = b.dataset.programaId;
        b.addEventListener('click', () =>
        {
          field.value = programaId;
          field.setAttribute('value', programaId);
          field.dispatchEvent(new Event('change', { target: field }));
          if (anchor) window.scrollTo({
            top: anchor.offsetTop,
            left: 0,
            behavior: 'smooth',
          });
        });
      });
    }

    /* Swiper */
    if (!root.classList.contains('has-swiper')) return;

    const swiperRoot = root.querySelector('.swiper');
    if (swiperRoot.swiper) swiperRoot.swiper.destroy();

    new Swiper(swiperRoot, {
      slidesPerView: 'auto',
      spaceBetween: 24,
      freeMode: {
        sticky: true,
        enabled: true,
        momentumBounce: false,
        momentumBounceRatio: 0,
        momentumRatio: 0.5
      },
      navigation: {
        prevEl: root.querySelector('.c-swiper-arrows .arrow.prev'),
        nextEl: root.querySelector('.c-swiper-arrows .arrow.next'),
      }
    })
  })

  // Filter form program options:
  const ids = [];
  document.querySelectorAll(moduleName).forEach((root, i) =>
  {
    root.querySelectorAll('button[data-programa-id]').forEach(b =>
    {
      if (!ids.includes(b.dataset.programaId))
        ids.push(b.dataset.programaId);
    });
  });
  const forms = document.querySelectorAll('.c-form');
  if (forms.length)
  {
    const targetForm = forms[forms.length - 1];
    const options = targetForm.querySelectorAll(
      'select[id="alg_programadeinteres"] option:not([selected])'
    );
    options.forEach(o =>
    {
      if (!ids.includes(o.value))
        o.style.display = 'none';
    });
  }
})
