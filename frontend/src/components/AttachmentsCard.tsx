import { Plus, Trash2, Skull } from 'lucide-react';
import type { Attachment } from '../types';
import { MAX_MADNESS, DEFAULT_MADNESS, ATTACHMENT_TABLES, ATTACHMENT_TYPES } from '../types';

interface Props {
  attachments: Attachment[];
  onChange: (attachments: Attachment[]) => void;
  readOnly?: boolean;
}

function AttachmentsCard({ attachments, onChange, readOnly }: Props) {
  const addAttachment = () => {
    onChange([
      ...attachments,
      {
        id: crypto.randomUUID(),
        target: '',
        table: ATTACHMENT_TABLES[0],
        type: ATTACHMENT_TYPES[ATTACHMENT_TABLES[0]][0],
        madness: DEFAULT_MADNESS,
        insanityEffect: '',
      },
    ]);
  };

  const updateAttachment = (id: string, patch: Partial<Attachment>) => {
    onChange(attachments.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  };

  const changeTable = (id: string, table: string) => {
    updateAttachment(id, { table, type: ATTACHMENT_TYPES[table][0] });
  };

  const removeAttachment = (id: string) => {
    onChange(attachments.filter((a) => a.id !== id));
  };

  return (
    <section id="attachment" className="bg-[#1a1a1a] border border-gray-800 rounded-md p-4">
      <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-2">
        <h2 className="text-sm text-gray-400 font-bold">未練</h2>
        {!readOnly && (
          <button
            onClick={addAttachment}
            className="flex items-center space-x-1 text-xs bg-[#222222] hover:bg-[#333333] border border-gray-700 rounded px-2 py-1 text-gray-300 transition-colors shrink-0"
          >
            <Plus size={14} className="shrink-0" />
            <span>追加</span>
          </button>
        )}
      </div>

      {attachments.length === 0 && (
        <div className="text-xs text-gray-500">未練が登録されていません。</div>
      )}

      <div className="space-y-3">
        {attachments.map((att) => {
          const isInsane = att.madness >= MAX_MADNESS;
          return (
            <div
              key={att.id}
              className={`border rounded-md p-3 transition-colors ${
                isInsane ? 'border-[#e74c3c]/60 bg-[#2a1414]' : 'border-gray-800 bg-[#151515]'
              }`}
            >
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder="対象"
                  value={att.target}
                  onChange={(e) => updateAttachment(att.id, { target: e.target.value })}
                  disabled={readOnly}
                  className="flex-1 min-w-[5rem] bg-[#333333] border-none rounded py-1 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#e74c3c]"
                />
                <span className="text-xs text-gray-500 shrink-0">への</span>
                <select
                  value={att.table}
                  onChange={(e) => changeTable(att.id, e.target.value)}
                  disabled={readOnly}
                  className="bg-[#333333] border-none rounded py-1 px-2 text-xs shrink-0 focus:outline-none focus:ring-1 focus:ring-[#e74c3c]"
                >
                  {ATTACHMENT_TABLES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <select
                  value={att.type}
                  onChange={(e) => updateAttachment(att.id, { type: e.target.value })}
                  disabled={readOnly}
                  className="flex-1 min-w-[5rem] bg-[#333333] border-none rounded py-1 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#e74c3c]"
                >
                  {ATTACHMENT_TYPES[att.table].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {!readOnly && (
                  <button
                    onClick={() => removeAttachment(att.id)}
                    className="p-1.5 bg-[#222222] hover:bg-[#333333] border border-gray-700 rounded text-gray-400 hover:text-[#e74c3c] transition-colors shrink-0"
                    aria-label="削除"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-2 mb-2">
                <label className="text-xs text-gray-400 bg-[#222222] py-1 px-2 text-center rounded border border-gray-700 shrink-0">
                  狂気点
                </label>
                <div className="flex space-x-1 shrink-0">
                  {Array.from({ length: MAX_MADNESS }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => updateAttachment(att.id, { madness: n })}
                      disabled={readOnly}
                      className={`w-7 h-7 rounded text-xs font-bold transition-colors ${
                        n <= att.madness
                          ? 'bg-[#e74c3c] text-white'
                          : 'bg-[#222222] text-gray-500 border border-gray-700 hover:bg-[#333333]'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                {isInsane && (
                  <span className="flex items-center space-x-1 text-xs font-bold text-[#e74c3c] shrink-0">
                    <Skull size={14} />
                    <span>発狂</span>
                  </span>
                )}
              </div>

              <textarea
                placeholder="発狂効果"
                value={att.insanityEffect}
                onChange={(e) => updateAttachment(att.id, { insanityEffect: e.target.value })}
                readOnly={readOnly}
                rows={2}
                className="w-full bg-[#333333] border-none rounded py-1 px-2 text-xs text-gray-300 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#e74c3c] resize-none"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default AttachmentsCard;
