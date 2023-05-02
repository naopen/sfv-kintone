(function() {
    "use strict";
    function getCommentsData(record_id, opt_offset, opt_comments) {
        var offset = opt_offset || 0;
        var body = {
            "app": kintone.app.getId(),
            "record": record_id,
            "offset": offset,
            "order": 'asc'      // ポイント(5)
        };
        var comments = opt_comments || [];
        return kintone.api(kintone.api.url('/k/v1/record/comments', true), 'GET', body).then(function(resp) {
            comments = comments.concat(resp.comments);
            if (resp.older === true) {
                return getCommentsData(record_id, offset + 10, comments);
            }
            return comments;
        });
    }

    function downloadFile(blob, fileName) {
        if (window.navigator.msSaveOrOpenBlob) {
            // ブラウザがIEの場合
            window.navigator.msSaveOrOpenBlob(blob, fileName);
        } else {
            // ブラウザがIE以外の場合
            var link = document.createElement('a');
            var e = document.createEvent('MouseEvents');
            var url = (window.uRL || window.webkitURL).createObjectURL(blob);
            e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            link.download = fileName;
            link.href = url;
            link.dispatchEvent(e);
        }
    }

    // *** 本文[fetch-records] ここから ***
    function fetchRecords(appId, opt_offset, opt_limit, opt_records) {
        var offset = opt_offset || 0;
        var limit = opt_limit || 100;
        var allRecords = opt_records || [];
        var params = {app: appId, query: 'order by レコード番号 asc limit ' + limit + ' offset ' + offset};
        return kintone.api('/k/v1/records', 'GET', params).then(function(resp) {
            allRecords = allRecords.concat(resp.records);
            if (resp.records.length === limit) {
                return fetchRecords(appId, offset + limit, limit, allRecords);
            }
            return allRecords;
        });
    }
    // *** 本文[fetch-records] ここまで ***

    // レコード一覧画面
    kintone.events.on(['app.record.index.show'], function(event) {
        // ヘッダの要素にボタンを作成
        var header_element = kintone.app.getHeaderMenuSpaceElement();
        var csv_button = document.createElement('button');
        csv_button.id = 'bulk-download-comment-csv';
        csv_button.innerText = 'レコードとコメントをバックアップ';

        csv_button.onclick = function() {
            fetchRecords(kintone.app.getId()).then(function(records) {
                // 全レコードを取得したらJSON形式でダウンロード
                var blob = new Blob([JSON.stringify(records)]);
                var fileName = kintone.app.getId() + '.json';
                downloadFile(blob, fileName);

                // *** 本文[save-records-and-comments] ここから ***
                var comments = [];
                var done = 0;
                // レコードごとにコメントを取得し、配列に入れていく
                records.forEach(function(elem, i, original) {
                    getCommentsData(elem.$id.value).then(function(comments_for_record) {
                        // 取得したコメントを、レコードIDをキーとする配列に保存(ポイント(1))
                        if (comments_for_record.length) {
                            comments[elem.$id.value] = comments_for_record;
                        }

                        done++;
                        // 最後のコメント取得が終わったら、JSON形式でダウンロード
                        if (done === original.length) {
                            var blob = new Blob([JSON.stringify(comments)]);
                            var fileName = kintone.app.getId() + '_comments.json';
                            downloadFile(blob, fileName);
                        }
                    });
                });
                // *** 本文[save-records-and-comments] ここまで ***
            });
        };

        header_element.appendChild(csv_button);
        return event;
    });
})();
