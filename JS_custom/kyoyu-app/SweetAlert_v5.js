(function () {
	"use strict";

	const today = new Date().toDateString();
	const showDialog = localStorage.getItem("showDialog");

	kintone.events.on(["portal.show"], function (event) {
		if (showDialog !== today) {
			const text = "確認してから業務開始してください<br>(=^・・^=)<br><br>下のチェックを入れて確認アプリを開くと<br>「このブラウザでは」<br>今日は再表示されません<br>"

			// document.createElementでチェックボックスを作成
			const checkbox = document.createElement("input");
			checkbox.type = "checkbox";
			checkbox.id = "no-show-today";

			// チェックボックスにラベルを付ける
			const label = document.createElement("label");
			label.innerHTML = "本日24時まで再表示しない";
			label.htmlFor = "no-show-today";

			// 罫線を引くコンテナ要素を作成
			const hr = document.createElement("hr");
			hr.style.border = "1px solid #ccc";
			hr.style.width = "90%";

			// 罫線とチェックボックスとラベルをコンテナ要素に追加
			const check = document.createElement("div");
			check.appendChild(hr);
			check.appendChild(checkbox);
			check.appendChild(label);

			Swal.fire({
				icon: "question",
				imageUrl: "https://mugen-wifi.com/osushi.jpg",
				imageWidth: 200,
				imageHeight: 150,
				imageAlt: "OSUSHI image",
				title: "<strong><u>共有事項確認OK?</u></strong>",
				html: text + check.outerHTML,
				padding: "1.5rem",
				footer: "SYSTEM Developed by Kannan Naoki",
				showConfirmButton: true,
				showCancelButton: false,
				showCloseButton: true,
				confirmButtonText: "確認アプリを開く",
				cancelButtonText: "キャンセル",
				confirmButtonColor: "#3085d6",
				cancelButtonColor: "#d33",
				// timer: 12000,
				// timerProgressBar: true,
				allowOutsideClick: false,
				allowEscapeKey: false,
			});
			Swal.update({
				buttonsStyling: true,
				confirmButtonClass: "btn btn-lg btn-primary mx-2",
				cancelButtonClass: "btn btn-lg btn-danger mx-2",
			});

			const searchBtn = document.createElement("button");
			searchBtn.classList.add("btn", "btn-lg", "btn-secondary", "mx-2");
			searchBtn.classList.add("swal2-styled", "swal2-confirm");
			searchBtn.textContent = "全体検索する";
			searchBtn.style.backgroundColor = "#84919e";
			searchBtn.style.color = "#fff";

			searchBtn.addEventListener("click", function () {
				Swal.fire({
					icon: "info",
					// （右上の検索欄と同じ機能です）だけ文字を小さくする
					title: "kintoneを全体検索する<br><small>（右上の検索欄と同じ機能です）</small>",
					input: "text",
					inputPlaceholder: "キーワードを入力してください",
					showCancelButton: true,
					confirmButtonText: "検索",
					cancelButtonText: "キャンセル",
					confirmButtonColor: "#03af7a",
					cancelButtonColor: "#c8c8cb",
					confirmButtonClass: "btn btn-lg btn-primary mx-2",
					cancelButtonClass: "btn btn-lg btn-danger mx-2",
					allowOutsideClick: false,
					allowEscapeKey: false,
				}).then((result) => {
					if (result.value) {
						window.location.href = `https://freedive.cybozu.com/k/search?keyword=${result.value}`;
					}
					// 何も入力されていない時はエラーメッセージを表示して表示が終わるまで待った後にページを再読み込みする
					else if (result.value === "") {
						Swal.fire({
							icon: "error",
							title: "キーワードを入力してください",
							showConfirmButton: false,
							timer: 1500,
							timerProgressBar: true,
						});
						setTimeout(function () {
							location.reload();
						}
							, 1500);
					}
					// キャンセルボタンを押した時はページを再読み込みする
					else {
						location.reload();
					}
				});
			});

			const confirmButton = document.querySelector(".swal2-confirm");
			confirmButton.insertAdjacentElement("afterend", searchBtn);

			document
				.querySelector(".swal2-confirm")
				.addEventListener("click", function () {
					if (document.getElementById("no-show-today").checked) {
						localStorage.setItem("showDialog", today);
					}
					window.location.href = "https://freedive.cybozu.com/k/84/";
				});
		}

	});
})();
