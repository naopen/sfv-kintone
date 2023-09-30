(() => {
	'use strict';
	kintone.events.on('app.record.index.show', async (event) => {

		// ボタンを表示する画面であるかを判定する
		if (event.viewName !== "● 端末発送：重複確認")
			return;
		// ボタンがもし既に表示されていたら，何もしない
		if (document.getElementById("finds_duplicates_button") !== null)
			return;

		// 一覧の件数を取得
		const recordCount = event.records.length;

		// ボタンを作成
		const myIndexButton = document.createElement('button');
		myIndexButton.id = 'finds_duplicates_button';
		myIndexButton.innerHTML = '重複確認実行';
		myIndexButton.onclick = handleClick;
		myIndexButton.className = "kintoneplugin-button-normal";
		// 色を変える
		myIndexButton.style.backgroundColor = "#FFC0CB";
		myIndexButton.style.color = "#000000";

		const myProgressDiv_1 = document.createElement('div');
		myProgressDiv_1.id = "my_progress_container_1";
		myProgressDiv_1.style.width = '900px';
		myProgressDiv_1.style.height = '23.5px';
		myProgressDiv_1.style.margin = '0 0 0 0';

		const myProgressDiv_2 = document.createElement('div');
		myProgressDiv_2.id = "my_progress_container_2";
		myProgressDiv_2.style.width = '900px';
		myProgressDiv_2.style.height = '25.5px';
		myProgressDiv_2.style.margin = '0 0 0 0';


		// ボタンをヘッダメニューに追加
		kintone.app.getHeaderMenuSpaceElement().appendChild(myIndexButton);
		kintone.app.getHeaderMenuSpaceElement().appendChild(myProgressDiv_1);
		kintone.app.getHeaderMenuSpaceElement().appendChild(myProgressDiv_2);


		// 処理の進捗を示すプログレスバーを表示 (ProgressBar.jsを使用)
		const progressBar_1 = new ProgressBar.Line('#my_progress_container_1', {
			strokeWidth: 0.01, // プログレスバーの太さ
			easing: 'easeInOut', // プログレスバーの進み方
			duration: 100, // 0.1秒ごとに更新
			color: '#77d9a8',
			trailColor: '#eee', // プログレスバーの線の色
			trailWidth: 0.01,
			svgStyle: { width: '100%', height: '100%' },
			text: {
				style: {
					color: '#4D4D4D',
					position: 'relative',
					left: '750px',
					top: '-100px',
					padding: 0,
					margin: 0,
					transform: null
				},
				autoStyleContainer: false
			},
			from: { color: '#77d9a8' },
			to: { color: '#3399FF' },
			step: (state, bar) => {
				bar.path.setAttribute('stroke', state.color);
				bar.setText('Step1: 一覧レコードの取得　　' + Math.round(bar.value() * 100) + ' %');
			}
		});

		// 比較元クエリ
		// レコード一括取得 API を使い、リクエストパラメータの offset を指定して順次レコードを取得する
		// クエリ条件：ステータスが「契約書未発送」かつIMEIが空白と等しいかつ重複確認が「重複あり」にチェックが入っていないかつ作成日時が直近1ヶ月以内
		// 取得するフィールド：レコード番号($id)、契約番号(id)、契約者氏名(name)、電話番号(phone_number)
		// limit 500：取得するレコード数の上限を500件に設定
		let api_of_todayRecordsObject = {
			app: kintone.app.getId(),
			query: 'ステータス in ("契約書未発送") and imei = "" and 重複確認 not in ("重複あり") and 作成日時 >= LAST_MONTH() limit 500',
			fields: ['$id', 'id', 'name', 'phone_number'],
			totalCount: true
		};

		// 比較先クエリ
		// レコード一括取得 API を使い、リクエストパラメータの offset を指定して順次レコードを取得する
		// クエリ条件：重複確認が「重複あり」にチェックが入っていないかつ作成日時が直近1ヶ月以内
		// 取得するフィールド：レコード番号($id)、契約番号(id)、契約者氏名(name)、電話番号(phone_number)
		// limit 500：取得するレコード数の上限を500件に設定
		// let api_of_pastRecordsObject = {
		// 	app: kintone.app.getId(),
		// 	query: '重複確認 not in ("重複あり") and 作成日時 >= LAST_YEAR() limit 500',
		// 	fields: ['$id', 'id', 'name', 'phone_number'],
		// 	totalCount: true
		// };
		let api_of_pastRecordsObject = {
			app: kintone.app.getId(),
			query: '重複確認 not in ("重複あり") and 作成日時 >= LAST_MONTH() limit 500',
			fields: ['$id', 'id', 'name', 'phone_number'],
			totalCount: true
		};

		async function handleClick() {

			try {
				//処理中にページ移動しようとした場合に警告を表示する
				window.onbeforeunload = function (e) {
					return "このページを離れると処理が中断されます。";
				};

				// 比較元クエリを実行し、保存
				const todayRecordsObject = await kintone.api(kintone.api.url('/k/v1/records', true), 'GET', api_of_todayRecordsObject);
				let todayRecords = todayRecordsObject.records;
				const count_of_todayRecords = todayRecordsObject.totalCount;

				// 比較先クエリを実行し、保存
				const pastRecordsObject = await kintone.api(kintone.api.url('/k/v1/records', true), 'GET', api_of_pastRecordsObject);
				let pastRecords = pastRecordsObject.records;
				const count_of_pastRecords = pastRecordsObject.totalCount;

				// もしクエリの返り値のレコード数が500件より多い場合はループ処理を行い、全てのレコードを取得する
				if (count_of_todayRecords > 500 || count_of_pastRecords > 500) {
					console.log("500件より多いレコードがあります。");
					// offsetを初期化
					let offset_of_todayRecords = 0;
					let offset_of_pastRecords = 0;

					// 保存したレコードに501件以降を追加していく
					while (count_of_todayRecords > offset_of_todayRecords) {
						offset_of_todayRecords += 500;
						api_of_todayRecordsObject.query = 'ステータス in ("契約書未発送") and imei = "" and 重複確認 not in ("重複あり") and 作成日時 >= LAST_MONTH() limit 500 offset ' + offset_of_todayRecords;
						const temp_of_todayRecordsObject = await kintone.api(kintone.api.url('/k/v1/records', true), 'GET', api_of_todayRecordsObject);
						console.log(temp_of_todayRecordsObject);
						todayRecords.push(...temp_of_todayRecordsObject.records);
					}
					while (count_of_pastRecords > offset_of_pastRecords) {
						offset_of_pastRecords += 500;
						// console.log("offset: " + offset_of_pastRecords);
						api_of_pastRecordsObject.query = '重複確認 not in ("重複あり") and 作成日時 >= LAST_MONTH() limit 500 offset ' + offset_of_pastRecords;
						// console.log("api_of_pastRecordsObject: " + JSON.stringify(api_of_pastRecordsObject));
						const temp_of_pastRecordsObject = await kintone.api(kintone.api.url('/k/v1/records', true), 'GET', api_of_pastRecordsObject);
						// console.log("temp_of_pastRecordsObject: " + JSON.stringify(temp_of_pastRecordsObject));
						pastRecords.push(...temp_of_pastRecordsObject.records);
						// console.log("pastRecords: " + JSON.stringify(pastRecords));
					}
				}

				console.log("from_records:");
				console.log(todayRecords);
				console.log("to_records: ");
				console.log(pastRecords);
				console.log("from_totalCount: " + count_of_todayRecords);
				console.log("to_totalCount: " + count_of_pastRecords);

				// 比較元クエリの返り値のレコード数が0件の場合
				if (count_of_todayRecords === 0) {
					alert("重複確認対象のレコードが0件です。");
					return;
				}
				// 警告を表示
				if (!confirm(count_of_todayRecords + "件のレコードを直近1ヶ月のレコード " + count_of_pastRecords + "件と比較します。よろしいですか？")) {
					return;
				}

				// todayRecordsのレコード数分ループ処理を行う


			}
			catch (error) {
				console.log(error);
			}
			finally {
				// ページ移動時の警告を解除
				window.onbeforeunload = null;
			}
		}
	});
})();



