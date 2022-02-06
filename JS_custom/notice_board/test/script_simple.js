(function() {
  'use strict';
  kintone.events.on('app.record.index.show', function(event) {
    if (event.viewId !== 6129497) {
        return;
    }

    var records = event.records;
    if (records.length === 0) {
        document.getElementById('my-customized-view').innerText = '表示するレコードがありません';
        return;
    }

    var recUrl = location.protocol + '//' + location.hostname + '/k/' + kintone.app.getId() + '/show#record=';
    var myRecordSpace = document.getElementById('my-tbody');
    myRecordSpace.innerText = '';

    for (var i = 0; i < records.length; i++) {
        var record = records[i];
        var row = myRecordSpace.insertRow(myRecordSpace.rows.length);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);

        var tmpA = document.createElement('a');
        tmpA.href = recUrl + record['レコード番号']['value'];
        tmpA.innerText = record['レコード番号']['value'];
        cell1.appendChild(tmpA);
        
        cell2.innerText = record['会社名']['value'];
        cell3.innerText = record['部署名']['value'];
        cell4.innerText = record['担当者名']['value'];
        cell5.innerText = record['住所']['value'];
    }
  });
})();