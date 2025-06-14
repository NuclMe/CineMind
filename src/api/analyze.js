import axios from 'axios';

export async function analyzeReview(
  source,
  movieTitle,
  customReview,
  userId,
  age,
  language
) {
  try {
    const response = await axios.post('http://127.0.0.1:5000/analyze', {
      source,
      movieTitle,
      customReview,
      userId,
      age,
      language,
    });
    return response.data;
  } catch (error) {
    console.error('❌ Error analyzing review:', error);
    throw error;
  }
}
