import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          title: '🎬 Movie Review Analyzer',
          reviewSource: 'Review source',
          language: 'Interface language',
          movieTitle: 'Movie title (English)',
          customReview: 'Your review',
          movieTitlePlaceholder: 'Movie title',
          analyze: 'Analyze',
          source: {
            guardian: 'Critic Reviews',
            tmdb: 'User Reviews',
          },
          summary: 'Summary',
          sentiment: 'Sentiment',
          keywords: 'Keywords',
          genres: 'Favorite genres',
          recommendations: 'Recommended movies',
          logout: 'Log out',
          age: 'ages',
        },
      },
      uk: {
        translation: {
          title: '🎬 Аналізатор фільмових рецензій',
          reviewSource: 'Джерело рецензії',
          language: 'Мова інтерфейсу',
          movieTitle: 'Назва фільму',
          customReview: 'Ваш відгук',
          movieTitlePlaceholder: 'Назва фільму',
          analyze: 'Аналізувати',
          source: {
            guardian: 'Відгуки критиків',
            tmdb: 'Відгуки користувачів',
          },
          summary: 'Стисла рецензія',
          critics_source: 'Джерела критики',
          sentiment: 'Тональність рецензій критиків',
          keywords: 'Ключові теми',
          genres: 'Улюблені жанри',
          recommendations: 'Рекомендовані фільми',
          logout: 'Вийти',
          age: 'років',
        },
      },
      fr: {
        translation: {
          title: '🎬 Analyseur de critiques de films',
          reviewSource: 'Source de la critique',
          language: "Langue de l'interface",
          movieTitle: 'Titre du film (en anglais)',
          customReview: 'Votre critique',
          movieTitlePlaceholder: 'Titre du film',
          analyze: 'Analyser',
          source: {
            guardian: 'Critiques de professionnels',
            tmdb: "Critiques d'utilisateurs",
          },
          summary: 'Résumé',
          sentiment: 'Sentiment',
          keywords: 'Mots-clés',
          genres: 'Genres préférés',
          recommendations: 'Films recommandés',
          logout: 'Déconnexion',
          age: 'ans',
        },
      },
      de: {
        translation: {
          title: '🎬 Filmrezensions-Analysator',
          reviewSource: 'Rezensionsquelle',
          language: 'Oberflächensprache',
          movieTitle: 'Filmtitel (Englisch)',
          customReview: 'Deine Rezension',
          movieTitlePlaceholder: 'Filmtitel',
          analyze: 'Analysieren',
          source: {
            guardian: 'Kritikerrezensionen',
            tmdb: 'Nutzerrezensionen',
          },
          summary: 'Zusammenfassung',
          sentiment: 'Stimmung',
          keywords: 'Schlüsselwörter',
          genres: 'Lieblingsgenres',
          recommendations: 'Empfohlene Filme',
          logout: 'Abmelden',
          age: 'Jahre',
        },
      },
      es: {
        translation: {
          title: '🎬 Analizador de críticas de películas',
          reviewSource: 'Fuente de la crítica',
          language: 'Idioma de la interfaz',
          movieTitle: 'Título de la película (en inglés)',
          customReview: 'Tu crítica',
          movieTitlePlaceholder: 'Título de la película',
          analyze: 'Analizar',
          source: {
            guardian: 'Críticas de expertos',
            tmdb: 'Críticas de usuarios',
          },
          summary: 'Resumen',
          sentiment: 'Sentimiento',
          keywords: 'Palabras clave',
          genres: 'Géneros favoritos',
          recommendations: 'Películas recomendadas',
          logout: 'Cerrar sesión',
          age: 'años',
        },
      },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
