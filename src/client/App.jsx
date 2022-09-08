import { useEffect, useState } from 'react';
import './App.css';
import MovieForm from './components/MovieForm';
import UserForm from './components/UserForm';

const apiUrl = 'http://localhost:4000';

function App() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}/movie`)
      .then(res => res.json())
      .then(res => setMovies(res.data));
  }, []);

  const handleRegister = async ({ username, password }) => {
    const response = await fetch(`${apiUrl}/user/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( {username, password} ),
    }) 
    const register = await response.json();
    console.log("Register response", register);
  };

  // the token is created during registration, but only added to local storage during login
  const handleLogin = async ({ username, password }) => {
    const response = await fetch(`${apiUrl}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( {username, password} ),
    })
    const login = await response.json();
    console.log("Handle Login response", login);
    console.log(bearer);
    // below: local storage takes a key/name pair
    localStorage.setItem("token", login.data);
  };
  
  const handleCreateMovie = async ({ title, description, runtimeMins }) => {
    const token = localStorage.getItem("token")
    console.log("Handle Create Movie response", token);
    const response = await fetch(`${apiUrl}/movie`, {
      method: 'POST',
      // this time we grab both the json body and token from the header
      headers: { 
      'Content-Type': 
      'application/json', 
      // 'Authorization': token },
      'Authorization': 'Bearer ' + token },
      body: JSON.stringify( {title, description, runtimeMins} ),
    })
    const movie = await response.json();
    // below: movies exists in State
    const createMovieList = [...movies, movie.data] 
    console.log("Create Movie", createMovieList);
    setMovies(createMovieList);
  }

  return (
    <div className="App">
      <h1>Register</h1>
      <UserForm handleSubmit={handleRegister} />

      <h1>Login</h1>
      <UserForm handleSubmit={handleLogin} />

      <h1>Create a movie</h1>
      <MovieForm handleSubmit={handleCreateMovie} />

      <h1>Movie list</h1>
      <ul>
        {movies.map(movie => {
          return (
            <li key={movie.id}>
              <h3>{movie.title}</h3>
              <p>Description: {movie.description}</p>
              <p>Runtime: {movie.runtimeMins}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;