import { Router } from 'express';
import bcrypt from 'bcrypt';
import { pool } from '../db/pool.js';

const router = Router();

router.post('/signup', async (req, res) => {
  const { username, password } = req.body as { username?: string; password?: string };
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' });
  }

  const existing = await pool.query('select id from users where username = $1', [username]);
  if (existing.rows.length > 0) {
    return res.status(409).json({ error: 'このIDは既に使用されています。' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'insert into users (username, password_hash) values ($1, $2) returning id, username',
    [username, passwordHash],
  );
  const user = result.rows[0];

  req.session.userId = user.id;
  res.json({ id: user.username });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body as { username?: string; password?: string };
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' });
  }

  const result = await pool.query('select id, username, password_hash from users where username = $1', [username]);
  const user = result.rows[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: 'IDまたはパスワードが正しくありません。' });
  }

  req.session.userId = user.id;
  res.json({ id: user.username });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

router.get('/me', async (req, res) => {
  if (!req.session.userId) {
    return res.json({ id: null });
  }
  const result = await pool.query('select username from users where id = $1', [req.session.userId]);
  const user = result.rows[0];
  res.json({ id: user ? user.username : null });
});

export default router;
