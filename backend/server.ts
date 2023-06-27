import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import Colors from 'colors.ts';
import auth from './routes/auth.route.js';
import calendar from './routes/calendar.route.js';
import webhooks from './routes/webhooks.route.js';
import errorHandler from './middlewares/errorHandler.js';
import appointments from './routes/appointments.route.js';
import integration from './routes/integration.route.js';
import googleCalendar from './routes/googleCalendar.route.js';
import bookers from './routes/bookers.route.js';
import cookieParser from 'cookie-parser';
import { renewExpiredWatchRequests } from './cron-job.js';

// run this cronjob
renewExpiredWatchRequests;

dotenv.config();

Colors.enable();
const app = express();
app.use(cookieParser());
app.use(express.json());
console.log(process.env.NEXT_PUBLIC_BASE_URL);
app.use(
  cors({
    origin: process.env.NEXT_PUBLIC_BASE_URL,
    credentials: true,
  })
);

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
app.use('/api/v1', appointments);
app.use('/api/v1', integration);
app.use('/api/v1', googleCalendar);
app.use('/api/v1/', bookers);
app.use('/api/v1/webhooks', webhooks);
app.use(errorHandler);

const PORT = process.env.BACK_PORT || 8080;

app.listen(PORT, (): void => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));
