var fs     = require('fs');
var path   = require('path');
var async  = require('async');
var colors = require('colors');

// Get the files in article directory.
fs.readdir(__dirname + '/../article/', function (err, files) {
	var articlesCache = new Array();
	async.map(files, function (file, callback) {
		async.waterfall([
			// 
			function (callback) {
				if (path.extname(file) === '.md')
					callback(null, file);
				else
					callback(1, file);
			},
			// 
			function (file, callback) {
				var fileSrc = path.normalize(__dirname + '/../article/' + file);
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
							var articleCache = { url: file, title: title, date: date, time: time, tags: tags };
							articlesCache.push(articleCache);
							callback(null, file, articleCache);
						}
						else
							callback(3, file);
					}
					else
						callback(2, file);
				});
			}
		], function (err, fileName, articleCache) {
			switch (err) {
				case 1:
					console.log(("=================== [Skip] Extential name is not '.md'. ===================\n    File: " + fileName + "\n===========================================================================\n").toString().grey);
					break;
				case 2:
				case 3:
					console.log(("===================== [Error] Aritcle rule is wrong. ======================\n    File: " + fileName + "\n===========================================================================\n").toString().red);
					break;
				case null:
					console.log(("===================== [Success] Loading the article. ======================\n    File: " + fileName + "\n===========================================================================\n").toString().green);
					// console.log(("===================== [Success] Loading the article. ======================\n    File: " + fileName + "\n\n" + JSON.stringify(articleCache, undefined, 2) + "\n===========================================================================\n").toString().green);
					break;
			}
			callback();
		});
	}, function (err) {
		console.log(articlesCache);
		fs.writeFile(__dirname + "/../generation.json", JSON.stringify(articlesCache));
	});
});