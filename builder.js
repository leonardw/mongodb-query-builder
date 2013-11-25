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
			if (firstWildcard > -1) {
				input = input.replace(/\*+/, '*'); //compress consecutive *s
				if (input !== '*') { //skip if only *s, same as doing nothing
					if (input.charAt(input.length - 1) === '*') {
						input = input.replace(/\*$/, '');
					} else {
						post = '$';
					}
					if (firstWildcard === 0) {
						input = input.replace(/^\*/, '');
					} else {
						pre = '^';
					}
					input = input.replace(/\./, '\\.'); //escape dot
					input = input.replace(/\*+/, '.*'); //convert * to regex
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