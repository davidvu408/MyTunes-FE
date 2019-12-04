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

var recentlyPlayed = {
     entries: [
          { username: "Justin", profile_picture: "images/default_profile.png", recently_played_URI: ["spotify:album:5hB4jVN4ZHpubyiMmW81K1", "spotify:album:4UhaqAS8V23KozB3dzLMax", "spotify:album:06S2JBsr4U1Dz3YaenPdVq"] },
          { username: "David", profile_picture: "images/default_profile.png", recently_played_URI: ["spotify:album:4UhaqAS8V23KozB3dzLMax", "spotify:track:4S4Mfvv03M1cHgIOJcbUCL"] }
     ]
}

// Make GET request for activity feed info
const httpActivityFeed = new XMLHttpRequest();
const activityFeedUrl = 'https://my-tunes-be.herokuapp.com/activityFeed';
httpActivityFeed.open("GET", activityFeedUrl); 
httpActivityFeed.onreadystatechange = function() {
     if (httpActivityFeed.readyState == 4 && httpActivityFeed.status == 200) {
          var activityFeedObj = JSON.parse(httpActivityFeed.response);
          for (i = 0; i < recentlyPlayed['entries'].length; i++) {
               var currEntry = activityFeedObj[i];

               // mock objects
               var currUser = recentlyPlayed['entries'][i]; 
               var rowDiv = document.createElement('div');
               rowDiv.className = "postDiv row-auto bottom5 transparent";
               // Create columns in each row div to separate different elements of each post
               // such as username, profile pic, albums, artists, and genres
               for (j = 0; j < 3; j++) {
                    var colDiv = document.createElement('div');
                    colDiv.className = 'col-lg-auto no-gutters';
                    colDiv.style = "margin: 2px;";

                    // Fill the correct columns with their respective content
                    // 0 = profile_picture, 1 = username, 2 = recently_played_URI
                    switch (j) {
                    case 0:
                         // Append user profile picture to the first colDiv
                         var picImg = document.createElement('img');
                         colDiv.className = " col-1";
                         picImg.className = 'img-fluid rounded-circle';
                         if (currUser['profile_picture'])
                              picImg.src = currUser['profile_picture'];
                         else
                              picImg.src = 'images/default_profile.png';
                         colDiv.appendChild(picImg);
                         break;
                    case 1:
                         // Append username to the second colDiv
                         var nameTxt = document.createElement('p');
                         colDiv.className = " col-md-10 my-auto";
                         nameTxt.className = "text-md text-light my-auto";
                         nameTxt.innerHTML = currUser['username'] + " is listening to..";
                         colDiv.appendChild(nameTxt);
                         break;
                    case 2:
                         var playerDiv = document.createElement('div');
                         playerDiv.className = "row";
                         // Split current URI by delimiter ":" 
                         var splitURI = currEntry['playlistUri'].split("%3A");
                         // Save the media type specified in the URI (track, album, etc);
                         var mediaType = splitURI[1];
                         // Save the media ID
                         var mediaID = splitURI[2];
                         // Compose the src string
                         var mediaSrc = "https://open.spotify.com/embed/" + mediaType + "/" + mediaID;

                         var musicCol = document.createElement('div');
                         musicCol.className = "col-sm-auto no-gutters";

                         // create spotify play iframe and add to musicCol
                         var spotifyPlay = document.createElement('iframe');
                         spotifyPlay.src = mediaSrc;
                         spotifyPlay.width = "700";
                         spotifyPlay.height = "380";
                         spotifyPlay.frameBorder = "0";
                         spotifyPlay.allowTransparency = "true";
                         spotifyPlay.allow = "encrypted-media";

                         musicCol.appendChild(spotifyPlay);
                         playerDiv.appendChild(musicCol);

                         /* Append each player to the playerDiv row element
                         for (k = 0; k < currUser['recently_played_URI'].length; k++) {
                              // Split current URI by delimiter ":" 
                              var splitURI = currUser['recently_played_URI'][k].split(":");
                              // Save the media type specified in the URI (track, album, etc);
                              var mediaType = splitURI[1];
                              // Save the media ID
                              var mediaID = splitURI[2];
                              // Compose the src string
                              var mediaSrc = "https://open.spotify.com/embed/" + mediaType + "/" + mediaID;

                              var musicCol = document.createElement('div');
                              musicCol.className = "col-sm-auto no-gutters";

                              // create spotify play iframe and add to musicCol
                              var spotifyPlay = document.createElement('iframe');
                              spotifyPlay.src = mediaSrc;
                              spotifyPlay.width = "300";
                              spotifyPlay.height = "380";
                              spotifyPlay.frameBorder = "0";
                              spotifyPlay.allowTransparency = "true";
                              spotifyPlay.allow = "encrypted-media";

                              musicCol.appendChild(spotifyPlay);
                              playerDiv.appendChild(musicCol);
                         }
                         */
                         colDiv.appendChild(playerDiv);
                         break;
                    default:
                         break;
                    }
                    rowDiv.appendChild(colDiv);
               }
               feedArea.appendChild(rowDiv);
          }
     }
}
httpActivityFeed.send();
