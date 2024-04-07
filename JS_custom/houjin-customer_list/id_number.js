//検索したいフィールドの設定値
const FIELD_CODE = 'record_No_';

//レコード一覧表示のイベントハンドラー
(function () {
    'use strict';

    kintone.events.on("app.record.index.show", function (event) {

        // 検索キーワード
        const search_word = document.createElement('input');
        search_word.type = 'text';
        search_word.style.padding = '5px';
        search_word.style.marginRight = '10px';
        search_word.style.border = '1px solid #ccc';
        search_word.style.borderRadius = '4px';

        // 検索ボタン
        const search_button = document.createElement('button');
        search_button.innerHTML = '検索';
        search_button.style.padding = '5px 15px';
        search_button.style.border = 'none';
        search_button.style.borderRadius = '4px';
        search_button.style.backgroundColor = '#007bff';
        search_button.style.color = 'white';
        search_button.style.cursor = 'pointer';
        search_button.onclick = function () {
            keyword_search();
        };

        // キーワード検索の関数
        function keyword_search() {
            const keyword = search_word.value;
            let str_query = '?query=' + FIELD_CODE + ' = "' + keyword;

            if (keyword == "") {
                str_query = "";
            } else if (keyword != "") {
                str_query = '?query=' + FIELD_CODE + ' = "' + keyword + '"';
            }

            // 検索結果のURLへ
            document.location = location.origin + location.pathname + str_query;
        }

        // 重複を避けるため要素をあらかじめクリアしておく
        const node_space = kintone.app.getHeaderMenuSpaceElement();
        for (let i = node_space.childNodes.length - 1; i >= 0; i--) {
            node_space.removeChild(node_space.childNodes[i]);
        }

        const label = document.createElement('label');
        label.appendChild(document.createTextNode('【レコード番号専用】検索欄 '));
        label.style.fontWeight = 'bold';
        label.appendChild(search_word);
        label.appendChild(search_button);
        kintone.app.getHeaderMenuSpaceElement().appendChild(label);

        return event;
    });
})();
