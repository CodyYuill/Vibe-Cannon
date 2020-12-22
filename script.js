$(document).ready(function () {
  var previousArtist = "";
  function startSearch(e) {
    e.preventDefault();
    var thisArtist = $("#artist").val();
    if ($("#useVimeo").is(":checked")) {
      vimVids();
    } else {
      ytVids();
    }
    if (thisArtist) {
      if (thisArtist != previousArtist) {
        previousArtist = thisArtist;
        getLyrics();
      }
    } else {
      setLyricsMessage();
    }
  }

  function ytVids() {
    $("#videos").empty(); // clears videos when submit button clicked

    var key = "AIzaSyAa1zc7O33vu-6VA17JJFLnWPC9ckiXcOw";
    var search = $("#song").val() + " " + $("#artist").val();
    var maxResults = 3;
    var ytUrl =
      "https://www.googleapis.com/youtube/v3/search?key=" +
      key +
      "&videoEmbeddable=true&type=video&part=snippet&maxResults=" +
      maxResults +
      "&q=" +
      search;

    //creating ajax call for when the submit button is clicked.
    $.ajax({
      url: ytUrl,
      method: "GET",
    }).then(function (data) {
      // for each loop for the data recieved.
      $.each(data.items, function (i, item) {
        //created p tag for video title.
        var p = $("<p>");
        p.text(item.snippet.title);
        //append p tag and iframe with video id to video section.
        $("#videos").append(
          p,
          `<iframe width="420" height="315" src="https://www.youtube.com/embed/${item.id.videoId}" frameborder="0" allow="accelerometer; encrypted-media" allowfullscreen></iframe>`
        );
      });
    });
  }

  function vimVids() {
    $("#videos").empty(); // clears videos when submit button clicked
    //var test = "beyonce";
    var accessToken = "1d50cb8f1dbb330003a778e658d15053";
    var numResults = 3;
    var search = $("#song").val() + " " + $("#artist").val();
    var vimUrl =
      "https://api.vimeo.com/videos?per_page=" + numResults + "&query=" +
      search +
      "&access_token=" +
      accessToken;
    //creating ajax call for when the submit button is clicked.
    $.ajax({
      url: vimUrl,
      method: "GET",
    }).then(function (data) {
      // for  loop for the data recieved.
      $.each(data.data, function (i, item) {
        //created p tag for video title.
        var p = $("<p>");
        p.text(item.name);
        //append p tag and iframe with video id to video section.
        $("#videos").append(p, `${item.embed.html}`);

        setIframeWidthHeight();
      });
    });
  }
  //Function to get lyrics
  function getLyrics() {
    $("#lyricsPlacement").empty(); // clears videos when submit button clicked

    var artist = $("#artist").val();
    var song = $("#song").val();
    var lyricUrl = "https://api.lyrics.ovh/v1/" + artist + "/" + song;
    $.ajax({
      url: lyricUrl,
      method: "GET",
    }).then(function (response) {
      // parse lyrics
      lyrics = response.lyrics.replace(/\n/g, "<br>");

      // adding song-lyrics to the lyrics div
      //$("#song-lyrics").append("<h1 id='lyrics-header'>Lyrics</h1>");
      //$("#song-lyrics").append("<h6>Artist: " + artist + " | Song: " + song + "</h6>");
      if (lyrics) {
        $("#lyricsPlacement").append(lyrics);
      } else {
        var noLyricsMessage =
          "WHOOPS! We can't find the lyrics you're looking for!";
        $("#lyricsPlacement").append(noLyricsMessage);
      }
    });
  }

  function setIframeWidthHeight() {
    $("iframe").attr("width", "420");
    $("iframe").attr("height", "315");
  }

  function setLyricsMessage() {
    $("#lyricsPlacement").empty();
    var noArtistMessage = $("<p>").text(
      "To get lyrics an Artist must be provided."
    );
    $("#lyrics").append(noArtistMessage);
  }

  $("#search-btn").click(startSearch);

  // Theme Switcher
  var themeSwitcher = document.querySelector("#theme-switcher");
  var body = document.querySelector("body");
  var cannonImg = document.getElementById("cannon-img");
  var mode = "light";
  // Set everything to light mode at the start
  body.setAttribute("class", "light");
  cannonImg.src = "./img/logo.png";

  themeSwitcher.addEventListener("click", function () {
    // Switch from light to dark
    if (mode === "light") {
      mode = "dark";
      body.setAttribute("class", "dark");
      cannonImg.src = "./img/logoD.png";
    } else {
      // Switch from dark to light
      mode = "light";
      body.setAttribute("class", "light");
      cannonImg.src = "./img/logo.png";
    }
  });
});
