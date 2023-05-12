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
			'width': '60px',
			'z-index': '999999'
		});
		$('body').append(
			this.container
				// .append(
				// 	img.clone(true)
				// 	.attr('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAXc0lEQVR42u3db3Acd3kH8O/vt7t3J+HEDpHl1E4c48am1LhJsCVC4/w7RdhA8sYeZ4CUMJDpQEtDO6XUYAI4MFAxIdOBOMMM0ADFTIlcKJ3YAzW2bBzjVJKdvAgZCClJiJMQZNmyY0f3Z3d/T1+c7nQn2ZZOd3u7d/v9vMgr793e5fbR8zy/fwARERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERFRzKmw3vjgVZctdJC8wvfN5Rp6oUDaoaGUUa9DqxNG/JdssY9d9/zzfwz7SyKaK/klOpF3lvq+uRxKdyigDQB8D+PaMceN6JdynvvSResxEsb9NSwAPL1qVWIsc6bbVmq9AW6A4M8ALLSV0taUf+sDcEUEwCiAZyzIY57IT19pv3jwjqefzofxRRHNhvQj4b3Rfru2sF4MbgawUgQdtgOF8h+6APABz4VRCqNQ+I3SOGg8/I895g2pO9CQ33ngAWBo2bLLfC3vVwp3GsHbkkrBAPBEIBPfw/luTAGwlIINICsCrXBUIP/+Gpwfrv/d70KJmETnIntxqdHOnQryQV/wNjsJwAfEB4wAcp4fulKAVoCyAFiAlwMsjSdFsEMb7wfqVgSaAQcWAH6+fPn8N8D8rVLysQTUEh+TD/1cb9RWhSCaE7wI4F8T2fw3177yyniQXxDRhcijaDfznL+G4O+1I2+CAXzv/A/8TJQCLAuADZg8XoLgIW28b6henA7i/gMJAIeWX/luG6rPUVjtQuDP9ak/D0sBDhRcwWBO/H++6fljB4P4HEQX4v7cXmfZuF/ZuA4e4Pn1fX3bAuAAxsWvXE8+ler1d9f7M9Q1AOxftiyV0LjPVvKPCsp25xoGZymhFHyRjA9138vPvfDVOwrtA6JAST8s71L7n7TG57WFNi/gat12AGPgG8EDL/3e+/ybPoRsvV67bgFg/8rFHUnP+U5SqdtyNaT61dIAHKXgivzYd809644de6VBb00xJHuw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')
				// 	.on('click',function(){
				// 		window.open('https://mail.google.com/mail/u/0/#search/'+encodeURIComponent(vars.query.replace(/\n/g,'')));
				// 	})
				// 	.on('mousedown',function(e){
				// 		e.stopPropagation();
				// 		e.preventDefault();
				// 	})
				// )
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
						.attr('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAA9NJREFUeF7tWk1IVFEU/k7lqNnPUIJpiVFkokQppg0a+LMqdFVBLSKohRXRJiVsYeFGRCEIMtwE0iaoVkpBYAoKk2ZqBS4qtHRTUSqZ+DM2J2bEGHXGd9979848mTfrc873c8+57859jxDlP4py/bANsDsgyh2wRyDKG8DeBO0RsEcgyh2wRyBcDcCfGxnj3cDsELDwEaAYINYFOAtAmXURWwjlwDxwkTHxUNvn+CKQq1M5n5VElAJ6O5OYvN+1xQdG7K4FHawh7jvD+P1keW5CGSi/TSpnqcUC2fIrsD7lOqITToLyn0vhLqXISurckcDgaR2KDIQ68kCFvab5my6wSry7iDHTaUCRgRTneVDOI1MaTCUHo6y09YMAUom547whA3j4PmN2FFiYARw7QRm3/XW4p4wx3WZgKU2kJFWBshoM6fCh6krkrmyGZ8AEWwWpjlxQYZ8uHYEshBK5t5zxp1UBezklzYyBpgHcfYQxPyiHqaIqPgP4SzNj7gfgnV08ZcYlg/ZWaOpbM4DdpYyZdkW0w1XWATjPgXJagmoNaQB/qmeM3QwXy/DgxLpABe5lmkMb0JHI4J/hIaYSJa4Q2FECyqjV2QEqj7IqBfsexxvTQMmXQenVxvYA7r/AmGxRTFNFeQew5w4o/Zam8CX0oIHclcnwDKlgqK5mkPkWAQtuwHps/9QG0IEq4ZVfuwM6YhjsETHQOjFbykF5rZIMWAeHn1XOkxNUPCnJgMEKxnizdVZXkImRI3Hoc8A63AekGuDtTGXyjgl6b40wqQbwSBNj5Ko1lImwMHhFtvafoTenGFPPROAjH5NUCcpqlLMJBqphdzFjpiPyAjUYGGl/X0khx4RfbkTKpphs0PEBIS0rKepK4u4cxnx/pGSGxDW6+sIdsITMQ9WMb3XWMmDbWVDuY10LGShAV6L/BedopXUMiD0GKnitS4OpEfAlh/veP6Tb8aUgV7sp8bpHYNEABwPzke2ClJqQNzx6iel2MGKXJZQIJF0CZdbr5ryWKYaKRWQM9jULXXMr7wD/GLy7wvj1QC+W8XgF3wUskTHUAX4TuvMY873GRYlmStrsQsEZNsBvQtdhhuedqJTVcQllwPRLhNxUd1Ur/37IlAE+Rd6eE0zTL/SbkHYPtP/6f3z+cIOxMAFs2g46dNc0L1FCUoB4uIl5rB7096s27tbToKNPpeBqg2lHSCfC768xpt4Cc24/Om9IAW3OA5z5Qi8qtCnLjZBugFx66qvZBqj32NoIdgdYe33Us7M7QL3H1kawO8Da66Oend0B6j22NkLUd8A/AvgDUPPZxBoAAAAASUVORK5CYII=')
						.on('click', function () {
							window.open('https://freedive.cybozu.com/k/search?keyword=' + encodeURIComponent(vars.query.replace(/\n/g, '')));
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
