
(function () {
    "use strict";

    function loadJS(src) {
        document.write('<script type="text/javascript" src="' + src + '"></script>');
    }
    
    loadJS('https://cdn.jsdelivr.net/foundation/5.2.2/js/vendor/jquery.js');
    loadJS('https://cdn.jsdelivr.net/foundation/5.2.2/js/foundation.min.js');
    loadJS('https://cdn.jsdelivr.net/foundation/5.2.2/js/vendor/modernizr.js');
    
    kintone.events.on('app.record.index.show', function(event){
        // カスタムビューでなければここで終了
        var check = document.getElementsByName('kintone-custom-view');
        if (check.length == 0) {
            return;
        }

        var rec = event.records;

        // イベントの多重化による要素生成に対応
        $('#articles').empty();
                
        var recUrl = location.protocol+'//'+location.hostname+'/k/'+kintone.app.getId()+'/show#record=';

        // 記事の中身を作成
        for(var i=0; i< rec.length; i++){
            if(i != 0){
                $('#articles').append('<hr />');
            }
            $('#articles').append('<article id="article' + i + '" class="articles"></article>');
            $('#article'+i).append('<h3><a href="'+ recUrl + rec[i]['recordNum']['value'] +'">' + rec[i]['title']['value'] + '</a></h3>');
            $('#article'+i).append('<h6>投稿者：' + rec[i]['author']['value'] + '　投稿日：' + rec[i]['postedDate']['value'] + '</h6>');
            $('#article'+i).append('<br>');
            $('#article'+i).append('<div class="row" id="articleRaw' + i + '"></div>');
            $('#articleRaw'+i).append('<p>' + rec[i]['article']['value'].replace(/\r?\n/g, "<br />") + '</p>');
        } // for i        
    }); // kintone.events
})();
