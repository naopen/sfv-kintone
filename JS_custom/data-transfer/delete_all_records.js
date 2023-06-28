(function () {
	"use strict";
	kintone.events.on('app.record.index.show', function (event) {

		// ボタンを表示する画面であるかを判定する
		if (event.viewName !== "● [レコード一括削除用] 解約済顧客")
			return;
		// ボタンがもし既に表示されていたら，何もしない
		if (document.getElementById('delete_button') !== null)
			return;

		// ボタンを作成
		var myIndexButton = document.createElement('button');
		myIndexButton.id = 'delete_button';
		myIndexButton.innerText = 'レコード一括削除';
		myIndexButton.className = 'kintoneplugin-button-normal';
		// 色を変える
		myIndexButton.style.backgroundColor = "#ff4b00";
		myIndexButton.style.color = "#ffffff";

		let recordsLength = event.records.length;

		// ボタンクリック時の処理
		myIndexButton.addEventListener("click", async (event) => {
			// 警告
			if (!confirm('一覧のレコードを全件削除します。削除する件数は' + recordsLength + '件です。よろしいですか？'))
				return;
			// 再度警告
			else if (!confirm('本当に' + recordsLength + '件のレコードを削除しますか？'))
				return;
			// 最終警告
			else if (!confirm('本当に' + recordsLength + '件のレコードを削除しますか？\n\nこの操作は取り消せません。\n\nよろしいですか？'))
				return;

			//1.getAllRecordsをつかって対象のものを全件取得
			const client = new KintoneRestAPIClient();
			const appId = kintone.app.getId();
			const res = await client.record.getAllRecords({ app: appId });
			const obj = kintone.app.record.get();
			const tblRecords = [];

			//2.1で取得したレコードからレコード番号だけとりだし配列化する     
			// 取得レコードのレコード番号
			const targetRecords = res.map((r) => {  //  idだけ抽出(mapは、ある配列から新しい配列を作る機能です）
				return {
					id: r.$id.value,
				};
			});

			console.log(targetRecords);

			//3.deleteAllRecordsを使って（2で抽出したIDをパラメータに渡し）、全件削除
			//レコード削除
			const res_dell = await client.record.deleteAllRecords({
				app: appId,
				records: targetRecords,
			});

			//アラート
			alert(recordsLength + '件のレコードを削除しました。');
			//リロード
			location.reload();

		});

		kintone.app.getHeaderMenuSpaceElement().appendChild(myIndexButton);
	});
})();
