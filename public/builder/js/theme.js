const swapSwiperClass = (el, state) =>
{
    el.querySelectorAll('[data-swiper-class]').forEach(found =>
    {
        const swiperClass = found.dataset.swiperClass;
        found.classList[state? 'add' : 'remove'](swiperClass);
    })
};


const useState = (moduleEl, defaultObj) =>
{
    const id = 'bsm-module-' + moduleEl.dataset.id;
    window[id] = window[id] || defaultObj || {};
    return window[id];
}
