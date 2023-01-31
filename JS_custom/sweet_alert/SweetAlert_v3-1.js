(function () {
	"use strict";

	const today = new Date().toJSON().slice(0, 10);
	const showDialog = localStorage.getItem("showDialog");

	kintone.events.on(["portal.show"], function (event) {
		if (showDialog !== today) {
			const text = "確認してから業務開始してください<br><br>下のチェックを入れて確認アプリを開くと<br>今日はもう表示されません<br>(=^・・^=)<br><br>"

			// document.createElementでチェックボックスを作成
			const checkbox = document.createElement("input");
			checkbox.type = "checkbox";
			checkbox.id = "no-show-today";

			// チェックボックスにラベルを付ける
			const label = document.createElement("label");
			label.htmlFor = "no-show-today";
			label.innerHTML = "明日になるまで再表示しない";

			// チェックボックスとラベルをコンテナー要素に追加
			const container = document.createElement("div");
			container.appendChild(checkbox);
			container.appendChild(label);

			Swal.fire({
				icon: "question",
				imageUrl: "https://mugen-wifi.com/osushi.jpg",
				imageWidth: 200,
				imageHeight: 150,
				imageAlt: "OSUSHI image",
				title: "<strong><u>共有事項確認OK?</u></strong>",
				html: text + container.outerHTML,
				padding: "1.5rem",
				footer: "SYSTEM Developed by 河南",
				showConfirmButton: true,
				showCancelButton: false,
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
			searchBtn.textContent = "全体検索";

			searchBtn.addEventListener("click", function () {
				Swal.fire({
					icon: "question",
					title: "<strong><u>全体検索</u></strong>",
					input: "text",
					inputPlaceholder: "キーワードを入力してください",
					showCancelButton: true,
					confirmButtonText: "検索",
					cancelButtonText: "キャンセル",
					confirmButtonClass: "btn btn-lg btn-primary mx-2",
					cancelButtonClass: "btn btn-lg btn-danger mx-2",
				}).then((result) => {
					if (result.value) {
						window.location.href = `https://freedive.cybozu.com/k/search?keyword=${result.value}`;
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
