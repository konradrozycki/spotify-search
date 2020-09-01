(function () {
    var next;
    var baseUrl = "https://elegant-croissant.glitch.me/spotify";
    var img;

    $(document).bind("keypress", function (e) {
        if (e.keyCode == 13) {
            $("#submit-button").trigger("click");
        }
    });

    $("#submit-button").on("click", function () {
        var userInput = $('input[name="user-input"]').val();
        var albumOrArtist = $("select").val();

        $(".results-container").empty();

        $.ajax({
            url: baseUrl,
            data: {
                query: userInput,
                type: albumOrArtist,
            },
            success: function (payload) {
                payload = payload.artists || payload.albums;
                next =
                    payload.next &&
                    payload.next.replace(
                        "https://api.spotify.com/v1/search",
                        baseUrl
                    );
                console.log("payload: ", payload);

                var html = "";
                for (var i = 0; i < payload.items.length; i++) {
                    var extUrl = payload.items[i].external_urls.spotify;
                    if (payload.items[i].images.length > 0) {
                        img = payload.items[i].images[1].url;
                    } else {
                        img = "./img/no-image.png";
                    }

                    html +=
                        '<div class="name"><a href="' +
                        extUrl +
                        '" target="_blank" rel="nofollow"><span><img src="' +
                        img +
                        '"></span><p clas="item-title">' +
                        payload.items[i].name +
                        "</p></a></div>";
                }

                if (payload.total > 20) {
                    var button = $(
                        '<button id="loadmore-button">Load more!</button>'
                    );
                    $(".results-container").append(html);
                    $(".loadmore-container").append(button);
                } else {
                    $(".results-container").append(html);
                }

                if (location.search.indexOf("scroll=infinite") > -1) {
                    infiniteScrollCheck();
                }
            },
        });
    });

    $(document).on("click", "#loadmore-button", function () {
        $.ajax({
            url: next,
            success: function (payload) {
                payload = payload.artists || payload.albums;
                next =
                    payload.next &&
                    payload.next.replace(
                        "https://api.spotify.com/v1/search",
                        baseUrl
                    );

                var html = "";

                for (var i = 0; i < payload.items.length; i++) {
                    var extUrl = payload.items[i].external_urls.spotify;
                    if (payload.items[i].images.length > 0) {
                        img = payload.items[i].images[1].url;
                    } else {
                        img =
                            "https://cdns.iconmonstr.com/wp-content/assets/preview/2017/240/iconmonstr-spotify-1.png";
                    }

                    html +=
                        '<div class="name"><a href="' +
                        extUrl +
                        '" target="_blank" rel="nofollow"><span><img src="' +
                        img +
                        '"></span><p>' +
                        payload.items[i].name +
                        "</p></a></div>";
                }
                $(".results-container").append(html);
            },
        });
    });

    var timerId;

    function infiniteScrollCheck() {
        clearTimeout(timerId);

        if (
            $(document).scrollTop() + $(window).height() >=
            $(document).height() - 200
        ) {
            $.ajax({
                url: next,
                success: function (payload) {
                    payload = payload.artists || payload.albums;
                    next =
                        payload.next &&
                        payload.next.replace(
                            "https://api.spotify.com/v1/search",
                            baseUrl
                        );

                    var html = "";

                    for (var i = 0; i < payload.items.length; i++) {
                        var extUrl = payload.items[i].external_urls.spotify;
                        if (payload.items[i].images.length > 0) {
                            img = payload.items[i].images[1].url;
                        } else {
                            img =
                                "https://cdns.iconmonstr.com/wp-content/assets/preview/2017/240/iconmonstr-spotify-1.png";
                        }

                        html +=
                            '<div class="name"><a href="' +
                            extUrl +
                            '" target="_blank" rel="nofollow"><span><img src="' +
                            img +
                            '"></span><p>' +
                            payload.items[i].name +
                            "</p></a></div>";
                    }
                    $(".results-container").append(html);
                },
            });
        }
        timerId = setTimeout(infiniteScrollCheck, 1000);
    }
})();
