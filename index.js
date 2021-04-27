if (navigator.serviceWorker) {
  let image = document.createElement('img');
  image.src = './baidu.png';
  document.body.appendChild(image);
  //
  navigator.serviceWorker
    .register('./sw.js')
    .then((registration) => {
      console.log('注册成功');
      let serviceWorker;
      if (registration.installing) {
        serviceWorker = registration.installing;
        console.log('当前状态为 installing: ', serviceWorker);
      } else if (registration.waiting) {
        serviceWorker = registration.waiting;
        console.log('当前状态为 waiting: ', serviceWorker);
      } else if (registration.active) {
        serviceWorker = registration.active;
        console.log('当前状态为 active: ', serviceWorker);
      } else if (registration.activing) {
        serviceWorker = registration.activing;
        console.log('当前状态为 activing: ', serviceWorker);
      }

      //   registration.onupdatefound = function () {
      //     alert('serviceWorker有更新');
      //   };

      if (serviceWorker) {
        serviceWorker.addEventListener('statechange', (e) => {
          console.log('当前状态变化为: ', e.target.state);
        });
      }
    })
    .catch((err) => {
      console.log('注册失败: ', err);
    });

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    // window.location.reload();
    console.log('serviceWorker有更新');
  });
}
