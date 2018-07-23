require 'net/http'
require 'sinatra'
require 'json'

omdbApiKey = '9f4d607a'

get '/favorites' do
  response.header['Content-Type'] = 'application/json'
  favorites = File.readlines('data.txt').map!(&:chomp) # The & symbol is a nil check. It will not call the following method if the original value is nil.
  # Advanced: What is the difference between "map" and "map!"?

  return 204 if favorites.empty? # What does the 204 code mean?

  favs_data = []

  favorites.each { |id|
    omdb_uri = URI("http://www.omdbapi.com/?apikey=#{omdbApiKey}&i=#{id}")
    res = Net::HTTP.get_response(omdb_uri)
    favs_data.push(JSON.parse(res.body)) unless res['Error']
  }

  JSON.generate(favs_data)
end

get '/favorite/:id' do
  return 'Invalid Request' unless params['id']

  favorites = File.readlines('data.txt').map!(&:chomp) # See line 9

  unless favorites.include?(params['id'])
    favorites.push(params['id'])
    File.open('data.txt', 'w') do |file|
      file.puts favorites
    end
  end

  201
end

get '/search/:title' do
  omdb_uri = URI("http://www.omdbapi.com/?apikey=#{omdbApiKey}&t=#{params['title']}")
  res = Net::HTTP.get_response(omdb_uri)
  res.body
end

# Advanced: Are we repeating certain processes? Could we abstract a few helper functions?

# Advanced: Add a catch-all route to return 404 for requests with undefined routes. Would that go at the top or bottom of the file? Why?

# Advanced: Add a route that clears all saved movies. Add a route that removes only specific movies. (Which one is more difficult?)
