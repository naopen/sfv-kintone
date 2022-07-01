(function(){

"use strict";



    kintone.events.on(['app.record.create.change.AM','app.record.edit.change.AM'],function(event){

        event.changes.field.value = event.changes.field.value.replace(/[Ａ-Ｚａ-ｚ０-９]/g,function(s){

        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);});

        

        return event;

    });

})();