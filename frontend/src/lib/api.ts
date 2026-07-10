import type { Character } from '../types';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

type CharacterInput = Omit<Character, 'id' | 'ownerId' | 'updatedAt'>;

async function apiFetch(path: string, options: RequestInit = {}) {
  try {
    return await fetch(`${API_BASE}${path}`, {
      ...options,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...options.headers },
    });
  } catch {
    throw new Error('サーバーに接続できませんでした。時間をおいて再度お試しください。');
  }
}

export async function signup(username: string, password: string): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await apiFetch('/api/auth/signup', { method: 'POST', body: JSON.stringify({ username, password }) });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { ok: false, error: body.error ?? '登録に失敗しました。' };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : '通信エラーが発生しました。' };
  }
}

export async function login(username: string, password: string): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { ok: false, error: body.error ?? 'ログインに失敗しました。' };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : '通信エラーが発生しました。' };
  }
}

export async function logout(): Promise<void> {
  await apiFetch('/api/auth/logout', { method: 'POST' });
}

export async function getCurrentUserId(): Promise<string | null> {
  const res = await apiFetch('/api/auth/me');
  if (!res.ok) return null;
  const body = await res.json();
  return body.id ?? null;
}

export async function getCharacters(): Promise<Character[]> {
  const res = await apiFetch('/api/characters');
  if (!res.ok) return [];
  return res.json();
}

export async function getCharacter(id: string): Promise<Character | undefined> {
  const res = await apiFetch(`/api/characters/${id}`);
  if (!res.ok) return undefined;
  return res.json();
}

export async function createCharacter(input: CharacterInput): Promise<Character> {
  const res = await apiFetch('/api/characters', { method: 'POST', body: JSON.stringify(input) });
  if (!res.ok) throw new Error('キャラクターの作成に失敗しました。');
  return res.json();
}

export async function saveCharacter(character: Character): Promise<Character> {
  const { basicInfo, design, parts, memoryFragments, attachments, sessionRecords, memo } = character;
  const res = await apiFetch(`/api/characters/${character.id}`, {
    method: 'PUT',
    body: JSON.stringify({ basicInfo, design, parts, memoryFragments, attachments, sessionRecords, memo }),
  });
  if (!res.ok) throw new Error('保存に失敗しました。');
  return res.json();
}

export async function deleteCharacter(id: string): Promise<void> {
  const res = await apiFetch(`/api/characters/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('削除に失敗しました。');
}
