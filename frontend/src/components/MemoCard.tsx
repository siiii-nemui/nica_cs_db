interface Props {
  memo: string;
  onChange: (memo: string) => void;
  readOnly?: boolean;
}

function MemoCard({ memo, onChange, readOnly }: Props) {
  return (
    <section id="memo" className="bg-[#1a1a1a] border border-gray-800 rounded-md p-4">
      <h2 className="text-sm text-gray-400 mb-4 font-bold border-b border-gray-800 pb-2">メモ</h2>
      <textarea
        value={memo}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        rows={10}
        className="w-full bg-[#333333] border-none rounded py-2 px-2 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#e74c3c] resize-y"
      />
    </section>
  );
}

export default MemoCard;
