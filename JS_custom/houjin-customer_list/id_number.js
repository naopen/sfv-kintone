//検索したいフィールドの設定値
const FIELD_CODE = 'customerid';

//レコード一覧表示のイベントハンドラー
(function () {
  'use strict';

    kintone.events.on("app.record.index.show", function (event) {

        //GET引数に格納された直前の検索キーワードを取得して再表示
        var result = {};
        //クエリから、URL固定部分(?query=)を無視して取り出す
        var query = window.location.search.substring(7);  
        //フィールドコード名と検索キーワードに分割する
        for(var i = 0;i < query.length;i++){
            var element = query[i].split('=');
            var param_field_code = encodeURIComponent(element[0]);
            var param_search_word = encodeURIComponent(element[1]);

            //空白スペースを取り除いて、配列に格納
            result[param_field_code.replace(/^\s+|\s+$/g, "")] = param_search_word.replace(/^[\s|\"]+|[\s|\"]+$/g, "");
        }

        //検索キーワード
        var search_word = document.createElement('input');
        search_word.type = 'text';

        //検索ボタン
        var search_button = document.createElement('input');
        search_button.type = 'submit';
        search_button.value = '　　検索　　';
        search_button.onclick = function () {
            keyword_search();
        };

        //キーワード検索の関数
        function keyword_search(){
            var keyword = search_word.value;
            var str_query = '?query='+ FIELD_CODE +' = "' + keyword;

            if(keyword == ""){
                str_query = "";
            }else if(keyword != ""){
                str_query = '?query='+ FIELD_CODE +' = "' + keyword + '"';
            }

            //検索結果のURLへ
            document.location = location.origin + location.pathname + str_query
        }

        //重複を避けるため要素をあらかじめクリアしておく
        var node_space = kintone.app.getHeaderMenuSpaceElement()
        for (var i =node_space.childNodes.length-1; i>=0; i--) {
            node_space.removeChild(node_space.childNodes[i]);
        }
        var label = document.createElement('label');
        label.appendChild(document.createTextNode('　【お客様番号専用】検索欄　'));
        label.appendChild(document.createTextNode('  '));  
        label.appendChild(search_word);
        label.appendChild(document.createTextNode('  '));    
        label.appendChild(search_button);     
        kintone.app.getHeaderMenuSpaceElement().appendChild(label);

        return event;
    });
})();