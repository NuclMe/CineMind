import React from 'react';
import { Formik, Form, Field } from 'formik';
import {
    TextField,
    MenuItem,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Slider,
    Button,
    Box,
    Typography,
} from '@mui/material';

const genresList = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Fantasy', 'Animation'];

export default function CollaborativeForm() {
    return (
        <Formik
            initialValues={{
                name: '',
                age: '',
                gender: '',
                genres: [],
                moviesPerWeek: 3,
                cinemaType: '',
            }}
            onSubmit={(values, { setSubmitting, resetForm }) => {
                console.log(values);
                setSubmitting(false);
                alert('✅ Данні надіслані!');
                resetForm();
            }}
        >
            {({ values, handleChange, setFieldValue, isSubmitting }) => (
                <Form>
                    <Box sx={{ maxWidth: 600, mx: 'auto', p: 2, boxShadow: 3, borderRadius: 2 }}>
                        <Typography variant="h5" align="center" gutterBottom>
                            Заповніть ваші вподобання
                        </Typography>

                        <Field
                            as={TextField}
                            label="Ім’я"
                            name="name"
                            fullWidth
                            margin="normal"
                            required
                        />

                        <Field
                            as={TextField}
                            label="Вік"
                            name="age"
                            type="number"
                            fullWidth
                            margin="normal"
                            required
                        />

                        <TextField
                            select
                            label="Стать"
                            name="gender"
                            value={values.gender}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                        >
                            <MenuItem value="male">Чоловік</MenuItem>
                            <MenuItem value="female">Жінка</MenuItem>
                            <MenuItem value="other">Інше</MenuItem>
                        </TextField>

                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle1">Улюблені жанри:</Typography>
                            <FormGroup>
                                {genresList.map((genre) => (
                                    <FormControlLabel
                                        key={genre}
                                        control={
                                            <Checkbox
                                                checked={values.genres.includes(genre)}
                                                onChange={() => {
                                                    if (values.genres.includes(genre)) {
                                                        setFieldValue(
                                                            'genres',
                                                            values.genres.filter((g) => g !== genre)
                                                        );
                                                    } else {
                                                        setFieldValue('genres', [...values.genres, genre]);
                                                    }
                                                }}
                                            />
                                        }
                                        label={genre}
                                    />
                                ))}
                            </FormGroup>
                        </Box>

                        <Box sx={{ mt: 3 }}>
                            <Typography gutterBottom>
                                Скільки фільмів на тиждень дивитесь? {values.moviesPerWeek}
                            </Typography>
                            <Slider
                                name="moviesPerWeek"
                                value={values.moviesPerWeek}
                                onChange={(_, val) => setFieldValue('moviesPerWeek', val)}
                                min={0}
                                max={20}
                                step={1}
                                valueLabelDisplay="auto"
                            />
                        </Box>

                        <TextField
                            select
                            label="Тип кінематографа"
                            name="cinemaType"
                            value={values.cinemaType}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                        >
                            <MenuItem value="mainstream">Мейнстрім</MenuItem>
                            <MenuItem value="arthouse">Артхаус</MenuItem>
                            <MenuItem value="documentary">Документальний</MenuItem>
                            <MenuItem value="experimental">Експериментальний</MenuItem>
                        </TextField>

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 3 }}
                            disabled={isSubmitting}
                        >
                            Надіслати
                        </Button>
                    </Box>
                </Form>
            )}
        </Formik>
    );
}
