import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { sessionMiddleware } from './session.js';
import authRoutes from './routes/auth.js';
import characterRoutes from './routes/characters.js';

const app = express();

const isProd = process.env.NODE_ENV === 'production';

// Behind Render's proxy: without this, express-session sees the request as
// plain HTTP and silently refuses to set the `secure` session cookie.
app.set('trust proxy', 1);

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

// Without this, a rejected async handler (e.g. a DB error) crashes the process.
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'サーバーでエラーが発生しました。時間をおいて再度お試しください。' });
});

const port = Number(process.env.PORT ?? 3001);
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
