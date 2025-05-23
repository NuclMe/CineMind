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
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Схема валідації
const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Це поле обовʼязкове'),
  password: Yup.string().required('Це поле обовʼязкове'),
});

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Вхід до системи 🎬
        </Typography>

        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            try {
              const response = await axios.post(
                'http://127.0.0.1:5000/login',
                values
              );
              console.log('✅ Успішний логін:', response.data);

              // Наприклад, можна зберегти user_id чи токен у localStorage
              localStorage.setItem('user', JSON.stringify(response.data));
              navigate('/analyzer');
            } catch (error) {
              console.error('❌ Логін помилка:', error);
              setErrors({ username: 'Невірний логін або пароль' });
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

              <Button
                color="primary"
                variant="contained"
                fullWidth
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Вхід...' : 'Увійти'}
              </Button>
            </form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
}
