window.addEventListener('load', () =>
{
    const moduleName = '.c-cards-de-programa';
    document.querySelectorAll(moduleName).forEach((root, i) =>
    {
        const grid = root.querySelector('.program-grid');
        if (grid.classList.contains('has-2-items') ||
            grid.classList.contains('has-1-items')
        ) {
            return;
        }
        const swiperRoot = root.querySelector('.swiper');
        if (swiperRoot.swiper) swiperRoot.swiper.destroy();

        swapSwiperClass(root, true);
        new Swiper(swiperRoot, {
            slidesPerView: 'auto',
            spaceBetween: 24,
            freeMode: {
                enabled: true,
                momentumBounce: false,
                momentumBounceRatio: 0,
                momentumRatio: 0.5
            },
            navigation: {
                prevEl: root.querySelector('.c-swiper-arrows .arrow-prev'),
                nextEl: root.querySelector('.c-swiper-arrows .arrow-next'),
            }
        })
    })
})
