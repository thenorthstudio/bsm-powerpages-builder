window.addEventListener('load', () =>
{
  const moduleName = '.c-cards-de-programa';
  document.querySelectorAll(moduleName).forEach((root, i) =>
  {
    if (!root.classList.contains('has-swiper')) return;
        
    const swiperRoot = root.querySelector('.swiper');
    if (swiperRoot.swiper) swiperRoot.swiper.destroy();

    // swapSwiperClass(root, true);
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
