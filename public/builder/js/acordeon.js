window.addEventListener('load', () =>
{
    const moduleName = '.c-acordeon';
    document.querySelectorAll(moduleName).forEach((root, i) =>
    {
        const store = useState(root, {
            toggleFoldable: (f, state) =>
            {
                store.foldables.forEach(f2 =>
                {
                    f2.querySelector('.body').style.maxHeight = '0px';
                    f2.classList.remove('is-open');
                });
                if (state)
                {
                    f.classList.add('is-open');
                    const body = f.querySelector('.body');
                    const bodyH = body.scrollHeight;
                    const duration = bodyH / 500;
    
                    body.style.maxHeight = bodyH + 'px';
                    body.style.transitionDuration = duration + 'px';
                }
                if (root.classList.contains('has-tabs')) {
                    store.viewportWrap.style.maxHeight = null;
                }
            },
            onClickFoldable: (e) =>
            {
                const f = e.currentTarget.parentElement;
                store.toggleFoldable(f, !f.classList.contains('is-open'));
            },

            goToTab: (index) =>
            {
                store.tabs.forEach(tab => {
                    tab.classList.remove('is-current');
                });
                store.viewports.forEach(v => {
                    v.classList.remove('is-current');
                });

                const tab = store.tabs.find(t => t.dataset.index == index);
                const view = store.viewports.find(v => v.dataset.index == index);
                const viewH = view.scrollHeight;

                tab.classList.add('is-current');
                view.classList.add('is-current');
                store.viewportWrap.style.maxHeight = viewH + 'px';
            },
            onClickTab: (e) =>
            {
                const tab = e.currentTarget;
                store.goToTab(tab.dataset.index);
            }
        });


        // Foldable click logic:
        store.foldables = root.querySelectorAll('.foldable');
        store.foldables.forEach(f =>
        {
            const head = f.querySelector('button.head');
            head.removeEventListener('click', store.onClickFoldable);
            head.addEventListener('click', store.onClickFoldable);
        })
        if (root.classList.contains('has-tabs'))
        {
            // Tab navigation:
            const swiperRoot = root.querySelector('.swiper');
            if (swiperRoot.swiper) swiperRoot.swiper.destroy();
    
            new Swiper(swiperRoot, {
                slidesPerView: 'auto',
                spaceBetween: 0,
                freeMode: {
                    sticky: true,
                    enabled: true,
                    momentumBounce: false,
                    momentumBounceRatio: 0,
                    momentumRatio: 0.5
                }
            })


            // Tab click logic:
            store.tabs = [...root.querySelectorAll('.tab-wrap .tab')];
            store.viewportWrap = root.querySelector('.viewport-wrap');
            store.viewports = [...root.querySelectorAll('.viewport')];
            store.tabs.forEach(tab =>
            {
                tab.removeEventListener('click', store.onClickTab);
                tab.addEventListener('click', store.onClickTab);
            })
        }
        store.toggleFoldable(store.foldables[0], true);
    })
})
