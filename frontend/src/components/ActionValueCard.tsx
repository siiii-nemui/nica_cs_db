import type { PartSkill } from '../types';
import { BREAKABLE_CATEGORIES, BASE_ACTION_VALUE } from '../types';

interface Props {
  parts: PartSkill[];
}

function ActionValueCard({ parts }: Props) {
  const bonusTotal = parts.reduce((sum, p) => {
    const isDisabled = BREAKABLE_CATEGORIES.includes(p.category) && p.isBroken;
    return isDisabled ? sum : sum + p.actionBonus;
  }, 0);
  const actionValue = BASE_ACTION_VALUE + bonusTotal;

  return (
    <section id="action" className="bg-[#1a1a1a] border border-gray-800 rounded-md p-4">
      <h2 className="text-sm text-gray-400 mb-4 font-bold border-b border-gray-800 pb-2">行動値</h2>
      <div className="flex items-center space-x-2">
        <label className="text-xs text-gray-400 bg-[#222222] py-1 px-2 text-center rounded border border-gray-700 shrink-0">
          行動値
        </label>
        <div className="text-2xl font-bold text-[#e74c3c]">{actionValue}</div>
        <div className="text-xs text-gray-500">
          （{BASE_ACTION_VALUE} + {bonusTotal}）
        </div>
      </div>
    </section>
  );
}

export default ActionValueCard;
