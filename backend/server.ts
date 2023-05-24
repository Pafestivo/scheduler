import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import Colors from 'colors.ts';

dotenv.config();

Colors.enable();

const app = express();

app.use(cors());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to WeSchdule API',
  });
});

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, (): void =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
);
