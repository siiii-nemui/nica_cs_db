import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { pool } from '../db/pool.js';

const router = Router();

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  next();
}

async function getUsernameById(id: string): Promise<string | null> {
  const result = await pool.query('select username from users where id = $1', [id]);
  return result.rows[0]?.username ?? null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToCharacter(row: any) {
  return {
    id: row.id,
    ownerId: row.owner_username,
    updatedAt: row.updated_at,
    basicInfo: row.basic_info,
    design: row.design,
    parts: row.parts,
    memoryFragments: row.memory_fragments,
    attachments: row.attachments,
    sessionRecords: row.session_records,
    memo: row.memo,
  };
}

router.get('/', requireAuth, async (req, res) => {
  const result = await pool.query(
    `select c.*, u.username as owner_username
     from characters c join users u on u.id = c.owner_id
     where c.owner_id = $1
     order by c.updated_at desc`,
    [req.session.userId],
  );
  res.json(result.rows.map(rowToCharacter));
});

router.get('/:id', async (req, res) => {
  const result = await pool.query(
    `select c.*, u.username as owner_username
     from characters c join users u on u.id = c.owner_id
     where c.id = $1`,
    [req.params.id],
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'not found' });
  res.json(rowToCharacter(result.rows[0]));
});

router.post('/', requireAuth, async (req, res) => {
  const body = req.body;
  const result = await pool.query(
    `insert into characters (owner_id, basic_info, design, parts, memory_fragments, attachments, session_records, memo)
     values ($1, $2, $3, $4, $5, $6, $7, $8)
     returning *`,
    [
      req.session.userId,
      JSON.stringify(body.basicInfo),
      JSON.stringify(body.design),
      JSON.stringify(body.parts),
      JSON.stringify(body.memoryFragments),
      JSON.stringify(body.attachments),
      JSON.stringify(body.sessionRecords),
      body.memo ?? '',
    ],
  );
  const username = await getUsernameById(req.session.userId!);
  res.json(rowToCharacter({ ...result.rows[0], owner_username: username }));
});

router.put('/:id', requireAuth, async (req, res) => {
  const existing = await pool.query('select owner_id from characters where id = $1', [req.params.id]);
  if (existing.rows.length === 0) return res.status(404).json({ error: 'not found' });
  if (existing.rows[0].owner_id !== req.session.userId) return res.status(403).json({ error: 'forbidden' });

  const body = req.body;
  const result = await pool.query(
    `update characters
     set basic_info = $1, design = $2, parts = $3, memory_fragments = $4,
         attachments = $5, session_records = $6, memo = $7, updated_at = now()
     where id = $8
     returning *`,
    [
      JSON.stringify(body.basicInfo),
      JSON.stringify(body.design),
      JSON.stringify(body.parts),
      JSON.stringify(body.memoryFragments),
      JSON.stringify(body.attachments),
      JSON.stringify(body.sessionRecords),
      body.memo ?? '',
      req.params.id,
    ],
  );
  const username = await getUsernameById(req.session.userId!);
  res.json(rowToCharacter({ ...result.rows[0], owner_username: username }));
});

router.delete('/:id', requireAuth, async (req, res) => {
  const existing = await pool.query('select owner_id from characters where id = $1', [req.params.id]);
  if (existing.rows.length === 0) return res.status(404).json({ error: 'not found' });
  if (existing.rows[0].owner_id !== req.session.userId) return res.status(403).json({ error: 'forbidden' });

  await pool.query('delete from characters where id = $1', [req.params.id]);
  res.json({ ok: true });
});

export default router;
