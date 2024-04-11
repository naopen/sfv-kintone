(function () {
  "use strict";
  kintone.events.on(["app.record.edit.submit.success"], function (event) {
    // const nStatus = record.status.value;
    const text = "必要に応じてステータスを更新してください。";
    // if (nStatus === "顧客使用中") {
    //   text = "保存しました。検品完了後、ステータスを更新してください。";
    // }
    Swal.fire({
      icon: "success",
      position: "top-start",
      toast: true,
      title: "保存完了",
      text: text,
      showConfirmButton: false,
      timer: 3500,
      timerProgressBar: true,
      width: "36rem",
      footer:
        "※検品完了の場合：「検品完了、故障なし」or「検品完了、しかし故障あり」→「実行」",

      // }).then((result) => {
      //   if (result.isConfirmed == true) {
      //     window.location.href = "https://freedive.cybozu.com/k/84/";
      //   }
    });
  });
})();
