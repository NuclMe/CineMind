import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { analyzeReview } from '../api/analyze';
import { genreMap } from '../genres';
import { useTranslation } from 'react-i18next';
import { User } from 'lucide-react';
import logo from '../assets/logo.png';

export default function AnalyzerPage() {
  const [source, setSource] = useState('guardian');
  const [movieTitle, setMovieTitle] = useState('');
  const [customReview, setCustomReview] = useState('');
  const [userGenres, setUserGenres] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [language, setLanguage] = useState(
    localStorage.getItem('language') || 'en'
  );

  const { t, i18n } = useTranslation();

  const navigate = useNavigate();

  const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const localGenres = storedUser?.genres;
    const userId = storedUser?.user_id;

    if (localGenres?.length) {
      setUserGenres(localGenres);
    } else if (userId) {
      axios
        .get(`http://127.0.0.1:5000/user/${userId}/genres`)
        .then((response) => {
          const genresFromServer = response.data.genres;
          setUserGenres(genresFromServer);

          // 🔄 Зберігаємо в localStorage
          const updatedUser = { ...storedUser, genres: genresFromServer };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        })
        .catch((error) => {
          console.error('❌ Error fetching user genres:', error);
        });
    }
  }, []);

  useEffect(() => {
    const fetchRecommendedMovies = async () => {
      const genreId = genreMap[userGenres[0]];
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

        setRecommendedMovies(response.data.results.slice(0, 9));
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
    const userId = user?.user_id;
    const age = user?.age;

    try {
      const data = await analyzeReview(
        source,
        movieTitle,
        customReview,
        userId,
        age,
        language
      );
      setResult(data);

      // 💡 Оновлюємо жанри з бекенда після аналізу
      const genreResponse = await axios.get(
        `http://127.0.0.1:5000/user/${userId}/genres`
      );
      const updatedGenres = genreResponse.data.genres;

      setUserGenres(updatedGenres);

      // 💾 Синхронізуємо з localStorage
      const updatedUser = { ...user, genres: updatedGenres };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error(error);
      alert(t('error.processing'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-bold flex items-center justify-center">
          <img
            src={logo}
            alt="CineMind Logo"
            className="w-20 bg-[wheat] rounded-full p-2 mr-[10px]"
          />
          CineMind
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-700">
            <User />
            <span>
              {user?.username}, {user?.age} {t('age')}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="py-2 px-4 font-semibold rounded bg-black text-white hover:bg-gradient-to-r hover:from-red-500 transition-all duration-500"
          >
            {t('logout')} 🚪
          </button>
        </div>
      </header>
      <main className="flex justify-center p-4">
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-2xl">
            <h1 className="text-2xl font-bold mb-4 text-center">
              {t('title')}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-medium">{t('language')}:</label>
                <select
                  value={language}
                  onChange={(e) => {
                    const lang = e.target.value;
                    setLanguage(lang);
                    localStorage.setItem('language', lang);
                    i18n.changeLanguage(lang);
                  }}
                  className="mt-1 w-full p-2 border rounded"
                >
                  <option value="uk">Українська</option>
                  <option value="en">English</option>
                  <option value="de">Deutsch</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
              </div>
              <div>
                <label className="font-medium">{t('reviewSource')}:</label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="mt-1 w-full p-2 border rounded"
                >
                  <option value="guardian">{t('source.guardian')}</option>
                  <option value="tmdb">{t('source.tmdb')}</option>
                </select>
              </div>

              {(source === 'tmdb' || source === 'guardian') && (
                <div>
                  <label className="font-medium">{t('movieTitle')}:</label>
                  <input
                    type="text"
                    value={movieTitle}
                    onChange={(e) => setMovieTitle(e.target.value)}
                    className="mt-1 w-full p-2 border rounded"
                    placeholder={t('movieTitlePlaceholder')}
                  />
                </div>
              )}

              {source === 'custom' && (
                <div>
                  <label className="font-medium">{t('customReview')}:</label>
                  <textarea
                    value={customReview}
                    onChange={(e) => setCustomReview(e.target.value)}
                    className="mt-1 w-full p-2 border rounded h-40"
                    placeholder={t('customReviewPlaceholder')}
                  ></textarea>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-green-700 transition-colors duration-300"
                disabled={loading}
              >
                {loading ? t('loading') : t('analyze')}
              </button>
            </form>

            {result && (
              <div className="mt-6 space-y-4">
                <div>
                  <h2 className="text-lg font-semibold">📜 {t('summary')}:</h2>
                  <p className="whitespace-pre-line bg-gray-50 p-3 rounded">
                    {result.summary}
                  </p>
                </div>
                <div className="mt-6 space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold">
                      📜 {t('critics_source')}:
                    </h2>
                    <div className="bg-gray-50 p-3 rounded space-y-2">
                      <a
                        href="https://www.theguardian.com/film/2015/jun/25/the-terminator-review-return-of-the-classic-80s-action-behemoth"
                        className="block text-blue-600 hover:underline"
                      >
                        Guardian
                      </a>
                      <a
                        href="https://filmschoolrejects.com/terminator-1984-what-critics-thought/"
                        className="block text-blue-600 hover:underline"
                      >
                        filmschoolrejects
                      </a>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold">
                    {result.sentiment === 'NEGATIVE' ? '😞' : '😊'}{' '}
                    {t('sentiment')}:
                  </h2>
                  <p className="bg-gray-50 p-3 rounded">{result.sentiment}</p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold">🔑 {t('keywords')}:</h2>
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
                <h2 className="text-lg font-semibold">🎯 {t('genres')}:</h2>
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
                  🎥 {t('recommendations')}:
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
      </main>
    </div>
  );
}
