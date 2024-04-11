(function () {
  "use strict";
  kintone.events.on(
    [
      "app.record.detail.show",
      "app.record.create.show",
      "app.record.edit.show",
    ],
    function (event) {
      var table_header = document.getElementsByClassName("subtable-label-gaia");

      var field_name = document.getElementsByClassName(
        "subtable-label-inner-gaia"
      );

      for (var i = 0; i < table_header.length; i++) {
        if (field_name[i].innerHTML === "個人 / 法人") {
          table_header[i].style.backgroundColor = "#ff8082";
        } else if (field_name[i].innerHTML === "契約番号") {
          table_header[i].style.backgroundColor = "#84919e";
        } else if (field_name[i].innerHTML === "契約者氏名") {
          table_header[i].style.backgroundColor = "#84919e";
        } else if (field_name[i].innerHTML === "電話番号") {
          table_header[i].style.backgroundColor = "#4dc4ff";
        } else if (field_name[i].innerHTML === "郵便番号") {
          table_header[i].style.backgroundColor = "#84919e";
        } else if (field_name[i].innerHTML === "住所") {
          table_header[i].style.backgroundColor = "#84919e";
        } else if (field_name[i].innerHTML === "出荷ステータス") {
          table_header[i].style.backgroundColor = "#84919e";
        } else if (field_name[i].innerHTML === "伝票番号") {
          table_header[i].style.backgroundColor = "#84919e";
        } else if (field_name[i].innerHTML === "着払い伝票番号") {
          table_header[i].style.backgroundColor = "#84919e";
        }
      }
    }
  );
})();
