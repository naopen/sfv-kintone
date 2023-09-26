(() => {
  "use strict";
  // チェックボックスのイベントを取得
  const cbEvents = [
    "app.record.create.change.imei_edit_enable",
    "app.record.edit.change.imei_edit_enable",
    "app.record.create.show",
    "app.record.edit.show",
  ];
  kintone.events.on(cbEvents, (event) => {
    const record = event.record;

    // チェックボックスの入力値チェック
    if (
      record.imei_edit_enable.value[0] ===
      "IMEIを編集する場合はチェックしてください"
    ) {
      // チェックなしの場合は"imei"を有効にする
      record.imei.disabled = false;
    } else {
      // チェックありの場合は"imei"を無効にする
      record.imei.disabled = true;
    }
    return event;
  });
})();
