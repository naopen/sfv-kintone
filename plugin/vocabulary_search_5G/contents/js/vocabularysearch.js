/*
*--------------------------------------------------------------------
* Kintone-Plugin "vocabularysearch"
* Version: 1.0
* Copyright (c) 2019 TIS
*
* Released under the MIT License.
* http://tis2010.jp/license.txt
* -------------------------------------------------------------------
*/
jTis.noConflict();
(function ($, PLUGIN_ID) {
	"use strict";
	var vars = {
		buttons: null,
		query: '',
	};
	var events = {
		show: [
			'app.record.index.show',
			'app.record.detail.show',
			'app.report.show',
			'mobile.app.record.index.show',
			'mobile.app.record.detail.show',
			'mobile.app.report.show'
		]
	};
	var SearchButtons = function () {
		var div = $('<div>').css({
			'box-sizing': 'border-box'
		});
		var img = $('<img>').css({
			'background-color': 'transparent',
			'border': 'none',
			'box-sizing': 'border-box',
			'cursor': 'pointer',
			'display': 'inline-block',
			'height': '25px',
			'margin': '1.25px',
			'vertical-align': 'top',
			'width': '25px'
		});
		/* append elements */
		this.container = div.clone(true).css({
			'background-color': '#FFFFFF',
			'border-radius': '15px',
			'box-shadow': '0px 0px 3px rgba(0,0,0,0.35)',
			'display': 'none',
			'height': '30px',
			'margin': '0px',
			'padding': '1.25px',
			'position': 'fixed',
			'width': '117px',
			'z-index': '999999'
		});
		$('body').append(
			this.container
				.append(
					img.clone(true)
						.attr('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAXc0lEQVR42u3db3Acd3kH8O/vt7t3J+HEDpHl1E4c48am1LhJsCVC4/w7RdhA8sYeZ4CUMJDpQEtDO6XUYAI4MFAxIdOBOMMM0ADFTIlcKJ3YAzW2bBzjVJKdvAgZCClJiJMQZNmyY0f3Z3d/T1+c7nQn2ZZOd3u7d/v9vMgr793e5fbR8zy/fwARERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERFRzKmw3vjgVZctdJC8wvfN5Rp6oUDaoaGUUa9DqxNG/JdssY9d9/zzfwz7SyKaK/klOpF3lvq+uRxKdyigDQB8D+PaMceN6JdynvvSResxEsb9NSwAPL1qVWIsc6bbVmq9AW6A4M8ALLSV0taUf+sDcEUEwCiAZyzIY57IT19pv3jwjqefzofxRRHNhvQj4b3Rfru2sF4MbgawUgQdtgOF8h+6APABz4VRCqNQ+I3SOGg8/I895g2pO9CQ33ngAWBo2bLLfC3vVwp3GsHbkkrBAPBEIBPfw/luTAGwlIINICsCrXBUIP/+Gpwfrv/d70KJmETnIntxqdHOnQryQV/wNjsJwAfEB4wAcp4fulKAVoCyAFiAlwMsjSdFsEMb7wfqVgSaAQcWAH6+fPn8N8D8rVLysQTUEh+TD/1cb9RWhSCaE7wI4F8T2fw3177yyniQXxDRhcijaDfznL+G4O+1I2+CAXzv/A/8TJQCLAuADZg8XoLgIW28b6henA7i/gMJAIeWX/luG6rPUVjtQuDP9ak/D0sBDhRcwWBO/H++6fljB4P4HEQX4v7cXmfZuF/ZuA4e4Pn1fX3bAuAAxsWvXE8+ler1d9f7M9Q1AOxftiyV0LjPVvKPCsp25xoGZymhFHyRjA9138vPvfDVOwrtA6JAST8s71L7n7TG57WFNi/gat12AGPgG8EDL/3e+/ybPoRsvV67bgFg/8rFHUnP+U5SqdtyNaT61dIAHKXgivzYd809644de6VBb00xJHuw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')
						.on('click', function () {
							window.open('https://mail.google.com/mail/u/0/#search/' + encodeURIComponent(vars.query.replace(/\n/g, '')));
						})
						.on('mousedown', function (e) {
							e.stopPropagation();
							e.preventDefault();
						})
				)
				.append(
					img.clone(true)
						.attr('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB1ElEQVQ4jc2RPWvTYRTFf/d5nuSfREUElVBplw5WCr4EpUQN1ehQurgojnYQFVzEzbUfod/AzW9QXxBrrJQqjWQopYhDKxiJWiht3v/Pcx1CKwWNo57pcDn3nMu58F9j8fIdU74wZfppZIc8z191qa3GsPEhBzqiMCCB/aCokW1R/apiV7FmqZNJfrzy7lW8a1A6U4yk1Xgkwd9GNQvYPwQGRGrByOM4lZ4ufnjdMADddiNLiKdQPdZnGcCgmjVebyUa7cHeAFANssN/k9gEdO9YjagaAAdgE8kNOp0FNGSBxK+GpKaJxAOCP4xqXgKnQAdVZFGdq+0pce70pYOu0y6q+nGU46gexZgt0un7hfLc8tNr9ySztnpI4tYQ1q4XKvMbuwazJy8eSQXNOWvfFCqlxmzxho02f0RJGKJZn9Ggm4hZEJH33rlPxvtRgiwXVt5+cQBR3N3nfJiRLt/nR8ZKWv28gkgVl0iiZCRoAeLrCC3r429ADGYS6BnYVLpKs/mEEO4SfF56lynBr2mUukk3tqg/h+qYqI6qMc9ClFrf28HZCWdb28Pi4xzoCVQHEGlpMpouVEo1gJfnJ61r1g9gkvXxpRfdPu/uoTzxUP4q+uf4CX9NzDK9gjicAAAAAElFTkSuQmCC')
						.on('click', function () {
							window.open('https://cloudair.jp/Tmlsearch/search?agencyCode=sfv&imei=' + encodeURIComponent(vars.query.replace(/\n/g, '')) + '&subUserId=&planStartDate=');
						})
						.on('mousedown', function (e) {
							e.stopPropagation();
							e.preventDefault();
						})
				)
				.append(
					img.clone(true)
						.attr('src', 'data:image/png;base64,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')
						.on('click', function () {
							window.open('https://freedive.cybozu.com/k/search?keyword=' + encodeURIComponent(vars.query.replace(/\n/g, '')) + '&app=174');
						})
						.on('mousedown', function (e) {
							e.stopPropagation();
							e.preventDefault();
						})
				)
				.append(
					img.clone(true)
						.attr('src', 'data:image/png;base64,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')
						.on('click', function () {
							window.open('https://freedive.cybozu.com/k/search?keyword=' + encodeURIComponent(vars.query.replace(/\n/g, '')) + '&app=515');
						})
						.on('mousedown', function (e) {
							e.stopPropagation();
							e.preventDefault();
						})
				)
		);
	};
	SearchButtons.prototype = {
		show: function () {
			this.container.show();
		},
		hide: function () {
			this.container.hide();
		}
	};
	/*---------------------------------------------------------------
	 kintone events
	---------------------------------------------------------------*/
	kintone.events.on(events.show, function (event) {
		if (!vars.buttons) vars.buttons = new SearchButtons();
		$('body').off('mousedown.vocabularysearch').on('mousedown.vocabularysearch', function (e) {
			vars.buttons.hide();
		});
		$('body').off('mouseup.vocabularysearch').on('mouseup.vocabularysearch', function (e) {
			if (vars.buttons.container.is(':visible')) return;
			if (window.getSelection) {
				vars.query = window.getSelection().toString().replace(/^\t/g, '').replace(/\t/g, ' ');
				if (vars.query.replace(/[ 　\n]+/g, '')) {
					vars.buttons.container.css({
						'left': (function () {
							var res = e.clientX;
							if (e.clientX + parseFloat(vars.buttons.container.css('width')) > $(window).width()) res = e.clientX - parseFloat(vars.buttons.container.css('width'));
							return res;
						})().toString() + 'px',
						'top': (function () {
							var res = e.clientY;
							if (e.clientY + parseFloat(vars.buttons.container.css('height')) > $(window).height()) res = e.clientY - parseFloat(vars.buttons.container.css('height'));
							return res;
						})().toString() + 'px',
					});
					vars.buttons.show();
				}
			}
		});
		return event;
	});
})(jTis, kintone.$PLUGIN_ID);
