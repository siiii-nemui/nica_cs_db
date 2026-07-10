import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { PartSkill } from '../types';
import { MANEUVER_GROUPS, SKILL_SOURCE_CATEGORIES, BREAKABLE_CATEGORIES, TIMINGS } from '../types';

interface Props {
  parts: PartSkill[];
  onChange: (parts: PartSkill[]) => void;
  readOnly?: boolean;
}

function PartsSkillsCard({ parts, onChange, readOnly }: Props) {
  const [severTarget, setSeverTarget] = useState<string>(BREAKABLE_CATEGORIES[0]);

  const addPart = (defaultCategory: string) => {
    onChange([
      ...parts,
      {
        id: crypto.randomUUID(),
        name: '',
        category: defaultCategory,
        timing: TIMINGS[0],
        cost: '',
        range: '',
        effect: '',
        actionBonus: 0,
        isUsed: false,
        isBroken: false,
      },
    ]);
  };

  const updatePart = (id: string, patch: Partial<PartSkill>) => {
    onChange(parts.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  const removePart = (id: string) => {
    onChange(parts.filter((p) => p.id !== id));
  };

  const recoverAllUses = () => {
    onChange(parts.map((p) => ({ ...p, isUsed: false })));
  };

  const severBodyPart = () => {
    onChange(parts.map((p) => (p.category === severTarget ? { ...p, isBroken: true } : p)));
  };

  return (
    <section id="maneuver" className="bg-[#1a1a1a] border border-gray-800 rounded-md p-4">
      <h2 className="text-sm text-gray-400 mb-4 font-bold border-b border-gray-800 pb-2">マニューバ</h2>

      <div className="border border-gray-800 bg-[#151515] rounded-md p-3 mb-4">
        <h3 className="text-xs font-bold text-gray-300 mb-2">ツール</h3>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={recoverAllUses}
            className="text-xs font-bold rounded py-1.5 px-2 bg-[#222222] text-gray-300 border border-gray-700 hover:bg-[#333333] transition-colors"
          >
            使用回数回復
          </button>
          <label className="text-xs text-gray-400 bg-[#222222] py-1 px-2 text-center rounded border border-gray-700 shrink-0">
            部位切断
          </label>
          <select
            value={severTarget}
            onChange={(e) => setSeverTarget(e.target.value)}
            className="bg-[#333333] border-none rounded py-1 px-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#e74c3c]"
          >
            {BREAKABLE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button
            onClick={severBodyPart}
            className="text-xs font-bold rounded py-1.5 px-2 bg-[#e74c3c] text-white hover:bg-[#c0392b] transition-colors"
          >
            切断実行
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {MANEUVER_GROUPS.map((group) => {
          const groupParts = parts.filter((p) => group.categories.includes(p.category));
          const isBreakableGroup = BREAKABLE_CATEGORIES.includes(group.label);

          return (
            <div key={group.label} className="border border-gray-800 bg-[#151515] rounded-md p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-gray-300">{group.label}</h3>
                {!readOnly && (
                  <button
                    onClick={() => addPart(group.categories[0])}
                    className="flex items-center space-x-1 text-xs bg-[#222222] hover:bg-[#333333] border border-gray-700 rounded px-2 py-1 text-gray-300 transition-colors shrink-0"
                  >
                    <Plus size={14} className="shrink-0" />
                    <span>追加</span>
                  </button>
                )}
              </div>

              {groupParts.length === 0 && (
                <div className="text-xs text-gray-500">登録されていません。</div>
              )}

              <div className="space-y-2">
                {groupParts.map((part) => (
                  <div
                    key={part.id}
                    className={`border rounded-md p-2 transition-colors ${
                      isBreakableGroup && part.isBroken
                        ? 'border-[#e74c3c]/60 bg-[#2a1414]'
                        : 'border-gray-800 bg-[#1e1e1e]'
                    }`}
                  >
                    {(() => {
                      const usedToggle = (
                        <button
                          onClick={() => updatePart(part.id, { isUsed: !part.isUsed })}
                          className={`text-xs font-bold rounded py-1.5 px-2 shrink-0 transition-colors ${
                            part.isUsed
                              ? 'bg-[#e74c3c] text-white'
                              : 'bg-[#222222] text-gray-400 border border-gray-700 hover:bg-[#333333]'
                          }`}
                        >
                          使用
                        </button>
                      );
                      const brokenToggle = isBreakableGroup && (
                        <button
                          onClick={() => updatePart(part.id, { isBroken: !part.isBroken })}
                          className={`text-xs font-bold rounded py-1.5 px-2 shrink-0 transition-colors ${
                            part.isBroken
                              ? 'bg-[#e74c3c] text-white'
                              : 'bg-[#222222] text-gray-400 border border-gray-700 hover:bg-[#333333]'
                          }`}
                        >
                          破損
                        </button>
                      );
                      const categorySelect = group.categories.length > 1 && (
                        <select
                          value={part.category}
                          onChange={(e) => updatePart(part.id, { category: e.target.value })}
                          disabled={readOnly}
                          className="bg-[#333333] border-none rounded py-1 px-2 text-xs shrink-0 focus:outline-none focus:ring-1 focus:ring-[#e74c3c]"
                        >
                          {SKILL_SOURCE_CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      );
                      const nameInput = (
                        <input
                          type="text"
                          placeholder="マニューバ名"
                          value={part.name}
                          onChange={(e) => updatePart(part.id, { name: e.target.value })}
                          disabled={readOnly}
                          className="flex-1 min-w-0 bg-[#333333] border-none rounded py-1 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#e74c3c]"
                        />
                      );
                      const timingSelect = (
                        <select
                          value={part.timing}
                          onChange={(e) => updatePart(part.id, { timing: e.target.value })}
                          disabled={readOnly}
                          className="bg-[#333333] border-none rounded py-1 px-2 text-xs shrink-0 focus:outline-none focus:ring-1 focus:ring-[#e74c3c]"
                        >
                          {TIMINGS.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      );
                      const costInput = (
                        <input
                          type="text"
                          placeholder="コスト"
                          value={part.cost}
                          onChange={(e) => updatePart(part.id, { cost: e.target.value })}
                          disabled={readOnly}
                          className="w-16 shrink-0 bg-[#333333] border-none rounded py-1 px-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#e74c3c]"
                        />
                      );
                      const rangeInput = (
                        <input
                          type="text"
                          placeholder="射程"
                          value={part.range}
                          onChange={(e) => updatePart(part.id, { range: e.target.value })}
                          disabled={readOnly}
                          className="w-16 shrink-0 bg-[#333333] border-none rounded py-1 px-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#e74c3c]"
                        />
                      );
                      const actionBonusInput = (
                        <input
                          type="number"
                          title="行動値補正"
                          value={part.actionBonus}
                          onChange={(e) => updatePart(part.id, { actionBonus: Number(e.target.value) })}
                          disabled={readOnly}
                          className="w-14 shrink-0 bg-[#333333] border-none rounded py-1 px-2 text-xs text-center focus:outline-none focus:ring-1 focus:ring-[#e74c3c]"
                        />
                      );
                      const deleteButton = !readOnly && (
                        <button
                          onClick={() => removePart(part.id)}
                          className="p-1.5 bg-[#222222] hover:bg-[#333333] border border-gray-700 rounded text-gray-400 hover:text-[#e74c3c] transition-colors shrink-0"
                          aria-label="削除"
                        >
                          <Trash2 size={14} />
                        </button>
                      );

                      return (
                        <>
                          {/* Mobile layout: stacked rows */}
                          <div className="flex lg:hidden items-center space-x-2 mb-2">
                            {usedToggle}
                            {brokenToggle}
                            {categorySelect}
                            {nameInput}
                            {deleteButton}
                          </div>
                          <div className="flex lg:hidden flex-wrap items-center gap-2 mb-2">
                            {timingSelect}
                            {costInput}
                            {rangeInput}
                            {actionBonusInput}
                          </div>

                          {/* Desktop layout: 使用/破損〜行動値補正 in one row */}
                          <div className="hidden lg:flex items-center gap-2 mb-2">
                            {usedToggle}
                            {brokenToggle}
                            {categorySelect}
                            {nameInput}
                            {timingSelect}
                            {costInput}
                            {rangeInput}
                            {actionBonusInput}
                            {deleteButton}
                          </div>
                        </>
                      );
                    })()}

                    <textarea
                      placeholder="効果"
                      value={part.effect}
                      onChange={(e) => updatePart(part.id, { effect: e.target.value })}
                      readOnly={readOnly}
                      rows={2}
                      className="w-full bg-[#333333] border-none rounded py-1 px-2 text-xs text-gray-300 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#e74c3c] resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default PartsSkillsCard;
