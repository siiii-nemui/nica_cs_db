import type { Character } from '../types';
import { BASE_ACTION_VALUE, BREAKABLE_CATEGORIES, MANEUVER_GROUPS, MAX_MADNESS } from '../types';

export function calculateActionValue(character: Character): number {
  const bonusTotal = character.parts.reduce((sum, p) => {
    const isDisabled = BREAKABLE_CATEGORIES.includes(p.category) && p.isBroken;
    return isDisabled ? sum : sum + p.actionBonus;
  }, 0);
  return BASE_ACTION_VALUE + bonusTotal;
}

export function calculateMaxActionValue(character: Character): number {
  const bonusTotal = character.parts.reduce((sum, p) => sum + p.actionBonus, 0);
  return BASE_ACTION_VALUE + bonusTotal;
}

const FIXED_COMMANDS_HEADER = [
  'nm 未練決定',
  '　',
  '1nc+1 対話判定：',
  '1nc 対話判定：',
  '1nc-1 対話判定：',
  '　',
  '1nc+2 狂気判定',
  '1nc+1 狂気判定',
  '1nc 狂気判定',
  '1nc-1 狂気判定',
  '1nc-2 狂気判定',
  '　',
  '1nc+2 行動判定',
  '1nc+1 行動判定',
  '1nc 行動判定',
  '1nc-1 行動判定',
  '1nc-2 行動判定',
  '　',
  '',
].join('\n');

export function buildCocofoliaExport(character: Character): string {
  const actionValue = calculateActionValue(character);
  const maxActionValue = calculateMaxActionValue(character);

  const status = [
    { label: '最大行動値', value: actionValue, max: maxActionValue },
    { label: '回復上限', value: BREAKABLE_CATEGORIES.length, max: BREAKABLE_CATEGORIES.length },
    ...character.attachments.map((a) => ({ label: a.target, value: a.madness, max: MAX_MADNESS })),
  ];

  const maneuverLines = MANEUVER_GROUPS.flatMap((group) =>
    character.parts
      .filter((p) => group.categories.includes(p.category) && p.name.trim() !== '')
      .map((p) => `1na 【${p.name}】${p.category} / ${p.timing} / ${p.cost} / ${p.range} ${p.effect}`),
  );

  const commands = FIXED_COMMANDS_HEADER + maneuverLines.join('\n');

  return JSON.stringify({
    kind: 'character',
    data: {
      name: character.basicInfo.name,
      memo: character.memo,
      initiative: actionValue,
      status,
      commands,
    },
  });
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    document.body.removeChild(textarea);
    return ok;
  }
}
