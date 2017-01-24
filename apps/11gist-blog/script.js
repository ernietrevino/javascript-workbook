'use strict';

$(document).ready(function() {
    // You code here
    function formatDate(date) {
        var arrDate = date.split('-');
        return arrDate[1] + '/' + arrDate[2] + '/'
        arrDate[0]
    }

    $.ajax('https://api.github.com/users/ernietrevino/gists', {
        success: function getGists(response) {
            response.forEach(function(post) {
                if (post.description.match('^#post')) {
                    var postDesc = post.description.replace(/#post/g, '');
                    var postURL = post.url.replace(/http:\/\/127.0.0.1:8080/g, '');
                    var postDate = formatDate(post.created_at.split('T')[0]);
                    var str = '<li><a href="#" data-url="' + postURL + '">' + postDesc + '</a> | ' + postDate + '</li>';
                    console.log(str);
                    $("#posts").append(str);
                }
            })
            $("#posts a").click(function() {
                var url = $(this).data('url');
                console.log(url);
                $.ajax(url, {
                    success: function postHandler(postResponse) {
                        var commURL = postResponse.comments_url.replace(/http:\/\/127.0.0.1:8080/g, '');
                        $("#post").empty();
                        $("#comments").empty();
                        $("#post").append(marked(postResponse.files["post.md"].content));
                        console.log(commURL);
                        $.ajax(commURL, {
                            success: function getComments(commResponse) {
                                commResponse.forEach(function(comment) {
                                    if (comment.user.login != null) {
                                        $("#comments").append("<li>" + comment.user.login + " - " + comment.body + "</li>");
                                    }
                                });
                            }
                        });
                    }
                });
            });
        }
    });
});
