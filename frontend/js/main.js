// Advanced: Implement this with jQuery. Would this be easier with jQuery? Why or why not?

var baseUrl = 'http://localhost:4567/'

function httpGet(url, callback) { // our helper function for HTTP GET requests
  var req = new XMLHttpRequest()
  req.open('GET', url, true) // "true" means it is asynchronous
  req.addEventListener('load', function() {
    if (!req.responseText) {
      return
    }

    var res = JSON.parse(req.responseText)
    callback(res) // a function we want to run when the request returns data
  })
  req.send(null)
}

function search() {
  clearMovies()

  var input = document.getElementsByTagName('input')[0]
  var title = input.value

  if (!title) {
    alert('Please enter a movie title.')
    return
  }

  var searchUrl = baseUrl + 'search/' + title
  httpGet(searchUrl, addMovie)
}

function addMovie(movie) { // Advanced: Can we break this down into smaller functions?
  if (!movie.Title) { // How does this boolean check work? What are we preventing?
    alert('No movies found!')
    return
  }

  saveMovieData(movie) // What happens when "addMovie" is called by "addFavorites"? Could this be improved?

  var contentDiv = document.getElementById('content')
  var movieElement = document.createElement('div')
  movieElement.className = 'movie'

  var titleText = "Title: " + movie.Title + " Year: " + movie.Year + " Director: " + movie.Director
  // Advanced: This is a bit clunky, no? Do a google search of "string interpolation" and think about how you could use that here.
  var titleElement = document.createTextNode(titleText)

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

function saveMovieData(movie) {
  var saveButton = document.getElementById('save')

  saveButton.setAttribute('data-imdbID', movie.imdbID)
}

function likeMovie(movie) {
  var saveButton = document.getElementById('save')
  var imdbID = saveButton.getAttribute('data-imdbid')

  var likeUrl = baseUrl + 'favorite/' + imdbID

  httpGet(likeUrl, alert('Movie saved!'))
}

// TODO: function unlikeMovie(movie) {}

function getFavorites() {
  var favoritesUrl = baseUrl + 'favorites'

  httpGet(favoritesUrl, addFavorites)
}

function addFavorites(movies) {
  clearMovies()

  if (movies.Error) {
    alert('No favorites!')
    return
  }

  movies.forEach(function(movie) {
    addMovie(movie)
  })
}
