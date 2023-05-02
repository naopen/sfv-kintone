(() => {
	'use strict';
	kintone.events.on('app.record.index.show', async (event) => {

		// ボタンを表示する画面であるかを判定する
		if (event.viewName !== "[一括削除用] 解約済顧客")
			return;
		// ボタンがもし既に表示されていたら，何もしない
		if (document.getElementById("delete_button") !== null)
			return;

		// ボタンを作成
		const myIndexButton = document.createElement('button');
		myIndexButton.id = 'delete_button';
		myIndexButton.innerHTML = 'ダウンロード実行';
		myIndexButton.onclick = handleClick;
		myIndexButton.className = "kintoneplugin-button-normal";
		// 色を変える
		myIndexButton.style.backgroundColor = "#FFC0CB";
		myIndexButton.style.color = "#000000";

		const myProgressDiv = document.createElement('div');
		myProgressDiv.id = "my_progress_container_1";
		myProgressDiv.style.width = '900px';
		myProgressDiv.style.height = '50px';
		myProgressDiv.style.margin = '8px 0 0 0';
		// 右に寄せる

		// ボタンをヘッダメニューに追加
		kintone.app.getHeaderMenuSpaceElement().appendChild(myIndexButton);
		kintone.app.getHeaderMenuSpaceElement().appendChild(myProgressDiv);
	});
})();




