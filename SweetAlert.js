(function() {
	'use strict';
	kintone.events.on(['portal.show'], function(event) {
		// SweetAlertを使った書き方
		swal({
		title: 'テスト',
		text: 'これはテスト通知です。',
		icon: 'success',
		button: 'OK'
		}).then(function() {
		// ダイアログクローズ後の処理
		// location.reload(true);
		});
	});
})();
