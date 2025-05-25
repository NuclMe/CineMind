import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { analyzeReview } from '../api/analyze';
import { genreMap } from '../genres';

export default function AnalyzerPage() {
  const [source, setSource] = useState('guardian');
  const [movieTitle, setMovieTitle] = useState('');
  const [customReview, setCustomReview] = useState('');
  const [userGenres, setUserGenres] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();
  const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.user_id;
    if (userId) {
      axios
        .get(`http://127.0.0.1:5000/user/${userId}/genres`)
        .then((response) => {
          setUserGenres(response.data.genres);
        })
        .catch((error) => {
          console.error('❌ Error fetching user genres:', error);
        });
    }
  }, []);

  useEffect(() => {
    const fetchRecommendedMovies = async () => {
      const genreId = genreMap[userGenres[0]]; // возьмём первый любимый жанр
      if (!genreId) return;

      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/discover/movie`,
          {
            params: {
              api_key: TMDB_KEY,
              with_genres: genreId,
            },
          }
        );

        setRecommendedMovies(response.data.results.slice(0, 5));
      } catch (error) {
        console.error('❌ Error fetching recommended movies:', error);
      }
    };

    if (userGenres.length > 0) {
      fetchRecommendedMovies();
    }
  }, [userGenres]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const user = JSON.parse(localStorage.getItem('user'));
    console.log('👤 Достаём user из localStorage:', user);
    const userId = user?.user_id;
    const age = user?.age;

    try {
      const data = await analyzeReview(
        source,
        movieTitle,
        customReview,
        userId,
        age
        // userGenres
      );
      setResult(data);
    } catch (error) {
      console.error(error);
      alert('Помилка при обробці запиту');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4 text-center">
          🎬 Аналізатор фільмових рецензій
        </h1>
        <button
          onClick={handleLogout}
          className="mt-8 py-3 font-semibold rounded-lg
             bg-black text-white 
             hover:bg-gradient-to-r hover:from-red-500
             transition-all duration-500"
        >
          Вийти 🚪
        </button>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-medium">Джерело рецензії:</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="mt-1 w-full p-2 border rounded"
            >
              <option value="guardian">Відгуки критиків(Guardian)</option>
              <option value="tmdb">Відгуки користувачів(TMDB)</option>
              {/* <option value="custom">Свій текст</option> */}
            </select>
          </div>

          {(source === 'tmdb' || source === 'guardian') && (
            <div>
              <label className="font-medium">Назва фільму:</label>
              <input
                type="text"
                value={movieTitle}
                onChange={(e) => setMovieTitle(e.target.value)}
                className="mt-1 w-full p-2 border rounded"
                placeholder="Введіть назву фільму"
              />
            </div>
          )}

          {source === 'custom' && (
            <div>
              <label className="font-medium">Текст рецензії:</label>
              <textarea
                value={customReview}
                onChange={(e) => setCustomReview(e.target.value)}
                className="mt-1 w-full p-2 border rounded h-40"
                placeholder="Введіть свій текст"
              ></textarea>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-green-700 transition-colors duration-300"
            disabled={loading}
          >
            {loading ? 'Обробка...' : 'Аналізувати'}
          </button>
        </form>

        {result && (
          <div className="mt-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold">
                📜 Узагальнена рецензія:
              </h2>
              <p className="whitespace-pre-line bg-gray-50 p-3 rounded">
                {result.summary}
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold">
                {result.sentiment === 'NEGATIVE' ? '😞' : '😊'} Загальне
                враження критика від фільму:
              </h2>
              <p className="bg-gray-50 p-3 rounded">{result.sentiment}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold">🔑 Ключові теми:</h2>
              <ul className="list-disc list-inside bg-gray-50 p-3 rounded">
                {result.keywords.map((kw: string, idx: number) => (
                  <li key={idx}>{kw}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
        {userGenres.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold">🎯 Ваші улюблені жанри:</h2>
            <ul className="list-disc list-inside bg-gray-50 p-3 rounded">
              {userGenres.map((genre, idx) => (
                <li key={idx}>{genre}</li>
              ))}
            </ul>
          </div>
        )}
        {recommendedMovies.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold">
              🎥 Рекомендовані фільми за вашим вподобаннями:
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {recommendedMovies.map((movie) => (
                <div key={movie.id} className="bg-white shadow rounded p-2">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="rounded mb-2"
                  />
                  <p className="text-center font-medium">{movie.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
