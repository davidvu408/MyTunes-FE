const refresh_token = localStorage.getItem('refreshToken');
var feedArea = document.getElementById("discover-feed");
// Mock objects
var user = {
    profile_picture: "images/default_profile.png",
    username: "",
    favorite_albums: "",
    favorite_genres: "",
    favorite_artists: ""
};
// JS obj w/ JSON fields
var postObj = {
    user_image: user.profile_picture,
    user_name: user.username,
    user_albums: user.favorite_albums,
    user_genres: user.favorite_genres,
    user_artists: user.favorite_artists
};
var genresObj = { genres: [{ name: "rock" }, { name: "pop" }, { name: "hip-hop" }, { name: "alternative" }] };
var artistsObj = { artists: [{ name: "Thom Yorke" }, { name: "Thom Yorke" }, { name: "Thom Yorke" }] };
var albumsObj = {
    albumlist: [
        { title: "ANIMA", artist: "Thom Yorke", album_art: "https://i.scdn.co/image/3ecc65012582d9507bfad45fb51d7bcdfc655f96" },
        { title: "ANIMA", artist: "Thom Yorke", album_art: "https://i.scdn.co/image/3ecc65012582d9507bfad45fb51d7bcdfc655f96" },
        { title: "ANIMA", artist: "Thom Yorke", album_art: "https://i.scdn.co/image/3ecc65012582d9507bfad45fb51d7bcdfc655f96" },
    ]
};
var postsObj = {
    posts: [
        { username: "Chris", profile_picture: "images/default_profile.png", recent_albums: albumsObj, favorite_genres: genresObj, favorite_artists: artistsObj },
        { username: "David", profile_picture: "images/default_profile.png", recent_albums: albumsObj, favorite_genres: genresObj, favorite_artists: artistsObj },
        { username: "Justin", profile_picture: "images/default_profile.png", recent_albums: albumsObj, favorite_genres: genresObj, favorite_artists: artistsObj }
    ]
};
// Make GET request for discovery feed data and render the users listed within the response
var urlParams = new URLSearchParams(window.location.search);
var currPageNum = urlParams.get('page');
if(currPageNum == null) {
    currPageNum = 0;
}
const httpDiscoveryFeed = new XMLHttpRequest();
const discoveryFeedUrl = 'https://my-tunes-be.herokuapp.com//discoveryFeed?pageIndex=' + currPageNum + '&refreshToken=' + refresh_token;
httpDiscoveryFeed.open("GET", discoveryFeedUrl);
httpDiscoveryFeed.onreadystatechange = function() {
    if (httpDiscoveryFeed.readyState == 4 && httpDiscoveryFeed.status == 200) {
        var discoveryFeedObj = JSON.parse(httpDiscoveryFeed.response);
        // Create div row elements for each post
        for (i = 0; i < discoveryFeedObj.length; i++) {
            var currUser = discoveryFeedObj[i];
            var rowDiv = document.createElement('div');
            rowDiv.className = "postDiv row h-100 transparent";
            // Create columns in each row div to separate different elements of each post
            // such as username, profile pic, albums, artists, and genres
            for (j = 0; j < 5; j++) {
                var colDiv = document.createElement('div');
                colDiv.className = 'col-md';
                colDiv.style = "margin: 2px;";

                // Fill the correct columns with their respective content
                // 0 = profilepic, 1 = username, 2 = recent_albums, 3 = favorite_genres, 4 = favorite_artists
                switch (j) {
                    case 0:
                        // Append user profile picture to the first colDiv
                        var picImg = document.createElement('img');
                        colDiv.className = " col-1";
                        picImg.className = 'img-fluid rounded-circle';
                        if (currUser['avatarURL'])
                            picImg.src = currUser['avatarURL'];
                        else
                            picImg.src = 'images/default_profile.png';
                        colDiv.appendChild(picImg);
                        break;
                    case 1:
                        // Append username to the second colDiv
                        var nameTxt = document.createElement('p');
                        colDiv.className = " col-md-10 my-auto";
                        nameTxt.className = "text-md text-light my-auto";
                        nameTxt.innerHTML = currUser['displayName'];
                        colDiv.appendChild(nameTxt);
                        break;
                    case 2:
                        var albumDiv = document.createElement('div');
                        albumDiv.className = "row";
                        // Append each album image to the albumDiv row element
                        for (k = 0; k < 3; k++) {
                            var albumCol = document.createElement('div');
                            albumCol.className = "col-sm";
                            var albumImg = document.createElement('img');
                            colDiv.className = " col-8";
                            albumImg.className = "img-fluid";
                            albumImg.src = postsObj.posts[i].recent_albums.albumlist[k].album_art;
                            albumCol.appendChild(albumImg);
                            albumDiv.appendChild(albumCol);
                        }
                        colDiv.appendChild(albumDiv);
                        break;
                    case 3:
                        // Append favorite genres to the appropriate colDiv
                        var genreNames = document.createElement('p');
                        genreNames.className = "text-sm text-light";
                        colDiv.className = " col-6";
                        genreNames.innerHTML = "Favorite Genres: <br>";
                        for (k = 0; k < currUser['topGenres'].length; k++) {
                            genreNames.innerHTML += currUser['topGenres'][k];
                            if (k < currUser['topGenres'].length - 1)
                                genreNames.innerHTML += ", ";
                        }
                        colDiv.appendChild(genreNames);
                        break;
                    case 4:
                        // Append favorite arstist to the appropriate colDiv
                        var artistNames = document.createElement('p');
                        artistNames.className = "text-sm text-light";
                        colDiv.className = " col-6";
                        artistNames.innerHTML = "Favoite Artists: <br>";
                        for (k = 0; k < currUser['topArtists'].length; k++) {
                            artistNames.innerHTML += currUser['topArtists'][k];
                            if (k < currUser['topArtists'].length - 1)
                                artistNames.innerHTML += ", ";
                        }
                        colDiv.appendChild(artistNames);
                        break;
                    default:
                        break;
                }
                rowDiv.appendChild(colDiv);
            }
            feedArea.appendChild(rowDiv);
        }
    }
};
httpDiscoveryFeed.send();