async function handleClick() {
	// 全件ではなく一覧画面のレコードを取得する
	let totalData = [];
	try {
		// 実行確認ダイアログを表示
		if (!confirm('ダウンロードしますか？')) {
			return;
		}

		// 処理の進捗を示すプログレスバーを表示 (ProgressBar.jsを使用)
		const progressBar_1 = new ProgressBar.Line('#my_progress_container_1',
			{
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
						top: '-120px',
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
					bar.setText(Math.round(bar.value() * 100) + ' %');
				}
			});


		let readCount = 0; //カーソルAPIから何度呼び出したか
		let cursorId = await createCursor(); //新規カーソルを作成＆得られたカーソルID

		totalData = { records: [] }; //カーソルAPIで取得されるレコード 
		let isReading = true; //カーソルAPIからのデータ取得中であるかを示す真偽値

		console.log("■■■■■■　処理開始　■■■■■■");

		while (isReading == true) { //作成したカーソルより、500件づつデータを取得＆結合
			let retValue = await getRecordsByCursorId(cursorId);
			totalData.records = totalData.records.concat(retValue.records); //取得したデータを結合
			readCount = readCount + 1; //カーソルAPIからデータを取得したのでカウントアップ

			// プログレスバーの値を更新
			progressBar_1.animate(readCount / 60);

			console.log("データ取得【" + readCount + "】回目");

			if (retValue.next == false) {
				isReading = false;
			}
			if (readCount >= 10000) { /*念の為の防波堤。。デバック中に暴発（無限ループ）しないように！*/
				console.log("■■　処理中断　■■");
				isReading = false;
				break;
			}
		}
		// プログレスバーを100%にする
		progressBar_1.animate(1.0);

		console.log("■■■■■■　処理完了　■■■■■■");
		console.log("取得したデータは？？");
		console.dir(totalData.records);


	}

	catch (error) {
		/**
		* データ取得中にエラーが発生し取り込みが中断された場合、明示的にカーソルを削除する必要がある。
		* ※カーソル経由で全てのレコードを取得すると、当該カーソルは自動的に削除される。
		*/
		await deleteCursor(cursorId);
		console.log(error);
	}
	finally {
		/**
		* ここにカーソルAPIからのデータ取得後処理が入る。
		*/

		//エスケープ
		function escapeStr(value) {
			return '"' + (value ? value.replace(/"/g, '""') : '') + '"';
		}

		//CSVファイルをダウンロード
		function downloadCSV(csv) {
			console.log("■■■■■■　CSVダウンロード　■■■■■■");
			var csvbuf = csv.map(function (e) { return e.join(','); }).join('\r\n');
			var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
			var blob = new Blob([bom, csvbuf], { type: 'text/csv' });
			var url = (window.URL || window.webkitURL).createObjectURL(blob);

			//ファイル名：アプリ番号_comments.csv
			var appId = kintone.app.getId();
			var fileName = appId + '_comments.csv';

			var link = document.createElement('a');
			var e = document.createEvent('MouseEvents');
			e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			link.download = fileName;
			link.href = url;
			link.dispatchEvent(e);
			console.log("■■■■■■　CSVダウンロード完了　■■■■■■");
		}
	}

	//レコード一覧からコメント情報を取得する
	function getCommentCsv(records, opt_comments, opt_i, opt_offset) {

		var i = opt_i || 0; //レコードのカウント
		var comments = opt_comments || [];
		var offset = opt_offset || 0;

		var appId = kintone.app.getId(); //アプリID
		var recordId = records[i]['$id']['value']; //レコードID

		var params = {
			'app': appId,
			'record': recordId,
			'offset': offset
		};

		console.log("■■■■■■　コメント取得　■■■■■■");
		//一覧画面からコメント取得
		return kintone.api(
			kintone.api.url('/k/v1/record/comments', true), 'GET', params).then(function (resp) {

				//CSVデータの作成
				for (var j = 0; j < resp.comments.length; j++) {
					var row = [];
					var mentions_code = [];
					var mentions_type = [];

					if (resp.comments[j].mentions[0] === undefined) {
						resp.comments[j].mentions.code = null;
					}
					for (var k = 0; k < resp.comments[j].mentions.length; k++) {
						mentions_code.push(resp.comments[j].mentions[k].code);
						mentions_type.push(resp.comments[j].mentions[k].type);
					}
					row.push(escapeStr(recordId));                       //レコードID
					row.push(escapeStr(resp.comments[j].id));            //コメントID
					row.push(escapeStr(resp.comments[j].text));          //コメント内容
					row.push(escapeStr(resp.comments[j].createdAt));     //投稿日時
					row.push(escapeStr(resp.comments[j].creator.code));  //投稿者ログイン名
					row.push(escapeStr(resp.comments[j].creator.name));  //投稿者表示名
					row.push(escapeStr(mentions_code.join(',')));   //メンション宛先
					row.push(escapeStr(mentions_type.join(',')));   //メンションタイプ
					comments.push(row);
				}

				//コメントを全て参照したか判定
				if (resp.older) {
					return getCommentCsv(records, comments, i, offset + 10);
				}

				i = i + 1;
				//レコードを全て参照したか判定
				if (records.length !== i) {
					return getCommentCsv(records, comments, i);
				}
				console.log("■■■■■■　コメント取得完了　■■■■■■");
				return comments;
			});
	}

	//コメント一覧のCSVファイルを作成
	function createCSVData(records) {
		getCommentCsv(records).then(function (comments) {

			console.log("■■■■■■　CSV作成　■■■■■■");
			var comments_csv = [];
			//CSVファイルの列名
			var column_row = ['レコードID', 'コメントID', 'コメント内容',
				'投稿日時', '投稿者ログイン名', '投稿者表示名',
				'メンション宛先', 'メンションタイプ'];
			if (comments.length === 0) {
				alert('コメントが登録されていません');
				return;
			}
			comments_csv.push(column_row);
			for (var i = 0; i < comments.length; i++) {
				comments_csv.push(comments[i]);
			}
			console.log("■■■■■■　CSV作成完了　■■■■■■");
			// BOM付でダウンロード
			downloadCSV(comments_csv);
		});
	}

	// CSVデータを作成・ダウンロード
	createCSVData(totalData.records);
	console.log(totalData.records);
	console.log("処理おわり！！");
	return;
}



/***************************************
* 概要：カーソルからデータを取得する
* cursorId {String}: カーソル
* return {Allay}:
*          - records : カーソルから取得した一部レコード
*          - next    : 次のカーソルで取得するデータが存在するか
***************************************/
async function getRecordsByCursorId(cursorId) {

	let body = { id: cursorId };
	return kintone.api(kintone.api.url('/k/v1/records/cursor', true), 'GET', body).then(async function (resp) {
		return { records: resp.records, next: resp.next }//取得したデータおよび、次のカーソル取得データ(next)が存在するか？を返却
	});

};

/***************************************
* 概要：カーソルを作成する
* return cursorId{String}: 新たに取得されたカーソル。取得失敗の場合は値はセットされない。
***************************************/
async function createCursor() {

	const getPerSize = 500;/* 500件づつ取得する */
	let body = {
		'app': kintone.app.getId(),
		// 'fields': ['レコード番号', '作成者', '作成日時'],
		// kenpin_dateが2022-11-30以前かつ空欄でないレコードを取得する
		'query': 'kenpin_date <= "2022-11-30" and kenpin_date != ""',
		'size': getPerSize
	};

	return kintone.api(kintone.api.url('/k/v1/records/cursor', true), 'POST', body).then(async function (resp) {
		// success
		console.log("■■　カーソル作成　■■");
		console.log("cursorIdは" + resp.id);
		return resp.id;
	}, function (error) {
		// error
		console.log(error);
		return;
	});

}

/***************************************
* 概要：カーソルを削除する
* cursorId {String}: カーソル
* return {boolean}: true 成功 / false失敗
***************************************/
async function deleteCursor(cursorId) {

	let body = { 'id': cursorId };

	return kintone.api(kintone.api.url('/k/v1/records/cursor', true), 'DELETE', body).then(async function (resp) {
		// success
		console.log(resp);
		return true;
	}, function (error) {
		// error
		console.log(error.message);
		return false;
	});
}



