// find template and compile it
var templateSource = document.getElementById('results-template').innerHTML,
    template = Handlebars.compile(templateSource),
    resultsPlaceholder = document.getElementById('results'),
    playingCssClass = 'playing',
    audioObject = null;

var fetchTracks = function (albumId, callback) {
    var params = getHashParams();

    var access_token = params.access_token
    
    $.ajax({
        url: 'https://api.spotify.com/v1/albums/' + albumId,
        headers: {
            'Authorization': 'Bearer ' + access_token
          },
        success: function (response) {
            callback(response);
        }
    });
};

var searchAlbums = function (query) {
    var params = getHashParams();

    var access_token = params.access_token

    $.ajax({
        url: 'https://api.spotify.com/v1/search',
        headers: {
            'Authorization': 'Bearer ' + access_token
          },
        data: {
            q: query,
            type: 'album'
        },
        success: function (response) {
            console.log(response);
            resultsPlaceholder.innerHTML = template(response);
            console.log(resultsPlaceholder.innerHTML);
        }
    });
};

results.addEventListener('click', function (e) {
    var target = e.target;
    if (target !== null && target.classList.contains('cover')) {
        if (target.classList.contains(playingCssClass)) {
            audioObject.pause();
        } else {
            if (audioObject) {
                audioObject.pause();
            }
            fetchTracks(target.getAttribute('data-album-id'), function (data) {
                audioObject = new Audio(data.tracks.items[0].preview_url);
                audioObject.play();
                target.classList.add(playingCssClass);
                audioObject.addEventListener('ended', function () {
                    target.classList.remove(playingCssClass);
                });
                audioObject.addEventListener('pause', function () {
                    target.classList.remove(playingCssClass);
                });
            });
        }
    }
});

document.getElementById('search-form').addEventListener('submit', function (e) {
    e.preventDefault();
    searchAlbums(document.getElementById('query').value);
}, false);