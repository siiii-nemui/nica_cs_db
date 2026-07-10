import { Plus, Trash2 } from 'lucide-react';
import type { SessionRecord } from '../types';

interface Props {
  records: SessionRecord[];
  onChange: (records: SessionRecord[]) => void;
  readOnly?: boolean;
}

function SessionRecordCard({ records, onChange, readOnly }: Props) {
  const addRecord = () => {
    onChange([...records, { id: crypto.randomUUID(), combatFavor: 0, personalFavor: 0, memo: '' }]);
  };

  const updateRecord = (id: string, patch: Partial<SessionRecord>) => {
    onChange(records.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const removeRecord = (id: string) => {
    onChange(records.filter((r) => r.id !== id));
  };

  return (
    <section id="session" className="bg-[#1a1a1a] border border-gray-800 rounded-md p-4">
      <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-2">
        <h2 className="text-sm text-gray-400 font-bold">セッション記録</h2>
        {!readOnly && (
          <button
            onClick={addRecord}
            className="flex items-center space-x-1 text-xs bg-[#222222] hover:bg-[#333333] border border-gray-700 rounded px-2 py-1 text-gray-300 transition-colors shrink-0"
          >
            <Plus size={14} className="shrink-0" />
            <span>追加</span>
          </button>
        )}
      </div>

      {records.length === 0 && (
        <div className="text-xs text-gray-500">セッション記録が登録されていません。</div>
      )}

      <div className="space-y-3">
        {records.map((r) => (
          <div key={r.id} className="border border-gray-800 bg-[#151515] rounded-md p-3">
            <div className="flex items-center space-x-2 mb-2">
              <label className="text-xs text-gray-400 bg-[#222222] py-1 px-2 text-center rounded border border-gray-700 shrink-0">
                戦闘寵愛
              </label>
              <input
                type="number"
                value={r.combatFavor}
                onChange={(e) => updateRecord(r.id, { combatFavor: Number(e.target.value) })}
                disabled={readOnly}
                className="w-16 bg-[#333333] border-none rounded py-1 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#e74c3c] shrink-0"
              />
              <label className="text-xs text-gray-400 bg-[#222222] py-1 px-2 text-center rounded border border-gray-700 shrink-0">
                個人寵愛
              </label>
              <input
                type="number"
                value={r.personalFavor}
                onChange={(e) => updateRecord(r.id, { personalFavor: Number(e.target.value) })}
                disabled={readOnly}
                className="w-16 bg-[#333333] border-none rounded py-1 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#e74c3c] shrink-0"
              />
              <label className="text-xs text-gray-400 bg-[#222222] py-1 px-2 text-center rounded border border-gray-700 shrink-0">
                獲得計
              </label>
              <div className="flex-1 text-sm font-bold text-[#e74c3c]">{r.combatFavor + r.personalFavor}</div>
              {!readOnly && (
                <button
                  onClick={() => removeRecord(r.id)}
                  className="p-1.5 bg-[#222222] hover:bg-[#333333] border border-gray-700 rounded text-gray-400 hover:text-[#e74c3c] transition-colors shrink-0"
                  aria-label="削除"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
            <textarea
              placeholder="メモ"
              value={r.memo}
              onChange={(e) => updateRecord(r.id, { memo: e.target.value })}
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

export default SessionRecordCard;
