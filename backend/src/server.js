import express from 'express';
import dotenv from 'dotenv';
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(express.json());
app.use('/api', healthRoutes);
app.use('/api', authRoutes);

app.get('/', (_req, res) => {
  res.json({
    name: 'GlobeTrotter API',
    status: 'foundation-ready',
    message: 'Backend foundation initialized for future feature development.',
  });
});

app.listen(port, () => {
  console.log(`GlobeTrotter backend is running on http://localhost:${port}`);
});
