import express from 'express';
import dotenv from 'dotenv';
import healthRoutes from './routes/health.routes.js';
import itineraryRoutes from './routes/itinerary.routes.js';
import authRoutes from './routes/auth.routes.js';
import tripRoutes from './routes/trip.routes.js';
import budgetRoutes from './routes/budget.routes.js';
import timelineRoutes from './routes/timeline.routes.js';
import sharingRoutes from './routes/sharing.routes.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3001);
const allowedOrigin = 'http://localhost:5173';

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  return next();
});

app.use(express.json());
app.use('/api', healthRoutes);
app.use('/api/itinerary', itineraryRoutes);
app.use('/api', authRoutes);
app.use('/api', tripRoutes);
app.use('/api', budgetRoutes);
app.use('/api', timelineRoutes);
app.use('/api', sharingRoutes);

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
