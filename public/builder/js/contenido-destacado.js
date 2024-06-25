window.addEventListener('load', () =>
{
    const moduleName = '.c-contenido-destacado';
    document.querySelectorAll(moduleName).forEach((root, i) =>
    {
        if (!root.classList.contains('has-swiper')) return;
        
        const swiperRoot = root.querySelector('.swiper');
        if (swiperRoot.swiper) swiperRoot.swiper.destroy();

        new Swiper(swiperRoot, {
            slidesPerView: 'auto',
            spaceBetween: window.innerWidth <= 960? 24 : 32,
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
