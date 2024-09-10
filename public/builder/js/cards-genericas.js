window.addEventListener('load', () =>
{
  const html = document.querySelector('html');
  html.classList.remove('no-scroll');
    
  const moduleName = '.c-cards-genericas';
  document.querySelectorAll(moduleName).forEach((root, i) =>
  {
    // Video:
    if (root.querySelector('.video-opener'))
    {
      const store = useState(root, {
        onClickPlay: () =>
        {
          html.classList.add('no-scroll');
          store.videoModal.classList.add('is-visible');
          store.player = new YT.Player(store.iframeWrap, {
            videoId: store.playBtn.dataset.vid,
            playerVars: {
              'playsinline': 1,
              'controls': 1,
              'enablejsapi': 1,
              'autoplay': 1,
            },
          });
        },
        onCloseModal: () =>
        {
          store.videoModal.classList.remove('is-visible');
          html.classList.remove('no-scroll');
          store.player.stopVideo();
          store.player.destroy();
          store.player = null;
        }
      });
      store.videoModal = root.querySelector('.video-modal');
      store.videoModal.classList.remove('is-visible');
    
      const modalBg = root.querySelector('.video-modal .background');
      modalBg.removeEventListener('click', store.onCloseModal);
      modalBg.addEventListener('click', store.onCloseModal);
    
      store.playBtn = root.querySelector('button.video-opener');
      store.playBtn.removeEventListener('click', store.onClickPlay);
      store.playBtn.addEventListener('click', store.onClickPlay);
            
      store.iframeWrap = root.querySelector('.iframe-wrap');
    }
        
        
    // Swiper:
    if (root.classList.contains('has-swiper'))
    {
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
    }
  })
})
