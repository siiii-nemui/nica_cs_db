import type { ActionValueRow, PartType } from '../types';
import { PART_TYPES, POSITIONS, CLASSES, CLASS_ACTION_VALUES, emptyActionValueRow } from '../types';

interface Props {
  position: string;
  mainClass: string;
  subClass: string;
  bonusType: PartType | null;
  favor: ActionValueRow;
  onPositionChange: (v: string) => void;
  onMainClassChange: (v: string) => void;
  onSubClassChange: (v: string) => void;
  onBonusTypeChange: (v: PartType) => void;
  onFavorChange: (row: ActionValueRow) => void;
  readOnly?: boolean;
}

const gridCols = 'grid-cols-[7rem_repeat(3,minmax(0,1fr))]';

function BasicDesignCard({
  position,
  mainClass,
  subClass,
  bonusType,
  favor,
  onPositionChange,
  onMainClassChange,
  onSubClassChange,
  onBonusTypeChange,
  onFavorChange,
  readOnly,
}: Props) {
  const mainClassValues = CLASS_ACTION_VALUES[mainClass] ?? emptyActionValueRow();
  const subClassValues = CLASS_ACTION_VALUES[subClass] ?? emptyActionValueRow();

  const totals: ActionValueRow = PART_TYPES.reduce((acc, type) => {
    acc[type] = mainClassValues[type] + subClassValues[type] + (bonusType === type ? 1 : 0) + favor[type];
    return acc;
  }, {} as ActionValueRow);

  return (
    <section id="design" className="bg-[#1a1a1a] border border-gray-800 rounded-md p-4">
      <h2 className="text-sm text-gray-400 mb-4 font-bold border-b border-gray-800 pb-2">基本設計</h2>

      <div className="space-y-2">
        <div className={`grid ${gridCols} gap-1 items-center`}>
          <div />
          {PART_TYPES.map((t) => (
            <div key={t} className="text-xs text-gray-400 font-bold text-center">
              {t}
            </div>
          ))}
        </div>

        {/* ポジション: informational only, no numeric contribution */}
        <div className={`grid ${gridCols} gap-1 items-center`}>
          <div className="flex flex-col space-y-1">
            <label className="text-xs text-gray-400 bg-[#222222] py-1 px-2 text-center rounded border border-gray-700">
              ポジション
            </label>
            <select
              value={position}
              onChange={(e) => onPositionChange(e.target.value)}
              disabled={readOnly}
              className="bg-[#333333] border-none rounded py-1 px-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#e74c3c]"
            >
              {POSITIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          {PART_TYPES.map((t) => (
            <div key={t} className="w-full bg-[#333333] rounded py-1 px-1 text-sm text-center text-gray-600">
              ー
            </div>
          ))}
        </div>

        {/* メインクラス / サブクラス: read-only, looked up from class */}
        {[
          { label: 'メインクラス', value: mainClass, onChange: onMainClassChange, values: mainClassValues },
          { label: 'サブクラス', value: subClass, onChange: onSubClassChange, values: subClassValues },
        ].map((row) => (
          <div key={row.label} className={`grid ${gridCols} gap-1 items-center`}>
            <div className="flex flex-col space-y-1">
              <label className="text-xs text-gray-400 bg-[#222222] py-1 px-2 text-center rounded border border-gray-700">
                {row.label}
              </label>
              <select
                value={row.value}
                onChange={(e) => row.onChange(e.target.value)}
                disabled={readOnly}
                className="bg-[#333333] border-none rounded py-1 px-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#e74c3c]"
              >
                {CLASSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            {PART_TYPES.map((t) => (
              <div key={t} className="w-full bg-[#333333] rounded py-1 px-1 text-sm text-center">
                {row.values[t]}
              </div>
            ))}
          </div>
        ))}

        {/* ボーナス: single-select radio, +1 to the chosen column */}
        <div className={`grid ${gridCols} gap-1 items-center`}>
          <label className="text-xs text-gray-400 bg-[#222222] py-1 px-2 text-center rounded border border-gray-700">
            ボーナス
          </label>
          {PART_TYPES.map((t) => (
            <div key={t} className="flex justify-center">
              <input
                type="radio"
                name="bonus-type"
                checked={bonusType === t}
                onChange={() => onBonusTypeChange(t)}
                disabled={readOnly}
                className="w-4 h-4 accent-[#e74c3c]"
              />
            </div>
          ))}
        </div>

        {/* 寵愛による修正: editable numbers */}
        <div className={`grid ${gridCols} gap-1 items-center`}>
          <label className="text-xs text-gray-400 bg-[#222222] py-1 px-2 text-center rounded border border-gray-700">
            寵愛による修正
          </label>
          {PART_TYPES.map((t) => (
            <input
              key={t}
              type="number"
              value={favor[t]}
              onChange={(e) => onFavorChange({ ...favor, [t]: Number(e.target.value) })}
              disabled={readOnly}
              className="w-full bg-[#333333] border-none rounded py-1 px-1 text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#e74c3c]"
            />
          ))}
        </div>

        <div className={`grid ${gridCols} gap-1 items-center`}>
          <label className="text-xs text-gray-400 bg-[#222222] py-1 px-2 text-center rounded border border-gray-700">
            総計
          </label>
          {PART_TYPES.map((t) => (
            <div key={t} className="w-full bg-[#333333] rounded py-1 px-1 text-sm text-center font-bold text-[#e74c3c]">
              {totals[t]}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BasicDesignCard;
