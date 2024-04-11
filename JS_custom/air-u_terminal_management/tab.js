/* -----------------------------------------------------------------------------
 * tab.js 
 *
 * Code copyright smile-up
 *
 * Code released under the MIT license
 * http://opensource.org/licenses/mit-license.php
 * -------------------------------------------------------------------------- */
(() => {
	"use strict";
	let url = "https://smile-up.jp/kintone/tab/tab.mod.js";
	let mod = null;
	(async () => {
		mod = await import(url);
	})();
	kintone.events.on([
		'app.record.detail.show',
		'app.record.create.show',
		'app.record.edit.show'
	], async event => {
		if (mod === null) {
			mod = await import(url);
		}
		new mod.Tab(event.type);
		return event;
	});
})();
v