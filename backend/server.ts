import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import Colors from 'colors.ts';
import auth from './routes/auth.route.js';
import calendar from './routes/calendar.route.js';
import availability from './routes/availability.route.js';
import errorHandler from './middlewares/errorHandler.js';
import appointments from './routes/appointments.route.js';

dotenv.config();

Colors.enable();

const app = express();
app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to WeSchdule API',
  });
});

app.use('/api/v1/auth', auth);
app.use('/api/v1', calendar);
app.use('/api/v1', availability);
app.use('/api/v1', appointments);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, (): void =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
);
