function getArticleByTitle (title, callback) {
	$.ajax({
		mimeType: 'text/plain; charset=utf-8',
		url: 'article/' + title + '.md',
		type: 'get',
		dataType: 'text',
		async: false,
		success: function (data) {
			var markdownToHTML = markdown.toHTML(data);
			callback(true, markdownToHTML);
		},
		error: function (event) {
			callback(false);
		}
	});
}

function getArticlesInfo (callback) {
	$.ajax({
		url: 'article/',
		async: false,
		success: function (data) {
			callback(true);
		},
		error: function (event) {
			callback(false);
		}
	});
}

function getParameterByName (name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	results = regex.exec(location.search);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}