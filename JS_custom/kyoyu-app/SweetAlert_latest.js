(function () {
	"use strict";

	const today = new Date().toDateString();
	const showDialog = localStorage.getItem("showDialog");

	kintone.events.on(["portal.show"], function (event) {
		if (showDialog !== today) {
			const text = "確認してから業務開始してください<br>(=^・・^=)<br><br>下のチェックを入れたまま確認すると<br>「このブラウザでは」<br>今日はダイアログが再表示されません<br>"

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
				imageUrl: "https://i.imgur.com/k8ypFf7.jpg",
				imageWidth: 200,
				imageHeight: 150,
				imageAlt: "OSUSHI image",
				title: "<strong><u>共有確認OK?</u></strong>",
				html: text + check.outerHTML,
				padding: "1.5rem",
				footer: "Kintone Portal System Developed By: Naoki Kannan",
				showConfirmButton: true,
				showCancelButton: false,
				showCloseButton: true,
				confirmButtonText: "[CS部]確認！",
				cancelButtonText: "キャンセル",
				confirmButtonColor: "#0DAC93",
				cancelButtonColor: "#d33",
				// timer: 12000,
				// timerProgressBar: true,
				allowOutsideClick: false,
				allowEscapeKey: false,
				didOpen: () => {
					document.getElementById("no-show-today").checked = true;
					// カスタムクローズボタンの動作を設定
					const closeButton = document.querySelector('.swal2-close');
					closeButton.onclick = null; // 既存のクリックイベントを削除
					closeButton.addEventListener('click', function (e) {
						if (!e.shiftKey) {
							// 2秒待つ
							setTimeout(() => {
								// Shiftキーが押されていない場合、メッセージを表示
								Swal.showValidationMessage("Shiftキーを押しながら閉じるボタンを押してください");
							}, 2000);
							Swal.showValidationMessage("確認しましたか？");
						} else {
							// Shiftキーが押されている場合、ダイアログを閉じる
							Swal.close();
						}
					});
				},
			});
			Swal.update({
				buttonsStyling: true,
				confirmButtonClass: "btn btn-lg btn-primary mx-2",
				cancelButtonClass: "btn btn-lg btn-danger mx-2",
			});

			document
				.querySelector(".swal2-confirm")
				.addEventListener("click", function () {
					if (document.getElementById("no-show-today").checked) {
						localStorage.setItem("showDialog", today);
					}
					// 新しいタブを開く
					openNewTab("https://freedive.cybozu.com/k/260/");
					openNewTab("https://freedive.cybozu.com/k/84/");
					// 同じタブで開く
					// window.location.href = "https://freedive.cybozu.com/k/84/";
				});

			const searchBtn = document.createElement("button");
			searchBtn.classList.add("btn", "btn-lg", "btn-secondary", "mx-2");
			searchBtn.classList.add("swal2-styled", "swal2-confirm");
			searchBtn.textContent = "全体検索";
			searchBtn.style.backgroundColor = "#84919e";
			searchBtn.style.color = "#fff";

			searchBtn.addEventListener("click", function () {
				Swal.fire({
					icon: "info",
					// （右上の検索欄と同じ機能です）だけ文字を小さくする
					title: "kintone全体検索<br><small>（右上の検索欄と同じ機能です）</small>",
					input: "text",
					inputPlaceholder: "キーワードを入力",
					showCancelButton: true,
					confirmButtonText: "検索",
					cancelButtonText: "キャンセル",
					confirmButtonColor: "#3085d6",
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

			const searchButton = document.querySelector(".swal2-confirm");
			searchButton.insertAdjacentElement("afterend", searchBtn);

			const dxCheckBtn = document.createElement("button");
			dxCheckBtn.classList.add("btn", "btn-lg", "btn-secondary", "mx-2");
			dxCheckBtn.classList.add("swal2-styled", "swal2-confirm");
			dxCheckBtn.textContent = "[DX部]確認！";
			dxCheckBtn.style.backgroundColor = "#990099";
			dxCheckBtn.style.color = "#fff";

			dxCheckBtn.addEventListener("click", function () {
				if (document.getElementById("no-show-today").checked) {
					localStorage.setItem("showDialog", today);
				}
				// 新しいタブを開く
				openNewTab("https://freedive.cybozu.com/k/391/");
				openNewTab("https://freedive.cybozu.com/k/390/");
				openNewTab("https://freedive.cybozu.com/k/323/");
				Swal.close();
			}
			);

			const dxCheckButton = document.querySelector(".swal2-confirm");
			dxCheckButton.insertAdjacentElement("afterend", dxCheckBtn);

			function openNewTab(url) {
				const a = document.createElement("a");
				a.href = url;
				a.target = "_blank";
				a.rel = "noopener";

				const event = new MouseEvent("click", {
					view: window,
					bubbles: true,
					cancelable: true,
				});
				a.dispatchEvent(event);
			}


		}

	});
})();
