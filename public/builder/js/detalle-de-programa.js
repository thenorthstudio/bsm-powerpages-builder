window.addEventListener('load', () =>
{
  const moduleName = '.c-detalle-de-programa';
  document.querySelectorAll(moduleName).forEach((root, i) =>
  {
    const swiperRoot = root.querySelector('.swiper');
    if (swiperRoot.swiper) swiperRoot.swiper.destroy();

    new Swiper(swiperRoot, {
      slidesPerView: 'auto',
      spaceBetween: 0,
      breakpoints: {
        1024: { spaceBetween: 24 }
      },
      freeMode: {
        sticky: true,
        enabled: true,
        momentumBounce: false,
        momentumBounceRatio: 0,
        momentumRatio: 0.5
      }
    })
  })
})
