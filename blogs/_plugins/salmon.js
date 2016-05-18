function getArticleByTitle(title, callback) {
	$.ajax({
		mimeType: 'text/plain; charset=utf-8',
		url: 'article/' + title + '.md',
		type: 'get',
		dataType: 'text',
		async: false,
		success: function (data) {
			var markdownToHTML = marked(data);
			callback(true, markdownToHTML);
		},
		error: function (event) {
			callback(false);
		}
	});
}

function getArticlesInfo(callback) {
	$.ajax({
		dataType: "json",
		url: "generation.json",
		mimeType: "application/json; charset=utf-8",
		success: function (articlesInfo) {
			callback(articlesInfo);
		},
		error: function (event) {
			callback(false);
		}
	});
}

function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	results = regex.exec(location.search);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}