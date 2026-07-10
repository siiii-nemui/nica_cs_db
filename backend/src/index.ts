import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { sessionMiddleware } from './session.js';
import authRoutes from './routes/auth.js';
import characterRoutes from './routes/characters.js';

const app = express();

const isProd = process.env.NODE_ENV === 'production';

app.use(
  cors({
    // Vite's dev server picks a random free port per run, so in development
    // allow any localhost origin rather than hardcoding one. Production stays
    // locked to FRONTEND_ORIGIN.
    origin: isProd
      ? (process.env.FRONTEND_ORIGIN ?? true)
      : /^http:\/\/localhost:\d+$/,
    credentials: true,
  }),
);
app.use(express.json());
app.use(sessionMiddleware);

app.use('/api/auth', authRoutes);
app.use('/api/characters', characterRoutes);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

const port = Number(process.env.PORT ?? 3001);
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
