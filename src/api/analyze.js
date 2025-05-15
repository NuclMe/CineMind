import axios from 'axios';

export async function analyzeReview(source, movieTitle, customReview, userId) {
  console.log('🔗 Отправляю analyze с userId:', userId); // ← добавь этот лог
  try {
    const response = await axios.post('http://127.0.0.1:5000/analyze', {
      source,
      movieTitle,
      customReview,
      userId, // ← убедись, что он тут реально передаётся!
    });
    return response.data;
  } catch (error) {
    console.error('❌ Error analyzing review:', error);
    throw error;
  }
}
