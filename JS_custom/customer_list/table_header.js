(function() {
	"use strict";
	kintone.events.on(["app.record.detail.show", "app.record.create.show", "app.record.edit.show"], function (event) {

		var table_header = document.getElementsByClassName("subtable-label-gaia");

		var field_name = document.getElementsByClassName("subtable-label-inner-gaia");

		for (var i = 0; i < table_header.length; i++){
			if (field_name[i].innerHTML === "解約手続き　※申込日：2022/07/01～") {
				table_header[i].style.backgroundColor = "#ff4b00";
			} else if (field_name[i].innerHTML === "付属品不備　※申込日：2022/07/01～") {
				table_header[i].style.backgroundColor = "#005AFF";
			} else if (field_name[i].innerHTML === "故障交換時_付属品不備　※申込日：2022/07/01～") {
				table_header[i].style.backgroundColor = "#03AF7A";
			}
		}
	})
})();