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
		const from_compare = {
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
		const to_compare = {
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
				const from_response = await kintone.api(kintone.api.url('/k/v1/records', true), 'GET', from_compare);
				const from_records = from_response.records;
				const from_totalCount = from_response.totalCount;

				// 比較先クエリを実行し、保存
				const to_response = await kintone.api(kintone.api.url('/k/v1/records', true), 'GET', to_compare);
				const to_records = to_response.records;
				const to_totalCount = to_response.totalCount;

				console.log("from_records:");
				console.log("to_records: ");
				console.log(from_records);
				console.log(to_records);
				console.log("from_totalCount: " + from_totalCount);
				console.log("to_totalCount: " + to_totalCount);



				// もしクエリの返り値のレコード数が500件より多い場合はループ処理を行い、全てのレコードを取得する
				if (from_totalCount > 500 || to_totalCount > 500) {
					console.log("500件より多いレコードがあります。");
					// offsetを初期化
					let fromOffset = 0;
					let toOffset = 0;

					// 保存したレコードに501件以降を追加していく
					while (from_totalCount > from_records.length) {
						fromOffset += 500;
						from_compare.query = 'ステータス in ("契約書未発送") and imei = "" and 重複確認 not in ("重複あり") and 作成日時 >= LAST_MONTH() limit 500 offset ' + fromOffset;
						const from_response_2 = await kintone.api(kintone.api.url('/k/v1/records', true), 'GET', from_compare);
						console.log(from_response_2);
						from_records.push(...from_response_2.records);
					}
					while (to_totalCount > to_records.length) {
						toOffset += 500;
						to_compare.query = '重複確認 not in ("重複あり") and 作成日時 >= LAST_MONTH() limit 500 offset ' + toOffset;
						const to_response_2 = await kintone.api(kintone.api.url('/k/v1/records', true), 'GET', to_compare);
						console.log(to_response_2);
						to_records.push(...to_response_2.records);
					}
				}

				console.log("from_records:");
				console.log("to_records: ");
				console.log(from_records);
				console.log(to_records);
				console.log("from_totalCount: " + from_totalCount);
				console.log("to_totalCount: " + to_totalCount);


				// 比較元クエリの返り値のレコード数が0件の場合
				if (from_totalCount === 0) {
					alert("重複確認対象のレコードが0件です。");
					return;
				}
				// 警告を表示
				if (!confirm(from_totalCount + "件のレコードを直近1ヶ月のレコード " + to_totalCount + "件と比較します。よろしいですか？")) {
					return;
				}



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



