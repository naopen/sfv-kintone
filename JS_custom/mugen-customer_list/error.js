(function () {
  "use strict";

  kintone.events.on(
    ["app.record.create.submit", "app.record.edit.submit"],
    function (event) {
      var record = event.record;

      // テストボックスにAが含まれている かつ 店名が未入力の時
      if (
        record.端末の居場所.value === "戻り端末検品完了" &&
        record.返送確認.value.indexOf("返却済(解約)") === -1 &&
        record.返送確認.value.indexOf("返却済(故障交換)") === -1
      ) {
        record.返送確認.error =
          "検品完了した場合、返却済(解約)と返却済(故障交換)のどちらかは必須項目です。";
      }

      if (
        (record.返送確認.value.indexOf("返却済(解約)") !== -1 ||
          record.返送確認.value.indexOf("返却済(故障交換)") !== -1) &&
        record.端末の居場所.value !== "戻り端末検品完了"
      ) {
        record.端末の居場所.error =
          "【戻り端末検品完了】にするか返送確認を空欄にして下さい。";
      }
      if (
        record.返送確認.value.indexOf("返却済(解約)") !== -1 &&
        record.返送確認.value.indexOf("返却済(故障交換)") !== -1 &&
        record.端末の居場所.value === "戻り端末検品完了"
      ) {
        record.返送確認.error = "返送確認は1つだけ選択して下さい。";
      }

      return event;
    }
  );
})();
