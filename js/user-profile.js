const refresh_token = localStorage.getItem('refreshToken');
// Make GET request for user info and render user image and display name
const httpUserProfile = new XMLHttpRequest();
const userProfileUrl = 'https://my-tunes-be.herokuapp.com/userProfileModel?refreshToken=' + refresh_token;
httpUserProfile.open("GET", userProfileUrl);
httpUserProfile.onreadystatechange = function() {
    if (httpUserProfile.readyState == 4 && httpUserProfile.status == 200) {
        var userProfileObj = JSON.parse(httpUserProfile.response);
        var albumObj = userProfileObj['topAlbums']
        var genreObj = { 'children': userProfileObj['topGenres'] };
        var userObj = userProfileObj;

        // Render user image
        var userImageRow = document.createElement('div');
        userImageRow.className = "row";
        var userImageCol = document.createElement('div');
        userImageCol.className = "col-lg";
        userImageCol.align = "center";
        var userImage = document.createElement('img');
        if (userObj.images[0])
            userImage.src = userObj.images[0]['url'];
        else
            userImage.src = 'https://statici.behindthevoiceactors.com/behindthevoiceactors/_img/chars/linus-van-pelt-charlie-browns-all-stars-46.9.jpg'
        userImage.className = "rounded-circle mt-4";
        userImage.style = "width:12em;height:12em";
        userImageCol.appendChild(userImage);
        userImageRow.appendChild(userImageCol);
        document.getElementById('user-info-container').appendChild(userImageRow);
        // Render user display name
        var userDisplayNameRow = document.createElement('div');
        userDisplayNameRow.className = "row";
        var userDisplayNameCol = document.createElement('div');
        userDisplayNameCol.className = "col-lg";
        userDisplayNameCol.align = "center";
        var userDisplayNameHeader = document.createElement('h2');
        userDisplayNameHeader.className = "text-white";
        userDisplayNameHeader.style = "padding-top:0.5em;"
        userDisplayNameHeader.innerHTML = userObj.displayName;
        // Render follow button
        var followButton = document.createElement('button');
        followButton.className = 'followBtn rounded mb-4 btn-outline-light';
        followButton.type = 'button';
        followButton.innerHTML = "Follow";
        userDisplayNameCol.appendChild(userDisplayNameHeader);
        userDisplayNameCol.appendChild(followButton);
        userDisplayNameRow.appendChild(userDisplayNameCol);
        document.getElementById('user-info-container').appendChild(userDisplayNameRow);
        // Render favorite albums
        // Compute number of rows needed
        var rowLength = Math.floor(albumObj.length / 5);
        if (albumObj.length % 5 > 0) rowLength++;
        // Number of albums we've filled into a column. Used to make sure we don't check an index out of bounds in the album array.
        var albumCount = 0;
        // Create rowLength number of rows with 4 columns each
        for (i = 0; i < rowLength; i++) {
            // Create a row div
            var rowDiv = document.createElement('div');
            rowDiv.className = 'row no-gutters';
            // Append 4 column divs into the row div.
            for (j = 0; j < 4; j++) {
                // If albumCount has exceeded album array length, then leave empty. Otherwise fill with album info.
                var colDiv = document.createElement('div');
                colDiv.className = 'col-sm';
                if (albumCount < albumObj.length) {
                    // Create viewOverlayDiv for hover effect capability
                    var viewOverlayDiv = document.createElement('div');
                    viewOverlayDiv.className = 'view overlay mx-2';
                    // Append the album img to viewOverlayDiv
                    var albumArtImg = document.createElement('img');
                    albumArtImg.className = 'img-fluid';
                    albumArtImg.src = albumObj[albumCount].albumCoverImgURL;
                    viewOverlayDiv.appendChild(albumArtImg);
                    // Append maskDiv to viewOverlayDiv which enables the hover effect
                    var maskDiv = document.createElement('div');
                    maskDiv.className = 'mask flex-center rgba-white-strong';
                    // Append text to maskDiv to show up when hovering
                    var albumTitleP = document.createElement('p');
                    albumTitleP.className = 'text-break black-text text-center font-weight-bold';
                    albumTitleP.innerHTML = albumObj[albumCount].name; //+ "<br>" + albumObj.albums[albumCount].artist;
                    maskDiv.appendChild(albumTitleP);
                    viewOverlayDiv.appendChild(maskDiv);
                    colDiv.appendChild(viewOverlayDiv);
                    albumCount++;
                }
                rowDiv.appendChild(colDiv);
            }
            // Append the row div onto collageContainer div
            document.getElementById('collage-container').appendChild(rowDiv);
        }
        // Render bubble chart, uses v4 of d3
        var diameter = 800;
        var color = d3.scaleOrdinal(d3.schemeCategory20);
        var bubble = d3.pack(genreObj)
            .size([diameter, diameter])
            .padding(1.5);
        var svg = d3.select("#genre-chart-column")
            .append("svg")
            .attr("width", diameter)
            .attr("height", diameter)
            .attr("class", "bubble");
        var nodes = d3.hierarchy(genreObj)
            .sum(function(d) { return d.weight; });
        var node = svg.selectAll(".node")
            .data(bubble(nodes).descendants())
            .enter()
            .filter(function(d) {
                return !d.children
            })
            .append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
        node.append("title")
            .text(function(d) {
                return d.name + ": " + d.weight;
            });
        node.append("circle")
            .attr("r", function(d) {
                return d.r;
            })
            .style("fill", function(d, i) {
                return color(i);
            });
        node.append("text")
            .attr("dy", ".2em")
            .style("text-anchor", "middle")
            .text(function(d) {
                return d.data.name;
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", function(d) {
                return d.r / 5;
            })
            .attr("fill", "white");

        d3.select(self.frameElement)
            .style("height", diameter + "em");
    }
};
httpUserProfile.send();