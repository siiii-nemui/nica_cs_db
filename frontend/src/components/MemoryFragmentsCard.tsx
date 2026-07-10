import { Plus, Trash2 } from 'lucide-react';
import type { MemoryFragment } from '../types';

interface Props {
  fragments: MemoryFragment[];
  onChange: (fragments: MemoryFragment[]) => void;
  readOnly?: boolean;
}

function MemoryFragmentsCard({ fragments, onChange, readOnly }: Props) {
  const addFragment = () => {
    onChange([...fragments, { id: crypto.randomUUID(), number: '', name: '', detail: '' }]);
  };

  const updateFragment = (id: string, patch: Partial<MemoryFragment>) => {
    onChange(fragments.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  };

  const removeFragment = (id: string) => {
    onChange(fragments.filter((f) => f.id !== id));
  };

  return (
    <section id="memory" className="bg-[#1a1a1a] border border-gray-800 rounded-md p-4">
      <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-2">
        <h2 className="text-sm text-gray-400 font-bold">記憶のカケラ</h2>
        {!readOnly && (
          <button
            onClick={addFragment}
            className="flex items-center space-x-1 text-xs bg-[#222222] hover:bg-[#333333] border border-gray-700 rounded px-2 py-1 text-gray-300 transition-colors shrink-0"
          >
            <Plus size={14} className="shrink-0" />
            <span>追加</span>
          </button>
        )}
      </div>

      {fragments.length === 0 && (
        <div className="text-xs text-gray-500">記憶のカケラが登録されていません。</div>
      )}

      <div className="space-y-3">
        {fragments.map((f) => (
          <div key={f.id} className="border border-gray-800 bg-[#151515] rounded-md p-3">
            <div className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                placeholder="番号"
                value={f.number}
                onChange={(e) => updateFragment(f.id, { number: e.target.value })}
                disabled={readOnly}
                className="w-16 shrink-0 bg-[#333333] border-none rounded py-1 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#e74c3c]"
              />
              <input
                type="text"
                placeholder="名前"
                value={f.name}
                onChange={(e) => updateFragment(f.id, { name: e.target.value })}
                disabled={readOnly}
                className="flex-1 min-w-0 bg-[#333333] border-none rounded py-1 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#e74c3c]"
              />
              {!readOnly && (
                <button
                  onClick={() => removeFragment(f.id)}
                  className="p-1.5 bg-[#222222] hover:bg-[#333333] border border-gray-700 rounded text-gray-400 hover:text-[#e74c3c] transition-colors shrink-0"
                  aria-label="削除"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
            <textarea
              placeholder="詳細"
              value={f.detail}
              onChange={(e) => updateFragment(f.id, { detail: e.target.value })}
              readOnly={readOnly}
              rows={2}
              className="w-full bg-[#333333] border-none rounded py-1 px-2 text-xs text-gray-300 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#e74c3c] resize-none"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default MemoryFragmentsCard;
