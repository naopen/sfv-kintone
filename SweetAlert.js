(function () {
  "use strict";
  kintone.events.on(["portal.show"], function (event) {
    let timerInterval;
    Swal.fire({
      icon: "question",
      imageUrl: "https://mugen-wifi.com/osushi.jpg",
      imageWidth: 400,
      imageHeight: 300,
      imageAlt: "OSUSHI image",
      title: "<strong><u>共有事項確認OK?</u></strong>",
      text: "I will close in 10 sec.",
      padding: "3rem",

      // html: '<a href="https://freedive.cybozu.com/k/84/"><strong><font color="orangered">クリック</font></strong></a>',
      footer:
        "SYSTEM Developed by KANNAN",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "確認アプリを開く",
      cancelButtonText: "キャンセル",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      timer: 12000,
      timerProgressBar: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      reverseButtons: true,

      // didOpen: () => {
      // 	Swal.showLoading()
      // 	const b = Swal.getHtmlContainer().querySelector('b')
      // 	timerInterval = setInterval(() => {
      // 	b.textContent = Swal.getTimerLeft()
      // 	}, 10)
      // },
      // willClose: () => {
      // 	clearInterval(timerInterval)
      // }
    }).then((result) => {
      if (result.isConfirmed == true) {
        window.location.href = "https://freedive.cybozu.com/k/84/";
      }

      /* Read more about handling dismissals below */
      // if (result.dismiss === Swal.DismissReason.timer) {
      // 	console.log('I was closed by the timer')
      // }
    });
  });
})();
