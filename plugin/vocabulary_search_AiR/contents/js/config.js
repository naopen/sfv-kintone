/*
*--------------------------------------------------------------------
* Kintone-Plugin "vocabularysearch -config.js-"
* Version: 1.0
* Copyright (c) 2019 TIS
*
* Released under the MIT License.
* http://tis2010.jp/license.txt
* -------------------------------------------------------------------
*/
jTis.noConflict();
(function($,PLUGIN_ID){
	"use strict";
	$('button#cancel').on('click',function(e){
		history.back();
	});
})(jTis,kintone.$PLUGIN_ID);