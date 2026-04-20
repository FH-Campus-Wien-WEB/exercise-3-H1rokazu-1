const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const movieModel = require('./movie-model.js');

const app = express();

// Parse urlencoded bodies
app.use(bodyParser.json()); 

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, 'files')));

/* Task 1.2: Add a GET /genres endpoint:
   This endpoint returns a sorted array of all the genres of the movies
   that are currently in the movie model.
*/
app.get('/genres', function (req, res) {
  // All movie objects are retrieved from the model
  const movies = Object.values(movieModel);

  // All genres are collected into a flat array
  const allGenres = movies.flatMap(movie => movie.Genres);

  // Duplicates are removed using a Set and the result is sorted alphabetically
  const uniqueGenres = [...new Set(allGenres)].sort();

  res.send(uniqueGenres);
});

/* Task 1.4: Extend the GET /movies endpoint:
   When a query parameter for a specific genre is given, 
   return only movies that have the given genre
 */
app.get('/movies', function (req, res) {
  // All movies are converted from an object to an array
  let movies = Object.values(movieModel);

  // The 'genre' query parameter is extracted from the request (e.g., ?genre=Action)
  const selectedGenre = req.query.genre;

  // If a specific genre was requested, the list is filtered
  if (selectedGenre) {
    movies = movies.filter(movie => movie.Genres.includes(selectedGenre));
  }

  // Either the filtered list or the full list is sent back to the client
  res.send(movies);
});

// Configure a 'get' endpoint for a specific movie
app.get('/movies/:imdbID', function (req, res) {
  const id = req.params.imdbID
  const exists = id in movieModel
 
  if (exists) {
    res.send(movieModel[id])
  } else {
    res.sendStatus(404)    
  }
})

app.put('/movies/:imdbID', function(req, res) {

  const id = req.params.imdbID
  const exists = id in movieModel

  movieModel[req.params.imdbID] = req.body;
  
  if (!exists) {
    res.status(201)
    res.send(req.body)
  } else {
    res.sendStatus(200)
  }
  
})

app.listen(3000)

console.log("Server now listening on http://localhost:3000/")
