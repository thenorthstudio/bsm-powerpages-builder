const swapSwiperClass = (el, state) =>
{
    el.querySelectorAll('[data-swiper-class]').forEach(found =>
    {
        const swiperClass = found.dataset.swiperClass;
        found.classList[state? 'add' : 'remove'](swiperClass);
    })
};

/* window.addEventListener('load', () =>
{
    window.bsmModules = window.bsmModules || [];
    window.bsmModules.forEach(m =>
    {
        document.querySelectorAll(`.c-${m.name}`).forEach((el, i) =>
        {
            
        })
    });
})

function onModuleLoad(moduleName, loadCallback)
{
    window.bsmModules = window.bsmModules || {};
    if (!window.bsmModules[moduleName])
    {
        window.bsmModules[moduleName] = {
            init: false,
            loadCallback,
            data:
        }
    }
    if (!el.dataset['module-id'])
    {
        const id = window.bsmModules.length;
        el.dataset['module-id'] = id;
        el.setAttribute('module-id', id);
        window.bsmModules.push({
            id,
            el,
            loadCallback,
            data: {}
        });
    }
    console.log(window.bsmModules);
}
 */
