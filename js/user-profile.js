function renderUserProfile(userProfileObj) {
    if (!userProfileObj) {
        userProfileObj = testUserProfileObj;
    }
    // Render user image
    const userImageRow = document.createElement('div');
    userImageRow.className = "row";
    const userImageCol = document.createElement('div');
    userImageCol.className = "col-lg";
    userImageCol.align = "center";
    const userImage = document.createElement('img');
    if (userProfileObj.images[0])
        userImage.src = userProfileObj.images[0]['url'];
    else
        userImage.src = 'https://statici.behindthevoiceactors.com/behindthevoiceactors/_img/chars/linus-van-pelt-charlie-browns-all-stars-46.9.jpg'
    userImage.className = "rounded-circle mt-4";
    userImage.style = "width:12em;height:12em";
    userImageCol.appendChild(userImage);
    userImageRow.appendChild(userImageCol);
    document.getElementById('user-info-container').appendChild(userImageRow);
    // Render user display name
    const userDisplayNameRow = document.createElement('div');
    userDisplayNameRow.className = "row";
    const userDisplayNameCol = document.createElement('div');
    userDisplayNameCol.className = "col-lg";
    userDisplayNameCol.align = "center";
    const userDisplayNameHeader = document.createElement('h2');
    userDisplayNameHeader.className = "text-white";
    userDisplayNameHeader.style = "padding-top:0.5em;"
    userDisplayNameHeader.innerHTML = 'Welcome, ' + userProfileObj.displayName + '!';

    userDisplayNameCol.appendChild(userDisplayNameHeader);

    userDisplayNameRow.appendChild(userDisplayNameCol);
    document.getElementById('user-info-container').appendChild(userDisplayNameRow);
}

function renderFavoriteGenres(userProfileObj) {
    if (!userProfileObj) {
        userProfileObj = testUserProfileObj;
    }
    const genreObj = { 'children': userProfileObj['topGenres'] };
    const diameter = 800;
    const color = d3.scaleOrdinal(d3.schemeCategory20);
    const bubble = d3.pack(genreObj)
        .size([diameter, diameter])
        .padding(1.5);
    const svg = d3.select("#genre-chart-column")
        .append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
        .attr("class", "bubble");
    const nodes = d3.hierarchy(genreObj)
        .sum(function(d) { return d.weight; });
    const node = svg.selectAll(".node")
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

function renderFavoriteAlbums(userProfileObj) {
    if (!userProfileObj) {
        userProfileObj = testUserProfileObj;
    }
    const albumObj = userProfileObj['topAlbums']
    // Compute number of rows needed
    const rowLength = Math.floor(albumObj.length / 5);
    if (albumObj.length % 5 > 0) rowLength++;
    // Number of albums we've filled into a column. Used to make sure we don't check an index out of bounds in the album array.
    let albumCount = 0;
    // Create rowLength number of rows with 4 columns each
    for (i = 0; i < rowLength; i++) {
        // Create a row div
        const rowDiv = document.createElement('div');
        rowDiv.className = 'row no-gutters';
        // Append 4 column divs into the row div.
        for (j = 0; j < 4; j++) {
            // If albumCount has exceeded album array length, then leave empty. Otherwise fill with album info.
            const colDiv = document.createElement('div');
            colDiv.className = 'col-sm';
            if (albumCount < albumObj.length) {
                // Create viewOverlayDiv for hover effect capability
                const viewOverlayDiv = document.createElement('div');
                viewOverlayDiv.className = 'view overlay mx-2';
                // Append the album img to viewOverlayDiv
                const albumArtImg = document.createElement('img');
                albumArtImg.className = 'img-fluid';
                albumArtImg.src = albumObj[albumCount].albumCoverImgURL;
                viewOverlayDiv.appendChild(albumArtImg);
                // Append maskDiv to viewOverlayDiv which enables the hover effect
                const maskDiv = document.createElement('div');
                maskDiv.className = 'mask flex-center rgba-white-strong';
                // Append text to maskDiv to show up when hovering
                const albumTitleP = document.createElement('p');
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
}

const refresh_token = localStorage.getItem('refreshToken');
const userProfileUrl = 'https://my-tunes-be.herokuapp.com/userProfileModel?refreshToken=' + refresh_token;

const subContainer = document.getElementById('sub-container');
subContainer.style.display = 'none';

let userProfileModel = localStorage.getItem('userProfileModel');

fetch(userProfileUrl)
.then(res => res.json())
.then(jsondata => {
    localStorage.setItem('userProfileModel',jsondata); // cache UserProfileModel
    subContainer.style.display = 'block';
    document.getElementById('loader').style.display = 'none';

    renderUserProfile(jsondata);
    renderFavoriteAlbums(jsondata);
    renderFavoriteGenres(jsondata);
});


