import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Eye, Upload, Trash2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../contexts/AuthContext';
import { getCharacters, deleteCharacter, createCharacter } from '../lib/api';
import { buildCocofoliaExport, copyToClipboard } from '../lib/export';
import { emptyBasicInfo, emptyCharacterDesign, createDefaultParts } from '../types';
import type { Character } from '../types';

function CharacterListPage() {
  const { userId, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!userId) {
      setLoading(false);
      return;
    }
    getCharacters()
      .then((chars) => setCharacters(chars))
      .catch(() => setCharacters([]))
      .finally(() => setLoading(false));
  }, [authLoading, userId]);

  const handleCreate = async () => {
    if (!userId) return;
    try {
      const character = await createCharacter({
        basicInfo: emptyBasicInfo(),
        design: emptyCharacterDesign(),
        parts: createDefaultParts(),
        memoryFragments: [],
        attachments: [],
        sessionRecords: [],
        memo: '',
      });
      navigate(`/characters/${character.id}/edit`);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'キャラクターの作成に失敗しました。');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('このキャラクターを削除しますか？')) return;
    try {
      await deleteCharacter(id);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : '削除に失敗しました。');
      return;
    }
    setCharacters(characters.filter((c) => c.id !== id));
  };

  const handleExport = async (id: string) => {
    const character = characters.find((c) => c.id === id);
    if (!character) return;
    const ok = await copyToClipboard(buildCocofoliaExport(character));
    if (!ok) return;
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  if (authLoading || loading) return null;

  if (!userId) {
    return (
      <div className="flex flex-col h-screen bg-[#111111] text-gray-300 font-sans">
        <PageHeader title="キャラクター一覧" />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="text-center space-y-3">
            <p className="text-sm text-gray-400">キャラクター一覧を見るにはログインが必要です。</p>
            <Link to="/login?next=/characters" className="text-[#e74c3c] underline">
              ログイン
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#111111] text-gray-300 font-sans">
      <PageHeader title="キャラクター一覧" />
      <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="max-w-2xl mx-auto space-y-4">
          <button
            onClick={handleCreate}
            className="flex items-center space-x-1 text-sm bg-[#222222] hover:bg-[#333333] border border-gray-700 rounded px-3 py-2 text-gray-300 transition-colors"
          >
            <Plus size={16} className="shrink-0" />
            <span>新規作成</span>
          </button>

          {characters.length === 0 && (
            <div className="text-sm text-gray-500">キャラクターが登録されていません。</div>
          )}

          <div className="space-y-2">
            {characters.map((c) => (
              <div
                key={c.id}
                className="flex flex-wrap items-center gap-2 bg-[#1a1a1a] border border-gray-800 rounded-md p-3"
              >
                <span className="flex-1 min-w-[8rem] text-sm font-bold">
                  {c.basicInfo.name || '(名称未設定)'}
                </span>
                <Link
                  to={`/characters/${c.id}/edit`}
                  className="flex items-center space-x-1 text-xs bg-[#222222] hover:bg-[#333333] border border-gray-700 rounded px-2 py-1 transition-colors shrink-0"
                >
                  <Pencil size={14} />
                  <span>編集</span>
                </Link>
                <Link
                  to={`/characters/${c.id}/view`}
                  className="flex items-center space-x-1 text-xs bg-[#222222] hover:bg-[#333333] border border-gray-700 rounded px-2 py-1 transition-colors shrink-0"
                >
                  <Eye size={14} />
                  <span>閲覧</span>
                </Link>
                <button
                  onClick={() => handleExport(c.id)}
                  className="flex items-center space-x-1 text-xs bg-[#222222] hover:bg-[#333333] border border-gray-700 rounded px-2 py-1 transition-colors shrink-0"
                >
                  <Upload size={14} />
                  <span>{copiedId === c.id ? 'コピー済' : '出力'}</span>
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="flex items-center space-x-1 text-xs bg-[#222222] hover:bg-[#333333] border border-gray-700 rounded px-2 py-1 text-gray-400 hover:text-[#e74c3c] transition-colors shrink-0"
                >
                  <Trash2 size={14} />
                  <span>削除</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default CharacterListPage;
