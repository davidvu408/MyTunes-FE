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

            //
            // Render Bargraph
            //
            
        var songObj = userProfileObj['songTimeRange'];

        // set the dimensions and margins of the graph
        var margin = {top: 20, right: 30, bottom: 40, left: 90},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

        var svg2 = d3.select("#song-time-graph")
            .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

        // load the data
        d3.json(songObj, function(data) {

            // Add X axis
            var x = d3.scaleLinear()
                .domain([0, 150])
                .range([0, width]);
            svg2.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("transform", "translate(-10,0)rotate(-45)")
                .style("text-anchor", "end")
                .attr("class", "xAxis");

            // Y axis
            var y = d3.scaleBand()
                .range([0, height])
                .domain(data.map(function(d) { return d.year; }))
                .padding(.1);
            svg2.append("g")
                .call(d3.axisLeft(y))
                .attr("class", "yAxis");

            //Bars
            svg2.selectAll("myRect")
                .data(data)
                .enter()
                .append("rect")
                .attr("x", x(0))
                .attr("y", function(d) { return y(d.year); })
                .attr("width", function(d) { return x(d.value); })
                .attr("height", y.bandwidth())
                .attr("fill", "#69b3a2");

            // text label for the x axis
            svg2.append("text")             
                .attr("transform",
                        "translate(" + (width/2) + " ," + 
                                    (height + margin.top + 20) + ")")
                .style("text-anchor", "middle")
                .style("stroke", "white")
                .text("value");

            // text label for the y axis
            svg2.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x",0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .style("stroke", "white")
                .text("year");
        });

        //
        // Render song popularity chart
        //

        var popObject = userProfileObj['songPopularity'];

        var svg3 = d3.select("#song-pop-graph")
            .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

        // Load the data
        d3.json(popObject, function(error, data){

            // Add X axis
            var x = d3.scaleLinear()
                .range([0, width])
                .domain(data.songPopValue);
            svg3.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("transform", "translate(-10,0)rotate(-45)")
                .style("text-anchor", "end")
                .attr("class", "xAxis");

            // Y axis
            var y = d3.scaleBand()
                .range([0, height])
                .domain(data.trackCount)
                .padding(.1);
            svg3.append("g")
                .call(d3.axisLeft(y))
                .attr("class", "yAxis");

            //Bars
            console.log(data.songPopularity);
            svg3.selectAll("myRect")
                .data(data.songPopularity)
                .enter()
                .append("rect")
                .attr("x", x(0))
                .attr("y", function(d) { return y(d); })
                .attr("width", function(d) { return x(d); })
                .attr("height", y.bandwidth())
                .attr("fill", "#69b3a2");

            // text label for the x axis
            svg3.append("text")             
                .attr("transform",
                        "translate(" + (width/2) + " ," + 
                                    (height + margin.top + 20) + ")")
                .style("text-anchor", "middle")
                .style("fill", "white")
                .text("value");

            // text label for the y axis
            svg3.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x",0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("song popularity");
        });
    }
};
httpUserProfile.send();