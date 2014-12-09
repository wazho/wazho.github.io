function getArticleByTitle (title) {
	$.ajax({
		mimeType: 'text/plain; charset=utf-8',
		url: 'article/' + title + '.txt',
		type: 'get',
		dataType: 'text',
		async: false,
		success: function (data) {
			console.log(data);
			var markdownToHTML = markdown.toHTML(data);
			$('.content').html(markdownToHTML);
		}
	});
}

function getParameterByName (name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	results = regex.exec(location.search);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}