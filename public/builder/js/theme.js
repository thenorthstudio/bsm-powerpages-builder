const swapSwiperClass = (el, state) =>
{
    el.querySelectorAll('[data-swiper-class]').forEach(found =>
    {
        const swiperClass = found.dataset.swiperClass;
        found.classList[state? 'add' : 'remove'](swiperClass);
    })
};
