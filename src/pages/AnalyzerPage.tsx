import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

export default function AnalyzerPage() {
  const [source, setSource] = useState('guardian')
  const [movieTitle, setMovieTitle] = useState('')
  const [customReview, setCustomReview] = useState('')

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user'); 
    navigate('/');               
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const response = await axios.post('http://127.0.0.1:5000/analyze', {
        source,
        movieTitle,
        customReview,
      })
      setResult(response.data)
    } catch (error) {
      console.error(error)
      alert('Помилка при обробці запиту')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4 text-center">🎬 Аналізатор фільмових рецензій</h1>
        <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
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
              <option value="guardian">Відгуки критиків</option>
              <option value="tmdb">Відгуки користувачів</option>
              <option value="custom">Свій текст</option>
            </select>
          </div>

          {source === 'guardian' && (
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

          {source === 'tmdb' && (
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
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? 'Обробка...' : 'Аналізувати'}
          </button>
        </form>

        {result && (
          <div className="mt-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold">📜 Узагальнена рецензія:</h2>
              <p className="whitespace-pre-line bg-gray-50 p-3 rounded">{result.summary}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold">
                {result.sentiment === 'NEGATIVE' ? '😞' : '😊'} Тональність:
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
      </div>
    </div>
  )
}
