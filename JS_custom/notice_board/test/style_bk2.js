(function() {
  'use strict';
  kintone.events.on('app.record.index.show', function(event) {
    // 対象のビュー以外は処理しない
    if (event.viewId !== 6129499) return event;
    var records = event.records;
    const vm = new Vue({
      el: '#app',
      data() {
        return {
          records: records,
        }
      }
    });
    return event;
  });
})();