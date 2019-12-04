const refresh_token = localStorage.getItem('refreshToken');
var feedArea = document.getElementById("discover-feed");


// Make GET request for activity feed info
const httpActivityFeed = new XMLHttpRequest();
const activityFeedUrl = 'https://my-tunes-be.herokuapp.com/activityFeed';
httpActivityFeed.open("GET", activityFeedUrl); 
httpActivityFeed.onreadystatechange = function() {
     if (httpActivityFeed.readyState == 4 && httpActivityFeed.status == 200) {
          var activityFeedObj = JSON.parse(httpActivityFeed.response);

          for (i = 0; i < activityFeedObj.length; i++) {
               var currEntry = activityFeedObj[i];

               // mock objects
               var currUser = activityFeedObj[i]; 
               var rowDiv = document.createElement('div');
               rowDiv.className = "postDiv container bottom5 transparent";
               // Create columns in each row div to separate different elements of each post
               // such as username, profile pic, albums, artists, and genres
               for (j = 0; j < 3; j++) {
                    var colDiv = document.createElement('div');
                    colDiv.className = 'row';

                    // Fill the correct columns with their respective content
                    // 0 = profile_picture, 1 = username, 2 = recently_played_URI
                    switch (j) {
                    case 0:
                         // Append user profile picture to the first colDiv
                         const innerRow = document.createElement('div');
                         innerRow.className = 'row';
                         innerRow.style.marginBottom = '10px';

                         var picImg = document.createElement('img');
                         colDiv.className = " col-1";
                         picImg.className = 'rounded-circle';
                         picImg.style.height = '25px';
                         picImg.style.width = '25px';
                         picImg.style.marginRight = '5px';
                         if (currUser['profile_picture'])
                              picImg.src = currUser['profile_picture'];
                         else
                              picImg.src = 'images/default_profile.png';

                          // Append username to the second colDiv
                         var nameTxt = document.createElement('p');
                         colDiv.className = " col-md-10 my-auto";
                         nameTxt.className = "text-md text-light my-auto";
                         nameTxt.innerHTML = currUser['userId'] + " was listening to..";

                         innerRow.appendChild(picImg);
                         innerRow.appendChild(nameTxt);
                         rowDiv.appendChild(innerRow);
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
