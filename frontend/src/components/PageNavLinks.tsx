import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  onNavigate?: () => void;
  linkClassName?: string;
}

function PageNavLinks({ onNavigate, linkClassName }: Props) {
  const { userId, logout } = useAuth();
  const navigate = useNavigate();
  const cls = linkClassName ?? 'block text-gray-300 hover:text-white transition-colors';

  const handleLogout = async () => {
    await logout();
    onNavigate?.();
    navigate('/characters');
  };

  return (
    <>
      <Link to="/characters" className={cls} onClick={onNavigate}>
        キャラクター一覧
      </Link>
      {userId ? (
        <button onClick={handleLogout} className={`${cls} text-left`}>
          ログアウト（{userId}）
        </button>
      ) : (
        <>
          <Link to="/login" className={cls} onClick={onNavigate}>
            ログイン
          </Link>
          <Link to="/signup" className={cls} onClick={onNavigate}>
            新規登録
          </Link>
        </>
      )}
    </>
  );
}

export default PageNavLinks;
