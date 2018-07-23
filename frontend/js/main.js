// Advanced: Implement this with jQuery. Would this be easier with jQuery? Why or why not?

var baseUrl = 'http://localhost:4567/'

function httpGet(url, callback) { // our helper function for HTTP GET requests
  var req = new XMLHttpRequest()
  console.log('httpGet -> url: ', url)
  req.open('GET', url, true) // "true" means it is asynchronous
  req.addEventListener('load', function() {
    callback(req.responseText) // a function we want to run when the request returns data
  })
  req.send(null)
}

function search() {
  var input = document.getElementsByTagName('input')[0]
  var title = input.title

  var searchUrl = baseUrl + 'search/' + title

  httpGet(searchUrl, addMovie)
}

function addAllMovies(movies) {
  console.log('addAllMovies')
  clearMovies()

  if (movies.Error) {
    alert('No movies found!')
    return
  }

  console.log('movies.length: ', movies.length)

  if (movies.length > 1) {
    var contentDiv = document.getElementById('content')

    movies.forEach(function(movie) {
      var movieElement = createMovieElement(movie)
      contentDiv.appendChild(movieElement)
    })
  } else if (movies.length == 1) {
    addMovie(movies)
  }
}

function addMovie(movie) { // create movie element
  console.log('addMovie')
  var contentDiv = document.getElementById('content')
  var movieElement = document.createElement('div')
  movieElement.className = 'movie'

  var titleText = "Title: " + movie.Title + " Year: " + movie.Year + " Director: " + movie.Director
  // Advanced: This is a bit clunky, no? Do a google search of "string interpolation" and think about how you could use that here.
  var titleElement = document.createTextNode(titleText)
  // like button

  titleElement.onclick = function() { // Advanced: Could this be abstracted to a separate function?
    var detailText = "Plot: " + movie.Plot
    var detailElement = document.createTextNode(detailText)
    // TODO: add link to movie's Wikipedia page (or search for Wikipedia for the movie title)

    titleElement.insertAdjacentElement('afterend', detailElement)
  }

  movieElement.appendChild(titleElement)
  contentDiv.appendChild(movieElement)
}

function clearMovies() {
  var contentDiv = document.getElementById('content')

  while (contentDiv.firstChild) { // Advanced: Why does this work? Can you explain this boolean check?
    contentDiv.removeChild(contentDiv.firstChild)
  }
}

function likeMovie(movie) {
  console.log('likeMovie')
  var likeUrl = baseUrl + 'favorite/' + movie.name + '/' + movie.oid

  httpGet(likeUrl, alert('Movie saved!'))
}

// TODO: function unlikeMovie(movie) {}

function getFavorites() {
  var favoritesUrl = baseUrl + 'favorites'

  httpGet(favoritesUrl, addAllMovies)
}
