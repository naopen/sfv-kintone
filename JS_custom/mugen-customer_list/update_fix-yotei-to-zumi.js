(() => {
  "use strict";
  kintone.events.on("app.record.index.show", (event) => {
    if (event.viewName !== "AIR-U修理予定▶▶AIR-U解約済") {
      return;
    }

    if (document.getElementById("my_index_button") !== null) {
      return;
    }

    const myIndexButton = document.createElement("button");
    myIndexButton.id = "my_index_button";
    myIndexButton.innerText = "【AIR-U修理予定】 ▶▶▶ 【AIR-U解約済】";
    myIndexButton.className = "kintoneplugin-button-normal";

    // ボタンクリック時の処理
    myIndexButton.onclick = () => {
      javascript: (function () {
        const fromStatus = "AIR-U修理予定",
          doAction = "AIR-U解約済にする",
          condition = { fromStatus: fromStatus, doAction: doAction },
          getUrl = kintone.api.url("/k/v1/records", !0),
          putUrl = kintone.api.url("/k/v1/records/status", !0);
        let currentQuery = kintone.app.getQueryCondition();
        currentQuery != "" && (currentQuery += " and ");
        const getBody = {
          app: kintone.app.getId(),
          fields: ["$id"],
          query:
            currentQuery +
            'ステータス = "' +
            condition.fromStatus +
            '" limit 100',
        };
        kintone
          .api(getUrl, "GET", getBody)
          .then(function (resp) {
            const ids = resp.records.map(function (record) {
              return record.$id.value;
            }),
              putBody = { app: kintone.app.getId(), records: [] };
            ids.forEach(function (id) {
              putBody.records.push({ id: id, action: condition.doAction });
            }),
              console.log(putBody);
            let message =
              "　　　　＊ " +
              ids.length +
              "台＊\n\nの端末のステータス更新をします。よろしいですか？\n\n⚠注意！　同時実行最大数は100台です。⚠\n⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤\n";
            (message +=
              myIndexButton.innerText +
              "\n　現在のステータス：" +
              condition.fromStatus),
              (message += "\n　実行アクション：" + condition.doAction);
            const result = window.confirm(message);
            return result ? kintone.api(putUrl, "PUT", putBody) : reject();
          })
          .then(function (resp) {
            // ステータス更新後の処理
            // 処理はステータス更新した全てのレコードに対して行う
            const putBody = {
              app: kintone.app.getId(),
              records: [],
            };
            resp.records.forEach(function (record) {
              putBody.records.push({
                id: record.id,
                record: {
                  "AIR_U修理予定_AIR_U解約済": {
                    value: [],
                  },
                },
              });
            });
            console.log(putBody);
            const putUrl = kintone.api.url("/k/v1/records", !0);
            return kintone.api(putUrl, "PUT", putBody);
          })
          .then(function (resp) {
            console.log(resp),
              alert(
                "ステータスの一括更新が完了しました\n\n⚠注意！⚠　101台以上の端末がある場合は再度同じ操作を実行してください"
              ),
              window.location.reload();
          })
          .catch(function (error) {
            console.log(error), alert("処理を中断しました。");
          });
      })();
    };

    kintone.app.getHeaderMenuSpaceElement().appendChild(myIndexButton);
  });
})();
