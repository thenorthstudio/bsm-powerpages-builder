window.addEventListener('load', () =>
{
  const html = document.querySelector('html');
  html.classList.remove('no-scroll');
    
  const moduleName = '.c-video';
  document.querySelectorAll(moduleName).forEach((root, i) =>
  {
    const store = {
      videoModal: root.querySelector('.video-modal'),
      playBtn: root.querySelector('button.video-opener'),
      modalBg: root.querySelector('.video-modal .background'),
      iframeWrap: root.querySelector('.iframe-wrap'),
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
        if (store.player && store.player.stopVideo)
        {
          store.player.stopVideo();
          store.player.destroy();
          store.player = null;
        }
      }
    };

    store.videoModal.classList.remove('is-visible');
    store.modalBg.addEventListener('click', store.onCloseModal);
    store.playBtn.addEventListener('click', store.onClickPlay);
  })
})
