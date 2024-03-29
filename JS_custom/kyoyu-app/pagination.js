(function () {
	"use strict";
	kintone.events.on('app.record.detail.show', function () {

		// 前のレコードに移動するボタンを作成
		const previousButton = document.createElement('button');
		previousButton.id = 'previous_button';
		previousButton.innerText = '前のレコード';
		previousButton.className = 'kintoneplugin-button-normal';
		// 色を変える
		previousButton.style.backgroundColor = "#C4C6FF ";
		previousButton.style.color = "#4D4D4D";

		// 次のレコードに移動するボタンを作成
		const nextButton = document.createElement('button');
		nextButton.id = 'next_button';
		nextButton.innerText = '次のレコード';
		nextButton.className = 'kintoneplugin-button-normal';
		// 色を変える
		nextButton.style.backgroundColor = "#ABFCD1 ";
		nextButton.style.color = "#4D4D4D";

		// ボタンを表示する場所を取得
		const headerSpace = kintone.app.record.getHeaderMenuSpaceElement();
		// ボタンを表示する
		headerSpace.appendChild(previousButton);
		headerSpace.appendChild(nextButton);

		// previousボタンクリック時の処理
		previousButton.addEventListener("click", async () => {
			// レコード番号を取得
			const recordNum = kintone.app.record.getId();
			// レコード番号を数値に変換
			const recordNumInt = parseInt(recordNum, 10);
			// レコード番号を1減らす
			const previousRecordNum = recordNumInt - 1;
			// レコード番号を文字列に変換
			const previousRecordNumStr = previousRecordNum.toString();
			console.log(previousRecordNumStr);

			// レコード詳細画面に遷移
			kintone.api(
				kintone.api.url('/k/v1/record', true),
				'GET',
				{ app: kintone.app.getId(), id: previousRecordNumStr },
				function (resp) {
					console.log(resp);
					window.location.href = 'https://freedive.cybozu.com/k/' + kintone.app.getId() + '/show#record=' + previousRecordNumStr;
				},
				function (error) {
					console.log(error);
				}
			);
		});

		// nextボタンクリック時の処理
		nextButton.addEventListener("click", async () => {
			// レコード番号を取得
			const recordNum = kintone.app.record.getId();
			// レコード番号を数値に変換
			const recordNumInt = parseInt(recordNum, 10);
			// レコード番号を1増やす
			const nextRecordNum = recordNumInt + 1;
			// レコード番号を文字列に変換
			const nextRecordNumStr = nextRecordNum.toString();
			// レコード詳細画面に遷移
			kintone.api(
				kintone.api.url('/k/v1/record', true),
				'GET',
				{ app: kintone.app.getId(), id: nextRecordNumStr },
				function (resp) {
					console.log(resp);
					window.location.href = 'https://freedive.cybozu.com/k/' + kintone.app.getId() + '/show#record=' + nextRecordNumStr;
				},
				function (error) {
					console.log(error);
				}
			);
		});
	});
})();
