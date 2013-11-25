/*!
 * mongodb-query-builder
 * Copyright (c) 2013 Leonard Wu <leonard.wu92@imperial.ac.uk>
 * https://github.com/leonardw/mongodb-query-builder
 * MIT Licensed
 */

function parseStringCriteria(src, qobj, prop) {
	if (src) {
		var input = src.trim(), len = input.length, pre = '', post = '';
		if (len > 0) {
			var firstWildcard = input.indexOf('*');
			if (firstWildcard > -1 || input.indexOf('?')>-1) {
				input = input.replace(/\*+/g, '*'); //compress consecutive *s
				if (input !== '*') { //skip if only *s, same as doing nothing
					if (input.charAt(input.length - 1) === '*') {
						input = input.replace(/\*$/g, '');
					} else {
						post = '$';
					}
					if (firstWildcard === 0) {
						input = input.replace(/^\*/, '');
					} else {
						pre = '^';
					}
					input = input.replace(/\./g, '\\.'); //escape dot
					input = input.replace(/\?/g, '.'); //convert ? to regex
					input = input.replace(/\*+/g, '.*'); //convert * to regex
					qobj[prop] = {
						$regex : pre + input + post
					};
				}

			} else {
				qobj[prop] = src;
			}
		}
	}
}

function parseSelectCriteria(src, qobj, prop) {
	var r = [];
	for ( var key in src) {
		if (src.hasOwnProperty(key) && src[key] === true) r.push(key);
	}
	if (r.length === 1) {
		qobj[prop] = r[0];
	} else if (r.length > 1) {
		qobj[prop] = {"$in" : r.sort()};
	}
}
