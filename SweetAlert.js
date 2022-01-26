
(function() {
  'use strict';

  kintone.events.on(['app.record.detail.show'], function(event) {

    var record = event.record;

    // レコード登録中の年齢をセット
    var existing_age = parseInt(record['age']['value'], 10);

    if (record['birthday']['value'] != null) {
      // 生年月日から年齢の計算
      // refer to https://msdn.microsoft.com/en-us/library/ie/ee532932%28v=vs.94%29.aspx
      var birthday = new Date(record['birthday']['value']);
      var today = new Date();
      var years = today.getFullYear() - birthday.getFullYear();
      birthday.setFullYear(today.getFullYear());
      if (today < birthday) {
        years--;
      }
      var real_age = years;

      // レコード登録中の年齢と計算した年齢が異なればレコードを更新
      if (existing_age !== real_age) {
        var params = {
          app: kintone.app.getId(),
          id: kintone.app.record.getId(),
          record: {
            age: {
              value: real_age
            }
          }
        };
        kintone.api(kintone.api.url('/k/v1/record', true), 'PUT', params, function(resp) {
          /* alert()を使った書き方
           *
           * alert('年齢を更新します。');
           * location.reload(true);
           *
           */

          // SweetAlertを使った書き方
          swal({
            title: '年齢を更新しました。',
            text: '画面をリロードします。',
            icon: 'success',
            button: 'OK'
          }).then(function() {
            // ダイアログクローズ後の処理
            location.reload(true);
          });
        }, function(resp) {
          // エラーの場合はメッセージを表示する
          var errmsg = 'レコード更新時にエラーが発生しました。';
          // レスポンスにエラーメッセージが含まれる場合はメッセージを表示する
          if (resp.message !== undefined) {
            errmsg += resp.message;
          }
          alert(errmsg);
        });
      }
    }
    return event;
  });
})();
