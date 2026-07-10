import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Menu, Upload, Save, Eye, Link2 } from 'lucide-react';
import BasicInfoCard from '../components/BasicInfoCard';
import BasicDesignCard from '../components/BasicDesignCard';
import ActionValueCard from '../components/ActionValueCard';
import PartsSkillsCard from '../components/PartsSkillsCard';
import MemoryFragmentsCard from '../components/MemoryFragmentsCard';
import AttachmentsCard from '../components/AttachmentsCard';
import SessionRecordCard from '../components/SessionRecordCard';
import MemoCard from '../components/MemoCard';
import PageNavLinks from '../components/PageNavLinks';
import { getCharacter, saveCharacter } from '../lib/api';
import { buildCocofoliaExport, copyToClipboard } from '../lib/export';
import type { Character, ActionValueRow, PartType } from '../types';
import { PART_TYPES, CLASS_ACTION_VALUES, emptyActionValueRow } from '../types';

const SECTION_LINKS = [
  { href: '#basic', label: '基本情報' },
  { href: '#design', label: '基本設計' },
  { href: '#action', label: '行動値' },
  { href: '#maneuver', label: 'マニューバ' },
  { href: '#memory', label: '記憶のカケラ' },
  { href: '#attachment', label: '未練' },
  { href: '#session', label: 'セッション記録' },
  { href: '#memo', label: 'メモ' },
];

interface Props {
  readOnly: boolean;
}

