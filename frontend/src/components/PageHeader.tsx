import { useState } from 'react';
import { Menu } from 'lucide-react';
import PageNavLinks from './PageNavLinks';

interface Props {
  title: string;
}

function PageHeader({ title }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b-2 border-[#e74c3c] bg-[#1a1a1a] z-10 shrink-0 relative">
      <div className="flex items-center space-x-2">
        <div className="w-1.5 h-5 bg-[#e74c3c]"></div>
        <h1 className="text-[#e74c3c] font-bold text-lg tracking-wider">{title}</h1>
      </div>
      <button
        className="p-1 border border-gray-600 rounded bg-[#222222] hover:bg-[#333333] transition-colors shrink-0"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="メニュー"
      >
        <Menu size={20} className="text-gray-300" />
      </button>

      {isMenuOpen && (
        <div className="absolute inset-0 z-20" onClick={() => setIsMenuOpen(false)}>
          <div
            className="absolute top-full right-4 mt-1 w-48 bg-[#111111] border border-gray-800 rounded-md p-4 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="space-y-4">
              <PageNavLinks onNavigate={() => setIsMenuOpen(false)} />
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

export default PageHeader;
