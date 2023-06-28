(() => {
	'use strict';
	kintone.events.on('app.record.index.show', (event) => {

		// ボタンを表示する画面であるかを判定する
		if (event.viewName === "○ [コメントDL用] 解約済顧客")
			return;
		if (event.viewName === "○ [デバッグ用] 解約済顧客")
			return;
		if (event.viewName === "● [レコード一括削除用] 解約済顧客")
			return;
		// ボタンがもし既に表示されていたら，何もしない
		if (document.getElementById("today_button") !== null)
			return;

		// ボタンをクリックした時に実行する関数
		function handleClick() {
			if (!event.size) {
				alert('レコードがありません');
				return;
			}
			// フィールドコードtoday_for_b2のみ表示
			const records = event.records;
			console.log(records);

			// 今日の日付を取得
			const today = new Date().toISOString().substring(0, 10);
			console.log(today);

			// 実行確認ダイアログを表示
			const totalCount = event.records.length;
			if (!window.confirm(`   ＊ ${totalCount}件 ＊  のレコードに\n\n【${today}】 と入力します。よろしいですか？`))
				return;

			// eventのrecordsのtoday_for_b2のvalueをtodayに書き換える
			const updateRecords = [];
			for (let i = 0; i < records.length; i++) {
				updateRecords[i] = {
					"id": records[i].$id.value,
					"record": {
						"today_for_b2": {
							"value": today
						}
					}
				};
			}


			// 更新処理を実行
			if (records.length > 0) {
				const requestBody = {
					"app": kintone.app.getId(),
					"records": updateRecords
				};
				console.log(requestBody);
				kintone.api(kintone.api.url('/k/v1/records.json', true), 'PUT', requestBody, (resp) => {
					alert(`${resp.records.length}件のレコードが更新されました`);
					location.reload();
				}, (error) => {
					alert(`エラーが発生しました: ${error.message}`);
				});
			} else {
				alert('更新するレコードがありません');
			}
		}


		// ボタンを作成
		const myIndexButton = document.createElement('button');
		myIndexButton.id = 'today_button';
		myIndexButton.innerHTML = '今日の日付を入力';
		myIndexButton.onclick = handleClick;
		myIndexButton.className = "kintoneplugin-button-normal";
		// 色を変える
		myIndexButton.style.backgroundColor = "#FFC0CB";
		myIndexButton.style.color = "#000000";

		// ボタンをヘッダメニューに追加
		kintone.app.getHeaderMenuSpaceElement().appendChild(myIndexButton);
	});
})();
