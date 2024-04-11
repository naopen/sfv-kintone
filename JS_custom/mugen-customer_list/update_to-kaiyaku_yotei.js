(() => {
  "use strict";
  kintone.events.on("app.record.index.show", (event) => {
    // ステータス名
    const statusName = "AIR-U解約予定";
    const fieldCode = {
      // フィールドコード
      updatedStatus: "to_AIR_U解約予定",
    }

    if (event.viewName !== "（現在のステータス）▶▶" + statusName) {
      return;
    }

    if (document.getElementById("my_index_button") !== null) {
      return;
    }

    const myIndexButton = document.createElement("button");
    myIndexButton.id = "my_index_button";
    myIndexButton.innerText = "【" + statusName + "】にする";
    myIndexButton.className = "kintoneplugin-button-normal";

    function showInfo(title, message) {
      return new Promise((resolve, reject) => {
        Swal.fire({
          title: title,
          html: message,
          confirmButtonText: 'OK',
          confirmButtonColor: '#3498db',
          width: 'auto',
          heightAuto: true,
          showCancelButton: true,
          cancelButtonText: 'キャンセル',
          cancelButtonColor: '#d33',
          allowOutsideClick: false
        }).then((result) => {
          if (result.isConfirmed) {
            resolve(true);
          } else {
            reject(new Error("キャンセルが選択されました"));
          }
        }
        );
      });
    }

    function showSuccess(title, message) {
      return new Promise((resolve) => {
        Swal.fire({
          title: title,
          html: message,
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3498db',
          width: 'auto',
          heightAuto: true
        }).then((result) => {
          if (result.isConfirmed) {
            resolve(true);
          }
        });
      }
      );
    }

    function showAlert(title, message) {
      Swal.fire({
        title: title,
        html: message,
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3498db',
        width: 'auto',
        heightAuto: true
      });
    }

    // ボタンクリック時の処理
    myIndexButton.onclick = () => {
      javascript: (function () {
        // 更新前ステータスは指定しない
        const doAction = statusName + "にする",
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
        console.log("クエリ：" + getBody.query);
        kintone
          // レコード一覧取得
          .api(getUrl, "GET", getBody)
          // レコード一覧取得成功時の処理 
          .then(function (resp) {
            const ids = resp.records.map(function (record) {
              return record.$id.value;
            }),
              putBody = { app: kintone.app.getId(), records: [] };
            ids.forEach(function (id) {
              putBody.records.push({ id: id, action: condition.doAction });
            }),
              console.log(putBody);
            // もし件数が0件ならエラーを新しく投げる
            if (ids.length === 0) {
              throw new Error("ステータスを更新する端末がありません");
            }
            let title =
              ids.length +
              "台の端末の<br>ステータス更新をします。<br>よろしいですか？",
              message = "⚠注意！　同時実行最大数は100台です。⚠<hr><br>実行アクション：" + condition.doAction;
            // ステータス更新の確認処理
            showInfo(title, message).then(() => {
              return kintone.api(putUrl, "PUT", putBody);
            })
              // OKボタン押下でステータス更新を実行
              // ステータス更新成功時 (その1) 一括更新が成功したら、チェックボックスを外す
              .then(function (resp) {
                const putBody = {
                  app: kintone.app.getId(),
                  records: [],
                };
                resp.records.forEach(function (record) {
                  putBody.records.push({
                    id: record.id,
                    record: {
                      [fieldCode.updatedStatus]: {
                        value: [],
                      },
                    },
                  });
                });
                console.log(putBody);
                const putUrl = kintone.api.url("/k/v1/records", !0);
                return kintone.api(putUrl, "PUT", putBody);
              })
              // ステータス更新成功時 (その2) 成功メッセージを表示
              .then(function (resp) {
                console.log(resp);
                showSuccess("ステータスの一括更新が完了しました", "⚠注意！⚠　101台以上の端末がある場合は再度同じ操作を実行してください").then(() => {
                  window.location.reload();
                });
              })
              // ステータス更新失敗時の処理 一括更新が失敗したら、エラーメッセージを表示
              .catch(function (error) {
                console.log("ステータス更新失敗：" + error.message);
                showAlert(error.message, "処理を中断しました。");
              });
          })
          // レコード一覧取得失敗時の処理
          .catch(function (error) {
            console.log("レコード一覧取得失敗：" + error.message);
            showAlert(error.message, "処理を中断しました。");
          });
      })();
    };

    kintone.app.getHeaderMenuSpaceElement().appendChild(myIndexButton);
  });
})();