function CharacterSheetPage({ readOnly }: Props) {
  const { id } = useParams<{ id: string }>();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [character, setCharacter] = useState<Character | null | undefined>(undefined);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [copiedAt, setCopiedAt] = useState<number | null>(null);
  const [sharedAt, setSharedAt] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    getCharacter(id)
      .then((c) => setCharacter(c ?? null))
      .catch(() => setCharacter(null));
  }, [id]);

  if (character === undefined) return null;

  if (character === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#111111] text-gray-300 space-y-4">
        <p>キャラクターが見つかりませんでした。</p>
        <Link to="/characters" className="text-[#e74c3c] underline">
          キャラクター一覧に戻る
        </Link>
      </div>
    );
  }

  const mainClassValues = CLASS_ACTION_VALUES[character.design.mainClass] ?? emptyActionValueRow();
  const subClassValues = CLASS_ACTION_VALUES[character.design.subClass] ?? emptyActionValueRow();

  const enhancementTotals: ActionValueRow = PART_TYPES.reduce((acc, type) => {
    acc[type] =
      mainClassValues[type] +
      subClassValues[type] +
      (character.design.bonusType === type ? 1 : 0) +
      character.design.favor[type];
    return acc;
  }, {} as ActionValueRow);

  const handleSave = async () => {
    try {
      const saved = await saveCharacter(character);
      setCharacter(saved);
      setSavedAt(Date.now());
    } catch (err) {
      window.alert(err instanceof Error ? err.message : '保存に失敗しました。');
    }
  };

  // In read-only (view) mode there's no explicit save button, but 使用/破損/ツール
  // toggles must still persist immediately since they're the only editable bits there.
  const updateCharacter = (updated: Character) => {
    setCharacter(updated);
    if (readOnly) saveCharacter(updated).catch(() => {});
  };

  const handleExport = async () => {
    const ok = await copyToClipboard(buildCocofoliaExport(character));
    if (ok) setCopiedAt(Date.now());
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/characters/${character.id}/view`;
    const ok = await copyToClipboard(url);
    if (ok) setSharedAt(Date.now());
  };

  return (
    <div className="flex flex-col h-screen bg-[#111111] text-gray-300 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b-2 border-[#e74c3c] bg-[#1a1a1a] z-10 shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-5 bg-[#e74c3c]"></div>
          <h1 className="text-[#e74c3c] font-bold text-lg tracking-wider">
            {readOnly ? '閲覧モード' : '編集モード'}
          </h1>
        </div>
        <button
          className="p-1 border border-gray-600 rounded bg-[#222222] hover:bg-[#333333] transition-colors lg:hidden shrink-0"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu size={20} className="text-gray-300" />
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden relative pb-[60px]">
        {/* Sidebar (Desktop) */}
        <aside className="hidden lg:flex lg:flex-col w-48 shrink-0 border-r border-gray-800 bg-[#111111] p-4 overflow-y-auto space-y-6">
          <nav className="space-y-4 pb-4 border-b border-gray-800">
            <PageNavLinks />
          </nav>
          <nav className="space-y-4">
            {SECTION_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="block text-gray-300 hover:text-white transition-colors">
                {link.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute inset-0 bg-black/50 z-20" onClick={() => setIsMobileMenuOpen(false)}>
            <aside className="w-48 h-full bg-[#111111] border-r border-gray-800 p-4 overflow-y-auto space-y-6" onClick={(e) => e.stopPropagation()}>
              <nav className="space-y-4 pb-4 border-b border-gray-800">
                <PageNavLinks onNavigate={() => setIsMobileMenuOpen(false)} />
              </nav>
              <nav className="space-y-4">
                {SECTION_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="block text-gray-300 hover:text-white transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 flex flex-col space-y-6">
          <BasicInfoCard
            basicInfo={character.basicInfo}
            onChange={(basicInfo) => updateCharacter({ ...character, basicInfo })}
            readOnly={readOnly}
          />

          <BasicDesignCard
            position={character.design.position}
            mainClass={character.design.mainClass}
            subClass={character.design.subClass}
            bonusType={character.design.bonusType}
            favor={character.design.favor}
            onPositionChange={(position) =>
              updateCharacter({ ...character, design: { ...character.design, position } })
            }
            onMainClassChange={(mainClass) =>
              updateCharacter({ ...character, design: { ...character.design, mainClass } })
            }
            onSubClassChange={(subClass) =>
              updateCharacter({ ...character, design: { ...character.design, subClass } })
            }
            onBonusTypeChange={(bonusType: PartType) =>
              updateCharacter({ ...character, design: { ...character.design, bonusType } })
            }
            onFavorChange={(favor) => updateCharacter({ ...character, design: { ...character.design, favor } })}
            readOnly={readOnly}
          />

          <ActionValueCard parts={character.parts} />

          <PartsSkillsCard
            parts={character.parts}
            onChange={(parts) => updateCharacter({ ...character, parts })}
            readOnly={readOnly}
          />

          <MemoryFragmentsCard
            fragments={character.memoryFragments}
            onChange={(memoryFragments) => updateCharacter({ ...character, memoryFragments })}
            readOnly={readOnly}
          />

          <AttachmentsCard
            attachments={character.attachments}
            onChange={(attachments) => updateCharacter({ ...character, attachments })}
            readOnly={readOnly}
          />

          <SessionRecordCard
            records={character.sessionRecords}
            onChange={(sessionRecords) => updateCharacter({ ...character, sessionRecords })}
            readOnly={readOnly}
          />

          <MemoCard
            memo={character.memo}
            onChange={(memo) => updateCharacter({ ...character, memo })}
            readOnly={readOnly}
          />
        </main>
      </div>

      {/* Bottom Action Bar */}
      <footer className="fixed bottom-0 w-full bg-[#e74c3c] flex items-center justify-between p-2 lg:px-6 z-20">
        {/* Stats: 強化値 */}
        <div className="flex items-center space-x-2 text-xs lg:text-sm font-bold text-gray-300">
          {PART_TYPES.map((t) => (
            <div key={t} className="bg-[#111111] px-2 py-1 rounded">
              {t}：{enhancementTotals[t]}
            </div>
          ))}
        </div>

        {/* Actions - using flex-shrink-0 per requirements */}
        <div className="flex items-center space-x-2 shrink-0">
          {!readOnly && (
            <Link
              to={`/characters/${character.id}/view`}
              className="flex flex-col items-center justify-center bg-[#111111] hover:bg-[#222222] transition-colors rounded p-1 w-10 h-10 lg:w-12 lg:h-12 shrink-0 text-white"
            >
              <Eye size={18} />
              <span className="text-[10px] mt-0.5 font-bold text-[#e74c3c]">閲覧</span>
            </Link>
          )}
          <button
            onClick={handleExport}
            className="flex flex-col items-center justify-center bg-[#111111] hover:bg-[#222222] transition-colors rounded p-1 w-10 h-10 lg:w-12 lg:h-12 shrink-0 text-white"
          >
            <Upload size={18} />
            <span className="text-[10px] mt-0.5 font-bold text-[#e74c3c]">{copiedAt ? 'コピー済' : '出力'}</span>
          </button>
          {!readOnly && (
            <button
              onClick={handleShare}
              className="flex flex-col items-center justify-center bg-[#111111] hover:bg-[#222222] transition-colors rounded p-1 w-10 h-10 lg:w-12 lg:h-12 shrink-0 text-white"
            >
              <Link2 size={18} />
              <span className="text-[10px] mt-0.5 font-bold text-[#e74c3c]">
                {sharedAt ? 'コピー済' : '共有URL'}
              </span>
            </button>
          )}
          {!readOnly && (
            <button
              onClick={handleSave}
              className="flex flex-col items-center justify-center bg-[#111111] hover:bg-[#222222] transition-colors rounded p-1 w-10 h-10 lg:w-12 lg:h-12 shrink-0 text-white"
            >
              <Save size={18} />
              <span className="text-[10px] mt-0.5 font-bold text-[#e74c3c]">
                {savedAt ? '保存済' : '保存'}
              </span>
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}

export default CharacterSheetPage;
