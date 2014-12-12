var fs = require('fs');
var path = require('path');
var async = require('async');

// Get the files in article directory.
fs.readdir(__dirname + '/../article/', function (err, files) {
	var articlesCache = new Array();
	files.forEach(function (file) {
		async.waterfall([
			// 
			function (callback) {
				if (path.extname(file) === '.md') {
					var fileSrc = path.normalize(__dirname + '/../article/' + file);
					callback(null, fileSrc);
				}
				else
					callback(1);
			},
			// 
			function (fileSrc, callback) {
				fs.readFile(fileSrc, 'utf-8', function (err, data) {
					var lines = data.toString().split('\n');
					if (lines.length >= 6) {
						// Top checking.
						var top = /^---$/.test(lines[0]);
						// Title.
						var title = lines[1].match(/^title:\s{0,}(.{1,})$/);
						title = (title && title.length > 1) ? title[1] : false;
						// Date.
						var date = lines[2].match(/^date:\s{0,}(\d{4})\/(\d{2})\/(\d{2})$/);
						date = (date && date.length > 3) ? { year: date[1], month: date[2], day: date[3] } : false;
						// Time.
						var time = lines[3].match(/^time:\s{0,}(\d{2}):(\d{2})$/);
						time = (time && time.length > 2) ? { hour: time[1], minute: time[2] } : false;
						// Tags.
						var tags = lines[4].replace(/^tags:\s*|\s*$|( ) +/g, '$1');
						tags = (tags) ? tags.split(/\s*,\s*/) : false;
						// Bottom checking.
						var bottom = /^---$/.test(lines[5]);

						var result = top & bottom & (title !== false) & (date !== false) & (time !== false) & (tags !== false);
						if (result) {
							var articleCache = { title: title, date: date, time: time, tags: tags };
							articlesCache.push(articleCache);
							callback(null, fileSrc);
						}
						else
							callback(3, fileSrc);
					}
					else
						callback(2, fileSrc);
				});
			}
		], function (err, fileSrc) {
			console.log(articlesCache);
		});
	});

	
});