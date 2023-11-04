(() => {
  "use strict";
  kintone.events.on("app.record.index.show", (event) => {
    if (event.viewName !== "（何か）▶▶AIR-U解約予定") {
      return;
    }

    if (document.getElementById("my_index_button") !== null) {
      return;
    }

    const myIndexButton = document.createElement("button");
    myIndexButton.id = "my_index_button";
    myIndexButton.innerText = "【AIR-U解約予定】にする";
    myIndexButton.className = "kintoneplugin-button-normal";

    // ボタンクリック時の処理
    myIndexButton.onclick = () => {
      javascript: (function () {
        // 更新前ステータスは指定しない
        const doAction = "AIR-U解約予定にする",
          // fromStatus = "在庫端末",
          // condition = { fromStatus: fromStatus, doAction: doAction },
          condition = { doAction: doAction },
          getUrl = kintone.api.url("/k/v1/records", !0),
          putUrl = kintone.api.url("/k/v1/records/status", !0);
        let currentQuery = kintone.app.getQueryCondition();
        // currentQuery != "" && (currentQuery += " and ");
        const getBody = {
          app: kintone.app.getId(),
          fields: ["$id"],
          query:
            currentQuery +
            'limit 100',
        };
        // デバッグ用にqueryを出力
        console.log(getBody.query);
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
              // "\n　現在のステータス：" +
              // condition.fromStatus),
              "\n　現在のステータス：" +
              condition.fromStatus),
              (message += "\n　実行アクション：" + condition.doAction);
            const result = window.confirm(message);
            return result ? kintone.api(putUrl, "PUT", putBody) : reject();
          })
          .then(function (resp) {
            // ステータス更新後の処理
            // 処理はステータス更新した全てのレコードに対して行う
            // Before: チェックボックス「（何か）→ AIR-U解約予定」の「実行する」チェックが入っている
            // After: チェックボックス「（何か）→ AIR-U解約予定」の「実行する」チェックが外れている
            const putBody = {
              app: kintone.app.getId(),
              records: [],
            };
            resp.records.forEach(function (record) {
              putBody.records.push({
                id: record.id,
                record: {
                  "to_AIR_U解約予定": {
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
            // エラー内容を表示
            console.log(error), alert(error.message);
            alert("処理を中断しました。");
          });
      })();
    };

    kintone.app.getHeaderMenuSpaceElement().appendChild(myIndexButton);
  });
})();
