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

          const event = {
            event: 'contact_form',
            contact_form_info: {
              contact_form_name: 'solicita información',
              // contact_form_id: '1234',
              contact_form_location: 'cta card programa',
              contact_form_step: 'pagina formulario',
              value: 1,
              ecommerce_timestamp_in_utc: new Date().toISOString(),
            },
            program_info: {
              program_id: programaId,
              program_name: b.dataset.programaTitle,
              program_area: b.dataset.programaArea,
            },
          };
          console.log(event);
          dataLayer.push(event);
          sessionStorage.setItem('program_info', JSON.stringify(event.program_info));
        });

        // Also save program info in session storage when field changes:
        field.addEventListener('change', (e) =>
        {
          const value = e.target.value;
          const selected = document.querySelector(
            'button[data-programa-id="' + value + '"]'
          );
          if (selected) sessionStorage.setItem('program_info', JSON.stringify({
            program_id: value,
            program_name: selected.dataset.programaTitle,
            program_area: selected.dataset.programaArea,
          }));
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
})
