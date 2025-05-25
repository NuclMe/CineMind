import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Схема валідації
const SignUpSchema = Yup.object().shape({
  username: Yup.string().required('Це поле обовʼязкове'),
  password: Yup.string().required('Це поле обовʼязкове'),
  gender: Yup.string().required('Це поле обовʼязкове'),
  age: Yup.number().required('Це поле обовʼязкове').min(0, 'Некоректний вік'),
  genres: Yup.array().min(1, 'Обери хоча б один жанр'),
});

const allGenres = [
  'Action',
  'Comedy',
  'Drama',
  'Horror',
  'Romance',
  'Sci-Fi',
  'Thriller',
];

export default function SignUpPage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Реєстрація 👤
        </Typography>

        <Formik
          initialValues={{
            username: '',
            password: '',
            gender: '',
            age: '',
            genres: [],
            language: 'en',
          }}
          validationSchema={SignUpSchema}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            try {
              const response = await axios.post(
                'http://127.0.0.1:5000/signup',
                values
              );
              console.log('✅ Успішна реєстрація:', response.data);

              // Якщо бекенд повертає токен одразу після signup:
              const token = response.data.token;
              localStorage.setItem('token', token); // або context, якщо є

              // Перенаправляємо на AnalyzerPage
              navigate('/analyzer');
            } catch (error) {
              console.error('❌ Помилка при реєстрації:', error);
              setErrors({
                username:
                  'Помилка при реєстрації (можливо, користувач вже існує)',
              });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <form onSubmit={handleSubmit}>
              <Box mb={3}>
                <TextField
                  fullWidth
                  id="username"
                  name="username"
                  label="Імʼя користувача"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.username && Boolean(errors.username)}
                  helperText={touched.username && errors.username}
                />
              </Box>

              <Box mb={3}>
                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  label="Пароль"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                />
              </Box>

              <Box mb={3}>
                <FormControl fullWidth>
                  <InputLabel id="gender-label">Стать</InputLabel>
                  <Select
                    labelId="gender-label"
                    id="gender"
                    name="gender"
                    value={values.gender}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.gender && Boolean(errors.gender)}
                    label="Стать"
                  >
                    <MenuItem value="male">Чоловік</MenuItem>
                    <MenuItem value="female">Жінка</MenuItem>
                  </Select>
                  {touched.gender && errors.gender && (
                    <Typography variant="caption" color="error">
                      {errors.gender}
                    </Typography>
                  )}
                </FormControl>
              </Box>
              <Box mb={3}>
                <FormControl fullWidth>
                  <InputLabel id="language-label">Мова інтерфейсу</InputLabel>
                  <Select
                    labelId="language-label"
                    id="language"
                    name="language"
                    value={values.language}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="Мова інтерфейсу"
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="uk">Українська</MenuItem>
                    <MenuItem value="es">Español</MenuItem>
                    <MenuItem value="de">Deutsch</MenuItem>
                    <MenuItem value="fr">Français</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box mb={3}>
                <TextField
                  fullWidth
                  id="age"
                  name="age"
                  label="Вік"
                  type="number"
                  value={values.age}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.age && Boolean(errors.age)}
                  helperText={touched.age && errors.age}
                />
              </Box>

              <Box mb={3}>
                <FormControl fullWidth>
                  <InputLabel id="genres-label">Улюблені жанри</InputLabel>
                  <Select
                    labelId="genres-label"
                    id="genres"
                    multiple
                    name="genres"
                    value={values.genres}
                    onChange={handleChange}
                    input={<OutlinedInput label="Улюблені жанри" />}
                    renderValue={(selected) => selected.join(', ')}
                  >
                    {allGenres.map((genre) => (
                      <MenuItem key={genre} value={genre}>
                        <Checkbox checked={values.genres.indexOf(genre) > -1} />
                        <ListItemText primary={genre} />
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.genres && errors.genres && (
                    <Typography variant="caption" color="error">
                      {errors.genres}
                    </Typography>
                  )}
                </FormControl>
              </Box>

              <Button
                color="primary"
                variant="contained"
                fullWidth
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Реєстрація...' : 'Зареєструватися'}
              </Button>
            </form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
}
