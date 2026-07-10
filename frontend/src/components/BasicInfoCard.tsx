import { TextField, SelectField } from './BasicInfoField';
import type { BasicInfo } from '../types';
import { INITIAL_PLACEMENTS } from '../types';

interface Props {
  basicInfo: BasicInfo;
  onChange: (basicInfo: BasicInfo) => void;
  readOnly?: boolean;
}

function BasicInfoCard({ basicInfo, onChange, readOnly }: Props) {
  const update = (patch: Partial<BasicInfo>) => onChange({ ...basicInfo, ...patch });

  return (
    <section id="basic" className="bg-[#1a1a1a] border border-gray-800 rounded-md p-4">
      <h2 className="text-sm text-gray-400 mb-4 font-bold border-b border-gray-800 pb-2">基本情報</h2>

      <div className="flex flex-col space-y-3 mb-3">
        <TextField
          label="ふりがな"
          value={basicInfo.furigana}
          onChange={(e) => update({ furigana: e.target.value })}
          disabled={readOnly}
        />
        <TextField
          label="名前"
          value={basicInfo.name}
          onChange={(e) => update({ name: e.target.value })}
          disabled={readOnly}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-3 gap-x-6">
        <TextField
          label="享年"
          value={basicInfo.ageAtDeath}
          onChange={(e) => update({ ageAtDeath: e.target.value })}
          disabled={readOnly}
        />
        <TextField
          label="性別"
          value={basicInfo.gender}
          onChange={(e) => update({ gender: e.target.value })}
          disabled={readOnly}
        />

        <TextField
          label="身長"
          value={basicInfo.height}
          onChange={(e) => update({ height: e.target.value })}
          disabled={readOnly}
        />
        <TextField
          label="体重"
          value={basicInfo.weight}
          onChange={(e) => update({ weight: e.target.value })}
          disabled={readOnly}
        />

        <TextField
          label="暗示"
          value={basicInfo.suggestion}
          onChange={(e) => update({ suggestion: e.target.value })}
          disabled={readOnly}
        />
        <SelectField
          label="初期配置"
          options={INITIAL_PLACEMENTS}
          value={basicInfo.initialPlacement}
          onChange={(e) => update({ initialPlacement: e.target.value })}
          disabled={readOnly}
        />
      </div>
    </section>
  );
}

export default BasicInfoCard;
