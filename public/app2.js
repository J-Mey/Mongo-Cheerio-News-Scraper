/*$.getJSON("/articles", function(data) {
    for (var i = 0; i < data.length; i++) {
        $(".article-container").append("<p data-id='" + data[i]._id + "'>" + data[i].headline + "<br />" + data[i].url + "<br />" + data[i].summary + "</p>");
        $(".article-container").append("<a class='btn btn-success save'> Save Article </a>")
    }
})*/


$(document).ready(function(){
    var ArticleContainer = (".article-container")
    $(document).on("click", ".scrape-new", scrapeArticle);
    $(document).on("click", ".clear", clearArticle);

    function scrapeArticle(){
        $.get("/scrape").then(function(data){
            console.log(data)
        })
    };

    $.getJSON("/articles", function(data) {
        for (var i = 0; i < data.length; i++) {
            $(".article-container").append(("<a class='article-link' target='_blank'>")
            .attr("href", data[i].url)
            .text(data[i].headline))
        }
    })

    /*$.getJSON("/articles", function(data) {
        for (var i = 0; i < data.length; i++) {
            $(".article-container").append(("<a class='article-link'" + data[i]._id + "'>" + data[i].headline + "<br />" + data[i].url + "<br />" + data[i].summary + "</a>"),
            $("<a class='btn btn-success save'> Save Article </a>"))
        }
    })*/

    //function appendArticle(){
    
    //}

    function clearArticle(){
      $.get("/clear").then(function(data){
          console.log(data)
      })
      ArticleContainer.empty()
    }



})

