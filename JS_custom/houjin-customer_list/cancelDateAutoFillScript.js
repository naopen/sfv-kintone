(function () {
	"use strict";

	kintone.events.on("app.record.edit.submit", (event) => {

		// 解約申請受付日に値が入っていれば処理を実行
		if (!event.record["解約申請受付日"].value) {
			return;
		}

		// ラジオボタン (ID: autoOrManual) の値が「手動入力」なら処理を中断
		if (event.record["autoOrManual"].value === "手動入力") {
			return;
		}

		const cancelDate = new Date(event.record["解約申請受付日"].value);
		console.log("解約申請受付日：" + cancelDate.toISOString().slice(0, 10));

		let contractEndDate = new Date(cancelDate);
		let deviceReturnDeadline = new Date(cancelDate);

		if (cancelDate) {
			const day = cancelDate.getDate();

			if (day >= 1 && day <= 20) {
				console.log("1～20日");
				// 契約終了日を翌月末に設定
				contractEndDate.setDate(1) // 当月1日に設定
				contractEndDate.setMonth(contractEndDate.getMonth() + 2); // 翌々月
				contractEndDate.setDate(0); // 翌月末
				// 端末返却期限を翌々月7日に設定
				deviceReturnDeadline.setDate(1) // 当月1日に設定
				deviceReturnDeadline.setMonth(cancelDate.getMonth() + 2); // 翌々月
				deviceReturnDeadline.setDate(7); // 翌々月の7日
			} else if (day >= 21) {
				console.log("21～末日");
				// 契約終了日を翌々月末に設定
				contractEndDate.setDate(1) // 当月1日に設定
				contractEndDate.setMonth(contractEndDate.getMonth() + 3); // 翌々々月
				contractEndDate.setDate(0); // 翌々月末
				// 端末返却期限を翌々々月7日に設定
				deviceReturnDeadline.setDate(1) // 当月1日に設定
				deviceReturnDeadline.setMonth(deviceReturnDeadline.getMonth() + 3); // 翌々々月
				deviceReturnDeadline.setDate(7); // 翌々々月の7日
			}
		}

		// 契約終了日と端末返却期限をyyyy-mm-dd形式に変換
		contractEndDate = contractEndDate.toISOString().slice(0, 10);
		deviceReturnDeadline = deviceReturnDeadline.toISOString().slice(0, 10);
		console.log("契約終了日：" + contractEndDate);
		console.log("端末返却期限：" + deviceReturnDeadline);


		event.record["契約終了日"].value = contractEndDate;
		event.record["端末返却期限"].value = deviceReturnDeadline;

		// 成功メッセージを表示
		const message = "解約申請受付日から契約終了日と端末返却期限を自動入力しました。";
		const Kuc = Kucs['1.13.0'];

		const notification = new Kuc.Notification({
			type: 'success',
			text: message,
			duration: 3000,
		});

		notification.addEventListener('close', event => {
			console.log(event);
		});

		notification.open()
		return event;
	}
	);
})();
